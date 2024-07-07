import Layout from "../Layout/Layout";
import React from "react";
import { useCart } from "../../context/cart";
import { toast } from "react-toastify";
import { useSearch } from "../../context/search";
import { useNavigate } from "react-router-dom";
const Search = () => {
  const [values, setValues] = useSearch();
  const [cart, setCart] = useCart();
  const navigate = useNavigate();
  return (
    <Layout title={"Search results | Shopsy"}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900">Search Results</h1>
        <h6>
          {values?.results.length < 1
            ? "No products Found"
            : `Found ${values?.results.length} Products`}
        </h6>
        <div className="d-flex flex-wrap gap-5">
          {values?.results.map((p) => (
            <div
              key={p.id}
              className="card mb-3"
              style={{ width: "30%", minWidth: "250px" }}
            >
              <img className="card-img-top" src={p.photo} alt={p.name} />
              <div className="card-body">
                <h5 className="card-title">{p.name}</h5>
                <p className="card-text">{p.description.substring(0, 30)}...</p>
                <p className="card-text">${p.price}</p>
                <div className="d-flex gap-3">
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/product/${p.slug}`)}
                  >
                    More Details
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setCart([...cart, p]);
                      localStorage.setItem(
                        "cart",
                        JSON.stringify([...cart, p])
                      );
                      toast.success("Item Added to Cart");
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Search;
