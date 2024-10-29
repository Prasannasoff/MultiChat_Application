import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Correct import
import './LoginPage.css'; // Import the CSS file

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(`http://localhost:8081/api/login`, { email, password });
      const token = response.data.token;
      localStorage.setItem('token', token);
      
      if (token) {
        // Decode the token to extract the email
        const decodedToken = jwtDecode(token);
        const userEmail = decodedToken.sub; // Renamed variable to avoid conflict
        console.log(userEmail)
        navigate('/publicChat', { state: { email: userEmail } });
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="container">
      <h2>Welcome Back!</h2>
      <label>Enter the Email:</label>
      <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />

      <label>Password:</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

      <button onClick={handleLogin}>Enter the chat</button>
      <Link className="link" to="/register">CLICK HERE TO REGISTER</Link>
    </div>
  );
}

export default LoginPage;
