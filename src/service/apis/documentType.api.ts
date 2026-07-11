import httpsCall from "../httpCall";
import catchAsync from "../../utils/catchAsync";
import type { AxiosResponse } from "axios";
import type { ApiResponse } from "../../types/api/baseResponse";
import type { DocumentTypePayload } from "../../types/payloads/document/documentType.payloads";
import type { DocumentTypeResponseData } from "../../types/responses/document/documentType.responses";
import type { PaginatedData } from "../../types/responses/pagingData/common.responses";

export const getDocumentTypesApi: (
  params?: Record<string, string>,
) => Promise<ApiResponse<PaginatedData<DocumentTypeResponseData>>> = catchAsync(
  async (
    params?: Record<string, string>,
  ): Promise<AxiosResponse<ApiResponse<PaginatedData<DocumentTypeResponseData>>>> => {
    const res = await httpsCall.get("/admin/document_type/get-list", { params });
    return res;
  },
);

export const getDocumentTypeByIdApi: (
  id: string,
) => Promise<ApiResponse<DocumentTypeResponseData>> = catchAsync(
  async (
    id: string,
  ): Promise<AxiosResponse<ApiResponse<DocumentTypeResponseData>>> => {
    const res = await httpsCall.get(`/admin/document_type/view?id=${id}`);
    return res;
  },
);

export const createDocumentTypeApi: (
  data: DocumentTypePayload,
) => Promise<ApiResponse<DocumentTypeResponseData>> = catchAsync(
  async (
    data: DocumentTypePayload,
  ): Promise<AxiosResponse<ApiResponse<DocumentTypeResponseData>>> => {
    const res = await httpsCall.post("/admin/document_type/create", data);
    return res;
  },
);

export const updateDocumentTypeApi: (
  id: string,
  data: Partial<DocumentTypePayload>,
) => Promise<ApiResponse<DocumentTypeResponseData>> = catchAsync(
  async (
    id: string,
    data: Partial<DocumentTypePayload>,
  ): Promise<AxiosResponse<ApiResponse<DocumentTypeResponseData>>> => {
    const res = await httpsCall.patch("/admin/document_type/update", { id, ...data });
    return res;
  },
);

export const deleteDocumentTypeApi: (id: string) => Promise<ApiResponse<any>> =
  catchAsync(async (id: string): Promise<AxiosResponse<ApiResponse<any>>> => {
    const res = await httpsCall.delete(`/admin/document_type/delete?id=${id}`);
    return res;
  });