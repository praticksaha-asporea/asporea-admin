import React from "react";
import {
  Box,
  Button,
  Card,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { isWithinSchedule } from "../../../utils/common";
import CandidateDocumentsSection from "../CandidateDocumentsSection";
import { useAssessmentFormSection } from "./hooks/useAssessmentFormSection";
import type { ExpType } from "../../../types/object.types";
import type { CandidateLead } from "../../../types/payloads/Candidate.types";
import type { IAssignment } from "../../../types/models.types";

interface AssessmentFormSectionProps {
  candidate: CandidateLead;
  assessAssign: IAssignment;
  isFoe: boolean;
  branchTitle: string;
}

const AssessmentFormSection: React.FC<AssessmentFormSectionProps> = ({
  candidate,
  assessAssign,
  isFoe,
  branchTitle,
}) => {
  const {
    assessBasicForm,
    isPreLocked,
    setIsPreLocked,
    docStatus,
    setDocStatus,
    expStatus,
    setExpStatus,
    expType,
    setExpType,
    techStatus,
    setTechStatus,
    classifyExp,
    setClassifyExp,
    showRejectBox,
    setShowRejectBox,
    remarksText,
    setRemarksText,
    expRFT,
    expRequestTech,
    showAssessmentForm,
    handleSaveAll,
    updateExpStatus,
  } = useAssessmentFormSection(candidate, assessAssign);

  return (
    <Card className="p-6 rounded-xl shadow-xl mt-4">
      <h1 className="text-2xl text-center font-medium mb-5 text-gray-500">Assessment</h1>
      <Grid container spacing={3}>
        <Grid  size={12}>
          <FormControl>
            <FormLabel className="font-semibold text-(--mui-palette-text-primary)">
              Assessment Status
            </FormLabel>
            <RadioGroup
              row
              name="status"
              value={assessBasicForm.values.status}
              onChange={(e, value) => {
                setIsPreLocked(
                  !(
                    assessBasicForm.isSubmitting ||
                    isWithinSchedule(assessAssign)
                  ) &&
                    (value === "completed" ||
                      value === "rejected" ||
                      value === "queued") &&
                    assessAssign?.status !== "completed" &&
                    assessAssign?.status !== "rejected" &&
                    assessAssign?.status !== "queued"
                );
                return assessBasicForm.handleChange(e);
              }}
            >
              <FormControlLabel
                value="assigned"
                control={<Radio />}
                label="Scheduled"
                disabled={assessBasicForm.values.status !== "assigned"}
              />
              {assessAssign?.schedule?.method === "on" && (
                <FormControlLabel
                  value="contacted"
                  control={<Radio readOnly />}
                  label="Contacted"
                  disabled
                />
              )}
              {assessAssign?.schedule?.method === "off" && (
                <FormControlLabel
                  value="queued"
                  control={<Radio />}
                  label="Queued"
                />
              )}
              <FormControlLabel
                value="completed"
                control={<Radio />}
                label="Completed"
                disabled={assessAssign?.status === "rejected"}
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
                disabled={assessAssign?.status === "completed"}
              />
            </RadioGroup>
          </FormControl>
        </Grid>
<Grid size={{ xs: 12, lg: 6 }}>          
    <FormControl>
            <FormLabel className="font-semibold text-(--mui-palette-text-primary)">
              Visit Option
            </FormLabel>
            <RadioGroup
              row
              value={
                assessAssign?.schedule?.method === "on" ? "remote" : "office"
              }
            >
              <FormControlLabel
                value="office"
                control={<Radio />}
                label="In-Office"
                disabled={assessAssign?.schedule?.method === "on"}
              />
              <FormControlLabel
                value="remote"
                control={<Radio />}
                label="Remote"
                disabled={assessAssign?.schedule?.method === "off"}
              />
            </RadioGroup>
          </FormControl>
        </Grid>
<Grid size={{ xs: 12, lg: 6 }}>          
          <TextField fullWidth label="Branch" disabled value={branchTitle} />
        </Grid>
        {assessAssign?.schedule?.method === "off" && (
     <Grid size={{ xs: 12, lg: 6 }}> 
            <TextField
              fullWidth
              label="Token No"
              disabled
              value={assessAssign?.token?.number || "—"}
            />
          </Grid>
        )}
<Grid size={{ xs: 12, lg: 6 }}>          
          <TextField
            fullWidth
            label="Scheduled Date"
            disabled
            value={
              assessAssign?.schedule?.date
                ? dayjs(assessAssign.schedule.date).format("DD/MM/YYYY")
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
              assessAssign?.schedule?.from
                ? assessAssign.schedule.from +
                  (assessAssign.schedule.to ? " – " + assessAssign.schedule.to : "")
                : "—"
            }
          />
        </Grid>
        <Grid size={12}>
          <Box className="flex justify-center md:justify-end gap-3 mt-2">
            {assessAssign && assessAssign.schedule?.method === "on" && (
              <>
                <Button
                  variant="contained"
                  className="bg-[--mui-palette-error-main]! hover:bg-[--mui-palette-error-dark]! text-white! text-[13px]! font-bold! rounded-lg! normal-case!"
                  disabled
                  
                >
                  Not Responded
                </Button>
                <Button
                  variant="contained"
                   disabled 
                
                >
                  Call
                </Button>
              </>
            )}
            {assessAssign && assessAssign.schedule?.method === "off" && (
              <Button
                variant="contained"
                 disabled
              >
                Queue
              </Button>
            )}
            {assessBasicForm?.values?.status === "queued" && (
              <Button
                variant="contained"
                type="button"
                 disabled 
                
              >
                Absent
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
      {assessBasicForm?.values?.status === "queued" ||
      assessBasicForm?.values?.status === "completed" ||
      assessBasicForm?.values?.status === "rejected" ||
      docStatus !== "uploaded" ? (
        <>
          <Box className="shadow-2xl rounded-xl p-5 mt-6 bg-(--mui-palette-primary)">
          <h1 className="mb-5 text-xl text-gray-600"> Documents Verification</h1>
            <Grid container spacing={3}>
       <Grid size={{ xs: 12, lg: 6 }}>          

                <TextField
                  fullWidth
                  label="Position Applied"
                  disabled
                  value={
                    typeof candidate?.documents?.position === "string"
                      ? candidate.documents.position
                      : candidate?.documents?.position?.title || ""
                  }
                />
              </Grid>
              <Grid size={12}>
                <CandidateDocumentsSection candidate={candidate} />
              </Grid>
              <Grid size={12}>
                <Typography
                  variant="body2"
                  className="mb-2 font-medium text-(--mui-palette-text-primary)"
                >
                  Verification Status
                </Typography>
                <RadioGroup
                  row
                  value={docStatus}
                  onChange={(e) => setDocStatus(e.target.value)}
                >
                  <FormControlLabel
                    value="uploaded"
                    control={<Radio disabled />}
                    label="Uploaded"
                  />
                  <FormControlLabel
                    value="verified"
                    control={<Radio disabled />}
                    label="Verified"
                  />
                  <FormControlLabel
                    value="rejected"
                    control={<Radio disabled />}
                    label="Rejected"
                  />
                </RadioGroup>
                {candidate?.status === "doc_awaiting_approval" && (
                  <Typography
                    variant="caption"
                    className="block mt-2 text-[--mui-palette-warning-main] font-medium"
                  >
                    Documents have been reviewed and are currently awaiting
                    approval from the Team Leader (TL).
                  </Typography>
                )}
              </Grid>
            </Grid>
            <Box className="flex justify-center md:justify-end gap-3 mt-2">
              <Button
                variant="contained"
                 disabled 
                 
              >
                Reject
              </Button>
              <Button
                variant="contained"
                 disabled 
                 
              >
                Verify
              </Button>
              <Button
                variant="contained"
                 disabled 
               >
                Request TL
              </Button>
            </Box>
            {showRejectBox && (
              <Box className="mt-4 p-4 rounded-xl shadow-inner transition-all">
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Specify Rejection Reason *"
                  placeholder="Type here why you are rejecting these documents (e.g., Invalid ID, blurry image)..."
                  value={remarksText}
                  onChange={(e) => setRemarksText(e.target.value)}
                  className="mb-3"
                  slotProps={{ input: { className: "text-[14px]" } }}
                />
                <Box className="flex justify-end gap-2">
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      setShowRejectBox(false);
                      setRemarksText("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    disabled 
                   
                  >
                    Confirm Reject
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
          <Box className="shadow-2xl rounded-xl p-5 mt-4 bg-(--mui-palette-secondary)">
            <Typography className="mb-2 font-bold text-[15px] text-(--mui-palette-text-primary)">
              Experience
            </Typography>
            <RadioGroup
              row
              value={expStatus}
              onChange={(e: any) => setExpStatus(e.target.value)}
            >
              <FormControlLabel
                value="selected"
                control={<Radio disabled />}
                label="Selected"
              />
              <FormControlLabel
                value="verified"
                control={<Radio disabled />}
                label="Verified"
              />
              <FormControlLabel
                value="request_technical"
                control={<Radio disabled />}
                label="Technical Requested"
              />
            </RadioGroup>
            <FormControl fullWidth className="mt-4 md:w-1/2">
              <InputLabel>Experience Type</InputLabel>
              <Select
                value={expType}
                label="Experience Type"
                onChange={(e) => setExpType(e.target.value as ExpType)}
              >
                <MenuItem value="fresher">Fresher</MenuItem>
                <MenuItem value="domestic">Domestic</MenuItem>
                <MenuItem value="abroad">Abroad</MenuItem>
                <MenuItem value="free">Freelance</MenuItem>
              </Select>
            </FormControl>
            <Box className="flex justify-end gap-3 mt-6 mb-2">
              <Button
                variant="contained"
                className="rounded-xl! normal-case! bg-[--mui-palette-error-main] hover:bg-[--mui-palette-error-dark]!"
                disabled={isPreLocked || !expRFT}
                onClick={() => updateExpStatus(`request_technical`)}
              >
                Refer Technical
              </Button>
              <Button
                variant="contained"
                 disabled 
                onClick={() => updateExpStatus(`verified`)}
              >
                Verify
              </Button>
            </Box>
          </Box>
          {expRequestTech && (
            <Box className="shadow-2xl rounded-xl p-5 mt-4 bg-(--mui-palette-primary)">
              <Typography className="mb-2 font-bold text-[15px] text-(--mui-palette-text-primary)">
                Technical Round
              </Typography>
              <RadioGroup
                row
                value={techStatus}
                onChange={(e) => setTechStatus(e.target.value)}
              >
                <FormControlLabel
                  value="refered"
                  control={<Radio disabled={isFoe} />}
                  label="Referred"
                />
                <FormControlLabel
                  value="passed"
                  control={<Radio disabled={isFoe} />}
                  label="Passed"
                />
                <FormControlLabel
                  value="failed"
                  control={<Radio disabled={isFoe} />}
                  label="Failed"
                />
              </RadioGroup>
              <FormControl fullWidth className="mt-4 md:w-1/2">
                <InputLabel>Classify Experience</InputLabel>
                <Select
                  value={classifyExp}
                  onChange={(e) => setClassifyExp(e.target.value)}
                  label="Classify Experience"
                  disabled
                >
                  <MenuItem value="fresher">Fresher</MenuItem>
                  <MenuItem value="domestic">Domestic</MenuItem>
                  <MenuItem value="abroad">Abroad</MenuItem>
                  <MenuItem value="free">Freelance</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
          {!isFoe &&
            !showAssessmentForm &&
            assessBasicForm.values.status === "rejected" && (
              <Box className="flex justify-end mt-6">
                <Button
                  variant="contained"
                  onClick={handleSaveAll}
                  className="bg-[--mui-palette-error-main] text-white! rounded-xl! px-10! py-2.5! normal-case! shadow-md"
                  disabled={isPreLocked}
                >
                  Reject
                </Button>
              </Box>
            )}
        </>
      ) : null}
     
    </Card>
  );
};

export default AssessmentFormSection;