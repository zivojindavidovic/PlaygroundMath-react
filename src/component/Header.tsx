import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../assets/logo.png";

const Header: React.FC = () => {
    const handleLogout = async () => {
        try {
            await fetch("http://0.0.0.0:8000/api/v1/auth/logout", {
                method: "POST",
                credentials: "include"
            });
            localStorage.clear();
            window.location.reload();
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <nav className="navbar navbar-light bg-light px-4 d-flex justify-content-between">
            <img src={logo} alt="Logo img" style={{maxHeight: 40}}/>
            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
        </nav>
    );
};

export default Header;