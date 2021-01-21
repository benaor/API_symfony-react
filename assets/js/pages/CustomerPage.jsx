import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Field from '../components/forms/Field';
import customersAPI from '../services/customersAPI';

const CustomerPage = ({ match, history }) => {

    const { id = "new " } = match.params;

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

    // Rcecuperation du client en fonction de son ID 
    const fetchCustomer = async id => {
        try {
            const { firstName, lastName, email, company } = await customersAPI.find(id);
            setCustomer({ firstName, lastName, email, company });

        } catch (error) {
            toast.error("le client n'a pas pu être chargé");
            history.replace("/customers")
        }
    }

    // Chargement du customer (si besoin) au chargement du composant ou au changement de l'identifiant
    useEffect(() => {
        if (id !== "new") {
            setEditing(true);
            fetchCustomer(id);
        }
    }, [id]);

    //Gestion des changements des inouts dans les formaulaires.
    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setCustomer({ ...customer, [name]: value })
    }

    //Gestion de la soumission des formulaires
    const handleSubmit = async event => {
        event.preventDefault();

        try {
            setErrors({});
            if (editing) {
                await customersAPI.update(id, customer);
                toast.success("le client a bien été modifié");
            }
            else {
                const response = await customersAPI.create(customer);
                toast.success("Le client a bien été créer");
                history.replace("/customers");
            }

        } catch ({ response }) {
            const { violations } = response.data;
            if (violations) {
                const apiErrors = {};
                violations.forEach(({ propertyPath, message }) => {
                    apiErrors[propertyPath] = message;
                });
                setErrors(apiErrors);
                toast.error("Il y a des erreurs dans votre formulaire");
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