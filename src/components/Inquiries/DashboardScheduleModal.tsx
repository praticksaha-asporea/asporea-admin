import React from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import type { CandidateRow, tacData, Slot } from "../../types/object.types";

interface DashboardScheduleModalProps {
  modalOpen: boolean;
  setModalOpen: (val: boolean) => void;
  targetLead: CandidateRow | null;
  tacList: tacData[];
  selectedTac: tacData | string;
  setSelectedTac: (val: string) => void;
  date: string;
  setDate: (val: string) => void;
  todayStr: string;
  slotsLoading: boolean;
  slots: Slot[];
  selectedSlot: Slot | null;
  setSelectedSlot: (val: Slot) => void;
  handleBookSlot: () => void;
  bookingLoading: boolean;
  schedulePhase: "pre" | "assess";
}

const DashboardScheduleModal: React.FC<DashboardScheduleModalProps> = ({
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
}) => {
  const currentTacValue =
    typeof selectedTac === "object" ? (selectedTac as any)?._id || "" : selectedTac || "";

  return (
    <Dialog
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          className: "rounded-xl p-2",
        },
      }}
    >
      <DialogTitle className="font-bold text-[20px]">
        {schedulePhase === "assess"
          ? "Schedule / Reschedule Assessment"
          : targetLead?.status === "pre_not_responded"
          ? "Reschedule Pre-Counselling"
          : "Schedule Pre-Counselling"}
      </DialogTitle>
      <DialogContent className="flex flex-col gap-5 pt-4">
        <Box className="mb-2">
          <Typography variant="body2" className="text-gray-500">
            Candidate
          </Typography>
          <Typography className="font-bold">
            {targetLead?.name} ({targetLead?.inqNo})
          </Typography>
        </Box>

        <FormControl fullWidth size="small">
          <InputLabel id="select-tac-label">Select Assigning TAC</InputLabel>
          <Select
            labelId="select-tac-label"
            value={currentTacValue}
            onChange={(e) => setSelectedTac(e.target.value as string)}
            label="Select Assigning TAC"
          >
            {tacList.length === 0 ? (
              <MenuItem disabled value="">
                No TAC available in this branch
              </MenuItem>
            ) : (
              tacList.map((tac) => (
                <MenuItem key={tac._id} value={tac._id}>
                  {tac.firstName} {tac.lastName ?? ""}{" "}
                  {tac.counterNo ? `(Counter: ${tac.counterNo})` : ""}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          type="date"
          label="Select Date"
          slotProps={{
            inputLabel: { shrink: true },
            htmlInput: { min: todayStr },
          }}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        {currentTacValue && (
          <Box>
            <Typography variant="subtitle2" className="mb-3 font-bold">
              Available Time Slots
            </Typography>
            <Box className="flex flex-wrap gap-4">
              {slotsLoading ? (
                <Typography className="mb-4 text-sm text-gray-500">
                  Loading slots...
                </Typography>
              ) : slots.length === 0 ? (
                <Typography className="text-sm text-gray-500">
                  No slots available for this date.
                </Typography>
              ) : (
                slots.map((slot, index) => (
                  <Button
                    key={index}
                    disabled={!slot.available}
                    variant={
                      selectedSlot?.time === slot.time ? "contained" : "outlined"
                    }
                    onClick={() => slot.available && setSelectedSlot(slot)}
                    className="normal-case rounded-[20px] px-6"
                  >
                    {slot.time}
                  </Button>
                ))
              )}
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions className="px-5">
        <Button onClick={() => setModalOpen(false)} className="normal-case">
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={!selectedSlot || !currentTacValue || bookingLoading}
          onClick={handleBookSlot}
          className="rounded-lg px-6 normal-case shadow-md"
        >
          {bookingLoading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Confirm & Book"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DashboardScheduleModal;