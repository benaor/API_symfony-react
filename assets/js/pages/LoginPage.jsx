import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import Field from '../components/forms/Field';
import AuthContext from '../contexts/AuthContext';
import AuthAPI from '../services/authAPI';

const LoginPage = ({ onLogin, history }) => {

    const { setIsAuthenticated } = useContext(AuthContext);
    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    })
    const [error, setError] = useState("");

    const handleCredentialsChange = ({ currentTarget }) => {
        const { value, name } = currentTarget;
        setCredentials({ ...credentials, [name]: value });
    }

    const handleSubmit = async event => {
        event.preventDefault();

        try {
            await AuthAPI.authenticate(credentials);
            setError("");
            setIsAuthenticated(true)
            toast.success("Vous êtes maintenant connecté !")
            history.replace('/')
        } catch (error) {
            setError("Aucun compte n'est relié a cet email, ou le mot de passe ne correspond pas");
            toast.error("une erreur est survenue");
        }
    }

    return (
        <>
            <h1>Connexion a l'application</h1>

            <form onSubmit={handleSubmit}>

                <Field label="Adresse email" name="username" value={credentials.username} onChange={handleCredentialsChange} placeholder="Adresse email de connexion" error={error} />
                <Field label="Mot de passe" name="password" value={credentials.password} onChange={handleCredentialsChange} type="password" error="" />

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