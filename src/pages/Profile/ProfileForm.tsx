import {
  UserPlus,
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Save,
  Bell,
  Camera,
  RefreshCw,
  X,
  Sliders,
} from "lucide-react";
import Cropper from "react-easy-crop";
import { motion, AnimatePresence } from "framer-motion";
import { useProfileForm } from "./useProfileForm";

const ProfileForm = () => {
  const {
    formik,
    loading,
    fetching,
    apiError,
    reduxUser,
    imgSrc,
    fileInput,
    handleAvatarChange,
    handleAvatarReset,
    openPreview,
    setOpenPreview,
    cropModalOpen,
    setCropModalOpen,
    tempImageSrc,
    crop,
    setCrop,
    zoom,
    setZoom,
    setCroppedAreaPixels,
    getCroppedImg,
    useOriginalImg
  } = useProfileForm();

  // ── Fetch skeleton ─────────────────────────────────────────────────────────
  if (fetching) {
    return (
      <div className="max-w-6xl mx-auto pb-20 animate-pulse space-y-8">
        <div className="h-20 bg-white rounded-3xl border border-gray-50" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-96 bg-white rounded-4xl border border-gray-100" />
          <div className="space-y-8">
            <div className="h-64 bg-white rounded-4xl border border-gray-100" />
            <div className="h-40 bg-white rounded-4xl border border-gray-100" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto pb-20"
    >
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 bg-white p-4 rounded-3xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] border border-gray-50 gap-4">
        <div className="flex items-center gap-4">
          {/* ── Avatar with upload overlay ── */}
          <div className="relative shrink-0">
            {imgSrc ? (
              <img
                src={imgSrc}
                alt="Profile"
                onClick={() => setOpenPreview(true)}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-gray-100 cursor-pointer hover:scale-105 transition-transform shadow-sm"
              // onError={() => { setImgSrc("") }}
              />
            ) : (
              <div
                onClick={() => setOpenPreview(true)}
                className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-[#0054a6] font-black text-xl uppercase border-2 border-gray-100 cursor-pointer hover:scale-105 transition-transform"
              >
                {formik.values.firstName
                  ? formik.values.firstName.charAt(0)
                  : "U"}
              </div>
            )}

            <label
              htmlFor="avatar-upload"
              className="absolute -bottom-1 -right-1 w-6 h-6  text-white rounded-lg flex items-center justify-center shadow-md cursor-pointer bg-red-400 hover:bg-red-600 transition-colors border border-white z-10"
            >
              <Camera className="w-3.5 h-3.5" />
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/png, image/jpeg"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-700 tracking-wider font-mono">
              {formik.values.firstName} {formik.values.lastName}
            </h1>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
              My Profile
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {imgSrc && (
            <button
              type="button"
              onClick={handleAvatarReset}
              className="flex items-center gap-2 px-5 py-3 border border-red-200 bg-red-500 text-white font-medium rounded-2xl hover:bg-red-400 transition-all duration-300 text-sm cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Remove Photo
            </button>
          )}
          <button
            type="button"
            onClick={() => formik.handleSubmit()}
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 bg-[#0D80F2] text-white font-bold rounded-2xl hover:scale-105 hover:rotate-1 hover:shadow-lg disabled:opacity-70 transition-all duration-300 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {apiError && (
        <div className="mb-6 px-5 py-4 bg-red-50 border border-red-200 rounded-2xl text-sm font-bold text-red-600">
          {apiError}
        </div>
      )}

      <form
        onSubmit={formik.handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* ── Left: Personal Information ── */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-4xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#0054a6]" />

            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-blue-50 text-[#0054a6] rounded-2xl">
                <UserPlus className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-medium tracking-wider text-gray-700">
                Personal Information
              </h2>
            </div>

            {fileInput && fileInput.startsWith("data:image") && !loading && (
              <div className="mb-6 flex items-center gap-2 px-5 py-3 bg-emerald-50 border border-emerald-200 text-emerald-600 font-semibold text-sm rounded-2xl animate-pulse">
                <i className="ri-information-fill text-lg" />
                Profile picture updated in preview. Click "Save Changes" to
                apply the changes.
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">
                  First Name *
                </label>
                <div className="relative group">
                  <UserPlus className="absolute left-5 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#0054a6] transition-colors" />
                  <input
                    type="text"
                    placeholder="John"
                    {...formik.getFieldProps("firstName")}
                    className={`w-full pl-14 pr-4 py-4 bg-gray-50 border-2 rounded-2xl outline-none font-bold text-gray-700 transition-all ${formik.touched.firstName && formik.errors.firstName ? "border-red-400 focus:bg-white" : "border-transparent focus:border-[#0054a6]/30 focus:bg-white"}`}
                  />
                </div>
                {formik.touched.firstName && formik.errors.firstName && (
                  <p className="text-red-500 text-xs font-bold pl-2">
                    {formik.errors.firstName}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">
                  Last Name *
                </label>
                <div className="relative group">
                  <UserPlus className="absolute left-5 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#0054a6] transition-colors" />
                  <input
                    type="text"
                    placeholder="Singh"
                    {...formik.getFieldProps("lastName")}
                    className={`w-full pl-14 pr-4 py-4 bg-gray-50 border-2 rounded-2xl outline-none font-bold text-gray-700 transition-all ${formik.touched.lastName && formik.errors.lastName ? "border-red-400 focus:bg-white" : "border-transparent focus:border-[#0054a6]/30 focus:bg-white"}`}
                  />
                </div>
                {formik.touched.lastName && formik.errors.lastName && (
                  <p className="text-red-500 text-xs font-bold pl-2">
                    {formik.errors.lastName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">
                  Email Address *
                </label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#0054a6] transition-colors" />
                  <input
                    type="email"
                    placeholder="john@asporea.com"
                    {...formik.getFieldProps("email")}
                    className={`w-full pl-14 pr-4 py-4 bg-gray-50 border-2 rounded-2xl outline-none font-bold text-gray-700 transition-all ${formik.touched.email && formik.errors.email ? "border-red-400 focus:bg-white" : "border-transparent focus:border-[#0054a6]/30 focus:bg-white"}`}
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500 text-xs font-bold pl-2">
                    {formik.errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">
                  Phone Number
                </label>
                <div className="relative group">
                  <Phone className="absolute left-5 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#0054a6] transition-colors" />
                  <input
                    type="text"
                    placeholder="9876543210"
                    {...formik.getFieldProps("phoneNumber")}
                    className={`w-full pl-14 pr-4 py-4 bg-gray-50 border-2 rounded-2xl outline-none font-bold text-gray-700 transition-all ${formik.touched.phoneNumber && formik.errors.phoneNumber ? "border-red-400 focus:bg-white" : "border-transparent focus:border-[#0054a6]/30 focus:bg-white"}`}
                  />
                </div>
                {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                  <p className="text-red-500 text-xs font-bold pl-2">
                    {formik.errors.phoneNumber}
                  </p>
                )}
              </div>

              {/* WhatsApp */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">
                  WhatsApp Number
                </label>
                <div className="relative group">
                  <MessageCircle className="absolute left-5 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#0054a6] transition-colors" />
                  <input
                    type="text"
                    placeholder="9876543210"
                    {...formik.getFieldProps("whatsappNumber")}
                    className={`w-full pl-14 pr-4 py-4 bg-gray-50 border-2 rounded-2xl outline-none font-bold text-gray-700 transition-all ${formik.touched.whatsappNumber && formik.errors.whatsappNumber ? "border-red-400 focus:bg-white" : "border-transparent focus:border-[#0054a6]/30 focus:bg-white"}`}
                  />
                </div>
                {formik.touched.whatsappNumber &&
                  formik.errors.whatsappNumber && (
                    <p className="text-red-500 text-xs font-bold pl-2">
                      {formik.errors.whatsappNumber}
                    </p>
                  )}
              </div>

              {/* Address */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">
                  Full Address
                </label>
                <div className="relative group">
                  <MapPin className="absolute left-5 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#0054a6] transition-colors" />
                  <textarea
                    rows={3}
                    placeholder="123 Street, Darjeeling, West Bengal"
                    {...formik.getFieldProps("address")}
                    className="w-full pl-14 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-[#0054a6]/30 rounded-2xl outline-none font-bold text-gray-700 transition-all resize-none focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: Notification Preferences ── */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-4xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#fc7728]" />

            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-orange-50 text-[#fc7728] rounded-2xl">
                <Bell className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-medium tracking-wider text-gray-700">
                Notifications
              </h2>
            </div>

            <p className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-widest">
              Channels
            </p>
            <div className="flex flex-col gap-4">
              {(["email"] as const).map((channel) => (
                <label
                  key={channel}
                  className="flex items-center justify-between cursor-pointer group p-3 rounded-2xl hover:bg-gray-50 transition-all"
                >
                  <span className="text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors capitalize">
                    {channel}
                  </span>
                  <div
                    onClick={() =>
                      formik.setFieldValue(
                        `notificationPreference.${channel}`,
                        !formik.values.notificationPreference[channel],
                      )
                    }
                    className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${formik.values.notificationPreference[channel] ? "bg-[#fc7728]" : "bg-gray-200"}`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${formik.values.notificationPreference[channel] ? "translate-x-5" : "translate-x-0"}`}
                    />
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-4xl border border-gray-100 space-y-3">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
              Account Info
            </p>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-500">Role</span>
              <span className="text-xs font-black text-[#0054a6] bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
                {reduxUser?.role}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-500">Status</span>
              <span
                className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider ${reduxUser?.status === "active" ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"}`}
              >
                {reduxUser?.status}
              </span>
            </div>
          </div>
        </div>
      </form>

      <AnimatePresence>
        {openPreview && imgSrc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenPreview(false)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative flex items-center justify-center layout-container"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={imgSrc}
                alt="Full view"
                className="max-w-full max-h-[80vh] w-auto h-auto object-cover rounded-2xl shadow-2xl block mx-auto"
              />
            </motion.div>
          </motion.div>
        )}

        {/* 2️⃣ DYNAMIC CROP MECHANISM MODAL */}
        {cropModalOpen && tempImageSrc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-[40px] max-w-lg w-full p-8 shadow-2xl border border-gray-100 flex flex-col"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-700 tracking-wide flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-[#0054a6]" /> Adjust Profile
                  Picture
                </h3>
                <button
                  onClick={() => setCropModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>


              <div className="relative w-full h-72 bg-slate-900 rounded-3xl overflow-hidden shadow-inner">
                <Cropper
                  image={tempImageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
                />
              </div>


              <div className="mt-6 space-y-1 px-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                  Zoom Control
                </label>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#0D80F2]"
                />
              </div>

              {/* Action Operations Trigger Arrays */}
              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={useOriginalImg}
                  className="w-1/2 py-3 border-2 border-gray-100 hover:border-gray-200 text-gray-500 font-bold rounded-2xl transition-all cursor-pointer text-sm"
                >
                  Skip & Use Original
                </button>
                <button
                  type="button"
                  onClick={getCroppedImg}
                  className="w-1/2 py-3 bg-[#0D80F2] hover:bg-blue-600 text-white font-bold rounded-2xl shadow-md transition-all cursor-pointer text-sm"
                >
                  Crop & Apply
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProfileForm;
