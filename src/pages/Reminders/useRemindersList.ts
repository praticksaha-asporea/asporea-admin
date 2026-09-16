import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import {
  getAdminRemindersListApi,
  getAdminReminderByIdApi,
  deleteAdminReminderApi,
  getAdminReminderTargetsApi,
  createAdminReminderApi,
} from "../../service/apis/reminder.api";
import type {
  AdminReminderListItem,
  ReminderTargetResponse,
} from "../../types/responses/reminder/reminder.responses";
import type { CreateAdminReminderPayload } from "../../types/payloads/reminder/reminder.payloads";

export const useRemindersList = (currentUserId?: string) => {
  // Listing States
  const [reminders, setReminders] = useState<AdminReminderListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter & Search States
  const [search, setSearch] = useState<string>("");
  const [readStatus, setReadStatus] = useState<string>("all");
  const [notifyType, setNotifyType] = useState<string>("all");

  // Pagination States
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  // Detail Modal & Single Fetch States
  const [selectedReminder, setSelectedReminder] = useState<AdminReminderListItem | null>(null);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);

  // Delete States
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  // Send Reminder Form Modal States
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [targets, setTargets] = useState<ReminderTargetResponse[]>([]);
  const [targetsLoading, setTargetsLoading] = useState<boolean>(false);
  const [selectedTargetIds, setSelectedTargetIds] = useState<string[]>([]);
  const [heading, setHeading] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);

  // Fetch Reminders History
  const fetchReminders = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        page: String(page),
        limit: "12",
        read: readStatus,
        notifyType,
      };
      if (search.trim()) params.search = search.trim();

      const res = await getAdminRemindersListApi(params);
      if (res && res.success) {
        const paginatedData = res.data;
        const list = paginatedData?.records || (paginatedData as any)?.reminders || [];
        setReminders(list);
        setTotalPages(paginatedData?.totalPages || 1);
        setTotalCount(paginatedData?.total || 0);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch reminders");
    } finally {
      setLoading(false);
    }
  }, [page, readStatus, notifyType, search]);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  // Fetch Single Reminder By ID (for View Details Modal)
  const fetchReminderById = async (id: string) => {
    setDetailLoading(true);
    try {
      const res = await getAdminReminderByIdApi(id);
      if (res && res.success) {
        setSelectedReminder(res.data);
      } else {
        toast.error(res?.message || "Failed to fetch reminder details");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error fetching reminder details");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleOpenDetailModal = (item: AdminReminderListItem) => {
    setSelectedReminder(item);
    if (item._id) {
      fetchReminderById(item._id);
    }
  };

  // Helper to check if reminder was sent by the currently logged-in Admin
  const isSentFromYou = useCallback(
    (sentFromId?: string) => {
      if (!currentUserId || !sentFromId) return false;
      return sentFromId.toString() === currentUserId.toString();
    },
    [currentUserId]
  );

  // Handle Search Submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchReminders();
  };

  // Delete Reminder Action
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await deleteAdminReminderApi(deleteId);
      if (res && res.success) {
        toast.success(res.message || "Reminder deleted successfully");
        setDeleteId(null);
        fetchReminders();
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete reminder");
    } finally {
      setDeleting(false);
    }
  };

  // Fetch Recipients when Role is selected in Create Modal
  useEffect(() => {
    if (!selectedRole) {
      setTargets([]);
      setSelectedTargetIds([]);
      return;
    }

    const fetchTargets = async () => {
      setTargetsLoading(true);
      try {
        const res = await getAdminReminderTargetsApi(selectedRole);
        if (res && res.success) {
          setTargets(res.data || []);
        } else {
          toast.error(res?.message || "Failed to fetch target users");
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to fetch targets");
      } finally {
        setTargetsLoading(false);
      }
    };

    fetchTargets();
    setSelectedTargetIds([]);
  }, [selectedRole]);

  // Toggle Single Recipient Selection (Max 20 limit)
  const toggleTargetSelect = (id: string) => {
    setSelectedTargetIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 20) {
        toast.error("You can select a maximum of 20 recipients at a time");
        return prev;
      }
      return [...prev, id];
    });
  };

  // Select All Targets (Max 20 cap)
  const handleSelectAllTargets = () => {
    if (selectedTargetIds.length === Math.min(targets.length, 20)) {
      setSelectedTargetIds([]);
    } else {
      const capped = targets.slice(0, 20).map((t) => t.id);
      setSelectedTargetIds(capped);
      if (targets.length > 20) {
        toast("Selected first 20 recipients (Max limit applied)", { icon: "ℹ️" });
      }
    }
  };

  // Send Bulk Reminder Submit
  const handleSendReminder = async () => {
    if (selectedTargetIds.length === 0) {
      toast.error("Please select at least one recipient");
      return;
    }
    if (!heading.trim() || !message.trim()) {
      toast.error("Heading and message are required");
      return;
    }

    const targetType = selectedRole === "user" ? "candidate" : "tac";
    const payload: CreateAdminReminderPayload = {
      targetIds: selectedTargetIds,
      notifyType: targetType,
      heading: heading.trim(),
      message: message.trim(),
    };

    setIsSending(true);
    try {
      const res = await createAdminReminderApi(payload);
      if (res && res.success) {
        toast.success(res.message || "Reminders sent successfully!");
        setIsCreateOpen(false);
        setSelectedRole("");
        setSelectedTargetIds([]);
        setHeading("");
        setMessage("");
        fetchReminders();
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to send reminders");
    } finally {
      setIsSending(false);
    }
  };

  return {
    reminders,
    loading,
    viewMode,
    setViewMode,
    search,
    setSearch,
    readStatus,
    setReadStatus,
    notifyType,
    setNotifyType,
    page,
    setPage,
    totalPages,
    totalCount,
    handleSearchSubmit,

    selectedReminder,
    setSelectedReminder,
    detailLoading,
    handleOpenDetailModal,
    isSentFromYou,
    currentUserId,

    deleteId,
    setDeleteId,
    deleting,
    handleDelete,

    isCreateOpen,
    setIsCreateOpen,
    selectedRole,
    setSelectedRole,
    targets,
    targetsLoading,
    selectedTargetIds,
    toggleTargetSelect,
    handleSelectAllTargets,
    heading,
    setHeading,
    message,
    setMessage,
    isSending,
    handleSendReminder,
  };
};