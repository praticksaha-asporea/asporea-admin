import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import {
    getCountriesApi,
    createCountryApi,
    updateCountryApi,
    deleteCountryApi,
} from "../../service/apis/position.api";
import type { CountryPayload } from "../../types/payloads/position/position.payloads";
import type { CountryResponseData } from "../../types/responses/position/position.responses";

const validationSchema = Yup.object({
    name: Yup.string().required("Country name is required"),
    code: Yup.string().optional(),
    isActive: Yup.boolean(),
});

export const useCountry = () => {
    const [countries, setCountries] = useState<CountryResponseData[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [editId, setEditId] = useState<string | null>(null);

    const fetchCountries = async () => {
        setFetching(true);
        try {
            const res = await getCountriesApi();
            setCountries((res?.data as unknown as CountryResponseData[]) || []);
        } catch (error) {
            console.error(error);
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchCountries();
    }, []);

    const formik = useFormik<CountryPayload>({
        initialValues: { name: "", code: "", isActive: true },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            setLoading(true);
            try {
                if (editId) {
                    await updateCountryApi(editId, values);
                    toast.success("Country updated successfully");
                } else {
                    await createCountryApi(values);
                    toast.success("Country added successfully");
                }
                resetForm();
                setEditId(null);
                fetchCountries();
            } catch (error: any) {
                toast.error(error?.response?.data?.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        },
    });

    const handleEdit = (country: CountryResponseData) => {
        setEditId(country._id);
        formik.setValues({
            name: country.name,
            code: country.code || "",
            isActive: country.isActive,
        });
    };

    const handleCancelEdit = () => {
        setEditId(null);
        formik.resetForm();
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this country?")) return;
        try {
            await deleteCountryApi(id);
            toast.success("Country deleted");
            fetchCountries();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to delete");
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            await updateCountryApi(id, { isActive: !currentStatus });
            toast.success("Status updated");
            fetchCountries();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    return {
        formik,
        countries,
        loading,
        fetching,
        editId,
        handleEdit,
        handleCancelEdit,
        handleDelete,
        handleToggleStatus,
    };
};