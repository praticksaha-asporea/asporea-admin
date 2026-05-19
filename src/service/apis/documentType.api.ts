import httpsCall from "../httpCall";
import catchAsync from "../../utils/catchAsync";

export type DocumentTypePayload = {
  title: string;
  subTitle: string;
  section: string;
  supportedExtensions: string[];
  required: boolean;
  multiple: boolean;
};

export const getDocumentTypesApi = catchAsync(async (params?: Record<string, string>) => {
  const res = await httpsCall.get("/admin/document_type/get-list", { params });
  return res;
});

export const getDocumentTypeByIdApi = catchAsync(async (id: string) => {
  const res = await httpsCall.get(`/admin/document_type/view?id=${id}`);
  return res;
});

export const createDocumentTypeApi = catchAsync(async (data: DocumentTypePayload) => {
  const res = await httpsCall.post("/admin/document_type/create", data);
  return res;
});

export const updateDocumentTypeApi = catchAsync(async (id: string, data: Partial<DocumentTypePayload>) => {
  const res = await httpsCall.patch("/admin/document_type/update", { id, ...data });
  return res;
});

export const deleteDocumentTypeApi = catchAsync(async (id: string) => {
  const res = await httpsCall.delete(`/admin/document_type/delete?id=${id}`);
  return res;
});
