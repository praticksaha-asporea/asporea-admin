import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
    createExternalSourceApi,
    getExternalSourcesApi,
    getExternalSourceByIdApi,
    updateExternalSourceApi
} from "../../service/apis/externalSource.api";
import type { ExternalSourcePayload } from "../../types/payloads/externalSource/externalSource.payloads";
import type {
    ExternalSource,
    PopulatedUser,
    PopulatedSubOf
} from "../../types/responses/externalSource/externalSource.responses";
import type { ApiErrorResponse } from "../../types/responses/errorResponse/error.response";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const useSourceForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);
    const [parentSources, setParentSources] = useState<ExternalSource[]>([]);

    const formik = useFormik<ExternalSourcePayload>({
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            whatsappNumber: "",
            address: "",
            password: "",
            role: "pca",
            subOf: "",
            notificationPreference: { sms: true, whatsapp: true, email: true },
        },
        validate: (values) => {
            const errors: any = {};

            if (!values.firstName?.trim()) errors.firstName = "First name is required";
            if (!values.lastName?.trim()) errors.lastName = "Last name is required";

            if (!values.email?.trim()) {
                errors.email = "Email is required";
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = "Invalid email address";
            }

            if (!isEdit && !values.password) {
                errors.password = "Password is required";
            } else if (values.password && !passwordRegex.test(values.password)) {
                errors.password = "Password must be 8+ chars with uppercase, lowercase, number & special char";
            }
            if (!values.phoneNumber?.trim()) {
                errors.phoneNumber = "Phone number is required";
            } else if (!/^\d{10}$/.test(values.phoneNumber.trim())) {
                errors.phoneNumber = "Phone number must be exactly 10 digits";
            }

            if (values.whatsappNumber?.trim() && !/^\d{10}$/.test(values.whatsappNumber.trim())) {
                errors.whatsappNumber = "WhatsApp number must be exactly 10 digits";
            }

            return errors;
        },
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const payload = { ...values, subOf: values.subOf || null };
                let res: any;

                if (isEdit) {
                    res = await updateExternalSourceApi(id as string, payload);
                } else {
                    res = await createExternalSourceApi(payload);
                }

                if (res?.success === true || res?.data?.success === true || res?.status === 200 || res?.status === 201) {
                    toast.success(`Source ${isEdit ? 'updated' : 'created'} successfully!`);
                    navigate("/external-sources");
                } else {
                    toast.error(res?.data?.message || "Failed to process request");
                }
            } catch (error: unknown) {
              const errorObj = error as ApiErrorResponse;
                
                setError(
                errorObj?.response?.data?.message ?? "Failed to load assignments."
            );
            } finally {
                setLoading(false);
            }
        },
    });


    useEffect(() => {
        if (isEdit) {
            const fetchSourceData = async () => {
                try {
                    const res: any = await getExternalSourceByIdApi(id as string);
                    const sourceData = res?.data?.data || res?.data;

                    if (sourceData && sourceData.userId) {

                        const user = typeof sourceData.userId === "object"
                            ? (sourceData.userId as PopulatedUser)
                            : null;

                        const parent = typeof sourceData.subOf === "object" && sourceData.subOf !== null
                            ? (sourceData.subOf as PopulatedSubOf)
                            : null;

                        const parentId = parent ? parent._id : (typeof sourceData.subOf === "string" ? sourceData.subOf : "");

                        if (user) {
                            formik.setValues({
                                firstName: user.firstName || "",
                                lastName: user.lastName || "",
                                email: user.email || "",
                                phoneNumber: user.phoneNumber || "",
                                whatsappNumber: user.whatsappNumber || "",
                                address: user.address || "",
                                password: "",
                                role: sourceData.type || "pca",
                                subOf: parentId,
                                notificationPreference: user.notificationPreference || { sms: true, whatsapp: true, email: true },
                            });
                        }
                    } else {
                        toast.error("Invalid data format received");
                    }
                } catch (error) {
                    console.error(error)
                    navigate("/external-sources");
                } finally {
                    setFetching(false);
                }
            };
            fetchSourceData();
        }
    }, [id, isEdit]);


    useEffect(() => {
        const fetchParents = async () => {
            try {
                const res: any = await getExternalSourcesApi({ type: formik.values.role, limit: 100 });
                const list = Array.isArray(res?.data?.data?.data) ? res.data.data.data : (Array.isArray(res?.data?.data) ? res.data.data : []);
                setParentSources(list.filter((src: any) => !src.subOf && src._id !== id));
            } catch (error) {
                console.error("Failed to load parents", error);
            }
        };
        fetchParents();

        if (formik.values.subOf) formik.setFieldValue("subOf", "");
    }, [formik.values.role, id]);

    return { formik, loading, fetching, isEdit, parentSources };
};

function setError(_arg0: string) {
    throw new Error("Function not implemented.");
}
