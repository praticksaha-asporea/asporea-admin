import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { createShiftApi, updateShiftApi, getShiftByIdApi } from "../../service/apis/shift.api";


import type { ShiftPayload, ScheduleObj } from "../../types/payloads/shift/shift.payloads";


export type ShiftFormValues = ShiftPayload;

export const emptySchedule: ScheduleObj = {
  days: [],
  startTime: "",
  endTime: "",
  breakTime: "",
};

const emptyValues: ShiftFormValues = {
  shiftName: "",
  schedules: [],
};

// ─── Validation ───────────────────────────────────────────────────────────────
const validationSchema = Yup.object({
  shiftName: Yup.string().required("Shift name is required"),
  schedules: Yup.array().min(1, "Add at least one schedule configuration"),
});

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useShiftForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [apiError, setApiError] = useState<string | null>(null);

  // ── Schedule builder state ──
  const [currentSchedule, setCurrentSchedule] = useState<ScheduleObj>(emptySchedule);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const formik = useFormik<ShiftFormValues>({
    initialValues: emptyValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      setApiError(null);
      try {
        if (isEdit && id) {
          const res = await updateShiftApi(id, values);
          if (res?.success !== false) {
            toast.success("Shift updated successfully.");
            navigate("/shifts");
          } else {
            setApiError(res?.message ?? "Failed to update shift.");
          }
        } else {
          const res = await createShiftApi(values);
          if (res?.success !== false) {
            toast.success("Shift created successfully.");
            navigate("/shifts");
          } else {
            setApiError(res?.message ?? "Failed to create shift.");
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

    const fetchShift = async () => {
      setFetching(true);
      setApiError(null);
      try {
        const { data: s } = await getShiftByIdApi(id);
        // const s = res?.data ?? res;
        if (s) {
          formik.setValues({
            shiftName: s.shiftName ?? "",
            schedules: s.schedules ?? [],
          });
        }
      } catch (err: any) {
        setApiError(
          err?.response?.data?.message ?? "Failed to load shift details."
        );
      } finally {
        setFetching(false);
      }
    };

    fetchShift();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEdit]);

  // ── Schedule helpers ───────────────────────────────────────────────────────
  const toggleScheduleDay = (day: string) => {
    const next = currentSchedule.days.includes(day)
      ? currentSchedule.days.filter((d) => d !== day)
      : [...currentSchedule.days, day];
    setCurrentSchedule((prev) => ({ ...prev, days: next }));
  };

  const addOrUpdateSchedule = (): boolean => {
    if (!currentSchedule.startTime || !currentSchedule.endTime || currentSchedule.days.length === 0) {
      return false;
    }
    if (currentSchedule.endTime <= currentSchedule.startTime) {
      return false;
    }
    const updated = [...formik.values.schedules];
    if (editingIndex !== null) {
      updated[editingIndex] = currentSchedule;
      setEditingIndex(null);
    } else {
      updated.push(currentSchedule);
    }
    formik.setFieldValue("schedules", updated);
    setCurrentSchedule(emptySchedule);
    return true;
  };

  const editSchedule = (index: number) => {
    setCurrentSchedule(formik.values.schedules[index]);
    setEditingIndex(index);
  };

  const removeSchedule = (index: number) => {
    formik.setFieldValue(
      "schedules",
      formik.values.schedules.filter((_, i) => i !== index)
    );
  };

  const cancelEditSchedule = () => {
    setEditingIndex(null);
    setCurrentSchedule(emptySchedule);
  };

  return {
    formik,
    loading,
    fetching,
    apiError,
    isEdit,
    currentSchedule,
    setCurrentSchedule,
    editingIndex,
    toggleScheduleDay,
    addOrUpdateSchedule,
    editSchedule,
    removeSchedule,
    cancelEditSchedule,
  };
};