import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Spinner from '../../Spinner';

const EditDailyPayment = () => {
    const initialPayment = {
        date: "",
        user: "",
        carAssign: "",
        totalEarning: "",
        cashCollected: "",
        totalcash: "",
        CNG: "",
        tollTax: "",
        payment: "",
        benefit: "",
        trips: "",
        description: "",
        percentage: "",
        isDelete: false,
        isEdit: false
    };

    const { id } = useParams();
    const [payment, setPayment] = useState(initialPayment);
    const [users, setUsers] = useState([]);
    const [cars, setCars] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const inputChangeHandler = (e) => {
        const { name, value } = e.target;
        setPayment(prevState => {
            const newPayment = { ...prevState, [name]: value };

            // Calculate payment when percentage or totalEarning changes
            if (name === 'percentage' || name === 'totalEarning') {
                const percentageValue = newPayment.percentage || 0;
                const earningValue = newPayment.totalEarning || 0;

                if (percentageValue && earningValue) {
                    newPayment.payment = ((earningValue * percentageValue) / 100).toFixed(2);
                }
            }

            // Calculate cashCollected
            if (newPayment.payment && newPayment.CNG && newPayment.tollTax && newPayment.totalcash) {
                newPayment.cashCollected = (newPayment.totalcash - newPayment.payment - newPayment.CNG - newPayment.tollTax).toFixed(2);
            }
           

            return newPayment;
        });
    };

    const updateForm = async (e) => {
        e.preventDefault();
        setLoading(true);
        await axios.put(`https://pawan-data-base.onrender.com/api/dailyPayments/update/${id}`, payment)
            .then((response) => {
                toast.success(response.data.message, { position: "top-right" });
                navigate("/dailypayments");
            })
            .catch(error => console.log(error));
        setLoading(false);
    };

    useEffect(() => {
        const fetchPaymentData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`https://pawan-data-base.onrender.com/api/dailyPayments/fetchById/${id}`);
                const fetchedPayment = response.data;
                const formattedDate = new Date(fetchedPayment.date).toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
                setPayment({ ...fetchedPayment, date: formattedDate });
            } catch (error) {
                console.log(error);
            }
            finally {
                setLoading(false); // Hide spinner after fetching
            }
        };

        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await axios.get("https://pawan-data-base.onrender.com/api/user/getAllUser");
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
            finally {
                setLoading(false); // Hide spinner after fetching
            }
        };

        const fetchCars = async () => {
            setLoading(true);
            try {
                const response = await axios.get("https://pawan-data-base.onrender.com/api/car/getAllCars");
                setCars(response.data);
            } catch (error) {
                console.error("Error fetching cars:", error);
            }
            finally {
                setLoading(false); // Hide spinner after fetching
            }
        };

        fetchPaymentData();
        fetchUsers();
        fetchCars();
    }, [id]);

    return (
        <div className='addUser'>
            <h1 style={{ textAlign: 'center', fontWeight: 'bold', textShadow: '1px 1px 2px rgb(63, 7, 78)' }}>--Update Daily Payment--</h1>
            {loading ? (
                <Spinner loading={loading} />
            ) : (
                <form className='addUserForm' onSubmit={updateForm}>
                    <table>
                        <tr>
                            <td>
                                <div className='inputGroup'>
                                    <label htmlFor='date'>Date</label>
                                    <input type='date' value={payment.date} onChange={inputChangeHandler} id="date" name="date" autoComplete='off' />
                                </div>
                            </td>
                            <td>
                                <div className='inputGroup'>
                                    <label htmlFor='user'>User</label>
                                    <select
                                        id="user"
                                        name="user"
                                        value={payment.user}
                                        onChange={inputChangeHandler}
                                    >
                                        <option value="">Select User</option>
                                        {users.map((user) => (
                                            <option key={user._id} value={user.name}>
                                                {user.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </td>
                            <td>
                                <div className='inputGroup'>
                                    <label htmlFor='carAssign'>Car Assign</label>
                                    <select
                                        id="carAssign"
                                        name="carAssign"
                                        value={payment.carAssign}
                                        onChange={inputChangeHandler}
                                    >
                                        <option value="">Select Car</option>
                                        {cars.map((car) => (
                                            <option key={car._id} value={car.carNumber}>
                                                {car.carNumber}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className='inputGroup'>
                                    <label htmlFor='totalEarning'>Total Earning</label>
                                    <input type='number' value={payment.totalEarning} onChange={inputChangeHandler} id="totalEarning" name="totalEarning" autoComplete='off' placeholder='Enter Total Earning' />
                                </div>
                            </td>
                            <td>
                                <div className='inputGroup'>
                                    <label htmlFor='totalcash'>Total Cash</label>
                                    <input type='number' value={payment.totalcash} onChange={inputChangeHandler} id="totalcash" name="totalcash" autoComplete='off' placeholder='Enter Total Cash' />
                                </div>
                            </td>
                            <td>
                                <div className='inputGroup'>
                                    <label htmlFor='CNG'>CNG</label>
                                    <input type='number' value={payment.CNG} onChange={inputChangeHandler} id="CNG" name="CNG" autoComplete='off' placeholder='Enter CNG' />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className='inputGroup'>
                                    <label htmlFor='tollTax'>Toll Tax</label>
                                    <input type='number' value={payment.tollTax} onChange={inputChangeHandler} id="tollTax" name="tollTax" autoComplete='off' placeholder='Enter Toll Tax' />
                                </div>
                            </td>
                            <td>
                                <div className='inputGroup'>
                                    <label htmlFor='percentage'>Percentage</label>
                                    <select
                                        id="percentage"
                                        name="percentage"
                                        value={payment.percentage}
                                        onChange={inputChangeHandler}
                                    >
                                        <option value="">Select Percentage</option>
                                        <option value="30">30%</option>
                                        <option value="35">35%</option>
                                        <option value="40">40%</option>
                                        <option value="45">45%</option>
                                        <option value="50">50%</option>
                                    </select>
                                </div>
                            </td>
                            <td>
                                <div className='inputGroup'>
                                    <label htmlFor='payment'>Payment</label>
                                    <input type='number' value={payment.payment} readOnly id="payment" name="payment" autoComplete='off' placeholder='Payment calculated here' />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className='inputGroup'>
                                    <label htmlFor='cashCollected'>Cash Collected</label>
                                    <input type='number' value={payment.cashCollected} readOnly id="cashCollected" name="cashCollected" autoComplete='off' placeholder='Cash Collected calculated here' />
                                </div>
                            </td>
                            <td>
                                <div className='inputGroup'>
                                    <label htmlFor='benefit'>Benefit</label>
                                    <input type='number' value={payment.benefit} onChange={inputChangeHandler} id="benefit" name="benefit" autoComplete='off' placeholder='Benefit here' />
                                </div>
                            </td>
                            <td>
                                <div className='inputGroup'>
                                    <label htmlFor='trips'>Trips</label>
                                    <input type='number' value={payment.trips} onChange={inputChangeHandler} id="trips" name="trips" autoComplete='off' placeholder='Enter Trips' />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className='inputGroup'>
                                    <label htmlFor='description'>Description</label>
                                    <input type='text' value={payment.description} onChange={inputChangeHandler} id="description" name="description" autoComplete='off' placeholder='Enter Description' />
                                </div>
                            </td>
                            <td>
                                <div className='inputGroup'>
                                    <button className="submit">Update Payment</button>
                                </div>
                            </td>
                            <td>
                                <div className='inputGroup'>
                                    <button type="button" className="cancel" onClick={() => navigate("/dailypayments")}> Cancel </button>
                                </div>
                            </td>
                        </tr>
                    </table>
                </form>)}
        </div>
    );
};

export default EditDailyPayment;
