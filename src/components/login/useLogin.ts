// components/login/useLogin.ts
import { useState } from "react";
import { loginApi } from "../../service/apis/auth.api";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/auth.store";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";

// export const useLogin = () => {
//   const [loading, setLoading] = useState(false);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//    const handleSubmit = async (values: any) => {
//   setLoading(true);
//   try {
//     const res = await loginApi(values);

//     console.log("RES:", res);

//     const access = res?.tokens?.accessToken;
//     const refresh = res?.tokens?.refreshToken;

//     if (access) {
//       localStorage.setItem("access_token", access);
//       localStorage.setItem("refresh_token", refresh);

//       dispatch(setUser(res.user));
//       navigate("/dashboard");
//     } else {
//       console.log("Token missing ❌");
//     }
//   } catch (err) {
//     console.log("Login failed");
//   } finally {
//     setLoading(false);
//   }
// };

//   return { handleSubmit, loading };
// };

export const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  // Login Component Formik
  const loginFormik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object({
      email: yup
        .string()
        .email("Please enter a valid email address")
        .required("Email address is required"),
      password: yup
        .string()
        .trim()
        .min(8, "Must be 8 or more than 8 characters")
        .required("Password field is Required")
        .matches(/\w/, "Please enter valid password"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const bodyData = {
          email: values.email,
          password: values.password,

        };
        const res = await loginApi(bodyData);
        // console.log(res,222);

        if (res.success) {
          // toast.success(response.message);
          setLoading(false);
          const access = res?.data?.tokens?.accessToken;
          const refresh = res?.data?.tokens?.refreshToken;

          if (access) {
            localStorage.setItem("access_token", access);
            localStorage.setItem("refresh_token", refresh);
            // console.log(res.data.admin,25888);
            
            dispatch(setUser(res.data.admin));
            navigate("/dashboard");
          } else {
            console.log("Token missing ❌");
          }
        } else {
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
      }
    },
  });
  return {
    loginFormik,
    loading,
    rememberMe,
    setRememberMe,
  };
};