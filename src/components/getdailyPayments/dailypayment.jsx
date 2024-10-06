import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "../../App.css";
import axios from 'axios';
import toast from 'react-hot-toast';
import Spinner from '../../Spinner';
import { useNavigate } from 'react-router-dom';


const DailyPayments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredPayments, setFilteredPayments] = useState([]);
    const [selectedPayments, setSelectedPayments] = useState(new Set());
    const [heading, setHeading] = useState("--- Daily Payments ---");

    const [numberOfCars, setNumberOfCars] = useState(0);
    const [numberOfDays, setNumberOfDays] = useState(0);
    const [rent, setRent] = useState(0);
    const [calculatedBenefit, setCalculatedBenefit] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                const response = await axios.get("https://pawan-data-base.onrender.com/api/dailyPayments/getAllPayments");
                const sortedPayments = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setPayments(sortedPayments);
                setFilteredPayments(sortedPayments);

            } catch (error) {
                console.error("Error fetching payments:", error);
            } finally {
                setLoading(false); // Hide spinner after fetching
            }
        };

        fetchData();
    }, []);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    const resetTimeToMidnight = (date) => {
        return new Date(date.setHours(0, 0, 0, 0));
    };

    const getStartOfWeek = (date) => {
        const currentDate = new Date(date);
        const day = currentDate.getDay();
        const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1); // Adjust when Sunday (day === 0)
        return new Date(currentDate.setDate(diff));
    };

    const getEndOfWeek = (startOfWeek) => {
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6); // End of week is 6 days after start
        return endOfWeek;
    };

    const filterPayments = (weekOffset) => {
        const today = new Date();
        let startOfWeek = resetTimeToMidnight(getStartOfWeek(today));  // Normalize startOfWeek
        startOfWeek.setDate(startOfWeek.getDate() + weekOffset * 7);   // Adjust for current or previous weeks

        const endOfWeek = resetTimeToMidnight(getEndOfWeek(startOfWeek)); // Normalize endOfWeek

        const filtered = payments.filter(payment => {
            const paymentDate = resetTimeToMidnight(new Date(payment.date)); // Normalize paymentDate
            return paymentDate >= startOfWeek && paymentDate <= endOfWeek;
        });

        setFilteredPayments(filtered);

        // Update heading based on weekOffset
        if (weekOffset === 0) {
            setHeading("--- Current Week Payments ---");
        } else if (weekOffset === -1) {
            setHeading("--- Previous Week Payments ---");
        }
    };

    const showAllPayments = () => {
        setFilteredPayments(payments);
        setHeading("--- Daily Payments ---");
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

    const toggleUserSelection = (carId) => {
        setSelectedPayments((prev) => {
            const newSelection = new Set(prev);
            if (newSelection.has(carId)) {
                newSelection.delete(carId);
            } else {
                newSelection.add(carId);
            }
            return newSelection;
        });
    };
    //<Link to={"/editCar/" + carData._id}><i className="fa-solid fa-pen-to-square"></i> </Link>
    const navigate = useNavigate();

    const editPayment = () => {
        if (selectedPayments.size === 1) {
            const paymentId = Array.from(selectedPayments)[0];
            // Use navigate to redirect without page refresh
            navigate(`/editDailyPayment/${paymentId}`);
        } else if (selectedPayments.size === 0) {
            alert("Select at least one record to edit");
        }
        else if (selectedPayments.size > 1) {
            alert("Select only one record to edit");
        }
    };

    const deletePayment = async () => {
        if (selectedPayments.size > 0) {
            const confirmed = window.confirm("Are you sure you want to delete selected Payment?");
            if (confirmed && selectedPayments.size > 0) {
                setLoading(true);
                try {
                    const deleteRequests = Array.from(selectedPayments).map(carId =>
                        axios.delete(`https://pawan-data-base.onrender.com/api/dailyPayments/delete/${carId}`)
                    );
                    await Promise.all(deleteRequests);
                    toast.success("Selected payments deleted successfully!", { position: "top-right" });

                    // Update both payments and filteredPayments
                    const updatedPayments = payments.filter(payment => !selectedPayments.has(payment._id));
                    setPayments(updatedPayments);
                    setFilteredPayments(updatedPayments); // Ensure filteredPayments is updated

                    // Clear the selection
                    setSelectedPayments(new Set());
                } catch (error) {
                    console.error("Error deleting payments:", error);
                }
                finally {
                    setLoading(false); // Stop spinner when operation completes
                }
            }
        }
        if (selectedPayments.size === 0) {
            alert("Select at least one record to Delete")
        }
    };

    const handleBenefitCalculation = () => {
        const benefit = (totals.totalEarning - totals.CNG - totals.payment - (numberOfCars * numberOfDays * rent)).toFixed(2);
        setCalculatedBenefit(benefit);
    };

    return (
        <div className='userTable'>
            <div className="loading-bar-container">
                <div id="loading-bar" className="loading-bar"></div>
            </div>
            <div>
                <h1 style={{ textAlign: 'center', fontWeight: 'bold', textShadow: '1px 1px 2px rgb(63, 7, 78)' }}>
                    {heading}
                </h1>
                <br></br>
                <div className="actionButtons">
                    <button onClick={editPayment}>Edit Selected</button>
                    <button onClick={deletePayment} >Delete Selected</button>
                    <Link to={"/addDailyPayment"} className='addButton'>Add Daily Payment</Link>
                    <button type="button" className="cancel" onClick={() => filterPayments(0)}>Show This Week</button>
                    <button type="button" className="cancel" onClick={() => filterPayments(-1)}>Show Previous Week</button>
                    <button type="button" className="cancel" onClick={showAllPayments}>Show All Data</button>
                </div>


            </div>
            {loading ? (
                <Spinner loading={loading} />
            ) : (
                <div className="tableContainer">
                    <table border={1} cellPadding={10} cellSpacing={0}>
                        <thead>
                            <tr>
                                <th>Select</th>
                                <th>SL/No</th>
                                <th>Date</th>
                                <th>User/Driver</th>
                                <th>Car Assign</th>
                                <th>Total Earning</th>
                                <th>Total Cash</th>
                                <th>CNG</th>
                                <th>Toll Tax</th>
                                <th>Payment</th>
                                <th>Cash Collected</th>
                                <th> Avrage Benefit</th>
                                <th>Trips</th>
                                <th>Percentage</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                !loading && filteredPayments.map((payment, index) => {
                                    const isNegativeBenefit = Number(payment.benefit) < 0;
                                    return (
                                        <tr key={payment._id} style={{ backgroundColor: isNegativeBenefit ? 'rgb(225, 102, 102)' : '' }}>
                                            <td style={{ textAlign: 'center' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedPayments.has(payment._id)}
                                                    onChange={() => toggleUserSelection(payment._id)}
                                                />
                                            </td>
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
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>)}
            <br></br>
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
                            <td>{totals.totalEarning.toFixed(2)}</td>
                            <td>{totals.totalCash.toFixed(2)}</td>
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
            <div className="inputs-container">
                <h2>Benefit Calculation</h2>
                <br></br>
                <label>
                    Number of Cars:
                    <input
                        type="number"
                        value={numberOfCars}
                        onChange={(e) => setNumberOfCars(Number(e.target.value))}
                    />
                </label>
                <label>
                    Number of Days:
                    <input
                        type="number"
                        value={numberOfDays}
                        onChange={(e) => setNumberOfDays(Number(e.target.value))}
                    />
                </label>
                <label>
                    Rent per Car:
                    <input
                        type="number"
                        value={rent}
                        onChange={(e) => setRent(Number(e.target.value))}
                    />
                </label>

                <button onClick={handleBenefitCalculation}>Calculate Benefit</button>
                <br></br>
                <h3>Calculated Benefit: {calculatedBenefit}</h3>
            </div>
        </div>
    );
};

export default DailyPayments;
