import Axios from 'axios';
import React, { useState } from 'react';

const LoginPage = (props) => {

    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    })
    const [error, setError] = useState("");

    const handleCredentialsChange = event => {
        const value = event.currentTarget.value;
        const name = event.currentTarget.name;

        setCredentials({ ...credentials, [name]: value });
    }

    const handleSubmit = async event => {
        event.preventDefault();

        try {
            const token = await Axios
            .post("https://localhost:8000/api/login_check", credentials)
            .then(response => response.data.token);

        setError("");

        // On stock le token dans le localstorage
        window.localStorage.setItem("authToken", token);

        // On previent Axios qu'on a maitenant un header avec un Token d'authentification sur toutes nos futurs requetes HTTP
        Axios.defaults.headers["Authorization"] = "Bearer " + token;

        } catch (error) {
            console.log(error.response)
            setError("Aucun compte n'est relié a cet email, ou le mot de passe ne correspond pas")
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