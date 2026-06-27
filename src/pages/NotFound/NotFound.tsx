import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useLottie } from "lottie-react";
import { useNavigate } from "react-router-dom";

 
import notFoundAnim from "../../assets/Lonely 404.json"; 
import asporeaLogo from "../../assets/asporeaLogo.png";

 
const LottiePlayer = ({ animationData }: { animationData: any }) => {
  const { View } = useLottie({
    animationData: animationData,
    loop: true,
    autoplay: true,
  });
  return <>{View}</>;
};

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-100 p-4 overflow-hidden">
       
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-250 h-150 bg-white/70 backdrop-blur-2xl rounded-[60px] shadow-2xl overflow-hidden flex border border-white/50"
      >
        
        {/* LEFT PANEL: Logo Center */}
        <div className="w-1/2 relative flex flex-col items-center justify-center p-16 text-center   bg-white/30">
          <motion.img
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            src={asporeaLogo}
            alt="Asporea Logo"
            className="w-48 h-auto object-contain mix-blend-multiply brightness-110 contrast-125"
          />
          <p className="mt-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.12em]">
            Asporea Human Resource Consultants <br /> Pvt. Ltd.
          </p>
        </div>

        {/* RIGHT PANEL: Lottie 404 & Text */}
        <div className="w-1/2 relative flex flex-col items-center justify-center p-12 text-center bg-white">
          
          
         

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative z-10 flex flex-col items-center justify-center w-full"
          >
            
            <div className="w-80 h-64 drop-shadow-xl -mt-6 mb-2">
               <LottiePlayer animationData={notFoundAnim} />
            </div>

            <h1 className="text-3xl font-medium text-slate-600 tracking-tight mb-3">
              Oops! Page Not Found
            </h1>
            
            <p className="text-slate-500 text-sm leading-relaxed mb-10 max-w-sm px-4">
              The page you are looking for might have been removed or does not exist.
            </p>

            <motion.button
              whileHover={{ x: 5, scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-3 px-8 py-3.5 bg-[#0D80F2] text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-200"
            >
              Back to Dashboard <ChevronRight className="w-5 h-5" />
            </motion.button>
          </motion.div>

        </div>
      </motion.div>

    </div>
  );
};

export default NotFound;