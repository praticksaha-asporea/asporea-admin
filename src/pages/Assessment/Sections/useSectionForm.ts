import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import {
  getSectionsApi,
  createSectionApi,
} from "../../../service/apis/assessmentSection.api";

export const useSectionForm = () => {
  const navigate = useNavigate();
  const [parentSections, setParentSections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchParentSections = async () => {
      try {
        const res = await getSectionsApi();
        const allSections = res?.data?.data?.data || res?.data?.data || [];

        const parents = allSections.filter(
          (s: any) => !s.underSection || s.underSection.trim() === "",
        );
        setParentSections(parents);
      } catch (error) {
        console.error("Error fetching sections:", error);
        toast.error("Failed to load parent sections");
      } finally {
        setIsFetching(false);
      }
    };
    fetchParentSections();
  }, []);

  const formik = useFormik({
    initialValues: {
      section: "",
      shortName: "",
      underSection: "",
      maxScore: "",
    },
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
        section: values.section.trim(),
        shortName: values.shortName.trim(),
        underSection: values.underSection || undefined,
        maxScore:
          !values.underSection && values.maxScore
            ? Number(values.maxScore)
            : undefined,
      };

      try {
        const res = await createSectionApi(payload);
        if (res) {
          toast.success("Section created successfully!");
          navigate("/assessment-sections");
        }
      } catch (error) {
        console.error("Error creating section:", error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  return { formik, parentSections, isLoading, isFetching, navigate };
};
