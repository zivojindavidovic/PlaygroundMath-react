import React, { useState, useEffect } from "react";

interface Account {
  accountId: number;
  username: string;
  points: number;
}

const Profile: React.FC = () => {
  const email = localStorage.getItem("email");
  const userId = localStorage.getItem("userId");
  const accessToken = localStorage.getItem("accessToken");
  const isTeacher = localStorage.getItem("isTeacher") === "true";

  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [deleteMode, setDeleteMode] = useState<"user" | "account" | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (userId) {
      fetch(`http://0.0.0.0:8000/api/v1/account/getAll?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success && data.results && data.results.length > 0) {
            setAccounts(data.results[0].accounts);
          }
        })
        .catch((err) => {
          console.error("Error fetching accounts:", err);
        });
    }
  }, [userId, accessToken]);

  const handleDelete = async () => {
    if (!password) {
      setError("Unesite lozinku.");
      return;
    }

    if (deleteMode === "user") {
      if (!userId) {
        setError("Korisnički ID nije pronađen.");
        return;
      }
      try {
        const response = await fetch("http://0.0.0.0:8000/api/v1/user/delete", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            userId,
            password,
          }),
        });
        const data = await response.json();
        if (!data.success) {
          const errorMessage =
            data.errors && data.errors[0] && data.errors[0].password
              ? data.errors[0].password
              : "Došlo je do greške pri brisanju naloga.";
          setError(errorMessage);
        } else {
          localStorage.clear();
          window.location.href = "/login";
        }
      } catch (err) {
        setError("Došlo je do greške. Molimo pokušajte ponovo.");
      }
    } else if (deleteMode === "account") {
      if (!selectedAccountId) {
        setError("Nije odabran nalog za brisanje.");
        return;
      }
      try {
        const response = await fetch(
          "http://0.0.0.0:8000/api/v1/account/delete",
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              accountId: selectedAccountId,
              userPassword: password,
            }),
          }
        );
        const data = await response.json();
        if (!data.success) {
          const errorMessage =
            data.errors && data.errors[0] && data.errors[0].password
              ? data.errors[0].password
              : "Došlo je do greške pri brisanju naloga.";
          setError(errorMessage);
        } else {
          setAccounts((prevAccounts) =>
            prevAccounts.filter((acc) => acc.accountId !== selectedAccountId)
          );
          closeModal();
        }
      } catch (err) {
        setError("Došlo je do greške. Molimo pokušajte ponovo.");
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setPassword("");
    setError("");
    setDeleteMode(null);
    setSelectedAccountId(null);
  };

  return (
    <div className="dashboard">
      <h1 className="text-center">Profil</h1>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Email</h5>
          <p className="card-text">{email}</p>
          <button
            className="btn btn-danger"
            onClick={() => {
              setDeleteMode("user");
              setShowModal(true);
            }}
          >
            Obriši nalog
          </button>
        </div>
      </div>

      {isTeacher && (
        <div>
          <h1 className="text-center mt-4">Nalozi dece</h1>
          <div className="account-list">
            {accounts.length === 0 && <p>Nema dostupnih naloga dece.</p>}
            {accounts.map((account) => (
              <div key={account.accountId} className="card my-2">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <h5>{account.username}</h5>
                    <p>Poeni: {account.points}</p>
                  </div>
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      setDeleteMode("account");
                      setSelectedAccountId(account.accountId);
                      setShowModal(true);
                    }}
                  >
                    Obriši
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showModal && (
        <div
          className="modal"
          style={{
            display: "block",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {deleteMode === "user"
                    ? "Potvrda brisanja naloga"
                    : "Potvrda brisanja naloga dece"}
                </h5>
              </div>

              <div className="modal-body">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Unesite lozinku"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {error && <div className="text-danger mt-2">{error}</div>}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Otkaži
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  Obriši
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
