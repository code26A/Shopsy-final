import { useEffect, useState } from "react";
import React from "react";
import Layout from "../../Layout/Layout";
import UserMenu from "../../Layout/UserMenu";
import { useAuth } from "../../../context/auth";
import moment from "moment";
import axios from "axios";
import { toast } from "react-toastify";
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [buyer, setBuyer] = useState("");
  const [product, setProduct] = useState([]);
  const [auth, setAuth] = useAuth();
  const getorders = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/orders");
      setOrders(data?.orders?.rows);
      setBuyer(data?.buyer?.rows[0]?.name);
      setProduct(data?.products?.rows);
      console.log(product);
    } catch (error) {
      console.log(error);
      toast.error("Error in retrieving orders");
    }
  };

  useEffect(() => {
    if (auth?.token) getorders();
  }, [auth?.token]);
  return (
    <Layout title={"Orders | Shopsy"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9 ">
            <h1>ALL ORDERS</h1>
            {orders?.map((o, i) => (
              <div key={i} className="border-shadow">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Status</th>
                      <th scope="col">Buyer</th>
                      <th scope="col">Date</th>
                      <th scope="col">Payment</th>
                      <th scope="col">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{i + 1}</td>
                      <td>
                        <strong>{o?.status}</strong>
                      </td>
                      <td>{buyer?.toUpperCase()}</td>
                      <td>{moment(o?.created_at).fromNow()}</td>
                      <td>{o?.products?.length}</td>
                      <td>{o?.payment.success ? "Success" : "Failed"}</td>
                    </tr>
                  </tbody>
                </table>
                <div className="container">
                  {o?.products.map((p, pIndex) => (
                    <div
                      key={pIndex}
                      className="card mb-3"
                      style={{ width: "30%", minWidth: "250px" }}
                    >
                      <img
                        className="card-img-top img-size"
                        src={p.photo}
                        alt={p.name}
                      />
                      <div className="card-body">
                        <h5 className="card-title">{p.name}</h5>
                        <p className="card-text">
                          {p.description.substring(0, 30)}...
                        </p>
                        <p className="card-text">${p.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
