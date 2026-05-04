import httpsCall from "../httpCall";
import catchAsync from "../../utils/catchAsync";


type LoginData = {
  email: string;
  password: string;
};
export const loginApi = catchAsync(async (data:LoginData) => {
  const res = await httpsCall.post(`/auth/login`, data);
  return res.data;
});