import React from 'react'

const CategoryForm = ({handleSubmit,value,setValue}) => {
  return (
    <>
     <form onSubmit={handleSubmit}>
  <div className="form-group mb-3">
    <input type="text" className="form-control"  placeholder="Enter New Category" value={value} onChange={(e)=> setValue(e.target.value)}/>
  </div>
  <button type="submit" className="btn btn-primary ml-3">Submit</button>
</form>

    </>
  )
}

export default CategoryForm
