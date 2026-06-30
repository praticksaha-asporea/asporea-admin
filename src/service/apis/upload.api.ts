import httpsCall from "../httpCall";
import catchAsync from "../../utils/catchAsync";

export const getUploadsListApi = catchAsync(
  async (params?: Record<string, any>) => {
    const res = await httpsCall.get("/admin/uploads", { params });
    return res;
  },
);

export const deleteUploadApi = catchAsync(
  async (id: string) => {
    const res = await httpsCall.delete("/admin/uploads", { params: { id } });
    return res;
  },
);