// components/login/useLogin.ts
import { useState } from "react";
import { loginApi } from "../../service/apis/auth.api";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/auth.store";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

   const handleSubmit = async (values: any) => {
  setLoading(true);
  try {
    const res = await loginApi(values);

    console.log("RES:", res);

    const access = res?.tokens?.accessToken;
    const refresh = res?.tokens?.refreshToken;

    if (access) {
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      dispatch(setUser(res.user));
      navigate("/dashboard");
    } else {
      console.log("Token missing ❌");
    }
  } catch (err) {
    console.log("Login failed");
  } finally {
    setLoading(false);
  }
};

  return { handleSubmit, loading };
};