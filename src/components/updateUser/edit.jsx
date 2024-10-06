import axios from 'axios';
import React, { useEffect, useState } from 'react'
import {  useParams,useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';



const Edit = () => {

    const users ={
        name:"",
        email:"",
        address:"",
    }   

    const {id} = useParams(); 
    const [user, setUser] =useState(users);
    const navigate = useNavigate();
    
    const inputChangeHandler =(e)=>{
        const {name,value} =e.target;
        setUser({...user, [name]:value});
    }
    const updateForm =async(e)=>{
        e.preventDefault();
        await axios.put(`http://localhost:8000/api/user/update/${id}`,user).then((Response)=>{
            toast.success(Response.data.message,{position:"top-right"});            
            navigate("/");
            //alert("User Updated successful..");
        }).catch(error => console.log(error))
    }

    useEffect(()=>{
        axios.get(`http://localhost:8000/api/user/fetchById/${id}`).then((response)=>{
            setUser(response.data);
        }).catch((error)=>{console.log(error);})
    },[id])


    return (
        <div className='user1'>
            <h3 style={{ textAlign: 'center' }}>Update User</h3>
            <form className='UserForm1' onSubmit={updateForm}>
                <div className='inputGroup'>
                    <label htmlFor='name'>Name</label>
                    <input type='text'value ={user.name} onChange={inputChangeHandler} id="name" name="name" autoComplete='off' placeholder='Enter Your Name'></input>
                </div>
                <div className='inputGroup'>
                    <label htmlFor='email'>Email</label>
                    <input type='text'value ={user.email} onChange={inputChangeHandler} id="email" name="email" autoComplete='off' placeholder='Enter Your Email'></input>
                </div>
                <div className='inputGroup'>
                    <label htmlFor='address'>Address</label>
                    <input type='text'value ={user.address} onChange={inputChangeHandler} id="address" name="address" autoComplete='off' placeholder='Enter Your Address'></input>
                </div>
                <div className='inputGroup'>
                    <label htmlFor='mobile1'>Mobile 1</label>
                    <input type='text'value ={user.mobile1} onChange={inputChangeHandler} id="mobile1" name="mobile1" autoComplete='off' placeholder='Enter Your mobile 1'></input>
                </div>
                <div className='inputGroup'>
                    <label htmlFor='mobile2'>Mobile 2</label>
                    <input type='text'value ={user.mobile2} onChange={inputChangeHandler} id="mobile2" name="mobile2" autoComplete='off' placeholder='Enter Your mobile 2'></input>
                </div>
                <div className='inputGroup' style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button className="submit">Update User</button>
                   
                </div>
                <div className='inputGroup' style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button type="button" className="cancel" onClick={() => navigate("/")}>Cancel</button>
                   
                </div>
            </form>
        </div>
    ) 
}

export default Edit