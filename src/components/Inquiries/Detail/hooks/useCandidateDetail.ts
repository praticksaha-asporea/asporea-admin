import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getTacListAction } from "../../../../service/apis/adminInquiry.actions";
import type { CandidateLead } from "../../../../types/payloads/Candidate.types";

interface UseCandidateDetailProps {
  selectedCandidate: CandidateLead;
}

export const useCandidateDetail = ({
  selectedCandidate,
}: UseCandidateDetailProps) => {
  const navigate = useNavigate();
  const currentUser = useSelector(
    (state: any) => state.userSlice?.userData || state.user?.userData
  );
  const isFoe =
    currentUser?.role === "foe" || currentUser?.user?.role === "foe";

  const c = selectedCandidate ?? {};
  const preferences = c.preferences ?? {};
  const source = c.source ?? {};
  const branchId = preferences.branchId as any;
  const consultantId = preferences.consultantId as any;
  const abp = c.assignmentByPhase ?? {};
  const inqAssign = abp["pre"] ?? null;
  const assessAssign = abp["assess"] ?? null;

  const [tacList, setTacList] = useState<any[]>([]);
  const [escalateTo, setEscalateTo] = useState("");

  useEffect(() => {
    const branchObjectId =
      typeof preferences.branchId === "object"
        ? preferences.branchId?._id
        : preferences.branchId;
    if (!branchObjectId) return;

    getTacListAction({ branchId: branchObjectId })
      .then((res: any) => {
        if (res?.data?.success) {
          const myId = currentUser?.id || currentUser?._id;
          setTacList(
            res?.data?.data?.filter((t: any) => String(t._id) !== String(myId))
          );
        }
      })
      .catch(() => {});
  }, [preferences.branchId, currentUser]);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/all-inquiries", { replace: true });
    }
  };

  return {
    c,
    preferences,
    source,
    branchId,
    consultantId,
    inqAssign,
    assessAssign,
    tacList,
    escalateTo,
    setEscalateTo,
    currentUser,
    isFoe,
    handleBack,
  };
};