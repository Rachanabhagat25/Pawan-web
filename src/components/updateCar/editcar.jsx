import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Spinner from '../../Spinner'; // Import the Spinner component

const EditCar = () => {
    const { id } = useParams();
    const [car, setCar] = useState({
        carNumber: "",
        carName: "",
        carCompany: "",
        status: "active"
    });
    const [loading, setLoading] = useState(true); // Loading state
    const navigate = useNavigate();

    const inputChangeHandler = (e) => {
        const { name, value } = e.target;
        setCar({ ...car, [name]: value });
    };

    const updateCar = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading when updating the car
        try {
            const response = await axios.put(`http://localhost:8000/api/car/update/${id}`, car);
            toast.success(response.data.message, { position: "top-right" });
            navigate("/cars");
        } catch (error) {
            console.error("Error updating car:", error);
        } finally {
            setLoading(false); // Stop loading after the update is complete
        }
    };

    useEffect(() => {
        const fetchCarData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/car/fetchById/${id}`);
                setCar(response.data);
            } catch (error) {
                console.error("Error fetching car data:", error);
            } finally {
                setLoading(false); // Stop loading after fetching the data
            }
        };
        fetchCarData();
    }, [id]);

    return (
        <div className='addUser'>
            <h3 style={{ textAlign: 'center' }}>Update Car</h3>
            
            {loading ? (
                <Spinner loading={loading} /> // Show spinner while loading
            ) : (
                <form className='addUserForm' onSubmit={updateCar}>
                    <div className='inputGroup'>
                        <label htmlFor='carNumber'>Car Number</label>
                        <input
                            type='text'
                            value={car.carNumber}
                            onChange={inputChangeHandler}
                            id="carNumber"
                            name="carNumber"
                            autoComplete='off'
                            placeholder='Enter Car Number'
                        />
                    </div>
                    <div className='inputGroup'>
                        <label htmlFor='carName'>Car Name</label>
                        <input
                            type='text'
                            value={car.carName}
                            onChange={inputChangeHandler}
                            id="carName"
                            name="carName"
                            autoComplete='off'
                            placeholder='Enter Car Name'
                        />
                    </div>
                    <div className='inputGroup'>
                        <label htmlFor='carCompany'>Car Company</label>
                        <input
                            type='text'
                            value={car.carCompany}
                            onChange={inputChangeHandler}
                            id="carCompany"
                            name="carCompany"
                            autoComplete='off'
                            placeholder='Enter Car Company'
                        />
                    </div>
                    <div className='inputGroup'>
                        <label htmlFor='status'>Status</label>
                        <select value={car.status} onChange={inputChangeHandler} id="status" name="status">
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                    <div className='inputGroup' style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <button className="submit" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Car'}
                        </button>
                    </div>
                    <div className='inputGroup' style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <button type="button" className="cancel" onClick={() => navigate("/cars")}>Cancel</button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default EditCar;
