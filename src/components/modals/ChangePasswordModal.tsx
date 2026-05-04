import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Lock, KeyRound, EyeOff, Eye, X, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
  const [showPass, setShowPass] = useState({ old: false, new: false, confirm: false });
  const [successMessage, setSuccessMessage] = useState("");

  const toggleVisibility = (field: 'old' | 'new' | 'confirm') => {
    setShowPass((prev) => ({ ...prev, [field]: !prev[field] }));
  };

   
  const validationSchema = Yup.object({
    oldPassword: Yup.string().required("Old password is required"),
    newPassword: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .notOneOf([Yup.ref('oldPassword')], "New password must be different from the old one")
      .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword')], "Passwords do not match")
      .required("Please confirm your new password"),
  });

  const formik = useFormik({
    initialValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSuccessMessage("");
       
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccessMessage("Password changed successfully! 🚀");
      resetForm();
      
   
      setTimeout(() => {
        onClose();
        setSuccessMessage("");
      }, 2000);
      
      setSubmitting(false);
    },
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
          />

         
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-[32px] shadow-2xl z-[101] overflow-hidden border border-gray-100"
          >
            {/* Modal Header */}
            <div className="bg-gray-50/80 px-8 py-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#0D80F2] text-white rounded-xl">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-medium text-gray-700 tracking-wider">Change Password</h2>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-2">Account Security</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 text-gray-400 hover:text-[#0D80F2] hover:bg-red-50 rounded-xl transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={formik.handleSubmit} className="p-8 space-y-5">
              
              {/* Success Message */}
              <AnimatePresence>
                {successMessage && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-green-50 text-green-600 p-3 rounded-xl flex items-center gap-2 text-sm font-bold">
                    <ShieldCheck className="w-5 h-5 shrink-0" /> {successMessage}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Old Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Old Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400   transition-colors" />
                  <input type={showPass.old ? "text" : "password"} placeholder="Enter current password" {...formik.getFieldProps('oldPassword')}
                    className={`w-full pl-12 pr-12 py-3 bg-gray-50 border-2 rounded-2xl outline-none font-bold text-sm transition-all [&::-ms-reveal]:hidden [&::-ms-clear]:hidden ${formik.touched.oldPassword && formik.errors.oldPassword ? 'border-[#0D80F2] bg-white' : 'border-transparent focus:border-[#0054a6]/30 focus:bg-white'}`}
                  />
                  <button type="button" onClick={() => toggleVisibility('old')} className="absolute right-4 top-3.5 text-gray-400 hover:text-[#0054a6] transition-colors cursor-pointer">
                    {showPass.old ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {formik.touched.oldPassword && formik.errors.oldPassword && <p className="text-[#0D80F2] text-xs font-bold pl-1">{formik.errors.oldPassword}</p>}
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">New Password</label>
                <div className="relative group">
                  <KeyRound className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 transition-colors" />
                  <input type={showPass.new ? "text" : "password"} placeholder="Enter new password" {...formik.getFieldProps('newPassword')}
                    className={`w-full pl-12 pr-12 py-3 bg-gray-50 border-2 rounded-2xl outline-none font-bold text-sm transition-all [&::-ms-reveal]:hidden [&::-ms-clear]:hidden ${formik.touched.newPassword && formik.errors.newPassword ? 'border-[#0D80F2] bg-white' : 'border-transparent focus:border-[#fc7728]/30 focus:bg-white'}`}
                  />
                  <button type="button" onClick={() => toggleVisibility('new')} className="absolute right-4 top-3.5 text-gray-400  transition-colors cursor-pointer">
                    {showPass.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {formik.touched.newPassword && formik.errors.newPassword && <p className="text-[#0D80F2] text-xs font-bold pl-1">{formik.errors.newPassword}</p>}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Confirm Password</label>
                <div className="relative group">
                  <KeyRound className="absolute left-4 top-3.5 w-5 h-5 text-gray-400   transition-colors" />
                  <input type={showPass.confirm ? "text" : "password"} placeholder="Confirm new password" {...formik.getFieldProps('confirmPassword')}
                    className={`w-full pl-12 pr-12 py-3 bg-gray-50 border-2 rounded-2xl outline-none font-bold text-sm transition-all [&::-ms-reveal]:hidden [&::-ms-clear]:hidden ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-[#0D80F2] bg-white' : 'border-transparent focus:border-[#fc7728]/30 focus:bg-white'}`}
                  />
                  <button type="button" onClick={() => toggleVisibility('confirm')} className="absolute right-4 top-3.5 text-gray-400 hover:text-[#fc7728] transition-colors cursor-pointer">
                    {showPass.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {formik.touched.confirmPassword && formik.errors.confirmPassword && <p className="text-[#0D80F2] text-xs font-bold pl-1">{formik.errors.confirmPassword}</p>}
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <button type="submit" disabled={formik.isSubmitting} className="w-full py-4 bg-[#0D80F2] text-white font-medium rounded-2xl tracking-wider shadow-xl shadow-gray-200  hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 cursor-pointer">
                  {formik.isSubmitting ? "Validating..." : "Update Password"}
                </button>
              </div>

            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ChangePasswordModal;