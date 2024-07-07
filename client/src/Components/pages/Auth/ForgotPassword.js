import React, { useState } from 'react';
import Layout from '../../Layout/Layout';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [newPassword, setnewPassword] = useState("");
    const [answer,setAnswer]=useState("");
    const navigate=useNavigate();
    // Handler submit 
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            axios.defaults.baseURL = 'http://localhost:8000';

            const res = await axios.post("/api/v1/auth/forgot-password", { email, newPassword, answer })
            if (res&&res.data.success) {
                toast.success(res.data.message);
                setTimeout(() => {
                    navigate('/login');
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
        <Layout title='Reset Password | Shopsy'> 
              <div className='register'>
                <div className="container">
                    <h1 className="register-heading">Reset Password</h1>
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="Inputemail" className="form-label">Email</label>
                                    <input type="email" value={email} required onChange={(e) => setEmail(e.target.value)} className="form-control" id="exampleInputEmail1" placeholder='Enter your email' aria-describedby="emailHelp" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="exampleInputPassword1" className="form-label">New Password</label>
                                    <input type="password" value={newPassword} required onChange={(e) => setnewPassword(e.target.value)} placeholder='Enter your New password' className="form-control" id="exampleInputPassword1" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="exampleInputAnswer" className="form-label">Security Answer: </label>
                                    <input type="text" value={answer} required onChange={(e) => setAnswer(e.target.value)} placeholder='What your Favourite sport?' className="form-control" id="exampleInputAnswer" />
                                </div>
                                <div className="d-flex justify-content-center"> 
                                    <button type="submit" className="btn btn-primary">Change Password</button>
                                </div>
                                
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
  )
}

export default ForgotPassword
