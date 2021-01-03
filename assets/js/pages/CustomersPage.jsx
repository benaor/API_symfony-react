import React, { useEffect, useState } from 'react';
import axios from "axios";
import Pagination from '../components/Pagination';

const CustomersPage = (props) => {

    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");

    useEffect(() => {
        axios
            .get("https://localhost:8000/api/customers")
            .then(response => response.data['hydra:member'])
            .then(data => setCustomers(data))
            .catch(error => console.log(error.response));
    }, []
    );

    const handleDelete = (id) => {

        //I make a copy of Array Customers
        const originalCustomers = [...customers];

        //Hidden the current customer
        setCustomers(customers.filter(customer => customer.id !== id))

        //Send HTTP Request to API
        axios
            .delete("https://localhost:8000/api/customers/" + id)
            .then(response => console.log("Customer " + id + " is delete"))
            .catch(error => {
                setCustomers(originalCustomers);
                console.log(error.response);
            });
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    }

    const handleSearch = event => {
        const value = event.currentTarget.value;
        setSearch(value);
        setCurrentPage(1);
    }

    const itemPerPage = 10;
    const filteredCustomers = customers.filter(
        c =>
            c.firstName.toLowerCase().includes(search.toLowerCase()) ||
            c.lastName.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase()) ||
            (c.company && c.company.toLowerCase().includes(search.toLowerCase())) 
    )

    const paginatedCustomers = Pagination.getData(filteredCustomers, currentPage, itemPerPage);

    return (
        <>
            <h1>Liste des clients</h1>

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