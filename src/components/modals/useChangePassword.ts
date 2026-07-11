import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { changePasswordApi } from "../../service/apis/auth.api";

 
import type { ChangePasswordPayload } from "../../types/payloads/auth/auth.payloads";

export type ChangePasswordValues = Omit<ChangePasswordPayload, "userId">;

export const useChangePassword = (userId: string, onClose: () => void) => {
  const [loading, setLoading] = useState<boolean>(false);

  const validationSchema = Yup.object({
    oldPassword: Yup.string().required("Old password is required"),
    newPassword: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .notOneOf([Yup.ref("oldPassword")], "New password must be different from the old one")
      .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords do not match")
      .required("Please confirm your new password"),
  });

  const formik = useFormik<ChangePasswordValues>({
    initialValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        const res = await changePasswordApi({
          userId,
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        });

        if (res?.success !== false) {
          toast.success(res?.message ?? "Password updated successfully.");
          resetForm();
          setTimeout(onClose, 1500);
        } else {
          toast.error(res?.message ?? "Failed to update password.");
        }
      } catch (err: any) {
        toast.error(
          err?.response?.data?.message ?? "Something went wrong. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },
  });

  return { formik, loading };
};