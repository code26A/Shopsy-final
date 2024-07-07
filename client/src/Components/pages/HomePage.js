import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Checkbox, Radio } from "antd";
import Layout from "../Layout/Layout";
import { prices } from "../Prices";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/cart";
import { useSelector } from "react-redux";
const HomePage = () => {
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState("");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  axios.defaults.baseURL = "http://localhost:8000";

  //get category
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/categories");
      if (data.success) {
        setCategory(data.category.rows);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch categories");
    }
  };
  useEffect(() => {
    fetchCategories();
    getTotal();
  }, []);

  const getAllProduct = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/api/v1/auth/products/product-list/${page}`
      );
      setLoading(false);

      if (data.success && Array.isArray(data.data)) {
        setProducts((prevProducts) => [...prevProducts, ...data.data]);
      } else {
        console.error("Invalid response data:", data);
        toast.error("Failed to fetch products: Invalid response data");
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      toast.error("Failed to fetch products");
    }
  };
  //product count
  const getTotal = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/products/product-count");
      setTotal(data?.total);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);

  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/api/v1/auth/products/product-list/${page}`
      );
      setLoading(false);
      setProducts([...products, ...data?.data]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };
  useEffect(() => {
    if (!checked.length && !radio) getAllProduct();
  }, [checked.length, radio]);
  useEffect(() => {
    if (checked.length || radio) filterProduct();
  }, [checked.length, radio]);
  //get filtered product
  const filterProduct = async () => {
    try {
      const { data } = await axios.post(
        "/api/v1/auth/products/product-filter",
        {
          checked,
          radio,
        }
      );
      setProducts(data?.products);
    } catch (error) {
      console.error(error);
      toast.error("Failed to filter products");
    }
  };
  return (
    <Layout title="All Products - Best offers | Shopsy">
      <div className="container-fluid row mt-3">
        <div className="col-md-2">
          <h4 className="text-center">Filter By Category</h4>
          <div className="d-flex flex-column m-3">
            {category?.map((c) => (
              <Checkbox
                key={c.id}
                onChange={(e) => handleFilter(e.target.checked, c.id)}
              >
                {c.name}
              </Checkbox>
            ))}
          </div>
          <h4 className="text-center mt-4">Filter By Price</h4>
          <div className="d-flex flex-column m-3">
            <Radio.Group
              onChange={(e) => setRadio(e.target.value)}
              value={radio}
            >
              {prices?.map((p) => (
                <div key={p.id}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
            <div className="d-flex flex-column mt-3">
              <button
                className="btn btn-danger"
                onClick={() => window.location.reload()}
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-9">
          <h1 className="text-center">All Products</h1>
          <div className="d-flex flex-wrap gap-5">
            {products?.map((p) => (
              <div
                key={p.id}
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
                  <div className="d-flex gap-3">
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate(`/product/${p.slug}`)}
                    >
                      More Details
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setCart([...cart, p]);
                        localStorage.setItem(
                          "cart",
                          JSON.stringify([...cart, p])
                        );
                        toast.success("Item Added to Cart");
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="m-2 p-3">
            {products && products.length < total && (
              <button
                className="btn  btn-warning"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
