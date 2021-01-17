import axios from "axios";

function register(user) {
  return axios.post("https://localhost:8000/api/users", user);
}

export default {
  register
};