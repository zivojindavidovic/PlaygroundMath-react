import React from "react"
import Login from "../components/auth/Login"
import "../styles/Login.scss"

const LoginPage: React.FC = () => {
    return (
        <div className="guest">
            <Login />
        </div>
    )
}

export default LoginPage;
