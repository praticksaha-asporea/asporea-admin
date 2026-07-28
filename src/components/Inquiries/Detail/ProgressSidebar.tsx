import React from "react";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { CamelCase } from "../../../utils/common";
import { useProgressSidebar } from "./hooks/useProgressSidebar";
import type { IBranch, IUser } from "../../../types/models.types";

interface ProgressSidebarProps {
  candidate: any;
  isFoe: boolean;
  branchId: IBranch | any;
  consultantId: IUser | any;
  tacList: IUser[];
  escalateTo: string;
  setEscalateTo: (val: string) => void;
  currentUser: IUser | any;
}

const ProgressSidebar: React.FC<ProgressSidebarProps> = ({
  candidate,
  isFoe,
  branchId,
  consultantId,
  tacList,
  escalateTo,
  setEscalateTo,
  currentUser,
}) => {
  const { escalationForm, fe, fh } = useProgressSidebar(
    candidate,
    escalateTo,
    setEscalateTo
  );

  return (
    <Card className="p-5 sticky top-6 rounded-xl shadow-2xl">
       <h1 className="mb-5 font-medium tracking-wide text-gray-500">
        Progress
       </h1>
      <Box className="mb-4 space-y-2">
        <Typography className="text-[10px] text-(--mui-palette-text-primary)">
          Branch:{" "}
          <span className="font-medium tracking-wider text-sm text-gray-600">
            {(branchId as any)?.title ?? "—"}
          </span>
        </Typography>
        <Typography className="text-[12px] text-(--mui-palette-text-primary)">
          Consultant:{" "}
          <span className="font-medium text-sm tracking-wider text-gray-600">
            {!isFoe &&
            (consultantId?._id?.toString() === currentUser?.id ||
              consultantId?._id?.toString() === currentUser?._id)
              ? "You"
              : consultantId?.firstName
              ? `${consultantId.firstName} ${consultantId.lastName ?? ""}`.trim()
              : "—"}
          </span>
        </Typography>
        <Typography className="text-[12px] text-(--mui-palette-text-primary)">
          Status:{" "}
          <span className="font-medium text-sm tracking-wider text-gray-600">
            {CamelCase(candidate?.status ?? "")}
          </span>
        </Typography>
        <Typography className="text-[12px] text-(--mui-palette-text-primary)">
          Experience:{" "}
          <span className="font-medium text-sm tracking-wider text-gray-600">
            {CamelCase(candidate?.experience?.type ?? "Not set")}
          </span>
        </Typography>
      </Box>

      {!isFoe && (
        <form onSubmit={escalationForm.handleSubmit}>
          <FormControl fullWidth className="mb-4" error={fe("toId")}>
            <InputLabel>Escalate</InputLabel>
            <Select
              label="Escalate"
              name="toId"
              value={escalationForm.values.toId}
              onChange={(e) => {
                escalationForm.handleChange(e);
                setEscalateTo(e.target.value as string);
              }}
              onBlur={escalationForm.handleBlur}
            >
              <MenuItem value="">-- Select TAC --</MenuItem>
              {tacList.map((tac) => (
                <MenuItem
                  key={tac._id?.toString()}
                  value={tac._id?.toString()}
                >
                  {`${tac.firstName} ${tac.lastName ?? ""}`.trim()}
                </MenuItem>
              ))}
            </Select>
            {fh("toId") && <FormHelperText>{fh("toId")}</FormHelperText>}
          </FormControl>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Reason *"
            name="reason"
            placeholder="Enter reason for escalation..."
            className="mb-4"
            slotProps={{ input: { className: "text-[14px]" } }}
            value={escalationForm.values.reason}
            onChange={escalationForm.handleChange}
            onBlur={escalationForm.handleBlur}
            error={fe("reason")}
            helperText={fh("reason")}
          />
          <Typography className="text-[12px] text-(--mui-palette-error-light) mb-4 font-medium">
            NOTE: This will need approval of your manager.
          </Typography>
          <Box className="flex justify-center">
            <Button
              variant="contained"
              type="submit"
              disabled={escalationForm.isSubmitting}
              className="w-full normal-case rounded-xl shadow-md"
            >
              {escalationForm.isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Submit"
              )}
            </Button>
          </Box>
        </form>
      )}
    </Card>
  );
};

export default ProgressSidebar;