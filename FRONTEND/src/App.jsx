import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Dashboard from "./PAGES/admin/Dashboard";
import SuperAdminLogin from "./PAGES/admin/SuperAdminLogin";
import AdminLayout from "./layouts/AdminLayout";
import AllUsers from "./PAGES/admin/users/AllUsers";
import AddUser from "./PAGES/admin/users/AddUser";
import Categories from "./PAGES/admin/Categories";
import Products from "./PAGES/admin/Products";
import Orders from "./PAGES/admin/Orders";
import Coupons from "./PAGES/admin/Coupons";
import Reports from "./PAGES/admin/Reports";
import Settings from "./PAGES/admin/Settings";

import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/admin" element={<SuperAdminLogin />} />
       <Route path="/dashboard" element={<AdminLayout />}>
    <Route index element={<Dashboard />} />
      <Route path="users" element={<AllUsers />} />
      <Route key="super-admins" path="users/super-admins" element={<AllUsers preselectedRole="super-admin" />} />
      <Route key="admins" path="users/admins" element={<AllUsers preselectedRole="admin" />} />
      <Route key="shipping-managers" path="users/shipping-managers" element={<AllUsers preselectedRole="shipping-manager" />} />
      <Route key="customers" path="users/customers" element={<AllUsers preselectedRole="customer" />} />
      <Route path="users/add" element={<AddUser />} />
      <Route path="categories" element={<Categories />} />
      <Route path="products" element={<Products />} />
      <Route path="orders" element={<Orders />} />
      <Route path="coupons" element={<Coupons />} />
      <Route path="reports" element={<Reports />} />
      <Route path="settings" element={<Settings />} />
     </Route>
      </Routes>

      <ToastContainer />
    </>
  );
}

export default App;