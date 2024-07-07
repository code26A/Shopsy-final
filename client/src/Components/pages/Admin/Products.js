import React, { useState, useEffect } from 'react';
import AdminMenu from '../../Layout/AdminMenu';
import Layout from '../../Layout/Layout';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const Products = () => {
  const [products, setProducts] = useState([]);

  const getallproducts = async () => {
    try {
      const { data } = await axios.get('/api/v1/auth/products/get-product');
      if (data?.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong in getting all products');
    }
  };

  useEffect(() => {
    getallproducts();
  }, []);

  return (
    <Layout title={'Products | Shopsy'}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center">ALL Products list</h1>
            <div className="d-flex flex-wrap gap-3 justify-content-between">
              {products.map((p) => (
                <Link key={p.id} to={`/dashboard/admin/products/${p.slug}`} className="card mb-3" style={{ width: '30%', minWidth: '250px' }}>
                  <img   className="card-img-top" src={p.photo} alt={p.name} />
                  <div className="card-body">
                    <h5 className="card-title">{p.name}</h5>
                    <p className="card-text">{p.description}</p>
                    <a href="#" className="btn btn-primary">
                      Update Product
                    </a>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
