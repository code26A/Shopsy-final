import { useState, useEffect } from "react";
import axios from "axios";

export default function useCategory() {
  const [categories, setCategories] = useState([]);
  // get cat
  axios.defaults.baseURL = "http://localhost:8000";
  const getCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/categories");
      setCategories(data?.category.rows);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCategory();
  }, []);
  return categories;
}
