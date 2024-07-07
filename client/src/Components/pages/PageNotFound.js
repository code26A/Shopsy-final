import React from 'react'
import Layout from '../Layout/Layout'
import { Link } from 'react-router-dom'
const PageNotFound = () => {
  return (
    <Layout>
        <div className='pnf'>
        <span className='pnf-title'>404</span>
        <h2 className='pnf-heading'>Oops ! Page Not Found</h2>
        <Link to='/' className='pnf-btn'>Go Back</Link>
        </div>
    </Layout>
  )
}

export default PageNotFound
