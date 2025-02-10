import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import styles from '../styles/RegisterPage.module.css';

function RegisterPage() {
    const [name, setName] = useState('');
    const [about, setAbout] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [image, setImage] = useState(null);  // Change to handle file

    const navigate = useNavigate();

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);  // Capture the uploaded file
    };

    const handleRegister = async () => {
        const formData = new FormData();
        formData.append('user_name', name);
        formData.append('about', about);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('phone', phone);
        formData.append('image', image);  // Append the image file

        try {
            const response = await axios.post("https://multichat-application-1.onrender.com/api/register", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'  // Set correct headers for file upload
                }
            });
            console.log(response.data);
            navigate('/');
        } catch (error) {
            console.error("There was an error registering!", error);
        }
    };

    return (
        <div className={styles.registerMain}>
            <div className={styles.container}>
                <h2>Register</h2>
                <input type="text" className={styles["form-control"]} placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                <input type="text" className={styles["form-control"]} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" className={styles["form-control"]} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <input type="number" className={styles["form-control"]} placeholder="Enter Phone No" value={phone} onChange={(e) => setPhone(e.target.value)} />
                
                {/* File input for image upload */}
                <input type="file" className={styles["form-control"]} onChange={handleImageChange} /> 
                
                <input type="text" className={styles["form-control"]} placeholder="Enter About" value={about} onChange={(e) => setAbout(e.target.value)} />

                <button className={styles["btn-primary"]} onClick={handleRegister}>Register</button>
                <Link to="/" className={styles.anchor}>
                    Already Have an Account
                </Link>
            </div>
        </div>
    );
}

export default RegisterPage;
