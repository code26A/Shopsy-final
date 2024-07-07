import Layout from '../Layout/Layout';
import React from 'react'
import { useParams } from 'react-router-dom';
import { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const CategoryProduct = () => {
    const [products,setProducts]=useState([])
    const navigate=useNavigate()
    const [categories,setCategories]=useState([])
    const params=useParams()
    const getProductbyCat=async()=>{
        try {
            console.log(params.slug)
            const {data}=await axios.get(`/api/v1/auth/products/product-category/${params.slug}`);
            setProducts(data?.rows)
            setCategories(data?.category?.rows[0])
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(()=>{
        if(params?.slug) getProductbyCat();
    },[params.slug])
  return (
    <Layout>
      <div className='container'>
        
        <h4 className='text-center mt-3'>{(categories?.name)?.toUpperCase()}</h4>
        <h6 className='text-center mt-3'>{products?.length} result found</h6>
        <div className="row">
        <div className="d-flex flex-wrap gap-5">
            {products?.map((p) => (
              <div
                key={p.id}
                className="card mb-3"
                style={{ width: '30%', minWidth: '250px' }}
              >
                <img className="card-img-top img-size" src={p.photo} alt={p.name} />
                <div className="card-body">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text">{p.description.substring(0, 30)}...</p>
                  <p className="card-text">${p.price}</p>
                  <div className="d-flex gap-3">
                    <button className="btn btn-primary" onClick={()=>navigate(`/product/${p.slug}`)}>More Details</button>
                    <button className="btn btn-secondary">Add to Cart</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default CategoryProduct
