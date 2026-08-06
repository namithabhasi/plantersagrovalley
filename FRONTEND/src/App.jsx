import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import './App.css'
// importing toastify 
import { toast } from 'react-toastify';

import './index.css';
import Navbar from './COMPONENTS/Navbar';
import Checkout from './COMPONENTS/Checkout';
import AuthModal from './COMPONENTS/AuthModal';
import { CartProvider } from './context/CartContext';

import Footer from './COMPONENTS/Footer';

import { ToastContainer } from "react-toastify";
import Home from "./PAGES/Home";
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
import Enquiries from "./PAGES/admin/Enquiries";
import Payment from "./PAGES/Payment";
import Cart from "./PAGES/Cart";
import Aboutus from "./PAGES/Aboutus";
import Faq from "./PAGES/Faq";
import Plants from "./PAGES/Plants";
import Seeds from "./PAGES/Seeds";
import Planterspage from "./PAGES/Planterspage";
import Fertilizers from "./PAGES/Fertilizers";
import Gardendecors from "./PAGES/Gardendecors";
import Signinpage from "./PAGES/Signinpage";
import Privacypolicy from "./PAGES/Privacypolicy";
import Terms from "./PAGES/Terms";
import Cancelandrefund from "./PAGES/Cancelandrefund";
import Trackorder from "./PAGES/Trackorder";
import Shippingpolicy from "./PAGES/Shippingpolicy";
import Getintouch from "./PAGES/Getintouch";
import Corporategift from "./PAGES/Corporategift";
import Plantrental from "./PAGES/Plantrental";
import Gardenmaintanence from "./PAGES/Gardenmaintanence";
import Verticalgarden from "./PAGES/Verticalgarden";
import Balconygarden from "./PAGES/Balconygarden";
import SearchPage from "./PAGES/SearchPage";
import Forgotpassword from "./PAGES/Forgotpassword";
import Blog from "./PAGES/Blog";
import Productdetails from "./PAGES/Productdetails";
import Profile from "./PAGES/Profile";
import Wishlist from "./PAGES/Wishlist";
import MyOrders from "./PAGES/MyOrders";

import Review from "./PAGES/Review";

import "react-toastify/dist/ReactToastify.css";

function App() {
  const location = useLocation();
  const hideNavbarFooter = location.pathname.startsWith('/dashboard') ||
    location.pathname === '/admin' ||
    location.pathname === '/payment' ||
    location.pathname === '/signin' ||
    location.pathname === '/forgot-password';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <CartProvider>
      {!hideNavbarFooter && <Navbar />}
      <Checkout />
      <AuthModal />

      <Routes>
        <Route path="/signin" element={<Signinpage />} />
        <Route path="/forgot-password" element={<Forgotpassword />} />
        <Route path="/privacy-policy" element={<Privacypolicy />} />
        <Route path="/terms-conditions" element={<Terms />} />
        <Route path="/cancel-refund" element={<Cancelandrefund />} />
        <Route path="/track-order" element={<Trackorder />} />
        <Route path="/shipping-policy" element={<Shippingpolicy />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/about" element={<Aboutus />} />
        <Route path="/faqs" element={<Faq />} />
        <Route path="/blogs" element={<Blog />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/plants" element={<Plants />} />
        <Route path="/seeds" element={<Seeds />} />
        <Route path="/planters" element={<Planterspage />} />
        <Route path="/fertilizers" element={<Fertilizers />} />
        <Route path="/garden-decor" element={<Gardendecors />} />
        <Route path="/contact" element={<Getintouch />} />
        <Route path="/corporate-gifting" element={<Corporategift />} />
        <Route path="/plant-rental" element={<Plantrental />} />
        <Route path="/garden-maintenance" element={<Gardenmaintanence />} />
        <Route path="/vertical-garden" element={<Verticalgarden />} />
        <Route path="/balcony-garden" element={<Balconygarden />} />
        <Route path="/product/:id" element={<Productdetails />} />
        <Route path="/review" element={<Review />} />
        <Route path="/product/:id/review" element={<Review />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/" element={<Home />} />
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
          <Route path="enquiries" element={<Enquiries />} />
        </Route>
      </Routes>
          {/* toast container for creating toast */}
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {!hideNavbarFooter && <Footer />}
    </CartProvider>
  );
}

export default App;
