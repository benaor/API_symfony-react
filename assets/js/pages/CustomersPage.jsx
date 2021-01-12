import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../components/Pagination';
import CustomersAPI from "../services/customersAPI";

const CustomersPage = (props) => {

    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");

    // Permet de recuperer les customers
    const fetchCustomers = async () => {
        try {
            const data = await CustomersAPI.findAll()
            setCustomers(data)
        } catch (error) {
            console.log(error.response)
        }
    }

    // Au chargement du composant, on va chercher les customers
    useEffect(() => { fetchCustomers() }, []);

    const handleDelete = async id => {

        //I make a copy of Array Customers
        const originalCustomers = [...customers];

        //Hidden the current customer
        setCustomers(customers.filter(customer => customer.id !== id))

        //Send HTTP Request to API
        try {
            await CustomersAPI.delete(id)
        } catch (error) {
            setCustomers(originalCustomers);
        }

    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    }

    // Gestion de la recherche
    const handleSearch = ({ currentTarget }) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    }

    // Filtrage des clients en fonction de la recherche
    const filteredCustomers = customers.filter(
        c =>
            c.firstName.toLowerCase().includes(search.toLowerCase()) ||
            c.lastName.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase()) ||
            (c.company && c.company.toLowerCase().includes(search.toLowerCase()))
    )

    const itemPerPage = 10;

    // Pagination des données
    const paginatedCustomers = Pagination.getData(filteredCustomers, currentPage, itemPerPage);

    return (
        <>
        <div className="d-flex justify-content-between align-items-center mb-3">
            <h1>Liste des clients</h1>
        <Link to="/customers/new" className="btn btn-primary">Créer un client</Link>
        </div>

            <div className="form-group">
                <input type="text" className="form-control" onChange={handleSearch} value={search} placeholder="Rechercher ..." />
            </div>

            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>ID.</th>
                        <th>Client</th>
                        <th>Email</th>
                        <th>Entreprise</th>
                        <th className="text-center"> Factures </th>
                        <th className="text-center"> Montant total </th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedCustomers.map(customer => <tr key={customer.id}>
                        <td>{customer.id}</td>
                        <td>
                            <a href="">{customer.firstName} {customer.lastName}</a>
                        </td>
                        <td>{customer.email}</td>
                        <td>{customer.company}</td>
                        <td className="text-center">{customer.invoices.length}</td>
                        <td className="text-center">{customer.totalAmount.toLocaleString()}€ </td>
                        <td>
                            <button
                                onClick={() => handleDelete(customer.id)}
                                disabled={customer.invoices.length > 0}
                                className="btn btn-sm btn-danger"
                            >
                                supprimer</button>
                        </td>
                    </tr>
                    )}
                </tbody>
            </table>
            {itemPerPage < filteredCustomers.length &&
                <Pagination currentPage={currentPage} itemPerPage={itemPerPage} length={filteredCustomers.length} onPageChanged={handlePageChange} />
            }
        </>
    );
}

export default CustomersPage;