import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import "../../App.css";
//D:\Repository\MyProject\MyMongoProject-first-branch\crud-operation\src\App.css
import toast from 'react-hot-toast';
import Spinner from '../../Spinner';

const Add = () => {
    const users = {
        name: "",
        email: "",
        address: "",
    }
    const [user, setUser] = useState(users);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const inputHandler = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value })
    }

    const submitForm = async (e) => {
        e.preventDefault();
        setLoading(true);
        await axios.post("https://pawan-data-base.onrender.com/api/user/create", user).then((Response) => {
            toast.success(Response.data.message, { position: "top-right" });
            navigate("/");
            //alert("User Created successful..");
        }).catch(error => console.log(error))

        setLoading(false); // Hide spinner after fetching

    }
    return (
        <div className='user1'>
            <Link to={"/"}>Back</Link>
            <h3 style={{ textAlign: 'center' }}>Add new User</h3>

            {/* Show the spinner while loading */}
            {loading ? (
                <Spinner loading={loading} />
            ) : (
                <form className='UserForm1' onSubmit={submitForm}>
                    <div className='inputGroup'>
                        <label htmlFor='name'>Name</label>
                        <input type='text' id="name" onChange={inputHandler} name="name" autoComplete='off' placeholder='Enter Your Name'></input>
                    </div>
                    <div className='inputGroup'>
                        <label htmlFor='email'>Email</label>
                        <input type='text' id="email" onChange={inputHandler} name="email" autoComplete='off' placeholder='Enter Your Email'></input>
                    </div>
                    <div className='inputGroup'>
                        <label htmlFor='address'>Address</label>
                        <input type='text' id="address" onChange={inputHandler} name="address" autoComplete='off' placeholder='Enter Your Address'></input>
                    </div>
                    <div className='inputGroup'>
                        <label htmlFor='mobile1'>Mobile 1</label>
                        <input type='text' id="mobile1" onChange={inputHandler} name="mobile1" autoComplete='off' placeholder='Enter Your mobile 1'></input>
                    </div>
                    <div className='inputGroup'>
                        <label htmlFor='mobile2'>Mobile 2</label>
                        <input type='text' id="mobile2" onChange={inputHandler} name="mobile2" autoComplete='off' placeholder='Enter Your mobile 2'></input>
                    </div>
                    <div className='inputGroup'>
                        <button className="submit">Add User</button>
                    </div>
                </form>
            )}
        </div>
    )
}

export default Add