import { useState, useEffect } from 'react';
import { Account } from '../types/profile';
import { ProfileService } from '../services/profileService';
import { toast } from 'react-toastify';

export const useProfile = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [deleteMode, setDeleteMode] = useState<"user" | "account" | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);

  const userId = localStorage.getItem("userId");
  const accessToken = localStorage.getItem("accessToken");

  const fetchAccounts = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const data = await ProfileService.getAccounts(userId);
      if (data.success && data.results && data.results[0]) {
        setAccounts(data.results[0].accounts);
      }
    } catch (err) {
      setError('Failed to load accounts');
      toast.error('Failed to load accounts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!password) {
      setError("Unesite lozinku.");
      return;
    }

    try {
      if (deleteMode === "user" && userId) {
        const response = await ProfileService.deleteUser({ userId, password });
        if (response.success) {
          localStorage.clear();
          window.location.href = "/login";
        } else {
          handleDeleteError(response);
        }
      } else if (deleteMode === "account" && selectedAccountId) {
        const response = await ProfileService.deleteAccount({
          accountId: selectedAccountId,
          userPassword: password
        });
        if (response.success) {
          setAccounts(prevAccounts => 
            prevAccounts.filter(acc => acc.accountId !== selectedAccountId)
          );
          closeModal();
        } else {
          handleDeleteError(response);
        }
      }
    } catch (err) {
      setError("Došlo je do greške. Molimo pokušajte ponovo.");
    }
  };

  const handleDeleteError = (response: { errors?: Record<string, string>[] }) => {
    const errorMessage = response.errors?.[0]?.password || "Došlo je do greške pri brisanju naloga.";
    setError(errorMessage);
  };

  const closeModal = () => {
    setShowModal(false);
    setPassword("");
    setError("");
    setDeleteMode(null);
    setSelectedAccountId(null);
  };

  useEffect(() => {
    fetchAccounts();
  }, [userId, accessToken]);

  return {
    accounts,
    isLoading,
    error,
    showModal,
    password,
    deleteMode,
    selectedAccountId,
    setShowModal,
    setPassword,
    setDeleteMode,
    setSelectedAccountId,
    handleDelete,
    closeModal
  };
}; 