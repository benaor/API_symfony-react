import React, { useState } from 'react';
import AuthAPI from '../services/authAPI';

const LoginPage = props => {

    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    })
    const [error, setError] = useState("");

    const handleCredentialsChange = ({currentTarget}) => {
        const {value, name} = currentTarget;
        setCredentials({ ...credentials, [name]: value });
    }

    const handleSubmit = async event => {
        event.preventDefault();

        try {
            await AuthAPI.authenticate(credentials);
            setError("");
            console.log("connexion reussi");
        } catch (error) {
            setError("Aucun compte n'est relié a cet email, ou le mot de passe ne correspond pas");
        }
    }

    return (
        <>
            <h1>Connexion a l'application</h1>

            <form onSubmit={handleSubmit}>

                <div className="form-group">
                    <label htmlFor="username">Adresse email</label>
                    <input
                        value={credentials.username}
                        onChange={handleCredentialsChange}
                        type="text"
                        className={"form-control " + (error && " is-invalid")}
                        placeholder="Adresse email de connexion"
                        name="username"
                        id="username" />
                        { error && <p className="invalid-feedback">{error}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="password">Mot de passe</label>
                    <input
                        value={credentials.password}
                        onChange={handleCredentialsChange}
                        type="password"
                        className="form-control"
                        placeholder="Mot de passe"
                        name="password"
                        id="password" />
                </div>

                <div className="form-group">
                    <button
                        type="submit"
                        className="btn btn-success">
                        Je me connecte
                    </button>
                </div>
            </form>
        </>
    );
}

export default LoginPage;