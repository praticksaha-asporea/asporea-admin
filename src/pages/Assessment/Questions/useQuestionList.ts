import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { confirmToast } from "../../../utils/confirmToast";
import {
  getQuestionsApi,
  deleteQuestionApi,
  restoreQuestionApi,
} from "../../../service/apis/assessment.api";
import type { AssessmentQuestion } from "../../../types/responses/assessment/assessment.responses";

export const useQuestionList = () => {
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleted, setShowDeleted] = useState(false);

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const res = await getQuestionsApi({
        limit: 100,
        includeDeleted: String(showDeleted),
      });

      if (res?.success && res.data) {
        let fetchedData: AssessmentQuestion[] = [];


        if (Array.isArray(res.data)) {

          fetchedData = res.data;
        } else if (typeof res.data === "object" && "data" in res.data) {

          const paginatedStructure = res.data as { data: AssessmentQuestion[] };
          fetchedData = paginatedStructure.data ?? [];
        }

        setQuestions(fetchedData);
      } else {
        setQuestions([]);
      }
    } catch (error) {
      console.error("Error loading questions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [showDeleted]);

  const handleDelete = async (id: string) => {
    const confirmed = await confirmToast(
      "Are you sure you want to delete this option?",
    );
    if (!confirmed) return;
    try {
      const res = await deleteQuestionApi(id);
      if (res?.success) {
        toast.success(res.message || "Option deleted successfully!");
        fetchQuestions();
      } else {
        toast.error(res?.message || "Failed to delete");
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleRestore = async (id: string) => {
    const confirmed = await confirmToast(
      "Do you want to restore this criteria option back to active form?",
    );
    if (!confirmed) return;
    try {
      const res = await restoreQuestionApi(id);
      if (res?.success) {
        toast.success(res.message || "Option restored successfully!");
        fetchQuestions();
      } else {
        toast.error(res?.message || "Failed to restore");
      }
    } catch (error) {
      console.error("Restore failed:", error);
    }
  };
  const groupedQuestions = questions.reduce(
    (acc, curr) => {
      if (!acc[curr.section]) acc[curr.section] = {};
      const sub = curr.subSection || "DEFAULT_OPTIONS";
      if (!acc[curr.section][sub]) acc[curr.section][sub] = [];

      acc[curr.section][sub].push(curr);

      acc[curr.section][sub].sort((a, b) => a.order - b.order);
      return acc;
    },
    {} as Record<string, Record<string, AssessmentQuestion[]>>,
  );

  const existingSections = Array.from(new Set(questions.map((q) => q.section)));

  return {
    questions,
    groupedQuestions,
    existingSections,
    showDeleted,
    setShowDeleted,
    isLoading,
    handleDelete,
    handleRestore,
  };
};
