import Axios from "axios";

async function authenticate(credentials) {
    
    await Axios
    .post("https://localhost:8000/api/login_check", credentials)
    .then(response => response.data.token)
    .then(token => {
        // On stock le token dans le localstorage
        window.localStorage.setItem("authToken", token);
        
        // On previent Axios qu'on a maitenant un header avec un Token d'authentification sur toutes nos futurs requetes HTTP
        Axios.defaults.headers["Authorization"] = "Bearer " + token;

    })
}

function logout() {
    window.localStorage.removeItem("authToken");
    delete Axios.defaults.headers["authorization"];
}

export default {
    authenticate: authenticate,
    logout : logout
}