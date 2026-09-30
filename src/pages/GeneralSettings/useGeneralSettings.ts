import { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import {
  getGeneralSettingsApi,
  updateGeneralSettingsApi,
} from "../../service/apis/generalSettings.api";

import type { GeneralSettingsPayload } from "../../types/payloads/general/generalSettings.payloads";
import type { GeneralSettingsResponseData } from "../../types/responses/general/generalSettings.responses";

export type GeneralSettingsValues = GeneralSettingsPayload;

export type SettingsStats = {
  lastInq?: number;
  lastFy?: string;
};

const emptyValues: GeneralSettingsValues = {
  tacAssignmentType: "random",
  inquiryNumberFormat: "ASP-INQ-0000",
  appointmentNumberFormat: "ASP-APMNT-00000",
  escalationTimelineHours: "",
  inqResTimelineHours: "",
  preCounsellingTimelineHours: "",
  assessmentTimelineHours: "",
  assessment: { fullMarks: "", passingMarks: "" },
  technical: { fullMarks: "", passingMarks: "" },
  inquiryBrochures: [], 
};

const validationSchema = Yup.object({
  tacAssignmentType: Yup.string().oneOf(["random", "counterwise"]).required(),
  inquiryNumberFormat: Yup.string().required("Inquiry number format is required"),
   appointmentNumberFormat: Yup.string().required("Appointment number format is required"),
  escalationTimelineHours: Yup.number().min(0, "Must be ≥ 0").nullable(),
  inqResTimelineHours: Yup.number().min(0, "Must be ≥ 0").nullable(),
  preCounsellingTimelineHours: Yup.number().min(0, "Must be ≥ 0").nullable(),
  assessmentTimelineHours: Yup.number().min(0, "Must be ≥ 0").nullable(),
  assessment: Yup.object({
    fullMarks: Yup.number().min(0, "Must be ≥ 0").nullable(),
    passingMarks: Yup.number().min(0, "Must be ≥ 0").nullable(),
  }),
  technical: Yup.object({
    fullMarks: Yup.number().min(0, "Must be ≥ 0").nullable(),
    passingMarks: Yup.number().min(0, "Must be ≥ 0").nullable(),
  }),
  inquiryBrochures: Yup.array().of(
    Yup.object({
      name: Yup.string().required("Name is required"),
      // uploadId ab required nahi hai kyunki nayi file ke paas fileData hoga
    })
  ),
});

export const useGeneralSettings = () => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [stats, setStats] = useState<SettingsStats>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formik = useFormik<GeneralSettingsValues>({
    initialValues: emptyValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const payloadToSubmit = {
          ...values,
          inquiryBrochures: values.inquiryBrochures?.map((b) => ({
            name: b.name,
            uploadId: b.uploadId,
            fileData: b.fileData, // ⚡ Nayi file ka Base64 data backend jayega
          })),
        };

        const res = await updateGeneralSettingsApi(payloadToSubmit);
        if (res?.success !== false) {
          toast.success(res?.message ?? "Settings updated successfully.");
        } else {
          toast.error(res?.message ?? "Failed to update settings.");
        }
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
  });

  // ⚡ File ko Base64 me convert karne ka logic
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newBrochures: any[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      const promise = new Promise((resolve) => {
        reader.onload = (e) => {
          resolve({
            name: file.name.split(".")[0] || "Brochure",
            fileData: e.target?.result, // Base64 string for backend
            path: e.target?.result,     // Base64 string for immediate UI preview
          });
        };
        reader.readAsDataURL(file);
      });
      
      const fileObj = await promise;
      newBrochures.push(fileObj);
    }

    formik.setFieldValue("inquiryBrochures", [
      ...(formik.values.inquiryBrochures || []),
      ...newBrochures,
    ]);

    toast.success("Brochures added! Click Save to confirm upload.");
  };

  useEffect(() => {
    const fetchSettings = async () => {
      setFetching(true);
      try {
        const res = await getGeneralSettingsApi();
        const s = res?.data as GeneralSettingsResponseData;
        if (s) {
          formik.setValues({
            tacAssignmentType: s.tacAssignmentType ?? s.tacAssignment ?? "random",
            inquiryNumberFormat: s.inquiryNumberFormat ?? "ASP-INQ-0000",
            appointmentNumberFormat: s.appointmentNumberFormat ?? "ASP-APMNT-00000", 
            escalationTimelineHours: s.escalationTimelineHours ?? "",
            inqResTimelineHours: s.inqResTimelineHours ?? "",
            preCounsellingTimelineHours: s.preCounsellingTimelineHours ?? "",
            assessmentTimelineHours: s.assessmentTimelineHours ?? "",
            assessment: {
              fullMarks: s.assessment?.fullMarks ?? "",
              passingMarks: s.assessment?.passingMarks ?? "",
            },
            technical: {
              fullMarks: s.technical?.fullMarks ?? "",
              passingMarks: s.technical?.passingMarks ?? "",
            },
            inquiryBrochures: s.inquiryBrochures?.map((b) => ({
              name: b.name,
              uploadId: b.uploadId?._id,
              path: b.uploadId?.path,
            })) || [],
          });

          setStats({ lastInq: s.lastInq, lastFy: s.lastFy });
        }
      } catch {
      } finally {
        setFetching(false);
      }
    };

    fetchSettings();
  }, []);

  return { formik, loading, fetching, stats, fileInputRef, handleFileUpload };
};