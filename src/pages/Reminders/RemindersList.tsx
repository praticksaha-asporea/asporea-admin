"use client";

import React from "react";
import {
  Box,
  Card,
  Typography,
  Select,
  MenuItem,
  TextField,
  Button,
  IconButton,
  Tooltip,
  Chip,
  Avatar,
  CircularProgress,
  Pagination,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Collapse,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import { format } from "date-fns";
import { useRemindersList } from "./useRemindersList";

const ROLE_OPTIONS = [
  { label: "Candidate (User)", value: "user" },
  { label: "TAC", value: "tac" },
  { label: "TAC Head", value: "tac_head" },
  { label: "Front Office Executive (FOE)", value: "foe" },
  { label: "Finance", value: "finance" },
  { label: "Coordinator", value: "coordinator" },
  { label: "Branch Head", value: "branch_head" },
  { label: "Admin", value: "admin" },
  { label: "PCA", value: "pca" },
  { label: "PCRA", value: "pcra" },
  { label: "Institute", value: "institute" },
];

interface RemindersListProps {
  currentUserId?: string;
}

const getAvatarUrl = (picPath?: string | null) => {
  if (!picPath) return "/avatar.png";
  if (picPath.startsWith("http://") || picPath.startsWith("https://")) {
    return picPath;
  }

  const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL || "";
  const cleanPath = picPath.startsWith("/") ? picPath : `/${picPath}`;
  return `${baseUrl}${cleanPath}`;
};

const RemindersList: React.FC<RemindersListProps> = ({ currentUserId }) => {
  const {
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
    handleSearchSubmit,

    selectedReminder,
    setSelectedReminder,
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
  } = useRemindersList(currentUserId);

  const parseMessage = (rawMsg: string) => {
    if (!rawMsg) return { cleanText: "—", inqRef: null };
    const splitRegex = /📌 Reference Inquiry(?:s)?:/;
    if (splitRegex.test(rawMsg)) {
      const parts = rawMsg.split(splitRegex);
      return {
        cleanText: parts[0]?.trim() || rawMsg,
        inqRef: parts[1]?.trim() || null,
      };
    }
    return { cleanText: rawMsg, inqRef: null };
  };

  return (
    <Box className="w-full p-4 md:p-6 font-sans bg-gray-50/50 min-h-screen">
      {/* ── HEADER ── */}
      <Box className="flex justify-between items-center mb-6">
        <Box>
          <Typography className="text-2xl font-bold text-gray-900">
            Sent Reminders History
          </Typography>
          <Typography className="text-sm text-gray-500 mt-0.5">
            View, filter, inspect details, or send bulk reminders across all
            user roles.
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={() => setIsCreateOpen(true)}
          startIcon={<i className="ri-add-line text-lg" />}
          className="rounded-xl px-5 py-2.5 font-semibold text-white bg-[#0D80F2] hover:bg-blue-600 shadow-md transition-all hover:scale-105"
        >
          Send Reminder
        </Button>
      </Box>

      {/* ── SEARCH & FILTERS BAR ── */}
      <Box className="flex flex-wrap gap-4 items-center justify-between mb-6">
        <form
          onSubmit={handleSearchSubmit}
          className="w-full md:w-auto flex-1 max-w-md"
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Search by recipient, message, or heading..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <i className="ri-search-line text-lg   text-(--mui-palette-text-secondary)" />
                  </InputAdornment>
                ),
                endAdornment: search ? (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearch("")}>
                      <i className="ri-close-line text-sm text-(--mui-palette-text-secondary)" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "50px",
                backgroundColor: "var(--mui-palette-background-paper)",
                transition: "all 0.2s ease-in-out",
                boxShadow: "0 1px 2px 0 rgba(0,0,0,0.1)",

                "& fieldset": {
                  border: "1px solid var(--mui-palette-divider)",
                },

                "&:hover fieldset": {
                  borderColor: "var(--mui-palette-primary-main)",
                },

                "&.Mui-focused fieldset": {
                  borderColor: "var(--mui-palette-primary-main)",
                  borderWidth: "1px",
                },
              },

              "& .MuiInputBase-input": {
                color: "var(--mui-palette-text-primary)",
              },

              "& .MuiInputBase-input::placeholder": {
                color: "var(--mui-palette-text-secondary)",
                opacity: 0.7,
              },
            }}
          />
        </form>

        <Box className="flex flex-wrap gap-3 items-center w-full md:w-auto">
          {/* Recipient Type Filter */}
          <Select
            size="small"
            value={notifyType}
            onChange={(e) => {
              setNotifyType(e.target.value);
              setPage(1);
            }}
            className="w-44 bg-white rounded-full shadow-sm"
            sx={{
              borderRadius: "50px",
              "& fieldset": { border: "1px solid #E5E7EB" },
            }}
          >
            <MenuItem value="all">All Recipients</MenuItem>
            <MenuItem value="candidate">Candidates</MenuItem>
            <MenuItem value="tac">Staff / TAC</MenuItem>
          </Select>

          {/* Read Status Filter */}
          <Select
            size="small"
            value={readStatus}
            onChange={(e) => {
              setReadStatus(e.target.value);
              setPage(1);
            }}
            className="w-44 bg-white rounded-full shadow-sm"
            sx={{
              borderRadius: "50px",
              "& fieldset": { border: "1px solid #E5E7EB" },
            }}
          >
            <MenuItem value="all">All Read Status</MenuItem>
            <MenuItem value="true">Read</MenuItem>
            <MenuItem value="false">Unread</MenuItem>
          </Select>

          {/* Grid / List View Toggle */}
        <Box className="flex items-center gap-1.5 bg-white p-1 rounded-full border border-gray-200 shadow-sm">
  {/* Grid View Button */}
  <IconButton
    size="small"
    onClick={() => setViewMode("grid")}
    sx={{
      width: 34,
      height: 34,
      borderRadius: "50%",
      backgroundColor: viewMode === "grid" ? "#0D80F2" : "#F3F4F6",
      color: viewMode === "grid" ? "#FFFFFF" : "#6B7280",
      boxShadow:
        viewMode === "grid" ? "0 2px 8px rgba(13, 128, 242, 0.35)" : "none",
      transition: "all 0.15s ease-in-out",
      "&:hover": {
        backgroundColor: viewMode === "grid" ? "#0B6ECC" : "#E5E7EB",
        color: viewMode === "grid" ? "#FFFFFF" : "#111827",
      },
    }}
  >
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
      />
    </svg>
  </IconButton>

  {/* List View Button */}
  <IconButton
    size="small"
    onClick={() => setViewMode("list")}
    sx={{
      width: 34,
      height: 34,
      borderRadius: "50%",
      backgroundColor: viewMode === "list" ? "#0D80F2" : "#F3F4F6",
      color: viewMode === "list" ? "#FFFFFF" : "#6B7280",
      boxShadow:
        viewMode === "list" ? "0 2px 8px rgba(13, 128, 242, 0.35)" : "none",
      transition: "all 0.15s ease-in-out",
      "&:hover": {
        backgroundColor: viewMode === "list" ? "#0B6ECC" : "#E5E7EB",
        color: viewMode === "list" ? "#FFFFFF" : "#111827",
      },
    }}
  >
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  </IconButton>
</Box>
        </Box>
      </Box>

      {/* ── CONTENT AREA ── */}
      {loading ? (
        <Box className="flex justify-center items-center py-20">
          <CircularProgress style={{ color: "#0D80F2" }} />
        </Box>
      ) : reminders.length === 0 ? (
        <Box className="flex flex-col items-center justify-center text-center py-24 bg-white rounded-3xl shadow-2xl text-gray-500 font-medium">
          <i className="ri-inbox-line text-6xl mb-4 opacity-30" />
          <Typography variant="h6" className="font-semibold text-gray-900">
            No reminders found
          </Typography>
          <Typography variant="body2" className="mt-1 opacity-70">
            Try adjusting your search query or role filters.
          </Typography>
        </Box>
      ) : viewMode === "grid" ? (
        /* ── GRID VIEW (COMPACT 4 CARDS PER ROW) ── */
        <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {reminders.map((row) => {
            const isSentFromYou =
              (currentUserId && row.sentFrom?._id === currentUserId) ||
              row.sentFrom?.role === "admin";
            const senderName = isSentFromYou
              ? "You"
              : `${row.sentFrom?.firstName || ""} ${row.sentFrom?.lastName || ""}`.trim() ||
                "System";

            const { cleanText, inqRef } = parseMessage(row.message);

            return (
              <Card
                key={row._id}
                elevation={0}
                className="flex flex-col rounded-xl shadow-md! hover:shadow-xl! bg-white overflow-hidden transition-all duration-300 transform hover:-translate-y-0.5 border border-gray-100"
              >
                {/* Top Section */}
                <Box className="p-3 flex items-start justify-between gap-2">
                  <Box className="flex items-center gap-2.5 min-w-0 flex-1">
                    <Avatar
                      src={getAvatarUrl(row.notifyToDetails?.profilePic)}
                      className="w-9 h-9 text-xs shadow-sm text-gray-700 font-bold shrink-0 bg-blue-50 border border-blue-100"
                    >
                      {row.notifyToDetails?.name?.charAt(0) || "U"}
                    </Avatar>
                    <Box className="min-w-0 flex-1">
                      <Typography className="font-bold text-[13px] leading-tight text-gray-900 truncate">
                        {row.notifyToDetails?.name || "Unknown"}
                      </Typography>
                      <Typography className="text-[11px] text-gray-500 mt-0.5 truncate font-medium">
                        {row.notifyType === "candidate"
                          ? ` ${row.notifyToDetails?.inqNo || "—"}`
                          : `${row.notifyToDetails?.role?.toUpperCase() || "STAFF"}`}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    size="small"
                    label={row.read ? "Read" : "Unread"}
                    color={row.read ? "success" : "warning"}
                    className="font-bold text-[10px] h-5 px-0.5 shrink-0"
                  />
                </Box>

                <hr className="border-t border-gray-100" />

                {/* Middle Info Section */}
                <Box className="p-3 space-y-2.5 flex-1">
                  {/* Heading */}
                  <Box className="grid grid-cols-[70px_1fr] items-start gap-1.5">
                    <Box className="flex items-center gap-1 text-gray-500">
                      <i className="ri-file-text-line text-[13px]" />
                      <Typography className="text-[11px] font-medium">
                        Heading
                      </Typography>
                    </Box>
                    <Typography className="text-[12.5px] font-bold text-gray-900 line-clamp-1 leading-tight">
                      {row.heading}
                    </Typography>
                  </Box>

                  {/* Message with Tooltip */}
                  <Box className="grid grid-cols-[70px_1fr] items-start gap-1.5">
                    <Box className="flex items-center gap-1 text-gray-500 mt-0.5">
                      <i className="ri-chat-3-line text-[13px]" />
                      <Typography className="text-[11px] font-medium">
                        Message
                      </Typography>
                    </Box>

                    <Tooltip
                      title={
                        <Box className="p-1 space-y-1.5 border-none max-w-60">
                          <Typography className="text-[12px] font-medium tracking-wide text-gray-900 leading-relaxed wrap-break-word">
                            {cleanText}
                          </Typography>
                          {inqRef && (
                            <Box className="pt-1.5 border-t border-gray-200">
                              <Typography className="text-[10px] font-semibold tracking-wider text-amber-600 wrap-break-word">
                                📌 Reference Inquiries: {inqRef}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      }
                      arrow
                      placement="top"
                      slotProps={{
                        tooltip: {
                          sx: {
                            bgcolor: "#ffffff",
                            color: "#111827",
                            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.15)",
                            border: "1px solid #E5E7EB",
                            borderRadius: "12px",
                            padding: "8px 12px",
                            maxWidth: "240px",
                          },
                        },
                        arrow: { sx: { color: "#ffffff" } },
                        popper: {
                          modifiers: [
                            {
                              name: "preventOverflow",
                              options: { boundary: "window" },
                            },
                          ],
                        },
                      }}
                    >
                      <Box className="min-w-0 cursor-pointer group">
                        <Typography className="text-[12px] text-gray-700 line-clamp-2 leading-relaxed group-hover:text-[#0D80F2] transition-colors">
                          {cleanText}
                        </Typography>
                        {inqRef && (
                          <Chip
                            size="small"
                            label={`Inq: ${inqRef}`}
                            className="mt-1 h-4.5 text-[10px] font-medium bg-blue-50 text-[#0D80F2] max-w-full truncate cursor-pointer group-hover:bg-blue-100 transition-colors"
                          />
                        )}
                      </Box>
                    </Tooltip>
                  </Box>

                  {/* Sent From Section */}
                  <Box className="grid grid-cols-[70px_1fr] items-start gap-1.5">
                    <Box className="flex items-center gap-1 text-gray-500">
                      <i className="ri-user-3-line text-[13px]" />
                      <Typography className="text-[11px] font-medium">
                        Sent From
                      </Typography>
                    </Box>
                    <Box className="flex items-center gap-1 min-w-0">
                      <Typography className="text-[12px] font-semibold text-gray-900 leading-tight truncate">
                        {isSentFromYou ? "You" : senderName}
                      </Typography>
                     
                    </Box>
                  </Box>
                </Box>

                <hr className="border-none border-gray-100" />

                {/* Card Footer (Compact & Action Buttons Always Visible) */}
                <Box className="px-3 py-2 flex items-center justify-between gap-2 bg-gray-50/70">
                  <Box className="flex items-center gap-1 text-gray-500 min-w-0 flex-1">
                    <i className="ri-calendar-line text-[13px] shrink-0" />
                    <Typography className="text-[10.5px] font-medium truncate">
                      {format(new Date(row.createdAt), "dd MMM, hh:mm a")}
                    </Typography>
                  </Box>
{/* Action Buttons Container (Using MUI sx prop for guaranteed background & icon colors) */}
<Box className="flex items-center gap-1.5 shrink-0 min-w-max">
  {/* View Details Button */}
  <Tooltip title="View Details" placement="top">
    <IconButton
      size="small"
      onClick={() => setSelectedReminder(row)}
      sx={{
       
        color: "#0D80F2", // Theme Blue
        "&:hover": { backgroundColor: "#DBEAFE" }, // Blue 100
        width: 28,
        height: 28,
        borderRadius: "8px",
        padding: 0,
        transition: "all 0.2s ease-in-out",
      }}
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
    </IconButton>
  </Tooltip>

   
  <Tooltip title="Delete Reminder" placement="top">
    <IconButton
      size="small"
      onClick={() => setDeleteId(row._id)}
      sx={{
        
        color: "#DC2626",  
        "&:hover": { backgroundColor: "#FEE2E2" }, 
        width: 28,
        height: 28,
        borderRadius: "8px",
        padding: 0,
        transition: "all 0.2s ease-in-out",
      }}
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
    </IconButton>
  </Tooltip>
</Box>
                </Box>
              </Card>
            );
          })}
        </Box>
      ) : (
        /* ── LIST VIEW (TABLE) ── */
        <TableContainer
          component={Paper}
           
          className="shadow-2xl  rounded-2xl overflow-hidden bg-white"
        >
          <Table>
            <TableHead className="bg-gray-50">
              <TableRow>
                <TableCell
                  align="left"
                  className="font-semibold text-[13px] py-4 text-gray-700"
                >
                  Recipient (Notify To)
                </TableCell>
                <TableCell
                  align="left"
                  className="font-semibold text-[13px] py-4 text-gray-700"
                >
                  Sent From
                </TableCell>
                <TableCell
                  align="center"
                  className="font-semibold text-[13px] py-4 text-gray-700"
                >
                  Heading
                </TableCell>
                <TableCell
                  align="center"
                  className="font-semibold text-[13px] py-4 text-gray-700"
                >
                  Message
                </TableCell>
                <TableCell
                  align="center"
                  className="font-semibold text-[13px] py-4 text-gray-700"
                >
                  Status
                </TableCell>
                <TableCell
                  align="center"
                  className="font-semibold text-[13px] py-4 text-gray-700"
                >
                  Sent At
                </TableCell>
                <TableCell
                  align="center"
                  className="font-semibold text-[13px] py-4 text-gray-700"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reminders.map((row) => {
                const isSentFromYou =
                  (currentUserId && row.sentFrom?._id === currentUserId) ||
                  row.sentFrom?.role === "admin";
                const senderName = isSentFromYou
                  ? "You"
                  : `${row.sentFrom?.firstName || ""} ${row.sentFrom?.lastName || ""}`.trim() ||
                    "System";
                const { cleanText } = parseMessage(row.message);

                return (
                  <TableRow
                    key={row._id}
                    hover
                    className="transition-colors border-b border-gray-100"
                  >
                    <TableCell align="left">
                      <Box className="flex items-center gap-3">
                        <Avatar
                          src={getAvatarUrl(row.notifyToDetails?.profilePic)}
                          className="w-10 h-10 border border-gray-200 bg-gray-100 text-gray-700 font-bold"
                        >
                          {row.notifyToDetails?.name?.charAt(0) || "U"}
                        </Avatar>
                        <Box>
                          <Typography className="font-semibold text-[14px] text-gray-900 leading-tight">
                            {row.notifyToDetails?.name || "Unknown"}
                          </Typography>
                          <Typography className="text-[12px] text-gray-500 mt-0.5">
                            {row.notifyType === "candidate"
                              ? `${row.notifyToDetails?.inqNo || "—"}`
                              : `${row.notifyToDetails?.role?.toUpperCase() || "STAFF"}`}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell align="left">
                      <Box className="flex items-center gap-1.5">
                        <Typography className="font-semibold text-[13px] text-gray-900 leading-tight">
                          {isSentFromYou ? "You" : senderName}
                        </Typography>
                      </Box>
                    
                    </TableCell>

                    <TableCell align="center" className="max-w-37.5">
                      <Typography className="font-semibold text-[13px] truncate text-gray-900">
                        {row.heading}
                      </Typography>
                    </TableCell>

                    <TableCell align="center" className="max-w-60">
                      <Typography className="text-[13px] text-gray-700 truncate">
                        {cleanText}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Chip
                        size="small"
                        label={row.read ? "Read" : "Unread"}
                        color={row.read ? "success" : "warning"}
                        className="font-bold text-[11px] px-1 h-6"
                      />
                    </TableCell>

                    <TableCell
                      align="center"
                      className="text-[12px] text-gray-500 whitespace-nowrap"
                    >
                      {format(new Date(row.createdAt), "dd MMM yyyy, hh:mm a")}
                    </TableCell>

                    <TableCell align="center">
                   <Box className="flex items-center justify-center gap-1.5">
  {/* View Details Button */}
  <IconButton
    size="small"
    onClick={() => setSelectedReminder(row)}
    sx={{
     
      color: "#0D80F2", // Theme Blue
      "&:hover": { backgroundColor: "#DBEAFE" }, // Blue 100
      width: 32,
      height: 32,
      borderRadius: "8px",
      padding: 0,
      transition: "all 0.2s ease-in-out",
    }}
  >
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  </IconButton>

  {/* Delete Reminder Button */}
  <IconButton
    size="small"
    onClick={() => setDeleteId(row._id)}
    sx={{
      
      color: "#DC2626", // Red 600
      "&:hover": { backgroundColor: "#FEE2E2" }, // Red 100
      width: 32,
      height: 32,
      borderRadius: "8px",
      padding: 0,
      transition: "all 0.2s ease-in-out",
    }}
  >
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  </IconButton>
</Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box className="flex justify-end mt-8">
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, val) => setPage(val)}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}

      {/* ── CREATE REMINDER MODAL ── */}
      <Dialog
        open={isCreateOpen}
       onClose={(_, reason) => {
    if (reason === "backdropClick") return; 
    setIsCreateOpen(false);
  }}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            className: "rounded-2xl shadow-2xl",
          },
        }}
      >
        <DialogTitle className="font-bold text-white bg-blue-400 text-xl py-4 px-6 flex justify-between items-center">
          <span>Create & Send Reminder</span>
          <IconButton
            size="small"
            onClick={() => setIsCreateOpen(false)}
            className="text-white"
          >
            <i className="ri-close-line" />
          </IconButton>
        </DialogTitle>

        <DialogContent className="p-6 space-y-6">
          <Box className="mt-2">
            <Typography className="text-sm font-semibold mb-2 text-gray-700">
              Select Recipient
            </Typography>
            <Select
              fullWidth
              size="small"
              displayEmpty
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              sx={{
                borderRadius: "50px",
                backgroundColor: "#ffffff",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  boxShadow: "0 4px 14px rgba(0, 0, 0, 0.08)",
                },
                "&.Mui-focused": {
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.12)",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              }}
            >
              <MenuItem value="" disabled>
                -- Select Target Role --
              </MenuItem>
              {ROLE_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </Box>
          {/* Step 2: Target Users List */}
          {selectedRole && (
            <Box className="space-y-3">
              <Box className="flex justify-between items-center">
                <Typography className="text-sm font-semibold text-gray-900">
                  Select Recipients ({selectedTargetIds.length} /{" "}
                  {targets.length} Available)
                  <span className="text-xs font-normal text-gray-500 ml-2">
                    (Max 20 at a time)
                  </span>
                </Typography>
                {targets.length > 0 && (
                  <Button
                    size="small"
                    onClick={handleSelectAllTargets}
                    sx={{
                      textTransform: "none",
                      fontWeight: "normal",
                      color: "#0D80F2",
                    }}
                  >
                    {selectedTargetIds.length === Math.min(targets.length, 20)
                      ? "Deselect All"
                      : "Select Top 20"}
                  </Button>
                )}
              </Box>

              {targetsLoading ? (
                <Box className="flex justify-center py-8">
                  <CircularProgress size={30} style={{ color: "#0D80F2" }} />
                </Box>
              ) : targets.length === 0 ? (
                <Typography className="text-center py-6 text-gray-500 bg-gray-50 rounded-2xl border border-gray-100">
                  No active users found for this role.
                </Typography>
              ) : (
                <Box className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-55 overflow-y-auto p-2 rounded-2xl bg-gray-50/50">
                  {targets.map((t) => {
                    const isSelected = selectedTargetIds.includes(t.id);
                    return (
                      <Box
                        key={t.id}
                        onClick={() => toggleTargetSelect(t.id)}
                        className={`relative cursor-pointer p-3 rounded-xl flex flex-col items-center text-center transition-all duration-200 ${
                          isSelected
                            ? "shadow-xl  bg-green-50/40"
                            : "bg-white hover:border-blue-300 shadow-2xl hover:shadow-sm"
                        }`}
                      >
                        {isSelected && (
                          <Box className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              strokeWidth="3.5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </Box>
                        )}

                        <Avatar
                          src={getAvatarUrl(t.profilePic)}
                          className="w-10 h-10 mb-1.5 bg-[#0D80F2] text-xs font-bold text-white shadow-sm"
                        >
                          {t.name.charAt(0)}
                        </Avatar>

                        <Typography className="font-semibold text-xs text-gray-900 truncate w-full">
                          {t.name}
                        </Typography>
                        <Typography className="text-[10px] text-gray-500 truncate w-full font-medium">
                          {t.info}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              )}
            </Box>
          )}

          {/* Step 3: Heading & Message Form */}
          <Collapse in={selectedTargetIds.length > 0}>
            <Box className="flex flex-col gap-5 pt-4 border-t border-gray-100 mt-2">
              <Typography className="text-sm font-semibold text-[#0D80F2] tracking-wide">
                Notification Content ({selectedTargetIds.length} Recipient
                {selectedTargetIds.length > 1 ? "s" : ""} Selected)
              </Typography>

              {/* Heading Input */}
              <TextField
                fullWidth
                size="small"
                label="Heading"
                placeholder="Enter reminder title/heading..."
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "16px",
                    backgroundColor: "#ffffff",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      boxShadow: "0 4px 14px rgba(0, 0, 0, 0.08)",
                    },
                    "&.Mui-focused": {
                      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.12)",
                    },
                    "& fieldset": {
                      border: "none",
                    },
                  },
                }}
              />

              {/* Message Textarea */}
              <TextField
                fullWidth
                size="small"
                label="Message"
                multiline
                rows={3}
                placeholder="Enter your reminder message details..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "16px",
                    backgroundColor: "#ffffff",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      boxShadow: "0 4px 14px rgba(0, 0, 0, 0.08)",
                    },
                    "&.Mui-focused": {
                      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.12)",
                    },
                    "& fieldset": {
                      border: "none",
                    },
                  },
                }}
              />
            </Box>
          </Collapse>
        </DialogContent>

        <DialogActions className="p-5 border-t border-gray-200">
          <Button
            onClick={() => setIsCreateOpen(false)}
            className="rounded-xl px-5 text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={isSending || selectedTargetIds.length === 0}
            onClick={handleSendReminder}
            className="rounded-xl px-6 bg-[#0D80F2] hover:bg-blue-600 font-semibold shadow-none"
            startIcon={
              isSending ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <i className="ri-send-plane-fill" />
              )
            }
          >
            {isSending ? "Sending..." : "Send Reminder"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── DETAIL MODAL ── */}
      <Dialog
        open={Boolean(selectedReminder)}
      onClose={(_, reason) => {
    if (reason === "backdropClick") return;  
    setSelectedReminder(null);
  }}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            className: "rounded-2xl shadow-2xl ",
          },
        }}
      >
        <DialogTitle className="font-bold  text-white bg-blue-400 text-[18px] py-4 px-6">
          Reminder Details
        </DialogTitle>
        <DialogContent className="p-6 space-y-5">
          <Box className="grid grid-cols-2 gap-4 shadow-2xl bg-gray-50 p-4 rounded-2xl mt-4">
            <Box>
              <Typography className="text-xs font-medium text-gray-500">
                Recipient Type
              </Typography>
              <Typography className="font-bold mt-1 uppercase text-blue-500 text-[14px]">
                {selectedReminder?.notifyType}
              </Typography>
            </Box>
            <Box>
              <Typography className="text-xs font-medium text-gray-500">
                Recipient Name
              </Typography>
              <Typography className="font-bold mt-1 text-blue-500 text-[14px]">
                {selectedReminder?.notifyToDetails?.name}
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography className="text-xs font-medium text-gray-500 mb-1">
              Heading
            </Typography>
            <Typography className="font-bold text-[16px] text-gray-900">
              {selectedReminder?.heading}
            </Typography>
          </Box>

          <Box>
            <Typography className="text-xs font-medium text-gray-500 mb-2">
              Message
            </Typography>
            <Box className="p-4 bg-gray-50 rounded-2xl   whitespace-pre-wrap text-[14px] text-gray-800 leading-relaxed shadow-2xl">
              {selectedReminder?.message}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions className="p-5 border-t border-gray-200">
          <Button
            variant="contained"
            className="rounded-xl px-6 py-2 shadow-none font-semibold text-sm bg-blue-500"
            onClick={() => setSelectedReminder(null)}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── DELETE DIALOG ── */}
      <Dialog
        open={Boolean(deleteId)}
      onClose={(_, reason) => {
    if (reason === "backdropClick") return;  
    setDeleteId(null);
  }}
        slotProps={{
          paper: {
            className: "rounded-2xl shadow-2xl",
          },
        }}
      >
        <DialogTitle className="font-bold text-[18px] text-red-500 px-6 pt-6 pb-2">
          Delete Reminder?
        </DialogTitle>
        <DialogContent className="px-6 pb-2">
          <Typography className="text-[14px] text-gray-600">
            Are you sure you want to delete this reminder log? This action is
            permanent.
          </Typography>
        </DialogContent>
        <DialogActions className="p-6">
          <Button
            onClick={() => setDeleteId(null)}
            className="rounded-xl text-gray-600"
          >
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            disabled={deleting}
            onClick={handleDelete}
            className="rounded-xl font-semibold px-5 shadow-none"
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RemindersList;