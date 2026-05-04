
import axios from "axios";

 const httpsCall = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});
httpsCall.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default httpsCall;