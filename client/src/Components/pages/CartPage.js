import React, { useEffect, useState } from "react";
import Layout from "../Layout/Layout";
import { useCart } from "../../context/cart";
import { useAuth } from "../../context/auth";
import DropIn from "braintree-web-drop-in-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const CartPage = () => {
  const [cart, setCart] = useCart();
  const [auth, setAuth] = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const checkOut = () => {
    if (!auth.token) navigate("/login");
  };

  const handleDecrease = (p) => {
    setQuantity((prevQuantity) => {
      const newQuantity = prevQuantity - 1;
      return newQuantity < 1 ? 1 : newQuantity;
    });
  };

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const totalPrice = () => {
    return cart.reduce((total, item) => total + parseFloat(item.price), 0);
  };

  const removeItem = (pid) => {
    const updatedCart = cart.filter((item) => item.id !== pid);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const getToken = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/products/braintree/token");
      setClientToken(data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getToken();
  }, [auth?.token]);

  const handlePayment = async () => {
    setLoading(true);
    try {
      if (!instance) {
        toast.error("Payment method not initialized.");
        setLoading(false);
        return;
      }
      console.log(instance);
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post(
        "/api/v1/auth/products/braintree/payment",
        { nonce, cart }
      );
      console.log(data);
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      toast.success("Payment Successful");
      navigate("/dashboard/user/orders");
    } catch (error) {
      console.error("Payment Error:", error);
      setLoading(false);
      toast.error("Payment failed. Please try again.");
    }
  };

  return (
    <Layout>
      <section className="h-screen flex justify-center items-center gradient-custom">
        <div className="container py-5">
          <div className="row d-flex justify-content-center my-4">
            <div className="col-md-8">
              {/* Cart items rendering */}
              <div className="card mb-4">
                <div className="card-header py-3">
                  <h5 className="mb-0">Cart - {cart.length}</h5>
                </div>
                {cart.map((p) => (
                  <div className="card-body" key={p.id}>
                    {/* Single item */}
                    <div className="row">
                      {/* Image */}
                      <div className="col-lg-3 col-md-12 mb-4 mb-lg-0">
                        <div className="bg-image hover-overlay hover-zoom ripple rounded">
                          <img src={p?.image} className="w-100" alt={p.alt} />
                          <Link to={`/product/${p.name}`}>
                            <div
                              className="mask"
                              style={{
                                backgroundColor: "rgba(251, 251, 251, 0.2)",
                              }}
                            />
                          </Link>
                        </div>
                      </div>
                      {/* Data */}
                      <div className="col-lg-5 col-md-6 mb-4 mb-lg-0">
                        <p>
                          <strong>{p.name.toUpperCase()}</strong>
                        </p>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm me-1 mb-2"
                          onClick={() => removeItem(p.id)}
                        >
                          <i className="fas fa-trash" />
                        </button>
                      </div>
                      <div className="col-lg-4 col-md-6 mb-4 mb-lg-0">
                        {/* Quantity input */}
                        <div className="d-flex mb-4" style={{ maxWidth: 300 }}>
                          <button
                            className="btn btn-primary px-3 me-2"
                            onClick={() => handleDecrease(p)}
                          >
                            <i className="fas fa-minus" />
                          </button>
                          <input
                            min={0}
                            name="quantity"
                            value={quantity}
                            type="number"
                            className="form-control text-center"
                            onChange={(e) =>
                              setQuantity(parseInt(e.target.value))
                            }
                          />
                          <button
                            className="btn btn-primary px-3 ms-2"
                            onClick={() => handleIncrease(p)}
                          >
                            <i className="fas fa-plus" />
                          </button>
                        </div>
                        {/* Price */}
                        <p className="text-start text-md-center">
                          <strong>Rs.{p.price}</strong>
                        </p>
                      </div>
                    </div>
                    {/* Single item */}
                    <hr className="my-4" />
                  </div>
                ))}
              </div>
              {/* Address section */}
              <div className="card mb-4">
                <div className="card-body">
                  <p>
                    <strong>Address :-</strong>
                  </p>
                  <p className="mb-3">{auth?.user?.address.toUpperCase()}</p>
                  <button
                    type="button"
                    className="btn  btn-lg btn-block btn-primary"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Update Address
                  </button>
                </div>
              </div>
              {/* Payment methods section */}
              <div className="card mb-4 mb-lg-0">
                <div className="card-body">
                  <p>
                    <strong>We accept</strong>
                  </p>
                  <div className="payment-methods d-flex gap-3">
                    <img
                      width="70px"
                      src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/paytm-icon.png"
                      alt="Paytm"
                      className="payment-logo "
                    />
                    <img
                      width="50px"
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/512px-Google_Pay_Logo.svg.png?20221017164555"
                      alt="Google Pay"
                      className="payment-logo"
                    />
                    <img
                      width="60px"
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/800px-Visa_Inc._logo.svg.png"
                      alt="Visa"
                      className="payment-logo"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Summary section */}
            <div className="col-md-4">
              <div className="card mb-4">
                <div className="card-header py-3">
                  <h5 className="mb-0">Summary</h5>
                </div>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                      Products
                      <span>Rs.{totalPrice()}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                      Shipping
                      <span>FREE</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                      <div>
                        <strong>Total amount</strong>
                        <strong>
                          <p className="mb-0">(including VAT)</p>
                        </strong>
                      </div>
                      <span>
                        <strong>Rs.{totalPrice()}</strong>
                      </span>
                    </li>
                  </ul>
                  {/* Checkout button */}
                  <button
                    type="button"
                    className={`btn  btn-lg btn-block ${
                      auth?.token ? "btn-primary" : "btn-warning"
                    }`}
                    onClick={checkOut}
                  >
                    {auth?.token ? "GO TO CHECKOUT" : "PROCEED TO LOGIN"}
                  </button>
                </div>
              </div>
              {/* Payment method selection and processing */}
              {clientToken && (
                <div className="mt-2">
                  {!clientToken || !cart.length ? (
                    ""
                  ) : (
                    <>
                      <DropIn
                        options={{
                          authorization: clientToken,
                          paypal: { flow: "vault" },
                        }}
                        onInstance={(instance) => setInstance(instance)}
                      />
                      <button
                        className="btn btn-warning mt-3"
                        onClick={handlePayment}
                        disabled={loading}
                      >
                        {loading ? "Processing..." : "Make Payment"}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CartPage;
