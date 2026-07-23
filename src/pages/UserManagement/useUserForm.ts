import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { createUserApi, updateUserApi, getUserByIdApi } from "../../service/apis/user.api";
import { toast } from "react-hot-toast";
import type { UserPayload } from "../../types/payloads/user/user.payloads";
import type { UserResponseData } from "../../types/responses/user/user.responses";


export type UserFormValues = UserPayload & {
  _showPassword: boolean;
};

const emptyValues: UserFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  whatsappNumber: "",
  address: "",
  role: "",
  password: "",
  status: "active",
  passportStatus: "not",
  passportNo: "",
  enquired: "no",
  notificationPreference: { sms: false, whatsapp: false, email: true },
  _showPassword: false
};

// ─── Validation Schema ───────────────────────────────────────────────────────
const buildSchema = (isEdit: boolean) =>
  yup.object({
    firstName: yup.string().required("First Name is required"),
    lastName: yup.string().required("Last Name is required"),
    email: yup.string().email("Invalid email address").required("Email is required"),
    phoneNumber: yup
      .string()
      .matches(/^[0-9]{10}$/, "Enter a valid 10-digit number")
      .required("Phone Number is required"),
    whatsappNumber: yup
      .string()
      .matches(/^[0-9]{10}$/, "Enter a valid 10-digit number")
      .required("WhatsApp Number is required"),
    address: yup.string(),
    role: yup.string().required("Please select a role"),
    password: isEdit
      ? yup.string().min(6, "Password must be at least 6 characters")
      : yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    passportStatus: yup.string(),
    passportNo: yup.string(),
  });

// ─── Custom Hook ─────────────────────────────────────────────────────────────
export const useUserForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  const formik = useFormik<UserFormValues>({
    initialValues: emptyValues,
    validationSchema: buildSchema(isEdit),
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        // TypeScript Magic: Separate internal UI keys from backend payload safely
        const { _showPassword, ...cleanPayload } = values;

        if (isEdit && id) {

          if (!cleanPayload.password) {
            delete cleanPayload.password;
          }

          const res = await updateUserApi(id, cleanPayload);
          if (res?.success !== false) {
            toast.success("User updated successfully");
          } else {
            toast.error(res?.message ?? "Failed to update user.");
          }
        } else {

          const res = await createUserApi(cleanPayload);
          if (res?.success !== false) {
            toast.success("User created successfully");
            navigate("/users");
          } else {
            toast.error(res?.message ?? "Failed to create user.");
          }
        }
      } catch (err: any) {
        console.error(err)
      } finally {
        setLoading(false);
      }
    },
  });

  // ── Pre-fill form when editing ─────────────────────────────────────────────
  useEffect(() => {
    if (!isEdit || !id) return;

    const fetchUser = async () => {
      setFetching(true);
      try {
        const res = await getUserByIdApi(id);
        const u = (res?.data?.user ?? res) as UserResponseData;

        if (u) {
          formik.setValues({
            firstName: u.firstName ?? "",
            lastName: u.lastName ?? "",
            email: u.email ?? "",
            phoneNumber: u.phoneNumber ?? "",
            whatsappNumber: u.whatsappNumber ?? "",
            address: u.address ?? "",
            role: u.role ?? "",
            password: "",
            status: u.status ?? "active",
            passportStatus: u.passportStatus ?? "not",
            passportNo: u.passportNo ?? "",
            enquired: u.enquired ?? "no",
            notificationPreference: u.notificationPreference ?? {
              sms: false,
              whatsapp: false,
              email: true,
            },
            _showPassword: false
          });
        }
      } catch (err: any) {
        console.error(err)
      } finally {
        setFetching(false);
      }
    };

    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEdit]);

  return { formik, loading, fetching, isEdit };
};