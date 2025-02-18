import React from "react"

import "../styles/LoginPage.scss"
import RegisterComponent from "../component/RegisterComponent";

const RegisterPage: React.FC = () => {
    return (
        <div className="guest">
            <RegisterComponent />
        </div>
    )
}

export default RegisterPage;
