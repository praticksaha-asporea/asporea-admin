import React from "react";
import {
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Pagination,
  Avatar,
} from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  MessageCircle,
  Mail,
  CalendarPlus,
  CalendarClock,
  CalendarCheck,
  User2,
} from "lucide-react";
import { CamelCase } from "../../utils/common";
import type{ CandidateRow } from "../../types/object.types";
import { useDashboardTable } from "./useDashboardTable";

dayjs.extend(relativeTime);

interface DashboardTableProps {
  rows: CandidateRow[];
  loading: boolean;
  error: string | null;
  isFoe: boolean;
  page: number;
  totalPages: number;
  setPage: (val: number) => void;
  openScheduleModal: (
    candidate: CandidateRow,
    isReschedule: boolean,
    phase: "pre" | "assess"
  ) => void;
  openCommModal: (candidate: CandidateRow, mode: "chat" | "email") => void;
  onViewCandidate: (id: string) => void;
  onPreviewImage: (url: string) => void;
}

const resolveFileSrc = (path?: string) => {
  if (!path) return "/avatar.png";
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("data:")
  )
    return path;
  const BACKEND_BASE =
    import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:3000";
  return `${BACKEND_BASE}${path.startsWith("/") ? path : `/${path}`}`;
};

const DashboardTable: React.FC<DashboardTableProps> = ({
  rows,
  loading,
  error,
  isFoe,
  page,
  totalPages,
  setPage,
  openScheduleModal,
  openCommModal,
  onViewCandidate,
  onPreviewImage,
}) => {
  const {
    getStatusBadge,
    getVisitChipColor,
    getVisitLabel,
    responsiveTableSx,
    preRescheduleStatuses,
    assessScheduleStatuses,
    cols,
  } = useDashboardTable(isFoe);

  return (
    <>
      <TableContainer
        component={Paper}
        className="shadow-xl w-full"
        sx={responsiveTableSx}
      >
        <Table size="small">
          <TableHead>
            <TableRow className="resp-thead">
              {cols.map((head, i) => (
                <TableCell
                  key={i}
                  align={
                    head === "Status" || head === "Token"
                      ? "center"
                      : head === "Actions"
                      ? "right"
                      : "left"
                  }
                  className="py-3 px-2 font-semibold bg-(--mui-palette-primary) text-(--mui-palette-secondary-main) text-[12px] leading-tight"
                >
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={cols.length} className="text-center py-10">
                  <CircularProgress size={28} />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={cols.length}
                  className="text-center py-8 text-red-500"
                >
                  {error}
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={cols.length}
                  className="text-center py-8 text-gray-400"
                >
                  No candidates found
                </TableCell>
              </TableRow>
            ) : (
              rows.map((candidate: any) => (
                <TableRow
                  key={candidate._id}
                  hover
                  className="resp-row transition-colors"
                >
                  <TableCell
                    className="resp-cell py-2! px-2!"
                    data-label="Candidate"
                  >
                    <Box className="flex items-center gap-3 min-w-40">
                      <Avatar
                        src={resolveFileSrc(candidate.profilePic)}
                        sx={{
                          width: 42,
                          height: 42,
                          cursor: "pointer",
                          border: "2px solid #e2e8f0",
                        }}
                        className="hover:scale-105 transition-transform shadow-sm"
                        onClick={() =>
                          onPreviewImage(resolveFileSrc(candidate.profilePic))
                        }
                      />
                      <Box>
                        <Typography className="font-medium tracking-wide text-[13px] leading-tight text-(--mui-palette-primary)">
                          {candidate?.name}
                        </Typography>
                        <Typography className="text-[11px] mt-1 text-(--mui-palette-text-secondary) font-medium">
                          {candidate.inqNo}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell
                    className="resp-cell py-2! px-2! text-[12px]"
                    data-label="Stage"
                  >
                    <span className="wrap-break-word line-clamp-2">
                      {candidate.stage}
                    </span>
                  </TableCell>

                  <TableCell
                    className="resp-cell py-2! px-2!"
                    data-label="Visit Type"
                  >
                    <Chip
                      label={getVisitLabel(candidate.visitType)}
                      color={getVisitChipColor(candidate.visitType)}
                      size="small"
                      variant="outlined"
                      className="text-[10px] h-5.5"
                    />
                  </TableCell>

                  {isFoe && (
                    <TableCell
                      className="resp-cell py-2! px-2! text-[12px] font-medium text-(--mui-palette-primary)"
                      data-label="Assigned TAC"
                    >
                      {candidate.assignedTacName || "Unassigned"}
                    </TableCell>
                  )}

                  <TableCell
                    align="center"
                    className="resp-cell py-2! px-2! text-[12px]"
                    data-label="Token"
                  >
                    {candidate.token ?? (
                      <span className="text-gray-400">—</span>
                    )}
                  </TableCell>

                  <TableCell
                    align="center"
                    className="resp-cell py-2! px-2!"
                    data-label="Status"
                  >
                    <Box
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] tracking-wide font-normal whitespace-nowrap ${getStatusBadge(
                        candidate.status
                      )}`}
                    >
                      {CamelCase(candidate.status)}
                    </Box>
                  </TableCell>

                  <TableCell
                    className="resp-cell py-2! translate-x-3.5 px-2! text-[11px] text-gray-500"
                    data-label="Last Activity"
                  >
                    {dayjs(candidate.lastActivity).fromNow()}
                  </TableCell>

                  <TableCell
                    align="right"
                    className="resp-cell py-2! px-2!"
                    data-label="Actions"
                  >
                   <Box className="flex gap-1 md:justify-end items-center">
                  
                      <IconButton
                        size="small"
                        title="Chat via WhatsApp"
                        onClick={() => openCommModal(candidate, "chat")}
                      >
                        <MessageCircle size={18} className="text-gray-500" />
                      </IconButton>

                       
                      <IconButton
                        size="small"
                        title="Send Email"
                        onClick={() => openCommModal(candidate, "email")}
                      >
                        <Mail size={18} className="text-gray-500" />
                      </IconButton>

               
                      {candidate.status === "inquiry_submitted" && (
                        <IconButton
                          size="small"
                          title="Schedule Pre-Counselling"
                          onClick={() =>
                            openScheduleModal(candidate, false, "pre")
                          }
                        >
                          <CalendarPlus size={18} className="text-blue-500" />
                        </IconButton>
                      )}

                 
                      {(candidate.status === "pre_not_responded" ||
                        preRescheduleStatuses.includes(candidate.status)) && (
                        <IconButton
                          size="small"
                          title="Reschedule Pre-Counselling"
                          onClick={() =>
                            openScheduleModal(candidate, true, "pre")
                          }
                        >
                          <CalendarClock size={18} className="text-orange-500" />
                        </IconButton>
                      )}

                      
                      {assessScheduleStatuses.includes(candidate.status) && (
                        <IconButton
                          size="small"
                          title="Schedule / Reschedule Assessment"
                          onClick={() =>
                            openScheduleModal(candidate, true, "assess")
                          }
                        >
                          <CalendarCheck size={18} className="text-pink-500" />
                        </IconButton>
                      )}

                     
                      <IconButton
                        size="small"
                        title="View Candidate Details"
                        onClick={() => onViewCandidate(candidate._id)}
                      >
                        <User2 size={18} className="text-blue-500" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box className="flex justify-center md:justify-end mt-4">
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_e, val) => setPage(val)}
            color="primary"
            size="small"
          />
        </Box>
      )}
    </>
  );
};

export default DashboardTable;