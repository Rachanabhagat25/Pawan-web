// NavBar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import "./App.css"; 

const NavBar = () => {
    return (
        <nav className='navBar'>
            <ul>
                <li><Link to="/">Users</Link></li>
                <li><Link to="/cars">Cars</Link></li>
                <li><Link to="/dailypayments">Daily Payments</Link></li>
                <li><Link to="/filterdailypayment">filter Daily Payments</Link></li>
            </ul>
        </nav>
    );
};

export default NavBar;