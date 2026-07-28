import React from "react";
import { Box, Dialog, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DashboardFilters from "../../components/Inquiries/DashboardFilters";
import DashboardTable from "../../components/Inquiries/DashboardTable";
import DashboardScheduleModal from "../../components/Inquiries/DashboardScheduleModal";
import DashboardCommunicationModal from "../../components/Inquiries/DashboardCommunicationModal";
import { useDashboardView } from "../../components/Inquiries/useDashboardView";

const AllInquiriesList: React.FC = () => {
  const navigate = useNavigate();
  const {
    searchInput,
    setSearchInput,
    statusFilter,
    setStatusFilter,
    experienceFilter,
    setExperienceFilter,
    rows,
    loading,
    error,
    page,
    totalPages,
    setPage,
    openScheduleModal,
    openCommModal,
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
    previewImage,
    setPreviewImage,
    commModalOpen,
    setCommModalOpen,
    commCandidate,
    commMode,
  } = useDashboardView();

  return (
    <Box className="w-full rounded-[20px]  shadow-2xl p-4 md:p-8 bg-white font-sans">
      <div  className="text-[22px] md:text-[25px] text-gray-700 mt-2 font-medium tracking-wide mb-6">
        <h1>  All Inquiries</h1>
      </div>

      <DashboardFilters
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        experienceFilter={experienceFilter}
        setExperienceFilter={setExperienceFilter}
      />

      <DashboardTable
        rows={rows}
        loading={loading}
        error={error}
        isFoe={true}
        page={page}
        totalPages={totalPages}
        setPage={setPage}
        openScheduleModal={openScheduleModal}
        openCommModal={openCommModal}
        onViewCandidate={(id) => navigate(`/all-inquiries/${id}`)}
        onPreviewImage={setPreviewImage}
      />

      <Dialog
        open={!!previewImage}
        onClose={() => setPreviewImage(null)}
        maxWidth="md"
        slotProps={{
       paper: {
      style: { backgroundColor: "transparent", boxShadow: "none" },
    },
  }}
      >
        <Box className="relative">
          <IconButton
            onClick={() => setPreviewImage(null)}
            className="absolute -top-4 -right-4 bg-white z-50"
          >
            <i className="mdi--close text-xl" />
          </IconButton>
          <img
            src={previewImage || ""}
            alt="Preview"
            className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain bg-white"
          />
        </Box>
      </Dialog>

      <DashboardScheduleModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        targetLead={targetLead}
        tacList={tacList}
        selectedTac={selectedTac}
        setSelectedTac={setSelectedTac}
        date={date}
        setDate={setDate}
        todayStr={todayStr}
        slotsLoading={slotsLoading}
        slots={slots}
        selectedSlot={selectedSlot}
        setSelectedSlot={setSelectedSlot}
        handleBookSlot={handleBookSlot}
        bookingLoading={bookingLoading}
        schedulePhase={schedulePhase}
      />

      <DashboardCommunicationModal
        open={commModalOpen}
        onClose={() => setCommModalOpen(false)}
        candidate={commCandidate}
        mode={commMode}
      />
    </Box>
  );
};

export default AllInquiriesList;