import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { createUserApi, updateUserApi, getUserByIdApi } from "../../service/apis/user.api";
import { toast } from "react-hot-toast";

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserFormValues = {
    _showPassword: any;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    whatsappNumber: string;
    address: string;
    role: string;
    password: string;
    passportStatus: string;
    passportNo: string;
    enquired: string;
    notificationPreference: {
        sms: boolean;
        whatsapp: boolean;
        email: boolean;
    };
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
    passportStatus: "not",
    passportNo: "",
    enquired: "no",
    notificationPreference: { sms: false, whatsapp: false, email: true },
    _showPassword: false
};

// ─── Validation ───────────────────────────────────────────────────────────────

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
        // password optional on edit (leave blank = no change)
        password: isEdit
            ? yup.string().min(6, "Password must be at least 6 characters")
            : yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
        passportStatus: yup.string(),
        passportNo: yup.string(),
    });

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useUserForm = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit); // true while loading existing user

    const formik = useFormik<UserFormValues>({
        initialValues: emptyValues,
        validationSchema: buildSchema(isEdit),
        enableReinitialize: true, // allows pre-fill after fetch
        onSubmit: async (values) => {
            setLoading(true);
            try {
                if (isEdit && id) {
                    const payload: Record<string, any> = {
                        firstName: values.firstName,
                        lastName: values.lastName,
                        email: values.email,
                        phoneNumber: values.phoneNumber,
                        whatsappNumber: values.whatsappNumber,
                        address: values.address,
                        role: values.role,
                        passportStatus: values.passportStatus,
                        passportNo: values.passportNo,
                        enquired: values.enquired,
                        notificationPreference: values.notificationPreference,
                    };
                    // only send password if the user typed something
                    if (values.password) payload.password = values.password;

                    const res = await updateUserApi(id, payload);
                    // console.log(res,8888);

                    if (res?.success !== false) {
                        toast.success("User updated successfully");
                        // navigate("/users");
                    } else {
                        toast.error(res?.message ?? "Failed to update user.");
                    }
                } else {
                    const res = await createUserApi({
                        firstName: values.firstName,
                        lastName: values.lastName,
                        email: values.email,
                        role: values.role,
                        status: "active",
                        password: values.password,
                        phoneNumber: values.phoneNumber,
                        whatsappNumber: values.whatsappNumber,
                        address: values.address,
                        passportStatus: values.passportStatus,
                        passportNo: values.passportNo,
                        enquired: values.enquired,
                        notificationPreference: values.notificationPreference,
                    });
                    
                    if (res?.success !== false) {
                        toast.success("User created successfully");
                        navigate("/users");
                    } else {
                        toast.error(res?.message);
                    }
                }
            } catch (err: any) {
                // toast.error(
                //     err?.response?.data?.message ?? "Something went wrong. Please try again."
                // );
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
                // console.log(res,222);

                const u = res?.data?.user ?? res; // handle both { data: user } and flat user
                if (u) {
                    formik.setValues({
                        firstName: u.firstName ?? "",
                        lastName: u.lastName ?? "",
                        email: u.email ?? "",
                        phoneNumber: u.phoneNumber ?? "",
                        whatsappNumber: u.whatsappNumber ?? "",
                        address: u.address ?? "",
                        role: u.role ?? "",
                        password: "",            // never pre-fill password
                        passportStatus: u.passportStatus ?? "not",
                        passportNo: u.passportNo ?? "",
                        enquired: u.enquired ?? "no",
                        notificationPreference: u.notificationPreference ?? {
                            sms: false, whatsapp: false, email: true,
                        },
                        _showPassword: u._id ? false : true
                    });
                }
            } catch (err: any) {
                toast.error(
                    err?.response?.data?.message ?? "Failed to load user details."
                );
            } finally {
                setFetching(false);
            }
        };

        fetchUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    return { formik, loading, fetching, isEdit };
};
