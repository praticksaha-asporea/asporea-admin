import { useState } from "react";
import { loginApi } from "../../service/apis/auth.api";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/auth.store";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-hot-toast";

import type { LoginPayload } from "../../types/payloads/auth/auth.payloads";

export const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const loginFormik = useFormik<LoginPayload>({
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
    
    const res = await loginApi(values);

    if (res.success) {
      setLoading(false);
      const access = res.data?.tokens?.accessToken;
      const refresh = res.data?.tokens?.refreshToken;

      if (access) {
        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);
        
        
        dispatch(setUser(res.data.admin));
        navigate("/dashboard");
      } else {
        console.log("Token missing ❌");
      }
    } else {
      setLoading(false);
      toast.error(res.message || "Something went wrong");
    }
  } catch (error) {        
    setLoading(false);
  }
}
  });

  return {
    loginFormik,
    loading,
    rememberMe,
    setRememberMe,
  };
};
