import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import {
  createDocumentTypeApi,
  updateDocumentTypeApi,
  getDocumentTypeByIdApi,
} from "../../../service/apis/documentType.api";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TypeFormValues = {
  title: string;
  subTitle: string;
  section: string;
  supportedExtensions: string[];
  required: boolean;
  multiple: boolean;
};

const EXTENSION_OPTIONS = ["PDF", "DOCX", "DOC", "JPG", "JPEG", "PNG", "XLSX", "CSV", "TXT"];

const emptyValues: TypeFormValues = {
  title: "",
  subTitle: "",
  section: "",
  supportedExtensions: [],
  required: false,
  multiple: false,
};

// ─── Validation ───────────────────────────────────────────────────────────────

const validationSchema = Yup.object({
  title:   Yup.string().required("Title is required"),
  subTitle: Yup.string(),
  section: Yup.string().required("Section is required"),
  supportedExtensions: Yup.array().min(1, "Select at least one extension"),
});

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useTypeForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [loading, setLoading]   = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [apiError, setApiError] = useState<string | null>(null);

  const formik = useFormik<TypeFormValues>({
    initialValues: emptyValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      setApiError(null);
      try {
        if (isEdit && id) {
          const res = await updateDocumentTypeApi(id, values);
          if (res?.success !== false) {
            toast.success("Document type updated.");
            navigate("/document-types");
          } else {
            setApiError(res?.message ?? "Failed to update document type.");
          }
        } else {
          const res = await createDocumentTypeApi(values);
          if (res?.success !== false) {
            toast.success("Document type created.");
            navigate("/document-types");
          } else {
            setApiError(res?.message ?? "Failed to create document type.");
          }
        }
      } catch (err: any) {
        setApiError(err?.response?.data?.message ?? "Something went wrong.");
      } finally {
        setLoading(false);
      }
    },
  });

  // ── Pre-fill on edit ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!isEdit || !id) return;

    const fetchType = async () => {
      setFetching(true);
      setApiError(null);
      try {
        const res = await getDocumentTypeByIdApi(id);
        const t = res?.data ?? res;
        if (t) {
          formik.setValues({
            title:               t.title               ?? "",
            subTitle:            t.subTitle            ?? "",
            section:             t.section             ?? "",
            supportedExtensions: t.supportedExtensions ?? [],
            required:            t.required            ?? false,
            multiple:            t.multiple            ?? false,
          });
        }
      } catch (err: any) {
        setApiError(err?.response?.data?.message ?? "Failed to load document type.");
      } finally {
        setFetching(false);
      }
    };

    fetchType();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // ── Extension toggle helper ────────────────────────────────────────────────
  const toggleExtension = (ext: string) => {
    const current = formik.values.supportedExtensions;
    const next = current.includes(ext)
      ? current.filter((e) => e !== ext)
      : [...current, ext];
    formik.setFieldValue("supportedExtensions", next);
  };

  return { formik, loading, fetching, apiError, isEdit, toggleExtension, EXTENSION_OPTIONS };
};
