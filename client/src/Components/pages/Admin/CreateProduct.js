import React, { useState, useEffect } from 'react';
import Layout from '../../Layout/Layout';
import AdminMenu from '../../Layout/AdminMenu';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Select } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const CreateProduct = () => {
  const [categories, setCategories] = useState([]);
  const [photo, setPhoto] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [shipping, setShipping] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false); // State variable for loading indicator
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/v1/category/categories');
        if (data.success) {
          setCategories(data.category.rows);
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch categories');
      }
    };
    fetchCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true during form submission
    try {
      const { data } = await axios.post('/api/v1/auth/products/create-product', {
        name,
        description,
        price,
        category,
        photo,
        quantity,
        shipping,
      });
      if (data.success) {
        toast.success('Product created successfully');
        navigate('/dashboard/admin/products');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to create product');
    } finally {
      setLoading(false); // Set loading back to false after form submission completes
    }
  };

  return (
    <Layout title="Create Product | Shopsy">
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Create Product</h1>
            <form onSubmit={handleCreate}>
              <div className="m-1 w-75">
                <Select
                  placeholder="Select a Category"
                  showSearch
                  className="form-select mb-3"
                  onChange={(value) => setCategory(value)}
                >
                  {categories.map((c) => (
                    <Option key={c.id} value={c.id}>
                      {c.name}
                    </Option>
                  ))}
                </Select>
                <div className="mb-3">
                  <label className="mb-2">Paste Photo URL:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={photo}
                    onChange={(e) => setPhoto(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="mb-2">Name:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="mb-2">Description:</label>
                  <textarea
                    rows="4"
                    cols="50"
                    className="form-control"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label className="mb-2">Price:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="mb-2">Quantity:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="mb-2">Shipping:</label>
                  <Select
                    showSearch
                    placeholder="Shipping"
                    className="form-select mb-3"
                    onChange={(value) => setShipping(value)}
                  >
                    <Option value={true}>YES</Option>
                    <Option value={false}>NO</Option>
                  </Select>
                </div>
                <div className="mb-3">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Product'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProduct;
