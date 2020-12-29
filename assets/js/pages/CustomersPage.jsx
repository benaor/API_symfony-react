import React from 'react';

const CustomersPage = (props) => {
    return (
        <>
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
        <tr>
            <td>12</td>
            <td>
                <a href="#">Benjamin GIRARD</a>
            </td>
            <td>benjamin@girard.com</td>
            <td>Ben&fils</td>
            <td className="text-center"> 4 </td>
            <td className="text-center"> 3600,00€ </td>
            <td>
                <button className="btn btn-sm btn-danger">supprimer</button>
            </td>
        </tr>
    </tbody>
</table>
        </>
    );
}

export default CustomersPage;