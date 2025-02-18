import React from "react"
import Register from "../components/auth/Register";
import "../styles/Register.scss"

const RegisterPage: React.FC = () => {
    return (
        <div className="guest">
            <Register />
        </div>
    )
}

export default RegisterPage;
