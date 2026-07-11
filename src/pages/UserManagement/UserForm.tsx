import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserPlus, Mail, ArrowLeft,
  Phone, MessageCircle, MapPin, FileText, Save,
  Briefcase, Lock, ShieldCheck,
  IdCardLanyard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserForm } from "./useUserForm";
// import ChangePasswordModal from "../../components/modals/ChangePasswordModal"; // reserved for later

const UserForm = () => {
  const navigate = useNavigate();
  const { formik, loading, fetching, isEdit } = useUserForm();
  const [showPasswordField, setShowPasswordField] = useState(false);

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
    <>
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto pb-20">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 bg-white p-4 rounded-3xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] border border-gray-50 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/users")}
              className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-700 tracking-wider font-mono">
                {isEdit ? "Edit User" : "Add New User"}
              </h1>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-3">
                {isEdit ? "Update profile & access" : "Configure profile & access"}
              </p>
            </div>
          </div>
        </div>

        {/* ── API error banner ── */}
        {/* {apiError && (
          <div className="mb-6 px-5 py-4 bg-red-50 border border-red-200 rounded-2xl text-sm font-bold text-red-600">
            {apiError}
          </div>
        )} */}

        <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left: Personal Information ── */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-4xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#0054a6]" />

              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-blue-50 text-[#0054a6] rounded-2xl"><UserPlus className="w-6 h-6" /></div>
                <h2 className="text-2xl font-medium tracking-wider text-gray-700">Personal Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* First Name */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <UserPlus className="absolute left-5 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#0054a6] transition-colors" />
                    <input
                      type="text"
                      placeholder="John"
                      {...formik.getFieldProps("firstName")}
                      className={`w-full pl-14 pr-4 py-4 bg-gray-50 border-2 rounded-2xl outline-none font-bold text-gray-700 transition-all ${formik.touched.firstName && formik.errors.firstName
                          ? "border-red-400 focus:bg-white"
                          : "border-transparent focus:border-[#0054a6]/30 focus:bg-white"
                        }`}
                    />
                  </div>
                  {formik.touched.firstName && formik.errors.firstName && (
                    <p className="text-red-500 text-xs font-bold mt-1 pl-2">{formik.errors.firstName}</p>
                  )}
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Last Name <span className="text-red-500">*</span></label>
                  <div className="relative group">
                    <UserPlus className="absolute left-5 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#0054a6] transition-colors" />
                    <input
                      type="text"
                      placeholder="Singh"
                      {...formik.getFieldProps("lastName")}
                      className={`w-full pl-14 pr-4 py-4 bg-gray-50 border-2 rounded-2xl outline-none font-bold text-gray-700 transition-all ${formik.touched.lastName && formik.errors.lastName
                          ? "border-red-400 focus:bg-white"
                          : "border-transparent focus:border-[#0054a6]/30 focus:bg-white"
                        }`}
                    />
                  </div>
                  {formik.touched.lastName && formik.errors.lastName && (
                    <p className="text-red-500 text-xs font-bold mt-1 pl-2">{formik.errors.lastName}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-5 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#0054a6] transition-colors" />
                    <input
                      type="email"
                      placeholder="john.singh@asporea.com"
                      {...formik.getFieldProps("email")}
                      className={`w-full pl-14 pr-4 py-4 bg-gray-50 border-2 rounded-2xl outline-none font-bold text-gray-700 transition-all ${formik.touched.email && formik.errors.email
                          ? "border-red-400 focus:bg-white"
                          : "border-transparent focus:border-[#0054a6]/30 focus:bg-white"
                        }`}
                    />
                  </div>
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-red-500 text-xs font-bold mt-1 pl-2">{formik.errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Phone Number <span className="text-red-500">*</span></label>
                  <div className="relative group">
                    <Phone className="absolute left-5 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#0054a6] transition-colors" />
                    <input
                      type="text"
                      placeholder="9876543210"
                      pattern="[0-9]{10}$"
                      {...formik.getFieldProps("phoneNumber")}
                      className={`w-full pl-14 pr-4 py-4 bg-gray-50 border-2 rounded-2xl outline-none font-bold text-gray-700 transition-all ${formik.touched.phoneNumber && formik.errors.phoneNumber
                          ? "border-red-400 focus:bg-white"
                          : "border-transparent focus:border-[#0054a6]/30 focus:bg-white"
                        }`}
                    />
                  </div>
                  {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                    <p className="text-red-500 text-xs font-bold mt-1 pl-2">{formik.errors.phoneNumber}</p>
                  )}
                </div>

                {/* WhatsApp */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">WhatsApp Number <span className="text-red-500">*</span></label>
                  <div className="relative group">
                    <MessageCircle className="absolute left-5 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#0054a6] transition-colors" />
                    <input
                      type="text"
                      placeholder="9876543210"
                      pattern="[0-9]{10}$"
                      {...formik.getFieldProps("whatsappNumber")}
                      className={`w-full pl-14 pr-4 py-4 bg-gray-50 border-2 rounded-2xl outline-none font-bold text-gray-700 transition-all ${formik.touched.whatsappNumber && formik.errors.whatsappNumber
                          ? "border-red-400 focus:bg-white"
                          : "border-transparent focus:border-[#0054a6]/30 focus:bg-white"
                        }`}
                    />
                  </div>
                  {formik.touched.whatsappNumber && formik.errors.whatsappNumber && (
                    <p className="text-red-500 text-xs font-bold mt-1 pl-2">{formik.errors.whatsappNumber}</p>
                  )}
                </div>

                {/* Address */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Full Address</label>
                  <div className="relative group">
                    <MapPin className="absolute left-5 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#0054a6] transition-colors" />
                    <input
                      type="text"
                      placeholder="123 Street, Darjeeling, West Bengal"
                      {...formik.getFieldProps("address")}
                      className="w-full pl-14 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-[#0054a6]/30 rounded-2xl outline-none font-bold text-gray-700 transition-all focus:bg-white"
                    />
                  </div>
                </div>

                {/* Passport Status */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Passport Status</label>
                  <div className="relative group">
                    <FileText className="absolute left-5 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#fc7728] transition-colors" />
                    <select
                      {...formik.getFieldProps("passportStatus")}
                      className="w-full pl-14 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-[#0054a6]/30 rounded-2xl outline-none font-bold text-gray-400 transition-all focus:bg-white"
                    >
                      <option value="not">Not Having</option>
                      <option value="having">Having Passport</option>
                      <option value="applied">Applied</option>
                    </select>
                  </div>
                </div>

                {
                  formik.values.passportStatus === "having" && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Passport Number</label>
                      <div className="relative group">
                        <IdCardLanyard className="absolute left-5 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#0054a6] transition-colors" />
                        <input
                          type="text"
                          placeholder="K1234567"
                          {...formik.getFieldProps("passportNo")}
                          className="w-full pl-14 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-[#0054a6]/30 rounded-2xl outline-none font-bold text-gray-700 transition-all focus:bg-white"
                        />
                      </div>
                      {formik.touched.passportNo && formik.errors.passportNo && (
                        <p className="text-red-500 text-xs font-bold mt-1 pl-2">{formik.errors.passportNo}</p>
                      )}
                    </div>
                  )
                }


                {/* Enquiry Status */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Enquiry Status</label>
                  <div className="flex gap-6 p-4 mt-1 rounded-2xl border border-gray-100 bg-gray-50">
                    {(["yes", "no"] as const).map((val) => (
                      <label key={val} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="enquired"
                          value={val}
                          checked={formik.values.enquired === val}
                          onChange={formik.handleChange}
                          className="w-5 h-5 text-[#0054a6] focus:ring-[#0054a6]"
                        />
                        <span className="text-sm font-bold text-gray-500 capitalize">{val}</span>
                      </label>
                    ))}
                  </div>
                </div>

              </div>

              {/* Save button */}
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-8 py-3.5 bg-[#0D80F2] text-white font-bold rounded-2xl hover:scale-105 hover:rotate-1 hover:shadow-lg disabled:opacity-70 transition-all duration-300"
                >
                  <Save className="w-4 h-4" />
                  {loading ? "Saving..." : isEdit ? "Update User" : "Save User"}
                </button>
              </div>
            </div>
          </div>

          {/* ── Right: Account Control + Notifications ── */}
          <div className="space-y-8">

            {/* Account Control */}
            <div className="bg-white p-8 rounded-4xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#fc7728]" />

              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-orange-50 text-[#fc7728] rounded-2xl"><Briefcase className="w-6 h-6" /></div>
                <h2 className="text-2xl font-medium tracking-wider text-gray-700">Account Control</h2>
              </div>

              <div className="space-y-6">

                {/* Role */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <Briefcase className="absolute left-5 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#fc7728] transition-colors" />
                    <select
                      {...formik.getFieldProps("role")}
                      className={`w-full pl-14 pr-4 py-4 bg-gray-50 border-2 rounded-2xl outline-none font-bold text-gray-700 appearance-none cursor-pointer transition-all ${formik.touched.role && formik.errors.role
                          ? "border-red-400 focus:bg-white"
                          : "border-transparent focus:border-[#fc7728]/30 focus:bg-white"
                        }`}
                    >
                      <option value="" disabled>Select access level...</option>
                      <option value="admin">System Admin</option>
                      <option value="user">Regular User</option>
                      <option value="tac">TAC</option>
                      <option value="tac_head">TAC Head</option>
                      <option value="foe">FOE</option>
                      <option value="finance">Finance</option>
                      <option value="coordinator">Coordinator</option>
                      <option value="pca">PCA</option>
                      <option value="sub_pca">Sub PCA</option>
                      <option value="pcra">PCRA</option>
                      <option value="institute">Institute</option>
                      <option value="branch_head">Branch Head</option>
                    </select>
                  </div>
                  {formik.touched.role && formik.errors.role && (
                    <p className="text-red-500 text-xs font-bold mt-1 pl-2">{formik.errors.role}</p>
                  )}
                </div>

                {/* Password / Change Password */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">
                    Password {!isEdit && <span className="text-red-500">*</span>}
                  </label>

                  {isEdit ? (
                    /* ── Edit mode: toggle to reveal inline password input ── */
                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowPasswordField((prev) => !prev);
                          // clear field when hiding so it doesn't get submitted
                          if (showPasswordField) formik.setFieldValue("password", "");
                        }}
                        className="w-full flex items-center gap-3 px-5 py-4 bg-gray-50 border-2 border-transparent hover:border-[#fc7728]/30 hover:bg-white rounded-2xl transition-all group"
                      >
                        <ShieldCheck className="w-5 h-5 text-gray-400 group-hover:text-[#fc7728] transition-colors shrink-0" />
                        <span className="text-sm font-bold text-gray-500 group-hover:text-gray-700 transition-colors">
                          Change Password
                        </span>
                        <span className={`ml-auto text-xs font-bold px-3 py-1 rounded-full transition-colors ${showPasswordField
                            ? "text-orange-500 bg-orange-50"
                            : "text-[#0D80F2] bg-blue-50"
                          }`}>
                          {showPasswordField ? "Cancel" : "Update"}
                        </span>
                      </button>

                      <AnimatePresence>
                        {showPasswordField && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="relative group">
                              <Lock className="absolute left-5 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#fc7728] transition-colors" />
                              <input
                                type="password"
                                placeholder="New password"
                                {...formik.getFieldProps("password")}
                                className={`w-full pl-14 pr-4 py-4 bg-gray-50 border-2 rounded-2xl outline-none font-bold text-gray-700 transition-all [&::-ms-reveal]:hidden [&::-ms-clear]:hidden ${formik.touched.password && formik.errors.password
                                    ? "border-red-400 focus:bg-white"
                                    : "border-transparent focus:border-[#fc7728]/30 focus:bg-white"
                                  }`}
                              />
                            </div>
                            {formik.touched.password && formik.errors.password && (
                              <p className="text-red-500 text-xs font-bold mt-1 pl-2">{formik.errors.password}</p>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    /* ── Add mode: password input always visible ── */
                    <>
                      <div className="relative group">
                        <Lock className="absolute left-5 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#fc7728] transition-colors" />
                        <input
                          type="password"
                          placeholder="••••••••"
                          {...formik.getFieldProps("password")}
                          className={`w-full pl-14 pr-4 py-4 bg-gray-50 border-2 rounded-2xl outline-none font-bold text-gray-700 transition-all [&::-ms-reveal]:hidden [&::-ms-clear]:hidden ${formik.touched.password && formik.errors.password
                              ? "border-red-400 focus:bg-white"
                              : "border-transparent focus:border-[#fc7728]/30 focus:bg-white"
                            }`}
                        />
                      </div>
                      {formik.touched.password && formik.errors.password && (
                        <p className="text-red-500 text-xs font-bold mt-1 pl-2">{formik.errors.password}</p>
                      )}
                    </>
                  )}
                </div>

              </div>
            </div>

            {/* Notification Channels */}
            <div className="bg-white p-8 rounded-4xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] border border-gray-100">
              <p className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-widest">Notification Channels</p>
              <div className="flex flex-col gap-3">
                {(["email", "sms", "whatsapp"] as const).map((channel) => (
                  <label key={channel} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      name={`notificationPreference.${channel}`}
                     checked={formik.values.notificationPreference?.[channel] ?? false}
                      onChange={formik.handleChange}
                      className="w-5 h-5 rounded text-[#fc7728] focus:ring-[#fc7728]"
                    />
                    <span className="text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors capitalize">
                      {channel}
                    </span>
                  </label>
                ))}
              </div>
            </div>

          </div>
        </form>
      </motion.div>

      {/* ── Change Password Modal — reserved for later ── */}
      {/* {isEdit && (
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    )} */}
    </>
  );
};

export default UserForm;
