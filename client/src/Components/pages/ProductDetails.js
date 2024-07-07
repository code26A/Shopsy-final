import React,{useState,useEffect} from 'react'
import Layout from '../Layout/Layout'
import axios from 'axios'
import { useParams } from 'react-router-dom'

const ProductDetails = () => {
   
    //get product
    axios.defaults.baseURL = 'http://localhost:8000';

    const params=useParams();
    const [product,setProduct]=useState({})
    const [category,setCategory]=useState({})
    const [relatedProduct,setRelatedProduct]=useState([])
    //getsimilar product
    const getSimilarProduct=async(pid,cid)=>{
        try {
            const {data}=await axios.get(`/api/v1/auth/products/related-product/${pid}/${cid}`)
            setRelatedProduct(data?.rows)
        } catch (error) {
            console.log(error)
        }
    }
     //initialp details
     useEffect(()=>{
        if(params?.slug) getProduct()
     },[params?.slug])
    const getProduct=async()=>{
        try {
            const {data}= await axios.get(`/api/v1/auth/products/get-product/${params.slug}`)
            setProduct(data?.product)
            setCategory(data?.category)
            getSimilarProduct(data?.product?.id,data?.category?.id)
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <Layout>
        <div className='row container mt-2'>
            <div className='col-md-6'>
            <img className="card-img-top" src={product.photo} alt={product.name} height='400' width='350px'/>
            </div>
        <div className='col-md-6 '>
            <h1 className='text-center'>Product Details</h1>
            <h5>Name : {product.name}</h5>
            <h5>Description : {product.description}</h5>
            <h5>Price : {product.price}</h5>
            <h5>Category : {category.name}</h5>
            <h5>Availaiblity : {product.quantity==0?'Not in Stock':`${product.quantity} IN STOCK`}</h5>
            <h5>Shipping : {product.shipping? "Available":"Not Available"}</h5>
            <div className='d-flex gap-2 mt-4'>
            <button className='btn btn-secondary ms-1'>ADD TO CART</button>
            <button className='btn btn-primary ms-1'>Buy now</button>
            </div>
        </div>
        </div>
        <hr/>
        <div className='row container'>
           <h6 className='m-4'>Similar Products</h6> 
           {relatedProduct.length<1 && <p className='text-center'>No Similar Product found</p>}
        <div className="d-flex flex-wrap gap-5 m-4">
            {relatedProduct?.map((p) => (
              <div
                key={p.id}
                className="card mb-3"
                style={{ width: '30%', minWidth: '250px' }}
              >
                <img className="card-img-top" src={p.photo} alt={p.name} />
                <div className="card-body">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text">{p.description.substring(0, 30)}...</p>
                  <p className="card-text">${p.price}</p>
                  <div className="d-flex gap-3">
                  
                    <button className="btn btn-secondary">Add to Cart</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          </div>
    </Layout>
  )
}

export default ProductDetails
