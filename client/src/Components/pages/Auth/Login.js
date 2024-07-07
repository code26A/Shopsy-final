import React, { useState } from 'react';
import Layout from '../../Layout/Layout';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import { useAuth } from '../../../context/auth';
const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate=useNavigate();
    const [auth,setAuth]=useAuth("")
    // Handler submit 
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            axios.defaults.baseURL = 'http://localhost:8000';

            const res = await axios.post("/api/v1/auth/login", { email, password })
            if (res&&res.data.success) {
                toast.success(res.data.message);
                setAuth({...auth,
                user: res.data.user,
                token: res.data.token});

                    localStorage.setItem('auth',JSON.stringify(res.data)); // stroring data in local storage

                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                toast.error(res.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong")
        }
    };

    return (
        <Layout title="Login | Shopsy">
            <div className='register'>
                <div className="container">
                    <h1 className="register-heading">Login</h1>
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="Inputemail" className="form-label">Email</label>
                                    <input type="email" value={email} required onChange={(e) => setEmail(e.target.value)} className="form-control" id="exampleInputEmail1" placeholder='Enter your email' aria-describedby="emailHelp" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                                    <input type="password" value={password} required onChange={(e) => setPassword(e.target.value)} placeholder='Enter your password' className="form-control" id="exampleInputPassword1" />
                                </div>
                                <div className="d-flex justify-content-center"> {/* Flex container to center button */}
                                    <button type="submit" className="btn btn-primary">Login</button>
                                </div>
                                <Link type="submit" to='/forgot-password' className="text-white">Forgot Password?</Link>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Login;
