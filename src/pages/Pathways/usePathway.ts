import { useState, useEffect, useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import {
  getPathwaysApi,
  createPathwayApi,
  updatePathwayApi,
  deletePathwayApi,
} from "../../service/apis/pathway.api";
import type { PathwayPayload } from "../../types/payloads/pathways/pathway.types";
import type { PathwayResponseData } from "../../types/responses/pathways/pathways.response";


const validationSchema = Yup.object({
  title: Yup.string().required("Pathway title is required"),
  underPathway: Yup.string().optional(),
  isActive: Yup.boolean().optional(),
});

export const usePathway = () => {
  const [pathways, setPathways] = useState<PathwayResponseData[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);

  const fetchPathways = async () => {
    setFetching(true);
    try {
      const res = await getPathwaysApi();
      setPathways((res?.data as unknown as PathwayResponseData[]) || []);
    } catch (error) {
      console.error(error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchPathways();
  }, []);

  // Filter top-level parents for dropdown
  const parentOptions = useMemo(() => {
    return pathways.filter((p) => !p.underPathway || p.underPathway === "");
  }, [pathways]);

  const formik = useFormik<PathwayPayload>({
    initialValues: { title: "", underPathway: "", isActive: true },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        if (editId) {
          await updatePathwayApi(editId, values);
          toast.success("Pathway updated successfully");
        } else {
          await createPathwayApi(values);
          toast.success("Pathway created successfully");
        }
        resetForm();
        setEditId(null);
        fetchPathways();
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    },
  });

  const handleEdit = (item: PathwayResponseData) => {
    setEditId(item._id);
    formik.setValues({
      title: item.title,
      underPathway: item.underPathway || "",
      isActive: item.isActive,
    });
  };

  const handleCancelEdit = () => {
    setEditId(null);
    formik.resetForm();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure? Deleting a parent category will also remove its sub-pathways.")) return;
    try {
      await deletePathwayApi(id);
      toast.success("Pathway deleted");
      fetchPathways();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete");
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await updatePathwayApi(id, { isActive: !currentStatus });
      toast.success("Status updated");
      fetchPathways();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return {
    formik,
    pathways,
    parentOptions,
    loading,
    fetching,
    editId,
    handleEdit,
    handleCancelEdit,
    handleDelete,
    handleToggleStatus,
  };
};