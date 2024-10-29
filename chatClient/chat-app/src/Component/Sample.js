import React,{useEffect} from 'react'
import { Link, useNavigate,useLocation } from "react-router-dom";
import api from '../services/api';
function Sample() {
    const location=useLocation();
    const {email}=location.state;
    console.log("Email",email)
    useEffect(() => {
        const getData = async () => {
            const response = await api.get(`/getCurrentUser/${email}`);
            console.log("Fetching user with email: ", email);

            console.log("CurrentUserDetail ", response.data);
            
        }
        getData();
    }, []);
  return (
    <div>Sample</div>
  )
}

export default Sample