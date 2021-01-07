import Axios from "axios";
import jwtDecode from "jwt-decode";


// Permet de se connecter 
async function authenticate(credentials) {

    // On envoi une requete a axios pour obtenir un token
    await Axios
        .post("https://localhost:8000/api/login_check", credentials)
        .then(response => response.data.token)
        .then(token => {
            // On stock le token dans le localstorage
            window.localStorage.setItem("authToken", token);

            // On previent Axios qu'on a maitenant un header avec un Token d'authentification sur toutes nos futurs requetes HTTP
            setAxiosToken(token)
        })
}

// Permet de definir un token
function setAxiosToken(token) {
    Axios.defaults.headers["authorization"] = "Bearer " + token;
}

// Permet de maintenir la connexion sur le site
function setup() {

    // Est ce que le token existe ? 
    const token = window.localStorage.getItem("authToken");
    if (token) {

        // Est ce que le token est encore valide ? 
        const jwtData = jwtDecode(token);
        if (jwtData.exp * 1000 > new Date().getTime()) {

            // Si il est valide alors on le renvoie dans le headers 
            setAxiosToken(token);

        }
    }
}

// Permet de se deconnecter
function logout() {
    window.localStorage.removeItem("authToken");
    delete Axios.defaults.headers["authorization"];
}

export default {
    authenticate: authenticate,
    logout: logout,
    setup: setup
}