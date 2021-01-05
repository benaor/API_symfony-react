import axios from "axios";

function findAll() {
    return axios
        .get("https://localhost:8000/api/invoices")
        .then(response => response.data['hydra:member'])
}

function deleteInvoice(id) {
    return axios
        .delete("https://localhost:8000/api/invoices/" + id)
}

export default {
    findAll,
    delete: deleteInvoice
}