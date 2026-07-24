import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Dashboard from "./PAGES/admin/Dashboard";
import SuperAdminLogin from "./PAGES/admin/SuperAdminLogin";
import AdminLayout from "./layouts/AdminLayout";
import AllUsers from "./PAGES/admin/users/AllUsers";
import AddUser from "./PAGES/admin/users/AddUser";

import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/admin" element={<SuperAdminLogin />} />
       <Route path="/dashboard" element={<AdminLayout />}>
    <Route index element={<Dashboard />} />
      <Route path="users" element={<AllUsers />} />
      <Route path="users/super-admins" element={<AllUsers key="super-admins" preselectedRole="super-admin" />} />
      <Route path="users/admins" element={<AllUsers key="admins" preselectedRole="admin" />} />
      <Route path="users/shipping-managers" element={<AllUsers key="shipping-managers" preselectedRole="shipping-manager" />} />
      <Route path="users/customers" element={<AllUsers key="customers" preselectedRole="customer" />} />
      <Route path="users/add" element={<AddUser />} />
     </Route>
      </Routes>

      <ToastContainer />
    </>
  );
}

export default App;