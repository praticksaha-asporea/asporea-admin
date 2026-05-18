import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { 
  UserPlus, Mail,   ArrowLeft, 
  Phone, MessageCircle, MapPin, FileText, Save,
  Briefcase,
  Lock
} from "lucide-react";
import { motion } from "framer-motion";

const UserForm = () => {
  const navigate = useNavigate();

  // 👇 YUP VALIDATION (UNCHANGED) 👇
  const validationSchema = Yup.object({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string(),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    phoneNumber: Yup.string(),
    whatsappNumber: Yup.string(),
    address: Yup.string(),
    role: Yup.string().required("Please select a role"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    passportStatus: Yup.string(),
  });

  // 👇 FORMIK LOGIC (UNCHANGED) 👇
  const formik = useFormik({
    initialValues: { 
      firstName: "", lastName: "", email: "", phoneNumber: "", whatsappNumber: "", address: "",
      role: "", password: "", passportStatus: "not", enquired: 'no',
      notificationPreference: { sms: false, whatsapp: false, email: true }
    },
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      const savedUsers = localStorage.getItem("asporea_users");
      const currentUsers = savedUsers ? JSON.parse(savedUsers) : [];

      const newUser = {
        id: Date.now(),
        firstName: values.firstName, lastName: values.lastName, email: values.email,
        phoneNumber: values.phoneNumber, whatsappNumber: values.whatsappNumber, address: values.address,
        role: values.role, password: values.password, passportStatus: values.passportStatus,
        enquired: values.enquired, notificationPreference: values.notificationPreference,
        status: "active",
        joinDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      };

      localStorage.setItem("asporea_users", JSON.stringify([...currentUsers, newUser]));

      alert("User Added Successfully! 🚀");
      setSubmitting(false);
      navigate("/users"); 
    },
  });

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto pb-20">
      
     
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 bg-white p-4 rounded-3xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] border border-gray-50 gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/users")} 
            className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold  text-gray-700 tracking-wider font-mono ">Add New User</h1>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-3">Configure profile & access</p>
          </div>
        </div>
        
         
        
      </div>

      <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
       
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-4xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#0054a6]"></div>
            
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-blue-50 text-[#0054a6] rounded-2xl"><UserPlus className="w-6 h-6" /></div>
              <h2 className="text-2xl font-medium tracking-wider text-gray-700">Personal Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">First Name <span className="text-red-500">*</span></label>
                <div className="relative group">
                  <UserPlus className="absolute left-5 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#0054a6] transition-colors" />
                  <input type="text" placeholder="John" {...formik.getFieldProps('firstName')}
                    className={`w-full pl-14 pr-4 py-4 bg-gray-50 border-2 rounded-2xl outline-none font-bold text-gray-700 transition-all ${formik.touched.firstName && formik.errors.firstName ? 'border-red-400 focus:bg-white' : 'border-transparent focus:border-[#0054a6]/30 focus:bg-white'}`}
                  />
                </div>
                {formik.touched.firstName && formik.errors.firstName && <p className="text-red-500 text-xs font-bold mt-1 pl-2">{formik.errors.firstName}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Last Name</label>
                <div className="relative group">
                  <UserPlus className="absolute left-5 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#0054a6] transition-colors" />
                  <input type="text" placeholder="Doe" {...formik.getFieldProps('lastName')}
                    className="w-full pl-14 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-[#0054a6]/30 rounded-2xl outline-none font-bold text-gray-700 transition-all focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Email Address <span className="text-red-500">*</span></label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#0054a6] transition-colors" />
                  <input type="email" placeholder="john@asporea.com" {...formik.getFieldProps('email')}
                    className={`w-full pl-14 pr-4 py-4 bg-gray-50 border-2 rounded-2xl outline-none font-bold text-gray-700 transition-all ${formik.touched.email && formik.errors.email ? 'border-red-400 focus:bg-white' : 'border-transparent focus:border-[#0054a6]/30 focus:bg-white'}`}
                  />
                </div>
                {formik.touched.email && formik.errors.email && <p className="text-red-500 text-xs font-bold mt-1 pl-2">{formik.errors.email}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Phone Number</label>
                <div className="relative group">
                  <Phone className="absolute left-5 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#0054a6] transition-colors" />
                  <input type="text" placeholder="+91 9876543210" {...formik.getFieldProps('phoneNumber')}
                    className="w-full pl-14 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-[#0054a6]/30 rounded-2xl outline-none font-bold text-gray-700 transition-all focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">WhatsApp Number</label>
                <div className="relative group">
                  <MessageCircle className="absolute left-5 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#0054a6] transition-colors" />
                  <input type="text" placeholder="+91 9876543210" {...formik.getFieldProps('whatsappNumber')}
                    className="w-full pl-14 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-[#0054a6]/30 rounded-2xl outline-none font-bold text-gray-700 transition-all focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Full Address</label>
                <div className="relative group">
                  <MapPin className="absolute left-5 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#0054a6] transition-colors" />
                  <input type="text" placeholder="123 Street, City, Country" {...formik.getFieldProps('address')}
                    className="w-full pl-14 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-[#0054a6]/30 rounded-2xl outline-none font-bold text-gray-700 transition-all focus:bg-white"
                  />
                </div>
              </div>
               <div className="space-y-2  ">
                <label   className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Passport Status</label>
                <div className="relative group">
                  <FileText className="absolute left-5 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#fc7728] transition-colors" />
                  <select {...formik.getFieldProps('passportStatus')}
                     className="w-full pl-14 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-[#0054a6]/30 rounded-2xl outline-none font-bold text-gray-400 transition-all focus:bg-white"
                  >
                    <option value="not">Not Having</option>
                    <option value="having">Having Passport</option>
                    <option value="applied">Applied</option>
                  </select>
                </div>
              </div>
            <div>
  <h2     className="text-xs font-bold mt-2 text-gray-500 uppercase tracking-widest pl-2">
    Enquiry status
  </h2>
  <div className="flex gap-6 p-4 mt-3 rounded-2xl border border-gray-50 hover:bg-white hover:shadow-sm  transition-all">
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        name="enquired"
        value="yes"
        checked={formik.values.enquired === "yes"}
        onChange={formik.handleChange}
        className="w-5 h-5 text-[#0054a6] focus:ring-[#0054a6]"
      />
      <span className="text-sm font-bold text-gray-400">Yes</span>
    </label>
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        name="enquired"
        value="no"
        checked={formik.values.enquired === "no"}
        onChange={formik.handleChange}
        className="w-5 h-5 text-[#0054a6] focus:ring-[#0054a6]"
      />
      <span className="text-sm font-bold text-gray-400">No</span>
    </label>
  </div>
  <div className=" mt-3 -translate-x-55 "> <button 
           
          type="submit"
          disabled={formik.isSubmitting} 
          className="w-full sm:w-auto flex items-center translate-x-25 justify-center gap-2 px-8 py-3.5 bg-[#0D80F2] text-white font-bold rounded-2xl hover:bg-[#0D80F2] transform  duration-300 hover:rotate-3 hover:scale-105 hover:shadow-lg disabled:opacity-70 transition-all"
        >
          <Save className="w-4 h-4" />
          {formik.isSubmitting ? "Saving..." : "Save User"}
        </button></div>
</div>

              
            </div>
          </div>
        </div>
 
 <div className="space-y-8">
           <div className="bg-white p-8 rounded-4xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#fc7728]"></div>
            
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-orange-50 text-[#fc7728] rounded-2xl"><Briefcase className="w-6 h-6" /></div>
              <h2  className="text-2xl font-medium tracking-wider text-gray-700">Account Control</h2>
            </div>

            <div className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Role <span className="text-red-500">*</span></label>
                <div className="relative group">
                  <Briefcase className="absolute left-5 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#fc7728] transition-colors" />
                  <select {...formik.getFieldProps('role')}
                    className={`w-full pl-14 pr-4 py-4 bg-gray-50 border-2 rounded-2xl outline-none font-bold text-gray-700 appearance-none cursor-pointer transition-all ${formik.touched.role && formik.errors.role ? 'border-red-400 focus:bg-white' : 'border-transparent focus:border-[#fc7728]/30 focus:bg-white'}`}
                  >
                    <option value="" disabled>Select access level...</option>
                    <option value="admin">System Admin</option>
                    <option value="user">Regular User</option>
                    <option value="tac">TAC</option>
                    <option value="tac_head">TAC Head</option>
                    <option value="reception">Reception</option>
                    <option value="finance">Finance</option>
                    <option value="coordinator">Coordinator</option>
                    <option value="pca">PCA</option>
                    <option value="sub_pca">Sub PCA</option>
                    <option value="pcra">PCRA</option>
                    <option value="institute">Institute</option>
                    <option value="branch_head">Branch Head</option>
                  </select>
                </div>
                {formik.touched.role && formik.errors.role && <p className="text-red-500 text-xs font-bold mt-1 pl-2">{formik.errors.role}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Password <span className="text-red-500">*</span></label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#fc7728] transition-colors" />
                  <input type="password" placeholder="••••••••" {...formik.getFieldProps('password')}
                    className={`w-full pl-14 pr-4 py-4 bg-gray-50 border-2 rounded-2xl outline-none font-bold text-gray-700 transition-all ${formik.touched.password && formik.errors.password ? 'border-red-400 focus:bg-white' : 'border-transparent focus:border-[#fc7728]/30 focus:bg-white'}`}
                  />
                </div>
                {formik.touched.password && formik.errors.password && <p className="text-red-500 text-xs font-bold mt-1 pl-2">{formik.errors.password}</p>}
              </div>

           

            </div>
          </div> 
          

          <div className="bg-white p-8 rounded-4xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] border border-gray-100">
               
            
             
             <div className="space-y-6">
              
                
                <div className=" p-5 rounded-2xl">
                  <p className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-widest">Notification Channels</p>
                  <div className="flex flex-col gap-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" name="notificationPreference.email" checked={formik.values.notificationPreference.email} onChange={formik.handleChange} className="w-5 h-5 rounded text-[#fc7728] focus:ring-[#fc7728]" /> 
                      <span className="text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors">Email</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" name="notificationPreference.sms" checked={formik.values.notificationPreference.sms} onChange={formik.handleChange} className="w-5 h-5 rounded text-[#fc7728] focus:ring-[#fc7728]" /> 
                      <span className="text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors">SMS</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" name="notificationPreference.whatsapp" checked={formik.values.notificationPreference.whatsapp} onChange={formik.handleChange} className="w-5 h-5 rounded text-[#fc7728] focus:ring-[#fc7728]" /> 
                      <span className="text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors">WhatsApp</span>
                    </label>
                  </div>
                </div>
             </div>
          </div>
         

        </div>
      </form>
    </motion.div>
  );
};

export default UserForm;