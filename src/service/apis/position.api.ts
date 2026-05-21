import httpsCall from "../httpCall";
import catchAsync from "../../utils/catchAsync";

export type PositionPayload = {
  title: string;
  details: string;
  requiredDocuments: string[];
  mandatoryDocuments: string[];
  positionBrochure?: string;   // ObjectId ref — populated by multer upload
};

export const getPositionsApi = catchAsync(async (params?: Record<string, string>) => {
  const res = await httpsCall.get("/admin/position/get-list", { params });
  return res;
});

export const getPositionByIdApi = catchAsync(async (id: string) => {
  const res = await httpsCall.get(`/admin/position/view?id=${id}`);
  return res;
});

export const createPositionApi = catchAsync(async (data: PositionPayload, brochure?: File | null) => {
  if (brochure) {
    const form = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (Array.isArray(v)) v.forEach((item) => form.append(k, item));
      else if (v !== undefined && v !== "") form.append(k, String(v));
    });
    form.append("positionBrochure", brochure);
    const res = await httpsCall.post("/admin/position/create", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res;
  }
  const res = await httpsCall.post("/admin/position/create", data);
  return res;
});

export const updatePositionApi = catchAsync(async (id: string, data: Partial<PositionPayload>, brochure?: File | null) => {
  if (brochure) {
    const form = new FormData();
    form.append("id", id);
    Object.entries(data).forEach(([k, v]) => {
      if (Array.isArray(v)) v.forEach((item) => form.append(k, item));
      else if (v !== undefined && v !== "") form.append(k, String(v));
    });
    form.append("positionBrochure", brochure);
    const res = await httpsCall.patch("/admin/position/update", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res;
  }
  const res = await httpsCall.patch("/admin/position/update", { id, ...data });
  return res;
});

export const deletePositionApi = catchAsync(async (id: string) => {
  const res = await httpsCall.delete(`/admin/position/delete?id=${id}`);
  return res;
});
