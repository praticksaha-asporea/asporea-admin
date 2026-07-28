import React from "react";
import dayjs from "dayjs";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { CamelCase, isWithinSchedule } from "../../../utils/common";
import { usePreCounselling } from "./hooks/usePreCounselling";
import type {
  BranchType,
  CandidateLead,
  ConsultantType,
} from "../../../types/payloads/Candidate.types";
import type { IAssignment } from "../../../types/models.types";
import type { IBranch } from "../../../types/models.types";
import type { IUser } from "../../../types/models.types";

const resolveFileSrc = (path?: string | null) => {
  if (!path) return "";
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("data:") ||
    path.startsWith("blob:")
  ) {
    return path;
  }
  const BACKEND_BASE =
    import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:3000";
  return `${BACKEND_BASE}${path.startsWith("/") ? path : `/${path}`}`;
};

interface PreCounsellingFormProps {
  candidate: CandidateLead;
  inqAssign: IAssignment;
  branchId: IBranch;
  consultantId: IUser;
  source: { type?: string; refType?: string; refName?: string };
  preferences?: {
    branchId?: BranchType | string;
    consultantId?: ConsultantType | string;
    visitType?: string;
  };
  candidatePhone: string;
}

const PreCounsellingForm: React.FC<PreCounsellingFormProps> = ({
  candidate: c,
  inqAssign,
  branchId,
  consultantId,
  source,
  preferences,
  candidatePhone,
}) => {
  const {
    preForm,
    isPreLocked,
    setIsPreLocked,
    previewUrl,
    isPreviewOpen,
    setIsPreviewOpen,
    isPdf,
    isDragging,
    fileInputRef,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    onFileInputChange,
    updateAssignmentStatus,
  } = usePreCounselling(inqAssign, candidatePhone);

  const fullPreviewUrl = resolveFileSrc(previewUrl);

  return (
    <Card className="p-6 rounded-xl shadow-2xl">
      <form onSubmit={preForm.handleSubmit}>
        <h1 className="text-xl text-center font-medium mb-5 text-gray-500">
          {" "}
          Pre-Counselling
        </h1>
        <Stack spacing={3}>
          <Grid container spacing={3}>
            <Grid size={12}>
              <FormControl>
                <FormLabel>Status</FormLabel>
                <RadioGroup
                  row
                  name="preStatus"
                  value={preForm.values.preStatus}
                  onChange={(e, value) => {
                    setIsPreLocked(
                      !(preForm.isSubmitting || isWithinSchedule(inqAssign)) &&
                        (value === "completed" ||
                          value === "rejected" ||
                          value === "queued") &&
                        inqAssign?.status !== "completed" &&
                        inqAssign?.status !== "rejected" &&
                        inqAssign?.status !== "queued",
                    );
                    return preForm.handleChange(e);
                  }}
                >
                  <FormControlLabel
                    value="assigned"
                    control={<Radio />}
                    label="Scheduled"
                    disabled={preForm.values.preStatus !== "assigned"}
                  />
                  {inqAssign?.schedule?.method === "on" && (
                    <FormControlLabel
                      value="contacted"
                      control={<Radio readOnly />}
                      label="Contacted"
                      disabled
                    />
                  )}
                  {inqAssign?.schedule?.method === "off" && (
                    <FormControlLabel
                      value="queued"
                      control={<Radio />}
                      label="Queued"
                      disabled={
                        preForm.values.preStatus === "rejected" ||
                        preForm.values.preStatus === "completed"
                      }
                    />
                  )}
                  <FormControlLabel
                    value="completed"
                    control={<Radio />}
                    label="Completed"
                    disabled={inqAssign?.status === "rejected"}
                  />
                  <FormControlLabel
                    value="not_responded"
                    control={<Radio readOnly />}
                    label="Not Responded / Unattended"
                    disabled
                  />
                  <FormControlLabel
                    value="rejected"
                    control={<Radio />}
                    label="Rejected"
                    disabled={inqAssign?.status === "completed"}
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, lg: 6 }}>
              <FormControl>
                <FormLabel>Visit Method</FormLabel>
                <RadioGroup
                  row
                  value={
                    inqAssign?.schedule?.method === "on" ? "remote" : "office"
                  }
                >
                  <FormControlLabel
                    value="office"
                    control={<Radio />}
                    label="In-Office"
                    disabled={inqAssign?.schedule?.method === "on"}
                  />
                  <FormControlLabel
                    value="remote"
                    control={<Radio />}
                    label="Remote"
                    disabled={inqAssign?.schedule?.method === "off"}
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, lg: 6 }}>
              <TextField
                fullWidth
                label="Branch"
                disabled
                value={branchId?.title ?? "—"}
              />
            </Grid>
            <Grid size={{ xs: 12, lg: 6 }}>
              <TextField
                fullWidth
                label="Assigned Consultant"
                disabled
                value={
                  consultantId?.firstName
                    ? `${consultantId.firstName} ${
                        consultantId.lastName ?? ""
                      }`.trim()
                    : "—"
                }
              />
            </Grid>
            <Grid size={{ xs: 12, lg: 6 }}>
              <TextField
                fullWidth
                label="Source"
                disabled
                value={CamelCase(source?.type ?? "")}
              />
            </Grid>

            {source?.refType && (
              <Grid size={{ xs: 12, lg: 6 }}>
                <TextField
                  fullWidth
                  label="Referred By (Type)"
                  disabled
                  value={CamelCase(source.refType ?? "")}
                />
              </Grid>
            )}
            {source?.refName && (
              <Grid size={{ xs: 12, lg: 6 }}>
                <TextField
                  fullWidth
                  label="Referred By (Name)"
                  disabled
                  value={source.refName}
                />
              </Grid>
            )}
            {preferences?.visitType === "offline" && (
              <Grid size={{ xs: 12, lg: 6 }}>
                <TextField
                  fullWidth
                  label="Token No"
                  value={inqAssign?.token?.number ?? "—"}
                  disabled
                />
              </Grid>
            )}

            <Grid size={{ xs: 12, lg: 6 }}>
              <TextField
                fullWidth
                label="Inquiry Created"
                disabled
                value={
                  c?.lastActivity
                    ? dayjs(c.lastActivity).format("DD/MM/YYYY hh:mm A")
                    : "—"
                }
              />
            </Grid>
            <Grid size={{ xs: 12, lg: 6 }}>
              <TextField
                fullWidth
                label="Scheduled Date"
                disabled
                value={
                  inqAssign?.schedule?.date
                    ? dayjs(inqAssign.schedule.date).format("DD/MM/YYYY")
                    : "—"
                }
              />
            </Grid>
            <Grid size={{ xs: 12, lg: 6 }}>
              <TextField
                fullWidth
                label="Scheduled Time"
                disabled
                value={
                  inqAssign?.schedule?.from
                    ? inqAssign.schedule.from +
                      (inqAssign.schedule.to
                        ? " – " + inqAssign.schedule.to
                        : "")
                    : "—"
                }
              />
            </Grid>

            <Grid size={12}>
              <Box className="flex justify-end gap-3">
                {inqAssign && inqAssign.schedule?.method === "on" && (
                  <>
                    <Button
                      variant="contained"
                      className="bg-[--mui-palette-error-main]! hover:bg-[--mui-palette-error-dark]! text-white! text-[13px]! font-bold! rounded-lg! normal-case!"
                      disabled={
                        (inqAssign.status !== "assigned" &&
                          preForm.values.preStatus !== "contacted") ||
                        !isWithinSchedule(inqAssign) ||
                        preForm.values.preStatus === "completed" ||
                        preForm.values.preStatus === "rejected"
                      }
                      onClick={() => updateAssignmentStatus("not_responded")}
                    >
                      Not Responded
                    </Button>
                    <Button
                      variant="contained"
                      className="bg-green-500! hover:bg-green-600! text-white! text-[13px]! font-bold! rounded-lg! normal-case!"
                      disabled
                      onClick={() => updateAssignmentStatus("contacted")}
                    >
                      Call
                    </Button>
                  </>
                )}
                {inqAssign && inqAssign.schedule?.method === "off" && (
                  <Button variant="contained" disabled>
                    Queue
                  </Button>
                )}
                {preForm?.values?.preStatus === "queued" && (
                  <Button
                    variant="contained"
                    type="button"
                    className="bg-[--mui-palette-error-main] hover:bg-[--mui-palette-error-dark]! text-white! text-[13px]! font-bold! rounded-lg! normal-case!"
                    disabled={isPreLocked}
                    onClick={() => updateAssignmentStatus("not_responded")}
                  >
                    Absent
                  </Button>
                )}
              </Box>
            </Grid>

            {["completed", "rejected", "queued"].includes(
              preForm?.values?.preStatus,
            ) && (
              <>
                <Grid size={{ xs: 12, lg: 6 }}>
                  <Typography className="text-[13px] font-semibold mb-1.5">
                    Additional Details of Candidate
                  </Typography>
                  <TextField
                    multiline
                    rows={3}
                    fullWidth
                    name="additionalDetails"
                    value={preForm.values.additionalDetails}
                    onChange={preForm.handleChange}
                    onBlur={preForm.handleBlur}
                    error={
                      preForm.submitCount > 0 &&
                      Boolean(preForm.errors.additionalDetails)
                    }
                    helperText={
                      preForm.submitCount > 0
                        ? (preForm.errors.additionalDetails as string)
                        : undefined
                    }
                    slotProps={{ input: { className: "text-[14px]" } }}
                    disabled={isPreLocked}
                  />
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }}>
                  <Typography className="text-[13px] font-semibold mb-1.5">
                    Specific Notes (During Pre-Counselling)
                  </Typography>
                  <TextField
                    multiline
                    rows={3}
                    fullWidth
                    name="specificNotes"
                    value={preForm.values.specificNotes}
                    onChange={preForm.handleChange}
                    onBlur={preForm.handleBlur}
                    slotProps={{ input: { className: "text-[14px]" } }}
                    disabled={isPreLocked}
                  />
                </Grid>
                <Grid size={12}>
                  <Typography className="text-[13px] font-semibold mb-1.5">
                    Advice
                  </Typography>
                  <TextField
                    multiline
                    rows={3}
                    fullWidth
                    name="advice"
                    value={preForm.values.advice}
                    onChange={preForm.handleChange}
                    onBlur={preForm.handleBlur}
                    slotProps={{ input: { className: "text-[13px]" } }}
                    disabled={isPreLocked}
                  />
                </Grid>

                <Grid size={{ xs: 12, lg: 6 }} id="resumeFile">
                  <Typography className="text-[12px] font-semibold mb-1.5">
                    Upload Resume
                  </Typography>
                  <Box
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all h-55 ${
                      isDragging
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:bg-[--mui-palette-secondary-lightOpacity]"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      hidden
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={onFileInputChange}
                      disabled={isPreLocked}
                    />
                    <i className="ri-upload-cloud-2-line text-4xl text-blue-500 mb-3" />
                    <Typography className="font-semibold text-sm">
                      Drag & Drop Resume
                    </Typography>
                    <Typography className="text-xs text-gray-500 mt-1">
                      PDF, JPG, JPEG, PNG
                    </Typography>
                  </Box>
                </Grid>

                {previewUrl && (
                  <Grid size={{ xs: 12, lg: 6 }}>
                    <Typography className="text-[12px] font-semibold mb-1.5">
                      Resume Preview
                    </Typography>
                    <Box
                      onClick={() => setIsPreviewOpen(true)}
                      className="rounded-xl h-55 bg-gray-50 overflow-hidden relative cursor-pointer group  transition-all"
                    >
                      {isPdf ? (
                        <Box className="w-full h-full pointer-events-none relative">
                          <iframe
                            src={fullPreviewUrl}
                            className="w-full h-full "
                          />
                          <Box className="absolute inset-0 bg-transparent group-hover:bg-black/10 transition-colors flex items-center justify-center">
                            <Box className="bg-white/90 text-blue-600 px-3 py-1.5 rounded-lg shadow-sm font-semibold text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                              Click to view document
                            </Box>
                          </Box>
                        </Box>
                      ) : (
                        <Box className="w-full h-full flex items-center justify-center bg-white relative">
                          <img
                            src={fullPreviewUrl} // 🚀 Updated here
                            alt="Resume Preview"
                            className="w-full h-full object-contain"
                          />
                          <Box className="absolute inset-0 bg-transparent group-hover:bg-black/10 transition-colors flex items-center justify-center">
                            <Box className="bg-white/90 text-blue-600 px-3 py-1.5 rounded-lg shadow-sm font-semibold text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                              Click to view image
                            </Box>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </Grid>
                )}
              </>
            )}
          </Grid>

          {["completed", "rejected", "queued"].includes(
            preForm?.values?.preStatus,
          ) && (
            <Box className="flex justify-end gap-3 mt-4 pt-6">
              <Button
                variant="contained"
                type="submit"
                disabled 
               >
                {preForm.isSubmitting ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Send As Prescription"
                )}
              </Button>
            </Box>
          )}
        </Stack>
      </form>

      {/* Modal Dialog */}
      <Dialog
        open={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            className: "rounded-[20px] relative overflow-hidden",
          },
        }}
      >
        <Box className="flex items-center justify-between px-5 py-3 ">
          <Typography variant="subtitle1" className="font-bold">
            Resume Preview
          </Typography>
          <Box className="flex items-center gap-2">
            {previewUrl && (
              <a
                href={fullPreviewUrl} // 🚀 Updated here
                download="Resume"
                target="_blank"
                rel="noreferrer"
              >
                <Button
                  size="small"
                  variant="text"
                  startIcon={<i className="ri-download-2-line" />}
                >
                  Download
                </Button>
              </a>
            )}
            <IconButton size="small" onClick={() => setIsPreviewOpen(false)}>
              <i className="ri-close-line text-xl" />
            </IconButton>
          </Box>
        </Box>
        <DialogContent className="p-0 bg-gray-50 flex items-center justify-center min-h-[60vh]">
          {previewUrl && isPdf ? (
            <iframe
              src={fullPreviewUrl} // 🚀 Updated here
              title="Resume PDF Preview"
              className="w-full min-h-[75vh] border-0"
            />
          ) : (
            previewUrl && (
              <img
                src={fullPreviewUrl} // 🚀 Updated here
                alt="Resume Image Preview"
                className="max-w-full max-h-[75vh] object-contain p-4"
              />
            )
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default PreCounsellingForm;
