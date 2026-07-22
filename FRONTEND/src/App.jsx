
import { Route, Routes } from 'react-router-dom';
import './App.css'
// importing toastify 
 import { ToastContainer, toast } from 'react-toastify';


 

function App() {

// const notify = () => toast.success("Toastify is working perfectly!");
  return (
    <>



<Routes>
  <Route/>
</Routes>











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

export default App
