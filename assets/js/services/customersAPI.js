import axios from "axios";

function findAll() {
    return axios
        .get("https://localhost:8000/api/customers")
        .then(response => response.data['hydra:member'])
}

function deleteCustomer(id) {
    return         axios
    .delete("https://localhost:8000/api/customers/" + id)
}

export default {
    findAll,
    delete: deleteCustomer
}