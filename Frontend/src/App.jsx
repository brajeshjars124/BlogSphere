import { useState, useEffect } from 'react'

import Home from './pages/Home';
import BlogDetails from './pages/BlogDetails';
import AddBlog from './pages/AddBlog';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Navbar from './components/Navbar';

import{ BrowserRouter, Routes, Route, Navigate } from 'react-router';
import './App.css'



function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);

  useEffect(() =>{
    const token = localStorage.getItem('token');
    
    if(token){
      const savedUser = localStorage.getItem('user');
      if(savedUser){
        setUser(JSON.parse(savedUser));
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) return <div className="container mt-5">Loading app...</div>;

  return (

    <>
      <BrowserRouter>
        <Navbar user={user} onLogOut={handleLogout} />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog/:blogId" element={<BlogDetails />} />

            <Route path="/signin" element={!user ? <SignIn setUser={setUser} /> : <Navigate to="/" />} />
            <Route path="/signup" element={!user ? <SignUp /> : <Navigate to="/" />} />

            <Route path="/blog/add-blog" element={user?  <AddBlog user={user}/> : <Navigate to="/signin" />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  )
}

export default App