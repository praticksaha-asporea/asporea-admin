import React, { useEffect, useState } from "react";
import { Box, Stack, CircularProgress, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useParams, useNavigate } from "react-router-dom";

import CandidateHeader from "../../components/Inquiries/Detail/CandidateHeader";
import InquiryDetailsForm from "../../components/Inquiries/Detail/InquiryDetailsForm";
import PreCounsellingForm from "../../components/Inquiries/Detail/PreCounsellingForm";
import ProgressSidebar from "../../components/Inquiries/Detail/ProgressSidebar";
import AssessmentFormSection from "../../components/Inquiries/Detail/AssessmentFormSection";

import { useCandidateDetail } from "../../components/Inquiries/Detail/hooks/useCandidateDetail";
import { getTacCandidateDetailAction } from "../../service/apis/adminInquiry.actions";

const AdminCandidateDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
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
  } = useCandidateDetail({ selectedCandidate });

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getTacCandidateDetailAction(id)
      .then((response: any) => {
        const leadData = response?.data?.data;
        setSelectedCandidate({
          _id: leadData.lead._id,
          name: leadData.lead.fullName ?? "—",
          inqNo: leadData.lead.inqNo ?? "—",
          stage: leadData.lead.status ?? "—",
          status: leadData.lead.status ?? "—",
          profilePic: leadData.lead.profilePic,
          contact: leadData.lead.contact,
          address: leadData.lead.address,
          preferences: leadData.lead.preferences,
          source: leadData.lead.source,
          experience: leadData.lead.experience,
          documents: leadData.lead.documents,
          technical: leadData.lead.technical,
          passport: leadData.lead.passport,
          token: leadData.branchToken?.tokenNo ?? null,
          lastActivity: leadData.lead.updatedAt,
          assignmentByPhase: leadData.assignmentByPhase ?? {},
          notificationPreference: leadData.lead?.contact ?? {},
        });
      })
      .catch((err: { response: { data: { message: any } } }) =>
        setError(err?.response?.data?.message ?? "Failed to load candidate"),
      )
      .finally(() => setLoading(false));
  }, [id]);

  const handleBack = () => navigate(-1);

  if (loading)
    return (
      <Box className="flex justify-center mt-20">
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Box className="flex justify-center mt-20">
        <Typography color="error">{error}</Typography>
      </Box>
    );

  return (
    <Box className="w-full p-4 md:p-6 bg-gray-50 min-h-screen">
      <CandidateHeader candidate={c} onBack={handleBack} />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 9 }}>
          <Stack spacing={3}>
            <InquiryDetailsForm candidate={c} />

            {!!Object.keys(c.assignmentByPhase ?? {}).length && (
              <PreCounsellingForm
                candidate={c}
                inqAssign={inqAssign}
                branchId={branchId}
                consultantId={inqAssign?.assignedTo || consultantId}
                source={source}
                preferences={preferences}
                candidatePhone={c?.contact?.phone ?? ""}
              />
            )}

            {!!Object.keys(c.assignmentByPhase ?? {}).length &&
              inqAssign?.status === "completed" &&
              assessAssign && (
                <AssessmentFormSection
                  candidate={c}
                  assessAssign={assessAssign}
                  isFoe={true}
                  branchTitle={
                    typeof branchId === "string"
                      ? branchId
                      : (branchId?.title ?? "—")
                  }
                />
              )}
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, lg: 3 }}>
          <ProgressSidebar
            candidate={c}
            isFoe={true}
            branchId={branchId}
            consultantId={consultantId}
            tacList={tacList}
            escalateTo={escalateTo}
            setEscalateTo={setEscalateTo}
            currentUser={currentUser}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminCandidateDetail;
