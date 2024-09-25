import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'
function LoginPage() {
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const [id, setId] = useState();
  const handleLogin = async () => {
    // const response = await axios.post("http://localhost:8081/api/auth", { user_name: name });
    // console.log(response.data);
    const data = {
      name: name,
      id: id
    }
    navigate('/publicChat', { state: data });
  }
  return (
    <div>
      <label>Enter the Name:</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <label>Enter the Id:</label>

      <input type="number" value={id} onChange={(e) => setId(e.target.value)}>

      </input>
      <button onClick={handleLogin}>Enter the chat</button>
      <Link to="/register">
        CLICK HERE TO REGISTER
      </Link>
    </div>
  )
}

export default LoginPage