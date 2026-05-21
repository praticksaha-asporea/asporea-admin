import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { getGeneralSettingsApi, updateGeneralSettingsApi } from "../../service/apis/generalSettings.api";

// ─── Types ────────────────────────────────────────────────────────────────────

export type GeneralSettingsValues = {
  tacAssignmentType: "random" | "counterwise";
  inquiryNumberFormat: string;
  escalationTimelineHours: number | "";
  inqResTimelineHours: number | "";
  preCounsellingTimelineHours: number | "";
  assessmentTimelineHours: number | "";
};

// ── Read-only stats (view only, not submitted) ─────────────────────────────

export type SettingsStats = {
  lastInq?: number;
  lastFy?: string;
};

const emptyValues: GeneralSettingsValues = {
  tacAssignmentType: "random",
  inquiryNumberFormat: "ASP-INQ-0000",
  escalationTimelineHours: "",
  inqResTimelineHours: "",
  preCounsellingTimelineHours: "",
  assessmentTimelineHours: "",
};

// ─── Validation ───────────────────────────────────────────────────────────────

const validationSchema = Yup.object({
  tacAssignmentType:               Yup.string().oneOf(["random", "counterwise"]).required(),
  inquiryNumberFormat:         Yup.string().required("Inquiry number format is required"),
  escalationTimelineHours:     Yup.number().min(0, "Must be ≥ 0").nullable(),
  inqResTimelineHours:         Yup.number().min(0, "Must be ≥ 0").nullable(),
  preCounsellingTimelineHours: Yup.number().min(0, "Must be ≥ 0").nullable(),
  assessmentTimelineHours:     Yup.number().min(0, "Must be ≥ 0").nullable(),
});

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useGeneralSettings = () => {
  const [loading, setLoading]   = useState(false);
  const [fetching, setFetching] = useState(true);
  const [stats, setStats]       = useState<SettingsStats>({});

  const formik = useFormik<GeneralSettingsValues>({
    initialValues: emptyValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const res = await updateGeneralSettingsApi(values);
        if (res?.success !== false) {
          toast.success(res?.message ?? "Settings updated successfully.");
        } else {
          toast.error(res?.message ?? "Failed to update settings.");
        }
      } catch (err: any) {
        // toast.error(err?.response?.data?.message ?? "Something went wrong.");
      } finally {
        setLoading(false);
      }
    },
  });

  // ── Fetch on mount ─────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchSettings = async () => {
      setFetching(true);
      try {
        const res = await getGeneralSettingsApi();
        const s = res?.data ?? res;
        if (s) {
          formik.setValues({
            tacAssignmentType:               s.tacAssignmentType               ?? "random",
            inquiryNumberFormat:         s.inquiryNumberFormat         ?? "ASP-INQ-0000",
            escalationTimelineHours:     s.escalationTimelineHours     ?? "",
            inqResTimelineHours:         s.inqResTimelineHours         ?? "",
            preCounsellingTimelineHours: s.preCounsellingTimelineHours ?? "",
            assessmentTimelineHours:     s.assessmentTimelineHours     ?? "",
          });
          // read-only stats
          setStats({
            lastInq:        s.lastInq,
            lastFy:         s.lastFy
          });
        }
      } catch {
        // non-fatal — form stays at defaults
      } finally {
        setFetching(false);
      }
    };

    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { formik, loading, fetching, stats };
};
