import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSearch } from '../../context/search'
import axios from 'axios'
const SearchInput = () => {
    const [values,setValues]=useSearch()
    const navigate=useNavigate()
    const handleSubmit=async(e)=>{
        e.preventDefault()
        try {
            const {data}=await axios.get(`/api/v1/auth/products/search/${values.key}`)
            setValues({...values,results: data.rows})
            navigate('/search')
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <div>
    
  <div className="container-fluid search">
    <form className="d-flex" role="search" onSubmit={handleSubmit}>
    <input
  className="form-control me-2"
  value={values.key}
  type="search"
  placeholder="Search"
  aria-label="Search"
  onChange={(e) => setValues({...values, key: e.target.value})}
/>
      <button className="btn btn-outline-success" type="submit">Search</button>
    </form>
  </div>


    </div>
  )
}

export default SearchInput
