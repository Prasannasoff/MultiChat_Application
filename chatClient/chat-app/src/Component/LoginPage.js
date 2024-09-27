import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'
function LoginPage() {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const user_name = name;
    const response = await axios.get(`http://localhost:8081/api/getCurrentUser/${user_name}`);
    console.log(response.data);
    if (response.data) {
      navigate('/publicChat', { state: response.data });
    }
  }
  return (
    <div>
      <label>Enter the Name:</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

      <button onClick={handleLogin}>Enter the chat</button>
      <Link to="/register">
        CLICK HERE TO REGISTER
      </Link>
    </div>
  )
}

export default LoginPage