import React from 'react'
import Layout from '../../Layout/Layout'
import AdminMenu from '../../Layout/AdminMenu'

const Users = () => {
  return (
    <Layout title={"Users | Shopsy"}>
       <div className='container-fluid m-3 p-3'>
         <div className='row'>
            <div className='col-md-3'>
              <AdminMenu/>
            </div>
            <div className='col-md-9 '>
                <h1>Users</h1>
               </div>
         </div>
        </div>
    </Layout>
  )
}

export default Users
