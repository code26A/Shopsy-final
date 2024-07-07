import React, { useState, useEffect } from 'react';
import Layout from '../../Layout/Layout';
import AdminMenu from '../../Layout/AdminMenu';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Select } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';

const { Option } = Select;

const UpdateProduct = () => {
  const [categories, setCategories] = useState([]);
  const [photo, setPhoto] = useState('');
  const params=useParams();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [shipping, setShipping] = useState('');
  const [id,setId]=useState('');
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
    getsingleproduct();
    //eslint-disable-next-line
  }, []);
  //get-single-product
  const getsingleproduct=async()=>{
   
    try {
        const {data}=await axios.get(`/api/v1/auth/products/get-product/${params.slug}`)
        setName(data?.product?.name);
        setPrice(data?.product?.price);
        setDescription(data?.product?.description);
        setPhoto(data?.product?.photo);
        setQuantity(data?.product?.quantity);
        setId(data?.product?.id)
    } catch (error) {
        console.log(error)
        toast.error("Error in Updating Products")
    }
  }
  const handleDelete = async () => {
    setLoading(true); // Set loading to true during form submission
    try {
        let answer=window.prompt( "Are you sure you want to delete this product?");
        if(!answer) return;
        console.log(shipping)
      const {data}=await axios.delete(`/api/v1/auth/products/delete-product/${id}`);
        toast.success('Product Deleted successfully');
        navigate('/dashboard/admin/products');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete product');
    } finally {
      setLoading(false); // Set loading back to false after form submission completes
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true during form submission
    try {
        console.log(shipping)
      const { data } = await axios.put(`/api/v1/auth/products/update-product/${id}`, {
        name,
        description,
        price,
        category,
        photo,
        quantity,
        shipping,
      });
      if (data?.success) {
        toast.success('Product updated successfully');
        navigate('/dashboard/admin/products');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update product');
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
            <h1>Update Product</h1>
            <form onSubmit={handleUpdate}>
              <div className="m-1 w-75">
                <Select
                  placeholder="Select a Category"
                  showSearch
                  className="form-select mb-3"
                  onChange={(value) => setCategory(value)}
                  value={category}
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
                    value={shipping}
                  >
                    <Option value="1">YES</Option>
                    <Option value="0">NO</Option>
                  </Select>
                </div>
                <div className="mb-3">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Product'}
                  </button>
                </div>
                <div className="mb-3">
                  <button  className="btn btn-danger" disabled={loading} onClick={handleDelete}>
                    {loading ? 'Deleting...' : 'Delete Product'}
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

export default UpdateProduct;
