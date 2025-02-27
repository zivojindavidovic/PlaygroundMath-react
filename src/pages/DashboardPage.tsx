import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import "../styles/Dashboard.scss";  

const DashboardPage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="logo">GetITMath</h1>
          <button className="logout-button" onClick={handleLogout}>
            Izloguj se
          </button>
        </div>
      </header>

      <div className="dashboard-layout">
        <nav className={`sidebar ${isMobileMenuOpen ? 'active' : ''}`}>
          {!isTeacher && !isAdmin && (
            <div className="menu-items">
              <Link to="/accounts" className="menu-item">
                <i className="fas fa-users"></i>
                <span>Nalozi</span>
              </Link>
              <Link to="/create-account" className="menu-item">
                <i className="fas fa-user-plus"></i>
                <span>Kreiraj nalog</span>
              </Link>
              <Link to="/professors" className="menu-item">
                <i className="fas fa-chalkboard-teacher"></i>
                <span>Profesori</span>
              </Link>
              <Link to="/review-child-courses" className="menu-item">
                <i className="fas fa-book-open"></i>
                <span>Istorija kurseva</span>
              </Link>
              <Link to="/rank-list" className="menu-item">
                <i className="fas fa-trophy"></i>
                <span>Rang lista</span>
              </Link>
              <Link to="/profile" className="menu-item">
                <i className="fas fa-user"></i>
                <span>Profil</span>
              </Link>
            </div>
          )}

          {isTeacher && !isAdmin && (
            <div className="menu-items">
              <Link to="/professor-courses" className="menu-item">
                <i className="fas fa-book"></i>
                <span>Moji kursevi</span>
              </Link>
              <Link to="/create-course" className="menu-item">
                <i className="fas fa-plus-circle"></i>
                <span>Kreiraj kurs</span>
              </Link>
              <Link to="/applications" className="menu-item">
                <i className="fas fa-clipboard-list"></i>
                <span>Aplikacije</span>
              </Link>
              <Link to="/profile" className="menu-item">
                <i className="fas fa-user"></i>
                <span>Profil</span>
              </Link>
            </div>
          )}

          {isAdmin && (
            <div className="menu-items">
              <Link to="/admin/users" className="menu-item">
                <i className="fas fa-users"></i>
                <span>Svi korisnici</span>
              </Link>
              <Link to="/admin/accounts" className="menu-item">
                <i className="fas fa-user-circle"></i>
                <span>Svi nalozi</span>
              </Link>
            </div>
          )}
        </nav>

        <main className="dashboard-content">
          <Outlet />
        </main>

        {/* Mobile Menu Toggle Button */}
        <button 
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <i className={`fas fa-${isMobileMenuOpen ? 'times' : 'bars'}`}></i>
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
