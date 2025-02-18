import React from "react"

import "../styles/LoginPage.scss"
import Register from "../components/auth/Register";

const RegisterPage: React.FC = () => {
    return (
        <div className="guest">
            <Register />
        </div>
    )
}

export default RegisterPage;
