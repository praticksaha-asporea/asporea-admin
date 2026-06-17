import { useState } from "react";
import { useLogin } from "./useLogin";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  ChevronRight,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";

import { useLottie } from "lottie-react";
import loginAnimation from "../loginAnimation.json";
import secondAnimation from "../secondAnimation.json";
import asporeaLogo from "../../assets/asporeaLogo.png";
import LoadingSpinner from "../../components/UI/loadingSpinner/LoadingSpinner";

const LottiePlayer = ({ animationData }: { animationData: any }) => {
  const { View } = useLottie({
    animationData: animationData,
    loop: true,
    autoplay: true,
  });
  return <>{View}</>;
};

const Login = () => {
  const { loginFormik, loading } = useLogin();//, rememberMe, setRememberMe 
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-100 p-4 overflow-hidden">
      {/* BACKGROUND IMAGE */}
      {/* <div 
        className="absolute inset-0   bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url( 'https://images.unsplash.com/photo-1651527567593-32c04202ed85?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8d2hpdGUlMjBpbGx1c3RyYXRpb25iJTIwZ3xlbnwwfHwwfHx8MA%3D%3D')" }} //  
      >
           
      </div> */}

      {/* MAIN CONTAINER */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05, filter: "blur(20px)" }}
        className="relative z-10 w-full max-w-250 h-150 bg-white/70 backdrop-blur-2xl rounded-[60px] shadow-2xl overflow-hidden flex border border-white/50"
      >
        {/* LEFT PANEL: Welcome Gate */}
        <div className="w-1/2 relative flex flex-col items-center justify-center p-16 text-center overflow-hidden">
          <AnimatePresence>
            {isLoginVisible && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onClick={() => setIsLoginVisible(false)}
                // Logo ke barabar (top-16) aur opposite side (right-10) rakha hai
                className="absolute top-24 right-98 z-50 text-gray-400 tracking-wider hover:text-[#0D80F2] font-bold font-mono transition-colors  text-[15px] uppercase  cursor-pointer"
              >
                ← Back
              </motion.button>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {!isLoginVisible && (
              <motion.img
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                src={asporeaLogo}
                alt="Asporea Logo"
                className="absolute top-22 h-12 w-auto object-contain mix-blend-multiply brightness-110 contrast-125 z-10"
              />
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {!isLoginVisible ? (
              <motion.div
                key="welcome-text"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
                className="relative z-10 flex flex-col items-center transform translate-y-12 w-full"
              >
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.12em] mb-5 -mt-9 whitespace-nowrap">
                  Asporea Human Resource Consultants <br /> Pvt. Ltd.
                </p>

                <motion.div
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  className="bg-[#0054a6] p-5 rounded-3xl mb-8 shadow-xl shadow-blue-200"
                >
                  <ShieldCheck className="w-10 h-10 text-white" />
                </motion.div>

                <h1 className="text-3xl font-medium mb-8 tracking-tight italic">
                  Hello, Welcome!
                </h1>

                <motion.button
                  whileHover={{ x: 10 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsLoginVisible(true)}
                  className="flex items-center gap-4 px-12 py-4 bg-[#0D80F2] text-white rounded-2xl font-bold transition-all shadow-xl"
                >
                  Login <ChevronRight className="w-5 h-5" />
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="left-animation"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="relative z-10 flex flex-col items-center justify-center w-full mt-10"
              >
                {/* SECOND ANIMATION USING HELPER COMPONENT */}
                <div className="w-full max-w-87.5 drop-shadow-2xl">
                  <LottiePlayer animationData={secondAnimation} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT PANEL: Illustration Banner */}
        <div className="w-1/2 relative flex items-center justify-center p-12 text-white text-center overflow-hidden">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>

          <motion.div className="relative z-10 flex flex-col items-center justify-center w-full">
            <div className="w-full max-w-95 lg:max-w-112.5 drop-shadow-2xl">
              <LottiePlayer animationData={loginAnimation} />
            </div>
          </motion.div>
        </div>

        <AnimatePresence>
          {isLoginVisible && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 80, damping: 20 }}
              className="absolute top-0 right-0 h-full w-1/2 bg-white z-50  flex flex-col justify-start pt-24 p-16"
            >
              {loading && (
                <div className="absolute inset-0 z-100 bg-white/60 backdrop-blur-sm rounded-l-none">
                  <LoadingSpinner />
                </div>
              )}

              <div className="mb-10 -mt-2 text-center translate-x-3">
                <img
                  src={asporeaLogo}
                  alt="Asporea Logo"

                  className="w-55 h-auto mx-auto object-contain"
                />
              </div>

              <form onSubmit={loginFormik.handleSubmit} className="space-y-5">
                {/* Email Input */}
                <div className="group relative">
                  <Mail className="absolute left-5 top-5 w-5 h-5 text-gray-400 group-focus-within:text-[#0D80F2] transition-colors" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Admin Email"
                    value={loginFormik.values.email}
                    onChange={loginFormik.handleChange}
                    className={`w-full pl-14 pr-6 py-4 bg-gray-50 border-2 outline-none rounded-2xl md:rounded-3xl transition-all font-bold text-sm ${loginFormik.touched.email && loginFormik.errors.email ? 'border-red-500 bg-white' : 'border-transparent focus:border-[#0D80F2]/30 focus:bg-white'}`}
                  />
                </div>

                {/* Password Input */}
                <div className="group relative">
                  <Lock className="absolute left-5 top-5 w-5 h-5 text-gray-400 group-focus-within:text-[#0D80F2] transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={loginFormik.values.password}
                    onChange={loginFormik.handleChange}
                    className={`w-full pl-14 pr-14 py-4 bg-gray-50 border-2 outline-none rounded-2xl md:rounded-3xl transition-all font-bold text-sm [&::-ms-reveal]:hidden [&::-ms-clear]:hidden ${loginFormik.touched.password && loginFormik.errors.password ? 'border-red-500 bg-white' : 'border-transparent focus:border-[#0D80F2]/30 focus:bg-white'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-5 text-gray-400 hover:text-[#0D80F2] transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className="flex justify-end px-2">
                  <button
                    type="button"
                    onClick={() => {

                      console.log("Forgot password clicked");
                    }}
                    className="text-[13px] font-bold text-gray-500 hover:text-[#0D80F2] transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-4 px-12 py-4  mt-24 translate-x-30 bg-[#0D80F2] text-white rounded-2xl font-bold transition-all shadow-xl"
                >
                  {loading ? "Authenticating..." : "Login"}
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Login;
