import { useNavigate } from "react-router-dom";
import { UserPlus, Mail, ArrowLeft, Phone, MessageCircle, MapPin, Save, Briefcase, Lock, Link } from "lucide-react";
import { motion } from "framer-motion";
import { useSourceForm } from "./useSourceForm";

const SourceForm = () => {
  const navigate = useNavigate();
  const { formik, loading, fetching, isEdit, parentSources } = useSourceForm();

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
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto pb-20">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 bg-white p-4 rounded-3xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] border border-gray-50 gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/external-sources")} className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-700 tracking-wider font-mono">
              {isEdit ? "Edit Source" : "Add New Source"}
            </h1>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-3">
              {isEdit ? "Update source details" : "Configure source & access"}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Left: Personal Information ── */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-4xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#0054a6]" />

            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-blue-50 text-[#0054a6] rounded-2xl"><UserPlus className="w-6 h-6" /></div>
              <h2 className="text-2xl font-medium tracking-wider text-gray-700">Representative Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* First Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">First Name <span className="text-red-500">*</span></label>
                <div className="relative mt-1 group">
                  <UserPlus className="absolute left-5 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#0054a6] transition-colors" />
                  <input
                    type="text"
                    placeholder="John"
                    {...formik.getFieldProps("firstName")}
                    className={`w-full pl-14 pr-4 py-4 bg-gray-100 border-2 rounded-2xl outline-none font-bold text-gray-700 transition-all ${
                      formik.touched.firstName && formik.errors.firstName
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
                <div className="relative mt-2 group">
                  <UserPlus className="absolute left-5 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#0054a6] transition-colors" />
                  <input
                    type="text"
                    placeholder="Doe"
                    {...formik.getFieldProps("lastName")}
                    className={`w-full pl-14 pr-4 py-4 bg-gray-100 border-2 rounded-2xl outline-none font-bold text-gray-700 transition-all ${
                      formik.touched.lastName && formik.errors.lastName
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
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Email Address <span className="text-red-500">*</span></label>
                <div className="relative mt-2 group">
                  <Mail className="absolute left-5 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#0054a6] transition-colors" />
                  <input
                    type="email"
                    placeholder="john@example.com"
                    {...formik.getFieldProps("email")}
                    className={`w-full pl-14 pr-4 py-4 bg-gray-100 border-2 rounded-2xl outline-none font-bold text-gray-700 transition-all ${
                      formik.touched.email && formik.errors.email
                        ? "border-red-400 focus:bg-white"
                        : "border-transparent focus:border-[#0054a6]/30 focus:bg-white"
                    }`}
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500 text-xs font-bold mt-1 pl-2">{formik.errors.email}</p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Phone Number <span className="text-red-500">*</span></label>
                <div className="relative mt-2 group">
                  <Phone className="absolute left-5 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#0054a6] transition-colors" />
                  <input
                    type="text"
                    placeholder="9876543210"
                    {...formik.getFieldProps("phoneNumber")}
                    className={`w-full pl-14 pr-4 py-4 bg-gray-100 border-2 rounded-2xl outline-none font-bold text-gray-700 transition-all ${
                      formik.touched.phoneNumber && formik.errors.phoneNumber
                        ? "border-red-400 focus:bg-white"
                        : "border-transparent focus:border-[#0054a6]/30 focus:bg-white"
                    }`}
                  />
                </div>
                {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                  <p className="text-red-500 text-xs font-bold mt-1 pl-2">{formik.errors.phoneNumber}</p>
                )}
              </div>

              {/* WhatsApp Number */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">WhatsApp Number</label>
                <div className="relative group mt-2">
                  <MessageCircle className="absolute left-5 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#0054a6] transition-colors" />
                  <input
                    type="text"
                    placeholder="9876543210"
                    {...formik.getFieldProps("whatsappNumber")}
                    className={`w-full pl-14 pr-4 py-4 bg-gray-100 border-2 rounded-2xl outline-none font-bold text-gray-700 transition-all ${
                      formik.touched.whatsappNumber && formik.errors.whatsappNumber
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
                <div className="relative mt-2 group">
                  <MapPin className="absolute left-5 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#0054a6] transition-colors" />
                  <input
                    type="text"
                    placeholder="City, State"
                    {...formik.getFieldProps("address")}
                    className="w-full pl-14 pr-4 py-4 bg-gray-100 border-2 border-transparent rounded-2xl outline-none font-bold text-gray-700 focus:border-[#0054a6]/30 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3.5 bg-[#0D80F2] text-white font-bold rounded-2xl hover:scale-105 hover:shadow-lg disabled:opacity-70 transition-all duration-300 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                {loading ? "Saving..." : isEdit ? "Update Source" : "Save Source"}
              </button>
            </div>
          </div>
        </div>

        {/* ── Right: Account Control + Notifications ── */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-4xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#fc7728]" />

            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-orange-50 text-[#fc7728] rounded-2xl"><Briefcase className="w-6 h-6" /></div>
              <h2 className="text-2xl font-medium tracking-wider text-gray-700">Role & Security</h2>
            </div>

            <div className="space-y-6">
              {/* Role Setup */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Source Type <span className="text-red-500">*</span></label>
                <div className="relative group">
                  <Briefcase className="absolute left-5 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#fc7728] transition-colors" />
                  <select
                    {...formik.getFieldProps("role")}
                    className="w-full pl-14 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none font-bold text-gray-700 appearance-none cursor-pointer focus:border-[#fc7728]/30 focus:bg-white transition-all"
                  >
                    <option value="pca">PCA</option>
                    <option value="pcra">PCRA</option>
                    <option value="institute">Institute</option>
                  </select>
                </div>
              </div>

              {/* SubOf Parent Logic */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">SubOf (Optional)</label>
                <div className="relative group">
                  <Link className="absolute left-5 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#fc7728] transition-colors" />
                  <select
                    {...formik.getFieldProps("subOf")}
                    className="w-full pl-14 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none font-bold text-gray-700 appearance-none cursor-pointer focus:border-[#fc7728]/30 focus:bg-white transition-all"
                  >
                    <option value="">None (Master {formik.values.role.toUpperCase()})</option>
                    {parentSources.map((parent) => (
                      <option key={parent._id} value={parent._id}>{parent.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">
                  Password {!isEdit && <span className="text-red-500">*</span>}
                </label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#fc7728] transition-colors" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    {...formik.getFieldProps("password")}
                    className={`w-full pl-14 pr-4 py-4 bg-gray-50 border-2 rounded-2xl outline-none font-bold text-gray-700 transition-all ${
                      formik.touched.password && formik.errors.password
                        ? "border-red-400 focus:bg-white"
                        : "border-transparent focus:border-[#fc7728]/30 focus:bg-white"
                    }`}
                  />
                </div>
                {formik.touched.password && formik.errors.password && (
                  <p className="text-red-500 text-xs font-bold mt-1 pl-2">{formik.errors.password}</p>
                )}
              </div>
            </div>
          </div>

          {/* Notifications */}
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
  );
};

export default SourceForm;