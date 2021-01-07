import React from 'react';
import authAPI from '../services/authAPI';

const Navbar = (props) => {

    const handleLogout = () => {
        authAPI.logout();
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <a className="navbar-brand" href="#">SymReact</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor02" aria-controls="navbarColor02" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarColor02">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <a className="nav-link" href="#/customers">Clients</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#/invoices">Factures</a>
                    </li>
                </ul>
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <a href="" className="nav-link">
                            Inscription
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="#/login" className="btn btn-light text-success">
                            Connexion !
                        </a>
                    </li>
                    <li className="nav-item">
                        <button onClick={handleLogout} className="btn btn-danger">
                            Deconnexion !
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;