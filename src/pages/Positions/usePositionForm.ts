import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { createPositionApi, updatePositionApi, getPositionByIdApi } from "../../service/apis/position.api";
import { getDocumentTypesApi } from "../../service/apis/documentType.api";

// ─── Types ────────────────────────────────────────────────────────────────────

export type PositionFormValues = {
  title: string;
  details: string;
  requiredDocuments: string[];
  mandatoryDocuments: string[];
};

export type DocTypeOption = {
  _id: string;
  title: string;
  section: string;
};

const emptyValues: PositionFormValues = {
  title: "",
  details: "",
  requiredDocuments: [],
  mandatoryDocuments: [],
};

// ─── Validation ───────────────────────────────────────────────────────────────

const validationSchema = Yup.object({
  title:   Yup.string().required("Title is required"),
  details: Yup.string().optional()
});

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const usePositionForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [loading, setLoading]           = useState(false);
  const [fetching, setFetching]         = useState(isEdit);
  const [docTypes, setDocTypes]         = useState<DocTypeOption[]>([]);
  const [brochureFile, setBrochureFile] = useState<File | null>(null);
  const [brochurePreview, setBrochurePreview] = useState<string>("");   // existing URL from API

  const handleBrochureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setBrochureFile(file);
  };

  const clearBrochure = () => {
    setBrochureFile(null);
    setBrochurePreview("");
  };

  // ── Load document types for dropdowns ─────────────────────────────────────
  useEffect(() => {
    const loadDocTypes = async () => {
      try {
        const res = await getDocumentTypesApi({ limit: "100" });
        setDocTypes(res?.data?.types ?? []);
      } catch {
        // non-fatal
      }
    };
    loadDocTypes();
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
            toast.success("Position updated.");
            navigate("/positions");
          }
        } else {
          const res = await createPositionApi(values, brochureFile);
          if (res?.success !== false) {
            toast.success("Position created.");
            navigate("/positions");
          }
        }
      } catch (err: any) {
        // toast.error(err?.response?.data?.message ?? "Something went wrong.");
      } finally {
        setLoading(false);
      }
    },
  });

  // ── Pre-fill on edit ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!isEdit || !id) return;

    const fetchPosition = async () => {
      setFetching(true);
      // setApiError(null);
      try {
        const res = await getPositionByIdApi(id);
        const p = res?.data ?? res;
        if (p) {
          formik.setValues({
            title:              p.title   ?? "",
            details:            p.details ?? "",
            requiredDocuments:  (p.requiredDocuments  ?? []).map((d: any) => d?._id ?? d),
            mandatoryDocuments: (p.mandatoryDocuments ?? []).map((d: any) => d?._id ?? d),
          });
          if (p.positionBrochure) setBrochurePreview(p.positionBrochure);
        }
      } 
      catch (err: any) {
        // setApiError(err?.response?.data?.message ?? "Failed to load position.");
      } 
      finally {
        setFetching(false);
      }
    };

    fetchPosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // ── Document toggle helpers ────────────────────────────────────────────────
  const toggleDoc = (field: "requiredDocuments" | "mandatoryDocuments", docId: string) => {
    const current = formik.values[field];
    const next = current.includes(docId)
      ? current.filter((d) => d !== docId)
      : [...current, docId];
    formik.setFieldValue(field, next);
  };

  return { formik, loading, fetching, isEdit, docTypes, toggleDoc, brochureFile, brochurePreview, handleBrochureChange, clearBrochure };
};
