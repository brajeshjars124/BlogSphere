import React, { useState } from 'react';
import { useNavigate } from 'react-router';



export default function SignUp() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  
  const  handleSubmit = async(e) => {
    e.preventDefault();
    try{
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password })
      });

      const data = await response.json();
      if (response.ok &&data.success ) {
        alert(data.message);
        navigate("/signin");
      } else {
        setError(data.error || "Registration Failed"); // "User already exists"
      }
    }
  
    catch(error){
      setError("Cannot connect to server.");
    }
  };
  return (
  <>
    <div className="row justify-content-center m-5">
      <div className="col-md-6 border p-4 rounded bg-light shadow-sm">
        <h3 className="mb-4 text-center text-muted ">Create Account</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter a strong, min 8 characters password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              viewport="password"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Sign Up</button>
        </form>
      </div>
    </div>
  </>
  );
}