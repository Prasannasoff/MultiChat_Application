import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'
function LoginPage() {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    // const response = await axios.post("http://localhost:8081/api/auth", { user_name: name });
    // console.log(response.data);
  
    navigate('/publicChat',{state:name});
  }
  return (
    <div>
      <label>Enter the Name:</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)}>
      </input>
      <button onClick={handleLogin}>Enter the chat</button>
      <Link to="/register">
        CLICK HERE TO REGISTER
      </Link>
    </div>
  )
}

export default LoginPage