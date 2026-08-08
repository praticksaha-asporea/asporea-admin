import React from "react";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Chip,
} from "@mui/material";
import { CamelCase } from "../../../utils/common";
import { useInquiryDetails } from "./hooks/useInquiryDetails";
import type { CandidateLead } from "../../../types/payloads/Candidate.types";

interface InquiryDetailsFormProps {
  candidate: CandidateLead;
}
const getChipStyle = (isActive: boolean) =>
  isActive
    ? "!bg-green-500 !text-white !font-bold border !border-green-700"
    : "!bg-gray-200 !text-gray-500 !font-medium border !border-gray-300";
const InquiryDetailsForm: React.FC<InquiryDetailsFormProps> = ({ candidate }) => {
  const { inquiryForm, fe, fh, preferences, notifPrefs } =
    useInquiryDetails(candidate);

  return (
    <Card className="p-6 rounded-xl shadow-2xl">
      <div className="mb-6 font-medium text-[25px] text-gray-500">
        <h1>  Inquiry Details ({candidate.inqNo ?? "—"})</h1>
      </div>
      <form onSubmit={inquiryForm.handleSubmit}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 6 }}> 
            <TextField
              fullWidth
              name="fullName"
              label="Full Name"
              value={inquiryForm.values.fullName}
              onChange={inquiryForm.handleChange}
              onBlur={inquiryForm.handleBlur}
              error={fe("fullName")}
              helperText={fh("fullName")}
            />
          </Grid>

          <Grid
             size={{ xs: 12, lg: 6 }}
            className="flex flex-col -mt-2 justify-center"
          >
            <Typography
              variant="h6"
              className="text-(--mui-palette-text-secondary) font-medium mb-2 tracking-wide"
            >
              Contact Preferences
            </Typography>
            <Box className="flex flex-wrap gap-2">
              <Chip
                label="WhatsApp"
                size="small"
                className={getChipStyle(!!notifPrefs?.whatsapp)}
              />
              <Chip
                label="Email"
                size="small"
                className={getChipStyle(!!notifPrefs?.email)}
              />
              <Chip
                label="SMS"
                size="small"
                className={getChipStyle(!!notifPrefs?.sms)}
              />
            </Box>
          </Grid>

       <Grid size={{ xs: 12, lg: 6 }}> 
            <TextField
              fullWidth
              name="email"
              label="Email Address"
              value={inquiryForm.values.email}
              onChange={inquiryForm.handleChange}
              onBlur={inquiryForm.handleBlur}
              error={fe("email")}
              helperText={fh("email")}
            />
          </Grid>
           <Grid size={{ xs: 12, lg: 6 }}> 
            <TextField
              fullWidth
              name="phone"
              label="Phone Number"
              value={inquiryForm.values.phone}
              onChange={inquiryForm.handleChange}
              onBlur={inquiryForm.handleBlur}
              error={fe("phone")}
              helperText={fh("phone")}
            />
          </Grid>
           <Grid size={{ xs: 12, lg: 6 }}> 
            <TextField
              fullWidth
              name="whatsapp"
              label="WhatsApp Number"
              value={inquiryForm.values.whatsapp}
              onChange={inquiryForm.handleChange}
              onBlur={inquiryForm.handleBlur}
              error={fe("whatsapp")}
              helperText={fh("whatsapp")}
            />
          </Grid>

           <Grid size={{ xs: 12, lg: 6 }}> 
            <FormControl fullWidth error={fe("passportStatus")}>
              <InputLabel>Passport Status</InputLabel>
              <Select
                name="passportStatus"
                label="Passport Status"
                value={inquiryForm.values.passportStatus}
                onChange={(e) => {
                  inquiryForm.handleChange(e);
                  if (e.target.value !== "having")
                    inquiryForm.setFieldValue("passportNo", "");
                }}
                onBlur={inquiryForm.handleBlur}
              >
                <MenuItem value="having">Having</MenuItem>
                <MenuItem value="applied">Applied</MenuItem>
                <MenuItem value="no">Not Having</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {inquiryForm.values.passportStatus === "having" && (
              <Grid size={{ xs: 12, lg: 6 }}> 
              <TextField
                fullWidth
                name="passportNo"
                label="Passport No"
                value={inquiryForm.values.passportNo}
                onChange={(e) =>
                  inquiryForm.setFieldValue(
                    "passportNo",
                    e.target.value.toUpperCase()
                  )
                }
                onBlur={inquiryForm.handleBlur}
                error={fe("passportNo")}
                helperText={fh("passportNo")}
              />
            </Grid>
          )}

          <Grid size={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              name="address"
              label="Full Address"
              value={inquiryForm.values.address}
              onChange={inquiryForm.handleChange}
              onBlur={inquiryForm.handleBlur}
              error={fe("address")}
              helperText={fh("address")}
            />
          </Grid>
           <Grid size={{ xs: 12, lg: 6 }}> 
            <TextField
              fullWidth
              label="Status"
              disabled
              value={CamelCase(candidate.status ?? "")}
            />
          </Grid>
            <Grid size={{ xs: 12, lg: 6 }}> 
            <TextField
              fullWidth
              label="Visit Type"
              disabled
              value={CamelCase(preferences.visitType ?? "")}
            />
          </Grid>
        </Grid>

        <Box className="flex justify-end mt-6">
          <Button
        
            variant="contained"
            type="submit"
            disabled 
            className="normal-case px-6"
          >
            {inquiryForm.isSubmitting ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Update"
            )}
          </Button>
        </Box>
      </form>
    </Card>
  );
};

export default InquiryDetailsForm;