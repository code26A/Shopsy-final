import React, { useEffect } from "react";
import Layout from "../../Layout/Layout";
import UserMenu from "../../Layout/UserMenu";
import { useAuth } from "../../../context/auth";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  //context
  const [auth, setAuth] = useAuth();
  //user data
  useEffect(() => {
    const { email, name, phone, address, password } = auth?.user;
    setName(name);
    setEmail(email);
    setPhone(phone);
    setAddress(address);
  }, [auth?.user]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      axios.defaults.baseURL = "http://localhost:8000";

      const { data } = await axios.put("/api/v1/auth/profile", {
        name,
        email,
        password,
        phone,
        address,
      });
      if (data?.error) {
        toast.error(data.error);
      } else {
        setAuth({ ...auth, user: data?.updatedUser });
        let ls = localStorage.getItem("auth");
        ls = JSON.parse(ls);
        ls.user = data?.updatedUser;
        localStorage.setItem("auth", JSON.stringify(ls));
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong during updation");
    }
  };
  return (
    <Layout title={"Profile | Shopsy"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9 ">
            <h1>Profile</h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="InputName" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-control"
                  id="exampleInputName"
                  placeholder="Enter your name"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="InputEmail" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                  id="exampleInputEmail"
                  placeholder="Enter your email"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="InputPassword" className="form-label">
                  Password
                </label>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                  id="exampleInputPassword"
                  placeholder="Change your password"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="InputPhone" className="form-label">
                  Phone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-control"
                  id="exampleInputPhone"
                  placeholder="Enter your phone"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="InputAddress" className="form-label">
                  Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="form-control"
                  id="exampleInputAddress"
                  placeholder="Enter your address"
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Update
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
