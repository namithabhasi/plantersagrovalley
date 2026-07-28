import { Route, Routes } from 'react-router-dom';
import './App.css'
// importing toastify 
import { ToastContainer, toast } from 'react-toastify';

import './index.css';
import Navbar from './COMPONENTS/Navbar';
import Home from './PAGES/Home';
import Footer from './COMPONENTS/Footer';

function App() {
  return (
    <>
      <Navbar />
      
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>

      <Footer />

      {/* toast container for creating toast */}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  )
}

export default App;
