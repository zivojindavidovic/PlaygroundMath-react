import React from "react"

import "../styles/LoginPage.scss"
import LoginComponent from "../component/LoginComponent";

const LoginPage: React.FC = () => {
    return (
        <div className="guest">
            <LoginComponent />
        </div>
    )
}

export default LoginPage;
