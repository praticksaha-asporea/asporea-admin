import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { createBranchApi, updateBranchApi, getBranchByIdApi } from "../../service/apis/branch.api";
import type { BranchPayload } from "../../types/payloads/branch/branch.payloads";
import type { BranchResponseData } from "../../types/responses/branch/branch.responses";

 
export type BranchFormValues = Omit<BranchPayload, "latitude" | "longitude"> & {
  latitude: string;
  longitude: string;
};

const emptyValues: BranchFormValues = {
  title: "",
  location: "",
  latitude: "",
  longitude: "",
  counters: 0,
  timeZone: "Asia/Kolkata",
  workDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
};

// ─── Validation ───────────────────────────────────────────────────────────────
const validationSchema = Yup.object({
  title:     Yup.string().required("Title is required"),
  location:  Yup.string().required("Location is required"),
  latitude:  Yup.string().matches(/^-?\d+(\.\d+)?$/, "Enter a valid latitude"),
  longitude: Yup.string().matches(/^-?\d+(\.\d+)?$/, "Enter a valid longitude"),
  workDays:  Yup.array().min(1, "Select at least one working day"),
});

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useBranchForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [loading, setLoading]   = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [apiError, setApiError] = useState<string | null>(null);

  const formik = useFormik<BranchFormValues>({
    initialValues: emptyValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      setApiError(null);
      try {
        if (isEdit && id) {
          const res = await updateBranchApi(id, values);
          if (res?.success !== false) {
            toast.success("Branch updated successfully.");
          } else {
            setApiError(res?.message ?? "Failed to update branch.");
          }
        } else {
          const res = await createBranchApi(values);
          if (res?.success !== false) {
            toast.success("Branch created successfully.");
            navigate("/branches");
          } else {
            setApiError(res?.message ?? "Failed to create branch.");
          }
        }
      } catch (err: any) {
        setApiError(
          err?.response?.data?.message ?? "Something went wrong. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },
  });

  // ── Pre-fill on edit ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!isEdit || !id) return;

    const fetchBranch = async () => {
      setFetching(true);
      setApiError(null);
      try {
        const res = await getBranchByIdApi(id);
        const b = (res?.data ?? res) as BranchResponseData;
        if (b) {          
          formik.setValues({
            title:     b.title     ?? "",
            location:  b.location  ?? "",
            latitude:  b.coordinates?.coordinates?.[1]?.toString() ?? "",
            longitude: b.coordinates?.coordinates?.[0]?.toString() ?? "",
            counters:  b.counters  ?? 0,
            timeZone:  b.timeZone  ?? "Asia/Kolkata",
            workDays:  b.workDays  ?? [],
          });
        }
      } catch (err: any) {
        setApiError(
          err?.response?.data?.message ?? "Failed to load branch details."
        );
      } finally {
        setFetching(false);
      }
    };

    fetchBranch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEdit]);

  // ── Day toggle helper ──
  const toggleDay = (day: string) => {
    const current = formik.values.workDays;
    const next = current.includes(day)
      ? current.filter((d) => d !== day)
      : [...current, day];
    formik.setFieldValue("workDays", next);
  };

  return { formik, loading, fetching, apiError, isEdit, toggleDay };
};