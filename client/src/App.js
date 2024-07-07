import About from "./Components/pages/About";
import Contact from "./Components/pages/Contact";
import HomePage from "./Components/pages/HomePage";
import Register from "./Components/pages/Auth/Register.js";
import PageNotFound from "./Components/pages/PageNotFound";
import Policy from "./Components/pages/Policy.js";
import "react-toastify/dist/ReactToastify.css";
import Login from "./Components/pages/Auth/Login.js";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./Components/pages/user/Dashboard.js";
import PrivateRoute from "./Components/Routes/Private.js";
import ForgotPassword from "./Components/pages/Auth/ForgotPassword.js";
import AdminRoute from "./Components/Routes/AdminRoute.js";
import AdminDashboard from "./Components/pages/Admin/AdminDashboard.js";
import CreateCategory from "./Components/pages/Admin/CreateCategory.js";
import CreateProduct from "./Components/pages/Admin/CreateProduct.js";
import Users from "./Components/pages/Admin/Users.js";
import Orders from "./Components/pages/UserMenu/Orders.js";
import Profile from "./Components/pages/UserMenu/Profile.js";
import Products from "./Components/pages/Admin/Products.js";
import UpdateProduct from "./Components/pages/Admin/UpdateProduct.js";
import Search from "./Components/pages/Search.js";
import ProductDetails from "./Components/pages/ProductDetails.js";
import Categories from "./Components/pages/Categories.js";
import CategoryProduct from "./Components/pages/CategoryProduct.js";
import CartPage from "./Components/pages/CartPage.js";
import AdminOrders from "./Components/pages/Admin/AdminOrders.js";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/categories" element={<Categories />}></Route>
        <Route path="/cart" element={<CartPage />}></Route>
        <Route path="/category/:slug" element={<CategoryProduct />}></Route>
        <Route path="/product/:slug" element={<ProductDetails />} />

        <Route path="/dashboard" element={<PrivateRoute />}>
          <Route path="user" element={<Dashboard />} />
          <Route path="user/orders" element={<Orders />} />
          <Route path="user/profile" element={<Profile />} />
        </Route>

        <Route path="/dashboard" element={<AdminRoute />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/create-category" element={<CreateCategory />} />
          <Route path="admin/create-product" element={<CreateProduct />} />
          <Route path="admin/products/:slug" element={<UpdateProduct />} />
          <Route path="admin/products" element={<Products />} />
          <Route path="admin/users" element={<Users />} />
          <Route path="admin/orders" element={<AdminOrders />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/search" element={<Search />} />
        <Route path="/forgot-password" element={<ForgotPassword />}></Route>
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/policy" element={<Policy />} />
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
