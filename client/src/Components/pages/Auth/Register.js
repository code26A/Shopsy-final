import React, { useState } from 'react';
import Layout from '../../Layout/Layout';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [answer, setAnswer] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            axios.defaults.baseURL = 'http://localhost:8000';

            const res = await axios.post("/api/v1/auth/register", { name, email, password, phone, address, answer });
            if (res && res.data.success) {
                toast.success(res.data.message);
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                toast.error(res.data.message || "Registration failed");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong during registration");
        }
    };

    return (
        <Layout title="Register | Shopsy">
            <div className='register'>
                <div className="container">
                    <h1 className="register-heading">Register</h1>
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="InputName" className="form-label">Name</label>
                                    <input type="text" value={name} required onChange={(e) => setName(e.target.value)} className="form-control" id="exampleInputName" placeholder='Enter your name' />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="InputEmail" className="form-label">Email</label>
                                    <input type="email" value={email} required onChange={(e) => setEmail(e.target.value)} className="form-control" id="exampleInputEmail" placeholder='Enter your email' />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="InputPassword" className="form-label">Password</label>
                                    <input type="password" value={password} required onChange={(e) => setPassword(e.target.value)} className="form-control" id="exampleInputPassword" placeholder='Enter your password' />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="InputPhone" className="form-label">Phone</label>
                                    <input type="tel" value={phone} required onChange={(e) => setPhone(e.target.value)} className="form-control" id="exampleInputPhone" placeholder='Enter your phone' />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="InputAddress" className="form-label">Address</label>
                                    <input type="text" value={address} required onChange={(e) => setAddress(e.target.value)} className="form-control" id="exampleInputAddress" placeholder='Enter your address' />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="InputAnswer" className="form-label">Security Question: What is Your Favorite Sports?</label>
                                    <input type="text" value={answer} required onChange={(e) => setAnswer(e.target.value)} className="form-control" id="exampleInputAnswer" placeholder='Your answer' />
                                </div>
                                <button type="submit" className="btn btn-primary">Register</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Register;
