import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import "../../App.css";
import toast from 'react-hot-toast';
import Spinner from '../../Spinner';

const AddCar = () => {
    const [car, setCar] = useState({
        carNumber: "",
        carName: "",
        carCompany: "",
        status: "active"
    });

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const inputChangeHandler = (e) => {
        const { name, value } = e.target;
        setCar({ ...car, [name]: value });
    }

    const addCar = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post("https://pawan-data-base.onrender.com/api/car/create", car);
            toast.success(response.data.message, { position: "top-right" });
            navigate("/cars");
        } catch (error) {
            console.error("Error adding car:", error);
        } finally {
            setLoading(false); // Hide spinner after fetching
        }
    }

    return (
        <div className='user1'>
            <h3 style={{ textAlign: 'center' }}>Add Car</h3>
            {/* Show the spinner while loading */}
            {loading ? (
                <Spinner loading={loading} />
            ) : (
                <form className='UserForm1' onSubmit={addCar}>
                    <div className='inputGroup'>
                        <label htmlFor='carNumber'>Car Number</label>
                        <input type='text' value={car.carNumber} onChange={inputChangeHandler} id="carNumber" name="carNumber" autoComplete='off' placeholder='Enter Car Number'></input>
                    </div>
                    <div className='inputGroup'>
                        <label htmlFor='carName'>Car Name</label>
                        <input type='text' value={car.carName} onChange={inputChangeHandler} id="carName" name="carName" autoComplete='off' placeholder='Enter Car Name'></input>
                    </div>
                    <div className='inputGroup'>
                        <label htmlFor='carCompany'>Car Company</label>
                        <input type='text' value={car.carCompany} onChange={inputChangeHandler} id="carCompany" name="carCompany" autoComplete='off' placeholder='Enter Car Company'></input>
                    </div>
                    <div className='inputGroup'>
                        <label htmlFor='status'>Status</label>
                        <select value={car.status} onChange={inputChangeHandler} id="status" name="status">
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                    <div className='inputGroup'>
                        <button className="submit">Add Car</button>
                    </div>
                    <div className='inputGroup' style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <button type="button" className="cancel" onClick={() => navigate("/cars")}>Cancel</button>
                    </div>
                </form>
            )}
        </div>
    )
}

export default AddCar;