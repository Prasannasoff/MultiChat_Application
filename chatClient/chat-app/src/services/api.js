// src/services/api.js
import axios from 'axios';

// Create an Axios instance
const api = axios.create({
    baseURL: 'http://localhost:8081/api', // Replace with your base API URL
});


// use Axios interceptors to automatically add the JWT token to every outgoing request, which simplifies the process since you won’t need to manually add the token in every request.

api.interceptors.request.use(
    (config) => {
        // Retrieve the token from localStorage (or another secure storage location)
        const token = localStorage.getItem('token');

        // If the token exists, add it to the request headers
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Handle the error
        return Promise.reject(error);
    }
);

export default api;
