import React from "react";
import { Box, MenuItem, Select, TextField } from "@mui/material";

interface DashboardFiltersProps {
  searchInput: string;
  setSearchInput: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  experienceFilter: string;
  setExperienceFilter: (val: string) => void;
}

const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  searchInput,
  setSearchInput,
  statusFilter,
  setStatusFilter,
  experienceFilter,
  setExperienceFilter,
}) => {
  return (
    <>
     

      <Box className="flex mt-8 flex-col  gap-3 mb-5">
        <TextField
          fullWidth
          size="small"
          placeholder="Search by name, inquiry ID, email or phone..."
          
          value={searchInput}
          onChange={(e: { target: { value: string; }; }) => setSearchInput(e.target.value)}
          slotProps={{ input: { className: "rounded-lg text-[14px]" } }}
        />
        <Box className="flex gap-2 flex-wrap">
          <Select
            displayEmpty
            size="small"
            value={statusFilter}
            onChange={(e: { target: { value: string; }; }) => setStatusFilter(e.target.value)}
            className="flex-1 min-w-35 text-[12px]"
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="inquiry_submitted">Inquiry Submitted</MenuItem>
            <MenuItem value="pre_scheduled">Pre-Counselling Scheduled</MenuItem>
            <MenuItem value="pre_completed">Pre-Counselling Completed</MenuItem>
            <MenuItem value="doc_submitted">Documents Submitted</MenuItem>
            <MenuItem value="exp_submitted">Experience Submitted</MenuItem>
            <MenuItem value="pre_not_responded">Pre Not Responded</MenuItem>
            <MenuItem value="assess_scheduled">Assessment Scheduled</MenuItem>
          </Select>
          <Select
            displayEmpty
            size="small"
            value={experienceFilter}
            onChange={(e: { target: { value: string; }; }) => setExperienceFilter(e.target.value)}
            className="flex-1 min-w-32.5 text-[12px]"
          >
            <MenuItem value="">All Experience</MenuItem>
            <MenuItem value="fresher">Fresher</MenuItem>
            <MenuItem value="domestic">Domestic</MenuItem>
            <MenuItem value="abroad">Abroad</MenuItem>
            <MenuItem value="free">Freelance</MenuItem>
          </Select>
        </Box>
      </Box>
    </>
  );
};

export default DashboardFilters;