import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Field from '../components/forms/Field';
import Select from '../components/forms/Select';
import customersAPI from '../services/customersAPI';
import invoicesAPI from '../services/invoicesAPI';

const InvoicePage = ({ history, match }) => {

    const { id = "new" } = match.params;

    const [invoice, setInvoice] = useState({
        amount: "",
        customer: "",
        status: "SENT"
    })


    const [customers, setCustomers] = useState([]);
    const [editing, setEditing ] = useState(false);
    const [errors, setErrors] = useState({
        amount: "",
        customer: "",
        status: ""
    })

    //recuperation des clients 
    const fetchCustomers = async () => {
        try {
            const data = await customersAPI.findAll();
            setCustomers(data);

            if (!invoice.customer) setInvoice({ ...invoice, customer: data[0].id });

        } catch ({ response }) {
            const { violations } = response.data;
            if (violations) {
                const apiErrors = {};
                violations.forEach(({ propertyPath, message }) => {
                    apiErrors[propertyPath] = message;
                });
                setErrors(apiErrors);
                //TODO : flash notifications d'une erreur
            }
        }
    }

    // Recuperation d'une facture 
    const fectchInvoice = async id => {
        try {
            const { amount, status, customer } = await invoicesAPI.find(id);
            setInvoice({ amount, status, customer: customer.id });

        } catch (error) {
            console.log(error.response);
            history.replace("/invoices")
            //TODO : flash noification erreur
        }
    }

    //recuperation de la liste des clients a chaque chargement du composant
    useEffect(() => {
        fetchCustomers();
    }, []);

    //Recuperation de la bonne facture quand l'URL change 
    useEffect(() => {
        if (id !== "new") {
            setEditing(true);
            fectchInvoice(id);
        }
    }, [id])

    //Gestion des changements des inputs dans les formulaires.
    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setInvoice({ ...invoice, [name]: value })
    }

    const handleSubmit = async event => {
        event.preventDefault();

        try {
            if(editing) {
                await invoicesAPI.update(id, invoice);
                //TODO FLASH
            } else { 
                await invoicesAPI.create(invoice);
            }
        } catch (error) {
            console.log(error.response);
        }
        console.log(invoice);
    }

    return (
        <>

            {(editing && <h1>Modification d'une facture</h1>) || (
                    <h1>Création d'une facture</h1>
                )}

            <form onSubmit={handleSubmit} >
                <Field name="amount" placeholder="montant de la facture" label="montant" onChange={handleChange} value={invoice.amount} error={errors.amount} />

                <Select name="customer" label="client" value={invoice.customer} error={errors.customer} onChange={handleChange}>
                    {customers.map(customer => (
                        <option key={customer.id} value={customer.id}>
                            {customer.firstName} {customer.lastName}
                        </option>))}
                </Select>

                <Select name="status" label="status" value={invoice.status} error={errors.status} onChange={handleChange}>
                    <option value="SENT">Envoyée</option>
                    <option value="PAID">Payée</option>
                    <option value="CANCELLED">Annulée</option>
                </Select>

                <div className="form-group">
                    <button type="submit" className="btn btn-success">Enregistrer</button>
                    <Link to="/invoices" className="btn btn-link">Retour aux factures</Link>
                </div>

            </form>
        </>
    );
}

export default InvoicePage;