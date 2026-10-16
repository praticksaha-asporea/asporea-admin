import React, { useEffect, useRef } from "react";
import { RefreshCw } from "lucide-react";

interface CaptchaBoxProps {
  code: string;
  onRefresh: () => void;
}

export const CaptchaBox: React.FC<CaptchaBoxProps> = ({ code, onRefresh }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background Gradient
    const gradient = ctx.createLinearGradient(
      0,
      0,
      canvas.width,
      canvas.height,
    );
    gradient.addColorStop(0, "#f1f5f9");
    gradient.addColorStop(1, "#e2e8f0");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add noise lines (for anti-OCR/Bot protection)
    for (let i = 0; i < 7; i++) {
      ctx.strokeStyle = `rgba(13, 128, 242, ${0.2 + Math.random() * 0.3})`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // Render distorted characters
    ctx.font = "bold 22px 'Courier New', monospace";
    for (let i = 0; i < code.length; i++) {
      ctx.save();
      const x = 18 + i * 22;
      const y = 28 + (Math.random() * 4 - 2);
      const angle = (Math.random() - 0.5) * 0.4; // Rotation angle

      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = ["#0054a6", "#0D80F2", "#1e293b", "#0f172a"][i % 4];
      ctx.fillText(code[i], 0, 0);
      ctx.restore();
    }
  }, [code]);

  return (
    <div className="flex items-center gap-3  p-2 rounded-2xl  ">
      <canvas
        ref={canvasRef}
        width={150}
        height={42}
        className="rounded-xl bg-slate-100 shadow-2xl cursor-not-allowed select-none"
      />
      <button
        type="button"
        onClick={onRefresh}
        title="Refresh Captcha"
        className="p-2.5   text-[#0D80F2] hover:bg-[#0D80F2] hover:text-white rounded-xl transition-all   cursor-pointer"
      >
        <RefreshCw size={18} />
      </button>
    </div>
  );
};
