import React from "react";

import "../styles/Dashboard.scss";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";

const DashboardPage: React.FC = () => {
  const isTeacher = localStorage.getItem("isTeacher") === "true";
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const handleLogout = async () => {
    try {
      await fetch("http://0.0.0.0:8000/api/v1/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      localStorage.clear();
      window.location.reload();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="dashboard">
      <div className="header">
        <p className="logo">GetITMath</p>
        <button className="btn btn-dark" onClick={handleLogout}>
          Izloguj se
        </button>
      </div>
      <div className="page-layout">
        <div className="left-side-menu">
          {!isTeacher && !isAdmin && (
            <div>
              <Link className="link" to={"/accounts"}>
                Nalozi
              </Link>
              <Link className="link" to={"/create-account"}>
                Kreiraj nalog
              </Link>
              <Link className="link" to={"/professors"}>
                Profesori
              </Link>
              <Link className="link" to={"/rank-list"}>
                Rang lista
              </Link>
              <Link className="link" to={"/profile"}>
                Profil
              </Link>
            </div>
          )}

          {isTeacher && !isAdmin && (
            <div>
              <Link className="link" to={"/professor-courses"}>
                Moji kursevi
              </Link>
              <Link className="link" to={"/create-course"}>
                Kreiraj kurs
              </Link>
              <Link className="link" to={"/applications"}>
                Aplikacije
              </Link>
              <Link className="link" to={"/profile"}>
                Profil
              </Link>
            </div>
          )}

          {isAdmin && !isTeacher && !isTeacher && !isAdmin && <div>Admin</div>}
        </div>
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
