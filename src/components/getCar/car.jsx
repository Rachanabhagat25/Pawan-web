import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "../../App.css";
import axios from 'axios';
import toast from 'react-hot-toast';
import Spinner from '../../Spinner'; // Import the Spinner component
import { useNavigate } from 'react-router-dom';

const Car = () => {
    const [cars, setCars] = useState([]);
    const [selectedCars, setSelectedCars] = useState(new Set());
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // Show spinner while fetching
            try {
                const response = await axios.get("https://pawan-data-base.onrender.com/api/car/getAllCars");
                setCars(response.data);
            } catch (error) {
                console.error("Error fetching car data:", error);
            } finally {
                setLoading(false); // Hide spinner after fetching
            }
        };
        fetchData();
    }, []);

    const toggleUserSelection = (carId) => {
        setSelectedCars((prev) => {
            const newSelection = new Set(prev);
            if (newSelection.has(carId)) {
                newSelection.delete(carId);
            } else {
                newSelection.add(carId);
            }
            return newSelection;
        });
    };
    const navigate = useNavigate();
    const editCar = () => {
        if (selectedCars.size === 1) {
            const carId = Array.from(selectedCars)[0];
            navigate(`/editCar/${carId}`);
        }
    };

    const deleteCar = async () => {
        const confirmed = window.confirm("Are you sure you want to delete selected cars?");
        if (confirmed && selectedCars.size > 0) {
            setLoading(true); // Start spinner when delete operation begins
            try {
                const deleteRequests = Array.from(selectedCars).map(carId =>
                    axios.delete(`https://pawan-data-base.onrender.com/api/car/delete/${carId}`)
                );
                await Promise.all(deleteRequests);
                toast.success("Selected Cars deleted successfully!", { position: "top-right" });
                setCars((prevCars) => prevCars.filter(car => !selectedCars.has(car._id)));
                setSelectedCars(new Set());
            } catch (error) {
                console.error("Error deleting cars:", error);
                toast.error("Error deleting cars. Please try again.", { position: "top-right" });
            } finally {
                setLoading(false); // Stop spinner when operation completes
            }
        }
    };

    return (
        <div className='carTable'>
            <div>
                <h1 style={{ textAlign: 'center', fontWeight: 'bold', textShadow: '1px 1px 2px rgb(63, 7, 78)' }}>
                    --- Cars Data ---
                </h1>
                <div className="actionButtons">
                    <button onClick={editCar} disabled={selectedCars.size !== 1}>Edit Selected</button>
                    <button onClick={deleteCar} disabled={selectedCars.size === 0}>Delete Selected</button>
                </div>
            </div>

            {/* Show the spinner while loading */}
            {loading ? (
                <Spinner loading={loading} /> 
            ) : (
                <div className="tableContainer">
                    <table border={1} cellPadding={10} cellSpacing={0}>
                        <thead>
                            <tr>
                                <th>Select</th>
                                <th>SL/No</th>
                                <th>Car Number</th>
                                <th>Car Name</th>
                                <th>Car Company</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                cars.map((carData, index) => {
                                    return (
                                        <tr key={carData._id}>
                                            <td style={{ textAlign: 'center' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCars.has(carData._id)}
                                                    onChange={() => toggleUserSelection(carData._id)}
                                                />
                                            </td>
                                            <td>{index + 1}</td>
                                            <td>{carData.carNumber}</td>
                                            <td>{carData.carName}</td>
                                            <td>{carData.carCompany}</td>
                                            <td>{carData.status}</td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table>
                </div>
            )}

            <br />
            <Link to={"/addCar"} className='addButton'>Add Car</Link>
        </div>
    );
};

export default Car;
