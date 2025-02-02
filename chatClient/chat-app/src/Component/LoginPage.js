import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Correct import
import styles from '../styles/LoginPage.module.css' // Import the CSS file
import { UserCircle } from "lucide-react"

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(`http://localhost:8081/api/login`, { email, password });
      const token = response.data.token;
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
    <div className={styles.container}>
      <div className={styles.card}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div className={styles.iconContainer}>
            <UserCircle className={styles.icon} />
          </div>
          <div style={{ color: "white", fontSize: "28px", fontFamily: "Poppins" }}>Login</div>
        </div>

        <div className={styles.inputGroup}>
          <input
            type="email"
            placeholder="Email ID"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />

        

          <button onClick={handleLogin} className={styles.loginButton}>
            LOGIN
          </button>
        </div>

        <Link to="/register" className={styles.registerLink}>
          CLICK HERE TO REGISTER
        </Link>
      </div>
    </div>
  );
}

export default LoginPage;
