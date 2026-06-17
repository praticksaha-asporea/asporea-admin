import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
 
import {
  createQuestionApi,
  updateQuestionApi,
  getQuestionByIdApi,
} from "../../../service/apis/assessment.api";

export const useQuestionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    shortName: "",
    marks: 0,
    section: "",
    subSection: "",
    type: "rating",
    levels: [""],
    order: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);  

   
  useEffect(() => {
    if (isEdit && id) {
      fetchQuestionData(id);
    }
  }, [id, isEdit]);

  const fetchQuestionData = async (questionId: string) => {
    setIsFetching(true);
    try {
      const res = await getQuestionByIdApi(questionId);

      const item = res?.data?.data || res?.data || res;

      

      if (item && (item.title || item.section || item.shortName)) {
        setFormData({
          title: item.title || "",
          shortName: item.shortName || "",
          marks: item.marks || 0,
          section: item.section || "",
          subSection: item.subSection || "",
          type: item.type || "rating",
          levels: item.levels && item.levels.length > 0 ? item.levels : [""],
          order: item.order || 0,
        });
      } else {
        console.error(
          "Error: Question data is missing expected fields (title, section, etc.)",
        );
      }
    } catch (error) {
      console.error("Error fetching question details from DB:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLevelChange = (index: number, value: string) => {
    const newLevels = [...formData.levels];
    newLevels[index] = value;
    setFormData({ ...formData, levels: newLevels });
  };

  const addLevel = () =>
    setFormData({ ...formData, levels: [...formData.levels, ""] });
  const removeLevel = (index: number) =>
    setFormData({
      ...formData,
      levels: formData.levels.filter((_, i) => i !== index),
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.section.trim()) {
      return toast.error("Title and Section are required!");
    }

    setIsLoading(true);

    const payload = {
      ...formData,
      marks: Number(formData.marks),
      order: Number(formData.order),
      levels: formData.levels.filter((l) => l.trim() !== ""),
    };

    try {
      if (isEdit) {
        const res = await updateQuestionApi(id as string, payload);
        if (res) {
          toast.success("Question updated successfully!");
          navigate("/questions");
        }
      } else {
        const res = await createQuestionApi(payload);
        if (res) {
          toast.success("Question created successfully!");
          navigate("/questions");
        }
      }
    } catch (error) {
      console.error("Error during submit", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isEdit,
    formData,
    isLoading,
    isFetching,
    handleChange,
    handleLevelChange,
    addLevel,
    removeLevel,
    handleSubmit,
    navigate,
  };
};
