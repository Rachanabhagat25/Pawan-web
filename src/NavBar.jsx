// NavBar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import "./App.css";

const NavBar = () => {
    return (
        <nav className='navBar'>
            <ul style={{ width: '100%', display: 'inline-block' }}>
                <li style={{ float: 'left' }}><Link to="/">Users</Link></li>
                <li style={{ float: 'left' }}><Link to="/cars">Cars</Link></li>
                <li style={{ float: 'left' }}><Link to="/dailypayments">Daily Payments</Link></li>
                <li style={{ float: 'left' }}><Link to="/filterdailypayment">Filter Daily Payments</Link></li>
                <li style={{ float: 'right', fontWeight: 'bold', color: 'white' }}><Link>-- Pawan/Sameer Cabs -- </Link></li> {/* Align right */}
            </ul>
        </nav>

    );
};

export default NavBar;