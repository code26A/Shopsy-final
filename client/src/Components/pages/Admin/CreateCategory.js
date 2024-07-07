import React, { useState, useEffect } from 'react';
import Layout from '../../Layout/Layout';
import AdminMenu from '../../Layout/AdminMenu';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Modal } from 'antd';
import CategoryForm from '../../Form/CategoryForm';

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState('');
  const [loading, setLoading] = useState(false); // Loading state for API requests

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true during form submission
    try {
      const { data } = await axios.post('/api/v1/category/create-category', { name });
      if (data.success) {
        toast.success('Category created successfully');
        setName(''); // Clear input field after successful submission
        getallcategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong in input form');
    } finally {
      setLoading(false); // Set loading back to false after form submission completes
    }
  };

  const getallcategory = async () => {
    try {
      const { data } = await axios.get('/api/v1/category/categories');
      if (data.success) {
        setCategories(data.category.rows);
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong in getting all categories');
    }
  };

  useEffect(() => {
    getallcategory();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`/api/v1/category/update-category/${selected.id}`, { name: updatedName });
      if (data.success) {
        toast.success('Category Updated Successfully');
        setSelected(null);
        setUpdatedName('');
        setVisible(false);
        getallcategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    }
  };

  const handleDelete = async (cid) => {
    try {
      const { data } = await axios.delete(`/api/v1/category/delete-category/${cid}`);
      if (data.success) {
        toast.success('Category Deleted Successfully');
        getallcategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    }
  };

  return (
    <Layout title="Create Category | Shopsy">
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Manage Category</h1>
            <div className="p-3 w-50">
              <CategoryForm handleSubmit={handleSubmit} value={name} setValue={setName} />
            </div>
            <div className="w-75">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((c) => (
                    <tr key={c.id}> {/* Added key prop */}
                      <td>{c.name}</td>
                      <td>
                        <button className="btn btn-primary ms-2" onClick={() => { setVisible(true); setUpdatedName(c.name); setSelected(c); }}>
                          Edit
                        </button>
                        <button className="btn btn-danger ms-2" onClick={() => { if (window.confirm('Are you sure you want to delete this category?')) handleDelete(c.id); }}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Modal onCancel={() => setVisible(false)} footer={null} open={visible}>
              <CategoryForm value={updatedName} setValue={setUpdatedName} handleSubmit={handleUpdate} />
            </Modal>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;
