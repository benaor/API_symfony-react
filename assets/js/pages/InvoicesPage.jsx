import moment from "moment";
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import TableLoader from "../components/loaders/TableLoader";
import Pagination from "../components/Pagination";
import invoicesAPI from '../services/invoicesAPI';

const STATUS_CLASSES = {
    PAID: "success",
    SENT: "info",
    CANCELLED: "danger"
}

const STATUS_LABELS = {
    PAID: "Payée",
    SENT: "Envoyée",
    CANCELLED: "Annulée"
}

const InvoicesPage = (props) => {

    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const itemPerPage = 10;

    //recuperer les factures
    const fetchInvoices = async () => {
        try {
            const data = await invoicesAPI.findAll()
            setInvoices(data);
            setLoading(false);
        } catch (error) {
            toast.error('erreur lors du chargement des factures');
        }
    }

    // Au demarrage du composant, on va chercher les Invoices
    useEffect(() => { fetchInvoices(); }, []);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    }

    // Gestion de la recherche
    const handleSearch = ({ currentTarget }) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    }

    const handleDelete = async id => {

        //I make a copy of Array Customers
        const originalInvoices = [...invoices];

        //Hidden the current customer
        setInvoices(invoices.filter(customer => customer.id !== id))

        //Send HTTP Request to API
        try {
            await invoicesAPI.delete(id)
            toast.success("La facture a bien été supprimé")
        } catch (error) {
            toast.error("une erreur est survenue")
            setInvoices(originalInvoices);
        }

    };


    // Filtrage des factures en fonction de la recherche
    const filteredInvoices = invoices.filter(
        i =>
            i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
            i.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
            STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase()) ||
            i.amount.toString().includes(search.toLowerCase())
    )


    // Pagination des données
    const paginatedInvoices = Pagination.getData(filteredInvoices, currentPage, itemPerPage);

    //format de la date avec MomentJS
    const formatDate = (str) => moment(str).format('DD/MM/YYYY');

    return (
        <>

            <div className="d-flex justify-content-between align-items-center">
                <h1>Liste des factures</h1>
                <Link className="btn btn-primary" to="/invoices/new">Créer une facture</Link>
            </div>

            <div className="form-group">
                <input type="text" className="form-control" onChange={handleSearch} value={search} placeholder="Rechercher ..." />
            </div>

            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Numéro</th>
                        <th>Client</th>
                        <th className="text-center">Date d'envoi</th>
                        <th className="text-center">Status</th>
                        <th className="text-center">Montant</th>
                        <th></th>
                    </tr>
                </thead>

                {!loading && (
                    <tbody>
                        {paginatedInvoices.map(invoice => <tr key={invoice.id} >
                            <td>{invoice.chrono}</td>
                            <td>
                                <a href="#">{invoice.customer.firstName} {invoice.customer.lastName}</a>
                            </td>
                            <td>{formatDate(invoice.sentAt)}</td>
                            <td className="text-center">
                                <span className={"badge badge-" + STATUS_CLASSES[invoice.status]}>{STATUS_LABELS[invoice.status]}</span>
                            </td>
                            <td className="text-center">{invoice.amount.toLocaleString()}€</td>
                            <td>
                                <Link to={"/invoices/" + invoice.id} className="btn btn-sm btn-primary mr-1">Editer</Link>
                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(invoice.id)}>Supprimer</button>
                            </td>
                        </tr>)}
                    </tbody>
                )}
            </table>
            {loading && (
            <TableLoader />
            )}

            <Pagination currentPage={currentPage} itemPerPage={itemPerPage} onPageChanged={handlePageChange} length={filteredInvoices.length}></Pagination>
        </>
    );
}

export default InvoicesPage;