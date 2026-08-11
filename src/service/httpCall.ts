import axios from "axios";
import toast from "react-hot-toast";
import { store } from "../store/store";
import { logOut } from "../store/auth.store";

function hasJwtExpired(obj: any, depth: number = 0, maxDepth: number = 10): boolean {
  if (depth > maxDepth) return false;
  if (typeof obj === 'string') {
    return obj.toLowerCase().includes('jwt expired');
  }
  if (typeof obj === 'number' || obj === null || obj === undefined) {
    return false;
  }
  if (Array.isArray(obj)) {
    return obj.some(item => hasJwtExpired(item, depth + 1, maxDepth));
  }
  if (typeof obj === 'object' && obj !== null) {
    return Object.values(obj).some(value => hasJwtExpired(value, depth + 1, maxDepth));
  }
  return false;
}

// Request Interceptor
axios.interceptors.request.use(async (config) => {
  config.baseURL = import.meta.env.VITE_API_BASE_URL;

  const token = localStorage.getItem("access_token") ?? "";

  if (token) {
    config.headers["Authorization"] = "Bearer " + token;
  } else if (axios.defaults.headers.common["access"]) {
    config.headers["access"] = axios.defaults.headers.common["access"];
  }
  return config;
});
// Response Interceptor
let retryCount = 0;
const MAX_RETRIES = 3;
axios.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    const message = error?.response?.data?.message || "";
    const isTokenError =
      message === "Invalid / expired token" ||
      message === "jwt audience invalid. expected: access" || message === "jwt expired" || message === "Please authenticate";
    if ((isTokenError || hasJwtExpired(error?.response)) && retryCount < MAX_RETRIES) {
      const currentRefreshToken = localStorage.getItem("refresh_token");

      if (currentRefreshToken) {

        try {
          const refreshResponse = await axios.post("/auth/refresh-token", {
            refreshToken: currentRefreshToken,
          });
          // console.log(refreshResponse,2223);

          const { accessToken, refreshToken } = refreshResponse.data.data || {};
          // console.log(accessToken,refreshToken,669);

          if (accessToken && refreshToken) {
            localStorage.setItem("access_token", accessToken);
            localStorage.setItem("refresh_token", refreshToken);

            // Update original request with new token
            error.config.headers["Authorization"] = `Bearer ${accessToken}`;
            retryCount++;
            return axios(error.config); // Retry the original request
          }
        } catch (refreshError) {
          //     toast.error("Session expired. Please login again.");
          //     retryCount = 0; 
          //     import("../store/store").then(({ store }) => {
          //     import("../store/auth.store").then(({ logOut }) => {
          //        store.dispatch(logOut());
          //       setTimeout(() => {
          //         window.location.href = "/login";
          //       }, 500);
          //     });
          //  });
          toast.error("Session expired. Please login again.");
          retryCount = 0;

          store.dispatch(logOut());

          setTimeout(() => {
            localStorage.clear();
            window.location.href = "/login";
          }, 500);
        }
      } else {
        toast.error("No refresh token found. Please login again.");
      }
    }
    toast.error(error.response?.data?.message || "Something went wrong.");
    retryCount = 0;
    return Promise.reject(error);
  }
);


// Exporting axios call methods
const httpsCall = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  patch: axios.patch,
  patchForm: axios.patchForm,
  interceptors: axios.interceptors,
};

export default httpsCall;
