import React from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { useDashboardCommunication } from "./useDashboardCommunication";
import type { CandidateRow } from "../../types/object.types";

interface CommunicationModalProps {
  open: boolean;
  onClose: () => void;
  candidate: CandidateRow | null;
  mode: "chat" | "email" | null;
}

const DashboardCommunicationModal: React.FC<CommunicationModalProps> = ({
  open,
  onClose,
  candidate,
  mode,
}) => {
  const { handleSend, isChat, isEmail, loading, message, setMessage } =
    useDashboardCommunication({ candidate, onClose, mode });

  return (
   <Dialog
   open={open}
   onClose={loading ? undefined : onClose}
   maxWidth="sm"
   fullWidth
   slotProps={{
    paper: {
      className: "rounded-[20px] p-2",
    },
  }}
>
      <DialogContent>
        <Box className="flex justify-between items-center mb-4">
          <Typography
            variant="h5"
            className="font-medium text-(--mui-palette-primary)"
          >
            {isChat ? "Send WhatsApp Message" : "Send Email"}
          </Typography>
          <IconButton onClick={onClose} disabled={loading} size="small">
            <i className="ri-close-line text-2xl" />
          </IconButton>
        </Box>

        <Box className="bg-(--mui-palette-primary) p-4 rounded-xl mb-6 shadow-2xl">
          <Typography
            variant="subtitle1"
            className="font-medium text-(--mui-palette-primary) mb-2"
          >
            {candidate?.name}
          </Typography>

          <Typography
            variant="body2"
            className={`mb-1 flex items-center gap-2 ${
              isChat
                ? "font-bold text-(--mui-palette-success-main) bg-(--mui-palette-primary) p-1 rounded w-fit"
                : "text-(--mui-palette-primary)"
            }`}
          >
            <i className="ri-phone-line" />
            {candidate?.contact?.whatsapp || candidate?.contact?.phone || "N/A"}
          </Typography>

          <Typography
            variant="body2"
            className={`flex items-center gap-2 ${
              isEmail
                ? "font-bold text-(--mui-palette-info-main) bg-(--mui-palette-primary) p-1 rounded w-fit"
                : "text-(--mui-palette-primary)"
            }`}
          >
            <i className="ri-mail-line" /> {candidate?.contact?.email || "N/A"}
          </Typography>
        </Box>

        <Box className="mt-2">
          <TextField
            fullWidth
            multiline
            rows={5}
            label="Message"
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            variant="outlined"
            disabled={loading}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
              },
            }}
          />
        </Box>

        <Box className="mt-6 flex justify-end">
          <Button
            variant="contained"
            onClick={handleSend}
            disabled={loading}
            className={`rounded-xl px-6 py-2.5 normal-case font-semibold shadow-md ${
              isChat
                ? "bg-(--mui-palette-success-main) hover:bg-(--mui-palette-success-dark)"
                : "bg-(--mui-palette-primary-main) hover:bg-(--mui-palette-primary-dark)"
            }`}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : isChat ? (
              <>
                <i className="ri-whatsapp-fill text-xl mr-2" /> Send via WhatsApp
              </>
            ) : (
              <>
                <i className="ri-send-plane-fill text-lg mr-2" /> Send Email
              </>
            )}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DashboardCommunicationModal;