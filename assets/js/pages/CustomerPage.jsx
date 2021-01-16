import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Field from '../components/forms/Field';

const CustomerPage = (props) => {

    const { id = "new " } = props.match.params;

    const [customer, setCustomer] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: ""
    })

    const [errors, setErrors] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: ""
    })

    const [editing, setEditing] = useState(false);

    const fetchCustomer = async id => {
        try {
            const data = await Axios
                .get("https://localhost:8000/api/customers/" + id)
                .then(response => response.data);
            const { firstName, lastName, email, company } = data;
            setCustomer({ firstName, lastName, email, company });

        } catch (error) {
            console.log(error.response);
        }
    }

    useEffect(() => {
        if (id !== "new") {
            setEditing(true);
            fetchCustomer(id);
        }
    }, [id]);

    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setCustomer({ ...customer, [name]: value })
    }

    const handleSubmit = async event => {
        event.preventDefault();

        try {

            if (editing) {
                const response = await Axios.put("https://localhost:8000/api/customers/" + id, customer);
                //TODO : Flash notification de succès 
            }
            else {
                const response = await Axios.post("https://localhost:8000/api/customers", customer);
                props.history.replace("/customers");
                //TODO : Flash notification de succès 
            }
            setErrors({});

        } catch (error) {
            if (error.response.data.violations) {
                const apiErrors = {};
                error.response.data.violations.forEach(violation => {
                    apiErrors[violation.propertyPath] = violation.message;
                });
                setErrors(apiErrors);
                //TODO : flash notifications d'une erreur
            }
        }
    }

    return (
        <>
            {(!editing && <h1>Creation d'un client</h1>) || (
                <h1>Modification du client</h1>
            )}

            <form onSubmit={handleSubmit}>
                <Field name="lastName" label="nom de famille" placeholder="nom de famille du client" value={customer.lastName} onChange={handleChange} error={errors.lastName} />
                <Field name="firstName" label="prenom" placeholder="Prenom du client" value={customer.firstName} onChange={handleChange} error={errors.firstName} />
                <Field name="email" label="Email" placeholder="adresse email du client" type="email" value={customer.email} onChange={handleChange} error={errors.email} />
                <Field name="company" label="Entreprise" placeholder="Entreprise du client" value={customer.company} onChange={handleChange} error={errors.company} />

                <div className="form-group">
                    <button type="submit" className="btn btn-success">Enregistrer</button>
                    <Link to="/customers" className="btn btn-link">Retour à la liste </Link>
                </div>
            </form>
        </>
    );
}

export default CustomerPage;