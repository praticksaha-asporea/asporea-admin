import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useFormik } from "formik";  
import { getSectionsApi, getSectionDetailApi, updateSectionApi } from "../../../service/apis/assessmentSection.api";
import type { AssessmentSection } from "../../../types/responses/assessment/section/assessmentSection.responses";
export const useEditSection = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

const [parentSections, setParentSections] = useState<AssessmentSection[]>([]);  
const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
 
  const [initialData, setInitialData] = useState({
    section: "",
    shortName: "",
    underSection: "",
    maxScore: "",
  });

 useEffect(() => {
    const initData = async () => {
      if (!id) return;
      try {
         
        const sectionsRes = await getSectionsApi();
        if (sectionsRes?.success && sectionsRes.data) {
          const allSections = Array.isArray(sectionsRes.data) ? sectionsRes.data : (sectionsRes.data as any).data || [];
          const parents = allSections.filter((s: AssessmentSection) => (!s.underSection || s.underSection.trim() === "") && s._id !== id);
          setParentSections(parents);
        }

         
        const detailRes = await getSectionDetailApi(id);
        if (detailRes?.success && detailRes.data) {
          const currentSection = detailRes.data;
          setInitialData({
            section: currentSection.section || "",
            shortName: currentSection.shortName || "",
            underSection: currentSection.underSection || "",
            maxScore: currentSection.maxScore ? String(currentSection.maxScore) : "",
          });
        } else {
          toast.error(detailRes?.message || "Failed to load section detail");
        }
      } catch (error) {
        console.error("Error fetching section detail", error);
        toast.error("Failed to load section data");
      } finally {
        setIsFetching(false);
      }
    };
    initData();
  }, [id]);

  
  const formik = useFormik({
    initialValues: initialData,
    enableReinitialize: true,  
    validate: (values) => {
      const errors: any = {};

      if (!values.section.trim()) {
        errors.section = "Section Name is required";
      }
      if (!values.shortName.trim()) {
        errors.shortName = "Short Name is required";
      }
      
     
     if (values.underSection) {
    
    if (values.maxScore && String(values.maxScore).trim() !== "") {
      errors.maxScore = "Max Score is not applicable for sub-sections. Please clear it.";
    }
  } else {
     
    if (!values.maxScore) {
      errors.maxScore = "Max Score is mandatory for Main Sections";
    } else {
      const score = Number(values.maxScore);
      if (score < 0) {
        errors.maxScore = "Max Score cannot be negative";
      } else if (score >= 100) {
        errors.maxScore = "Max Score must be strictly less than 100 (e.g., 99)";
      }
    }
  }

  return errors;
},
    onSubmit: async (values) => {
      setIsLoading(true);
      const payload = {
        section: values.section,
        shortName: values.shortName,
        underSection: values.underSection,
        maxScore: values.underSection === "" && values.maxScore ? Number(values.maxScore) : undefined,
      };

     if (!id) return;
      try {
        const res = await updateSectionApi(id, payload);
        if (res?.success) {
          toast.success(res.message || "Section updated successfully!");
          navigate("/assessment-sections");
        } else {
          toast.error(res?.message || "Failed to update section");
        }
      } catch (error) {
        console.error("Error updating section", error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  return { formik, parentSections, isLoading, isFetching, navigate };
};