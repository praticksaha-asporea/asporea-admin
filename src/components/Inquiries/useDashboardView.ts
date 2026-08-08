import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import type { Slot, CandidateRow, tacData } from "../../types/object.types";
import {
  getTacCandidatesAction,
  getTacListAction,
  getSlotsAction,
  bookSlotAction,
  scheduleAssessmentAction,
} from "../../service/apis/adminInquiry.actions";

export interface kpiTypes {
  openCases: number;
  pendingCounselling: number;
  pendingAssessment: number;
}

export const useDashboardView = () => {
  const navigate = useNavigate();
  const currentUser = useSelector(
    (state: any) =>
      state.userSlice?.userData || state.user?.userData || state.auth?.user
  );

  const userRole = currentUser?.role || currentUser?.user?.role || "admin";
  const isFoe = userRole === "foe";
  const isAdmin = userRole === "admin" || userRole === "superadmin";

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");
  const [page, setPage] = useState(1);
  const LIMIT = 10;

  const [rows, setRows] = useState<CandidateRow[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [kpis, setKpis] = useState<kpiTypes | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [targetLead, setTargetLead] = useState<CandidateRow | null>(null);
  const [commModalOpen, setCommModalOpen] = useState(false);
  const [commMode, setCommMode] = useState<"chat" | "email" | null>(null);
  const [commCandidate, setCommCandidate] = useState<CandidateRow | null>(
    null
  );

  const [tacList, setTacList] = useState<tacData[]>([]);
  const [selectedTac, setSelectedTac] = useState<string>("");

  const serverNow = new Date();
  const utcTime = serverNow.getTime() + serverNow.getTimezoneOffset() * 60000;
  const istTime = new Date(utcTime + 330 * 60000);
  const todayStr = istTime.toISOString().split("T")[0];

  const [date, setDate] = useState(todayStr);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [schedulePhase, setSchedulePhase] = useState<"pre" | "assess">("pre");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const openCommModal = (candidate: CandidateRow, mode: "chat" | "email") => {
    setCommCandidate(candidate);
    setCommMode(mode);
    setCommModalOpen(true);
  };

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, experienceFilter]);

  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
       const payload= {
        page,
        limit: LIMIT,
        search: search || undefined,
        status: statusFilter || undefined,
        experience: experienceFilter || undefined,
        kpis: kpis === null,
        all: true,
        isAdmin: true,
        role: userRole,
      };

      const res = await getTacCandidatesAction(payload);
      const resBody = res?.data ?? res;
      const candidatesData = resBody?.data?.data || resBody?.data || [];

      setRows(candidatesData);
      setTotalPages(resBody?.pagination?.totalPages || 1);
      setTotal(resBody?.pagination?.total || 0);
      if (resBody?.kpis) setKpis(resBody.kpis);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to load candidates");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, experienceFilter, kpis, userRole]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

   const openScheduleModal = async (
    candidate: any,
    _isReschedule = false,
    phase: "pre" | "assess" = "pre"
  ) => {
    setTargetLead(candidate);
    setSchedulePhase(phase);
    setModalOpen(true);

    const rawBranch = candidate?.branchId || candidate?.preferences?.branchId;
    const branchIdStr =
      typeof rawBranch === "object"
        ? (rawBranch?._id || rawBranch?.id)?.toString()
        : rawBranch?.toString() || "";

     
    const extractTacId = (val: any): string => {
      if (!val) return "";
      if (typeof val === "string") return val.trim();
      if (typeof val === "object") {
        return (val._id || val.id)?.toString()?.trim() || "";
      }
      return String(val).trim();
    };

    
    const prevTacId =
      extractTacId(candidate?.consultantId) ||
      extractTacId(candidate?.preferences?.consultantId);

    setDate(todayStr);
    setSlots([]);
    setSelectedSlot(null);

    if (branchIdStr) {
      try {
        const res = await getTacListAction({ branchId: branchIdStr });
        const rawList = res?.data?.data ?? res?.data ?? res;
        const fetchedList: tacData[] = Array.isArray(rawList) ? rawList : [];

        if (fetchedList.length > 0) {
          setTacList(fetchedList);

    
          const matchedTac = prevTacId
            ? fetchedList.find((t) => String(t._id).trim() === prevTacId)
            : null;

          if (matchedTac) {
            setSelectedTac(String(matchedTac._id));
          } else {
          
            setSelectedTac(String(fetchedList[0]._id));
          }
        } else {
          setTacList([]);
          setSelectedTac("");
        }
      } catch {
        setTacList([]);
        setSelectedTac("");
      }
    } else {
      setTacList([]);
      setSelectedTac("");
    }
  };

  
  useEffect(() => {
    const loadSlots = async () => {
      const tacId =
        typeof selectedTac === "object"
          ? (selectedTac as any)?._id
          : selectedTac;

      if (!tacId || typeof tacId !== "string" || !date || !modalOpen) return;

      setSlotsLoading(true);
      setSelectedSlot(null);

      try {
        const res = await getSlotsAction({
          consultantId: tacId,
          date,
        });

        
        const rawSlots = res?.data?.data ?? res?.data ?? res;
        const fetchedSlots: Slot[] = Array.isArray(rawSlots) ? rawSlots : [];

        setSlots(fetchedSlots);
      } catch {
        toast.error("Failed to fetch slots");
        setSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    };

    loadSlots();
  }, [selectedTac, date, modalOpen]);

const handleBookSlot = async () => {
    const tacId =
      typeof selectedTac === "object"
        ? (selectedTac as any)?._id
        : selectedTac;

    if (!targetLead || !tacId || !selectedSlot) return;
    setBookingLoading(true);

    const method = (targetLead.visitType === "online" ? "on" : "off") as
      | "on"
      | "off";

    const payload = {
      leadId: targetLead._id,
      consultantId: tacId as string,
      date,
      from: selectedSlot.from,
      to: selectedSlot.to,
      method: method,
    };

    try {
      let res: any;
      if (schedulePhase === "pre") {
        res = await bookSlotAction(payload);
      } else {
        res = await scheduleAssessmentAction(payload);
      }

       
      const isSuccess =
        res?.data?.success === true ||
        res?.success === true ||
        res?.status === 200 ||
        res?.status === 201;

      const serverMessage =
        res?.data?.message ||
        res?.message ||
        `${
          schedulePhase === "pre" ? "Pre-Counselling" : "Assessment"
        } session scheduled successfully!`;

      if (isSuccess) {
        toast.success(serverMessage);
        setModalOpen(false);
        fetchCandidates();
      } else {
        toast.error(
          res?.data?.message || res?.message || "Failed to book slot"
        );
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to book slot");
    } finally {
      setBookingLoading(false);
    }
  };
  return {
    isFoe,
    isAdmin,
    kpis,
    total,
    searchInput,
    setSearchInput,
    statusFilter,
    setStatusFilter,
    experienceFilter,
    setExperienceFilter,
    rows,
    loading,
    error,
    page,
    totalPages,
    setPage,
    openScheduleModal,
    openCommModal,
    navigate,
    modalOpen,
    setModalOpen,
    targetLead,
    tacList,
    selectedTac,
    setSelectedTac,
    date,
    setDate,
    todayStr,
    slotsLoading,
    slots,
    selectedSlot,
    setSelectedSlot,
    handleBookSlot,
    bookingLoading,
    schedulePhase,
    commModalOpen,
    setCommModalOpen,
    commCandidate,
    commMode,
    previewImage,
    setPreviewImage,
  };
};