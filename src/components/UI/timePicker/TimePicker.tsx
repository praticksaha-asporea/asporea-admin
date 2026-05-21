import { Clock } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TimePickerProps {
  value: string;           // "HH:MM" 24-hour format
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const HOURS   = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = ["00", "15", "30", "45"];

function parseTime(value: string): { h: string; m: string } {
  const [h = "08", m = "00"] = (value ?? "").split(":");
  // snap minute to nearest slot
  const snapped = MINUTES.reduce((prev, cur) =>
    Math.abs(Number(cur) - Number(m)) < Math.abs(Number(prev) - Number(m)) ? cur : prev
  );
  return { h: h.padStart(2, "0"), m: snapped };
}

// ─── Component ────────────────────────────────────────────────────────────────

const TimePicker = ({ value, onChange, label, required }: TimePickerProps) => {
  const { h, m } = parseTime(value);

  const handleHour   = (e: React.ChangeEvent<HTMLSelectElement>) => onChange(`${e.target.value}:${m}`);
  const handleMinute = (e: React.ChangeEvent<HTMLSelectElement>) => onChange(`${h}:${e.target.value}`);

  // display label: "08:30 AM" style
  const displayHour = Number(h);
  const ampm  = displayHour >= 12 ? "PM" : "AM";
  const hour12 = displayHour % 12 === 0 ? 12 : displayHour % 12;

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="flex items-center gap-2 bg-gray-50 border-2 border-transparent focus-within:border-gray-200 rounded-2xl px-4 py-3 transition-all focus-within:bg-white">
        <Clock className="w-5 h-5 text-gray-400 shrink-0" />

        {/* Hour */}
        <select
          value={h}
          onChange={handleHour}
          className="bg-transparent outline-none font-black text-gray-700 text-sm cursor-pointer"
        >
          {HOURS.map((hr) => {
            const n = Number(hr);
            const ap = n >= 12 ? "PM" : "AM";
            const h12 = n % 12 === 0 ? 12 : n % 12;
            return (
              <option key={hr} value={hr}>
                {String(h12).padStart(2, "0")} {ap}
              </option>
            );
          })}
        </select>

        <span className="text-gray-400 font-black text-sm">:</span>

        {/* Minute */}
        <select
          value={m}
          onChange={handleMinute}
          className="bg-transparent outline-none font-black text-gray-700 text-sm cursor-pointer"
        >
          {MINUTES.map((min) => (
            <option key={min} value={min}>{min}</option>
          ))}
        </select>

        {/* Read-only badge */}
        <span className="ml-auto text-xs font-black text-[#0054a6] bg-blue-50 px-2 py-1 rounded-lg shrink-0">
          {String(hour12).padStart(2, "0")}:{m} {ampm}
        </span>
      </div>
    </div>
  );
};

export default TimePicker;
