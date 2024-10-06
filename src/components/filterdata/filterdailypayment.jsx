import React, { useState, useEffect } from 'react';
import "../../App.css";
import axios from 'axios';
import Spinner from '../../Spinner';

const FilterDailyPayment = () => {
    const [payments, setPayments] = useState([]);
    const [filteredPayments, setFilteredPayments] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedCarAssign, setSelectedCarAssign] = useState('');
    const [users, setUsers] = useState([]);
    const [carAssigns, setCarAssigns] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // Show spinner while fetching
            try {
                const response = await axios.get("http://localhost:8000/api/dailyPayments/getAllPayments");
                const sortedPayments = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setPayments(sortedPayments);
                setFilteredPayments(response.data);
            }
            catch (error) {
                console.error("Error fetching daily payment data:", error);
            } finally {
                setLoading(false); // Hide spinner after fetching
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        // Extract unique users and car assigns from payments
        const uniqueUsers = [...new Set(payments.map(payment => payment.user))];
        setUsers(uniqueUsers);

        const uniqueCarAssigns = [...new Set(payments.map(payment => payment.carAssign))];
        setCarAssigns(uniqueCarAssigns);
    }, [payments]);

    useEffect(() => {
        let filtered = payments;

        if (selectedUser) {
            filtered = filtered.filter(payment => payment.user === selectedUser);
        }

        if (selectedCarAssign) {
            filtered = filtered.filter(payment => payment.carAssign === selectedCarAssign);
        }
        if (startDate) {
            filtered = filtered.filter(payment => new Date(payment.date) >= new Date(startDate));
        }

        if (endDate) {
            filtered = filtered.filter(payment => new Date(payment.date) <= new Date(endDate));
        }
        setFilteredPayments(filtered);
    }, [selectedUser, selectedCarAssign, startDate, endDate, payments]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    const calculateTotals = () => {
        return filteredPayments.reduce((totals, payment) => {
            totals.totalEarning += Number(payment.totalEarning) || 0;
            totals.totalCash += Number(payment.totalcash) || 0;
            totals.CNG += Number(payment.CNG) || 0;
            totals.tollTax += Number(payment.tollTax) || 0;
            totals.payment += Number(payment.payment) || 0;
            totals.cashCollected += Number(payment.cashCollected) || 0;
            totals.benefit += Number(payment.benefit) || 0;
            totals.trips += Number(payment.trips) || 0;
            return totals;
        }, {
            totalEarning: 0,
            totalCash: 0,
            CNG: 0,
            tollTax: 0,
            payment: 0,
            cashCollected: 0,
            benefit: 0,
            trips: 0,
        });
    };
    const totals = calculateTotals();

    return (
        <div className='userTable'>
            <div className='filter'>
                <label htmlFor='userFilter'>Filter by User </label>
                <select id='userFilter' value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                    <option value="">All Users</option>
                    {users.map((user, index) => (
                        <option key={index} value={user}>{user}</option>
                    ))}
                </select>
                <label htmlFor='carAssignFilter'>Filter by Car Assign </label>
                <select id='carAssignFilter' value={selectedCarAssign} onChange={(e) => setSelectedCarAssign(e.target.value)}>
                    <option value="">All Cars</option>
                    {carAssigns.map((carAssign, index) => (
                        <option key={index} value={carAssign}>{carAssign}</option>
                    ))}
                </select>
                <label htmlFor='startDate'>From Date </label>
                <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} />

                <label htmlFor='endDate'>To Date </label>
                <input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            {/* Show the spinner while loading */}
            {loading ? (
                <Spinner loading={loading} />
            ) : (
                <div className="tableContainer">
                    <table border={1} cellPadding={10} cellSpacing={0}>
                        <thead>
                            <tr>
                                <th>SL/No</th>
                                <th>Date</th>
                                <th>User</th>
                                <th>Car Assign</th>
                                <th>Total Earning</th>
                                <th>Total Cash</th>
                                <th>CNG</th>
                                <th>Toll Tax</th>
                                <th>Payment</th>
                                <th>Cash Collected</th>
                                <th>Benefit</th>
                                <th>Trips</th>
                                <th>Percentage</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                filteredPayments.map((payment, index) => {
                                    const isNegativeBenefit = Number(payment.benefit) < 0;
                                    return (
                                        <tr key={payment._id} style={{ backgroundColor: isNegativeBenefit ? 'rgb(225, 102, 102)' : '' }}>
                                            <td>{index + 1}</td>
                                            <td>{formatDate(payment.date)}</td>
                                            <td>{payment.user}</td>
                                            <td>{payment.carAssign}</td>
                                            <td>{payment.totalEarning}</td>
                                            <td>{payment.totalcash}</td>
                                            <td>{payment.CNG}</td>
                                            <td>{payment.tollTax}</td>
                                            <td>{payment.payment}</td>
                                            <td>{payment.cashCollected}</td>
                                            <td>{payment.benefit}</td>
                                            <td>{payment.trips}</td>
                                            <td>{payment.percentage}</td>
                                            <td>{payment.description}</td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table>
                </div>
            )}
            <div className="totaltable">
                <table border={1} cellPadding={20} cellSpacing={0}>
                    <thead >
                        <tr>
                            <th>Total</th>
                            <th>Total Earning</th>
                            <th>Total Cash</th>
                            <th>CNG</th>
                            <th>Toll Tax</th>
                            <th>Payment</th>
                            <th>Cash Collected</th>
                            <th>Benefit</th>
                            <th>Trips</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Total</td>
                            <td>{totals.totalEarning}</td>
                            <td>{totals.totalCash}</td>
                            <td>{totals.CNG}</td>
                            <td>{totals.tollTax}</td>
                            <td>{totals.payment.toFixed(2)}</td>
                            <td>{totals.cashCollected.toFixed(2)}</td>
                            <td>{totals.benefit.toFixed(2)}</td>
                            <td>{totals.trips}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default FilterDailyPayment;
