import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { confirmToast } from "../../../utils/confirmToast";
import { getSectionsApi, deleteSectionApi } from "../../../service/apis/assessmentSection.api";
import type { AssessmentSection } from "../../../types/responses/assessment/section/assessmentSection.responses";

export const useSectionList = () => {
  const [sections, setSections] = useState<AssessmentSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSections = async () => {
    setIsLoading(true);
    try {
      const res = await getSectionsApi();
      if (res?.success && res.data) {
       
        const fetchedData = Array.isArray(res.data) ? res.data : (res.data as any).data || [];
        setSections(fetchedData);
      } else {
        setSections([]);
      }
    } catch (error) {
      console.error("Error loading sections:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);
const handleDelete = async (id: string) => {
    const confirmed = await confirmToast("Are you sure you want to delete this section?");
    if (!confirmed) return;

    try {
      const res = await deleteSectionApi(id);
      if (res?.success) {
        toast.success(res.message || "Section deleted successfully!");
        fetchSections();  
      } else {
        toast.error(res?.message || "Failed to delete section.");
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const getParentName = (parentId: string) => {
    if (!parentId) return "----";  
    const parent = sections.find((s) => s._id === parentId);
    return parent ? parent.section : "----";
  };

  return { sections, isLoading, handleDelete, getParentName };
};