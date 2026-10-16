import { useState, useEffect, useCallback, useMemo } from "react";
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

  const [captchaCode, setCaptchaCode] = useState("");

  const generateCaptcha = useCallback(() => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
  }, []);

  useEffect(() => {
    generateCaptcha();
  }, [generateCaptcha]);

  const validationSchema = useMemo(() => {
    return yup.object({
      email: yup
        .string()
        .email("Please enter a valid email address")
        .required("Email address is required"),
      password: yup
        .string()
        .trim()
        .min(8, "Must be 8 or more than 8 characters")
        .required("Password field is required"),
      captcha: yup
        .string()
        .trim()
        .required("CAPTCHA verification is required")
        .test(
          "captcha-match",
          "Incorrect CAPTCHA code!",
          (value) => value?.trim() === captchaCode // ⚡ Exact Case Sensitive Match
        ),
    });
  }, [captchaCode]);

  const loginFormik = useFormik<LoginPayload & { captcha: string }>({
    initialValues: {
      email: "",
      password: "",
      captcha: "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setFieldError }) => {
      // ⚡ HARD SECURITY GUARD: Exact match check before API call
      if (values.captcha.trim() !== captchaCode) {
        toast.error("Incorrect CAPTCHA code!");
        setFieldError("captcha", "Incorrect CAPTCHA code!");
        generateCaptcha();
        loginFormik.setFieldValue("captcha", "");
        return; // ⛔ Stop execution here! API will not be called.
      }

      setLoading(true);
      try {
        const res = await loginApi({
          email: values.email,
          password: values.password,
        });

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
          generateCaptcha();
          loginFormik.setFieldValue("captcha", "");
        }
      } catch (error) {
        setLoading(false);
        generateCaptcha();
        loginFormik.setFieldValue("captcha", "");
      }
    },
  });

  return {
    loginFormik,
    loading,
    rememberMe,
    setRememberMe,
    captchaCode,
    generateCaptcha,
  };
};