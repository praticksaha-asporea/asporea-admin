import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { createPositionApi, updatePositionApi, getPositionByIdApi,getCountriesApi } from "../../service/apis/position.api";
import { getDocumentTypesApi } from "../../service/apis/documentType.api";
import type { PositionPayload } from "../../types/payloads/position/position.payloads";
import type { PositionResponseData } from "../../types/responses/position/position.responses";
import type { DocumentTypeResponseData } from "../../types/responses/document/documentType.responses";

export type PositionFormValues = Omit<PositionPayload, "positionBrochure">;

export type DocTypeOption = {
  _id: string;
  title: string;
  section: string;
};
export type CountryOption = {
  _id: string;
  name: string;
  code?: string;
};
const emptyValues: PositionFormValues = {
  title: "",
  details: "",
  requiredDocuments: [],
  mandatoryDocuments: [],
  programTypes: [],  
  countries: [],     
   
};

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  details: Yup.string().optional()
});

export const usePositionForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [docTypes, setDocTypes] = useState<DocTypeOption[]>([]);
  const [countriesList, setCountriesList] = useState<CountryOption[]>([]);
  const [brochureFile, setBrochureFile] = useState<File | null>(null);
  const [brochurePreview, setBrochurePreview] = useState<string>("");

  const handleBrochureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setBrochureFile(file);
  };

  const clearBrochure = () => {
    setBrochureFile(null);
    setBrochurePreview("");
  };

  // Load document types for dropdown multi-select
  useEffect(() => {
    const loadDocTypes = async () => {
      try {
        const res = await getDocumentTypesApi({ limit: "100" });
        // Handle explicit dynamic response layout mapping safely
        const backendData = res?.data as unknown as { types?: DocumentTypeResponseData[] };
        const items = backendData?.types ?? [];

        setDocTypes(items.map(t => ({
          _id: t._id,
          title: t.title,
          section: t.section
        })));
      } catch {
        // Safe silence non-fatal
      }
    };
    const loadCountries = async () => {
      try {
        const res = await getCountriesApi();
        const items = (res?.data as unknown as CountryOption[]) ?? [];
        setCountriesList(items);
      } catch {
        // Safe silence non-fatal
      }
    };
    loadDocTypes();
    loadCountries();
  }, []);

  const formik = useFormik<PositionFormValues>({
    initialValues: emptyValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        if (isEdit && id) {
          const res = await updatePositionApi(id, values, brochureFile);
          if (res?.success !== false) {
            toast.success("Position updated successfully.");
            navigate("/positions");
          }
        } else {
          const res = await createPositionApi(values, brochureFile);
          if (res?.success !== false) {
            toast.success("Position created successfully.");
            navigate("/positions");
          }
        }
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
  });

  // Pre-fill fields safely on edit scenario
  useEffect(() => {
    if (!isEdit || !id) return;

    const fetchPosition = async () => {
      setFetching(true);
      try {
        const res = await getPositionByIdApi(id);
        const p = res?.data as PositionResponseData | undefined;
        if (p) {
          formik.setValues({
            title: p.title ?? "",
            details: p.details ?? "",
            // requiredDocuments: (p.requiredDocuments ?? []).map((d) => d?._id ?? d),
            // mandatoryDocuments: (p.mandatoryDocuments ?? []).map((d) => d?._id ?? d),
            requiredDocuments: (p.requiredDocuments ?? []).map((d) =>
              typeof d === "string" ? d : d._id
            ),

            mandatoryDocuments: (p.mandatoryDocuments ?? []).map((d) =>
              typeof d === "string" ? d : d._id
            ),
            programTypes: p.programTypes ?? [],
            countries: (p.countries ?? []).map((c: any) =>
              typeof c === "string" ? c : c.name || c._id
            ),
          });
          if (p.positionBrochure) setBrochurePreview(p.positionBrochure);
        }
      } catch {
        // Catch block boundary
      } finally {
        setFetching(false);
      }
    };

    fetchPosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEdit]);

  const toggleDoc = (field: "requiredDocuments" | "mandatoryDocuments", docId: string) => {
    const current = formik.values[field];
    const next = current.includes(docId)
      ? current.filter((d) => d !== docId)
      : [...current, docId];
    formik.setFieldValue(field, next);
  };

  return { formik, loading, fetching, isEdit, docTypes,countriesList, toggleDoc, brochureFile, brochurePreview, handleBrochureChange, clearBrochure };
};