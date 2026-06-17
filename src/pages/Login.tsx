 
import { Navigate } from "react-router-dom";
import LoginBox from "../assets/login/Login";

export default function Login() {
const token = localStorage.getItem("access_token");

  if (token) {
    return <Navigate to="/dashboard" replace />;
    
  }


  return <LoginBox />;
}