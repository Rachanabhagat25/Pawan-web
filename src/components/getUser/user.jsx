import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "../../App.css";
import axios from 'axios';
import toast from 'react-hot-toast';
import Spinner from '../../Spinner.js'; // Import the Spinner component
import { useNavigate } from 'react-router-dom';

const User = () => {
    const [user, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState(new Set());
    const [loading, setLoading] = useState(true); // Loading state
 
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // Show spinner
            try {
                const response = await axios.get("http://localhost:8000/api/user/getAllUser");
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
                toast.error("Error fetching user data. Please try again.", { position: "top-right" });
            } finally {
                setLoading(false); // Hide spinner after data retrieval
            }
        };
        fetchData();
    }, []);
 
    const toggleUserSelection = (userId) => {
        setSelectedUsers((prev) => {
            const newSelection = new Set(prev);
            if (newSelection.has(userId)) {
                newSelection.delete(userId);
            } else {
                newSelection.add(userId);
            }
            return newSelection;
        });
    };
 
    const deleteUsers = async () => {
        const confirmed = window.confirm("Are you sure you want to delete selected users?");
        if (confirmed && selectedUsers.size > 0) {
            setLoading(true);
            try {
                const deleteRequests = Array.from(selectedUsers).map(userId =>
                    axios.delete(`http://localhost:8000/api/user/delete/${userId}`)
                );
                await Promise.all(deleteRequests);
                toast.success("Selected users deleted successfully!", { position: "top-right" });
                setUsers((prevUsers) => prevUsers.filter(user => !selectedUsers.has(user._id)));
                setSelectedUsers(new Set());
            } catch (error) {
                console.error("Error deleting users:", error);
                toast.error("Error deleting users. Please try again.", { position: "top-right" });
            } finally {
                setLoading(false); // Stop spinner when operation completes
            }
        }
    };
    const navigate = useNavigate();
    const editUsers = () => {
        if (selectedUsers.size === 1) {
            const userId = Array.from(selectedUsers)[0];
            navigate(`/edit/${userId}`);
        }
        else{
            alert("select on record to edit !..");
        }
    };
 
    return (
        <div className='driverdata'>
            <div>
                <h1 style={{ textAlign: 'center', fontWeight: 'bold', textShadow: '1px 1px 2px rgb(63, 7, 78)' }}>
                    --- Driver / Users ---
                </h1>
                <div className="actionButtons">
                    <button onClick={editUsers} disabled={selectedUsers.size !== 1}>Edit Selected</button>
                    <button onClick={deleteUsers} disabled={selectedUsers.size === 0}>Delete Selected</button>
                </div>
            </div>
 
            {/* Show the spinner while loading */}
            {loading ? (
                <Spinner loading={loading} />
            ) : user.length > 0 ? (
                <div className="tableContainer">
                    <table border={1} cellPadding={10} cellSpacing={0}>
                        <thead style={{textAlign:'center'}}>
                            <tr>
                                <th>Select</th>
                                <th>SL/No</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Address</th>
                                <th>Mobile 1</th>
                                <th>Mobile 2</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                user.map((userdata, index) => {
                                    return (
                                        <tr key={userdata._id}>
                                            <td style={{textAlign:'center'}}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedUsers.has(userdata._id)}
                                                    onChange={() => toggleUserSelection(userdata._id)}
                                                />
                                            </td>
                                            <td>{index + 1}</td>
                                            <td>{userdata.name}</td>
                                            <td>{userdata.email}</td>
                                            <td>{userdata.address}</td>
                                            <td>{userdata.mobile1}</td>
                                            <td>{userdata.mobile2}</td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No users found or failed to fetch users.</p>
            )}
           
            <br />
            <br />
            <Link to={"/add"} className='addButton'>Add User</Link>
        </div>
    );
};
 
export default User;
