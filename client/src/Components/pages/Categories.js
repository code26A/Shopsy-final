import React from 'react'
import { useState,useEffect } from 'react'
import useCategory from '../../hooks/useCategory'
import Layout from '../Layout/Layout'
import { Link } from 'react-router-dom'

const Categories = () => {
    const categories=useCategory()
    return (
    <Layout title={"All Categories | Shopsy"}>
        <div className='container'>
            <div className='row'>
                {categories.map((c)=>(
                    <div className='col-md-6 mt-5 mb-3'>
                        <Link to={`/category/${c.slug}`} className='btn btn-primary' >{c.name}</Link>
                     </div>
                ))}
                
            </div>
        </div>
    </Layout>
  )
}

export default Categories
