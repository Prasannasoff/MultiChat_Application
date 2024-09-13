import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'
function RegisterPage() {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    const response = await axios.post("http://localhost:8081/api/save", { user_name: name });
    console.log(response.data);
   
  }
  return (
    <div>
      <label>Enter the Name:</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)}>
      </input>
      <button onClick={handleRegister}>Enter the chat</button>
      <Link to="/">
        CLICK HERE TO LOGIN
      </Link>
    </div>
  )
}

export default RegisterPage