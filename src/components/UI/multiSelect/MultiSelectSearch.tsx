import { useState, useRef, useEffect } from "react";
import { Search, X, ChevronDown, Check } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SelectOption = {
  value: string;
  label: string;
  meta?: string; // optional sub-label (e.g. section name)
};

interface MultiSelectSearchProps {
  options: SelectOption[];
  value: string[];                          // selected values (ids)
  onChange: (values: string[]) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  error?: string;
  accentColor?: string;                     // tailwind bg class e.g. "bg-[#0054a6]"
}

// ─── Component ────────────────────────────────────────────────────────────────

const MultiSelectSearch = ({
  options,
  value,
  onChange,
  placeholder = "Search and select...",
  label,
  required,
  error,
  accentColor = "bg-[#0054a6]",
}: MultiSelectSearchProps) => {
  const [open, setOpen]       = useState(false);
  const [query, setQuery]     = useState("");
  const containerRef          = useRef<HTMLDivElement>(null);
  const inputRef              = useRef<HTMLInputElement>(null);

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // focus input when opening
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const filtered = options.filter((opt) =>
    opt.label.toLowerCase().includes(query.toLowerCase()) ||
    (opt.meta ?? "").toLowerCase().includes(query.toLowerCase())
  );

  const toggle = (val: string) => {
    onChange(
      value.includes(val) ? value.filter((v) => v !== val) : [...value, val]
    );
  };

  const remove = (val: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== val));
  };

  const selectedOptions = options.filter((o) => value.includes(o.value));

  return (
    <div className="space-y-2" ref={containerRef}>
      {label && (
        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Trigger box */}
      <div
        onClick={() => setOpen((p) => !p)}
        className={`min-h-13.5 w-full px-4 py-3 bg-gray-50 border-2 rounded-2xl cursor-pointer transition-all flex flex-wrap gap-2 items-center ${
          error
            ? "border-red-400"
            : open
            ? "border-[#0054a6]/30 bg-white"
            : "border-transparent hover:border-gray-200"
        }`}
      >
        {selectedOptions.length === 0 ? (
          <span className="text-sm text-gray-400 font-medium select-none">{placeholder}</span>
        ) : (
          selectedOptions.map((opt) => (
            <span
              key={opt.value}
              className={`flex items-center gap-1.5 text-xs font-bold text-white px-3 py-1.5 rounded-xl ${accentColor}`}
            >
              {opt.label}
              <button
                type="button"
                onClick={(e) => remove(opt.value, e)}
                className="hover:opacity-70 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))
        )}
        <ChevronDown
          className={`w-4 h-4 text-gray-400 ml-auto shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
          style={{ maxWidth: containerRef.current?.offsetWidth }}
        >
          {/* Search input */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-xl outline-none text-sm font-medium text-gray-700 border border-transparent focus:border-gray-200"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* Options list */}
          <ul className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-sm text-gray-400 font-medium text-center">No results found</li>
            ) : (
              filtered.map((opt) => {
                const isSelected = value.includes(opt.value);
                return (
                  <li
                    key={opt.value}
                    onClick={(e) => { e.stopPropagation(); toggle(opt.value); }}
                    className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${
                      isSelected ? "bg-blue-50/60" : "hover:bg-gray-50"
                    }`}
                  >
                    <div>
                      <p className={`text-sm font-bold ${isSelected ? "text-[#0054a6]" : "text-gray-700"}`}>
                        {opt.label}
                      </p>
                      {opt.meta && (
                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-0.5">
                          {opt.meta}
                        </p>
                      )}
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#0054a6] shrink-0" />}
                  </li>
                );
              })
            )}
          </ul>

          {/* Footer count */}
          {value.length > 0 && (
            <div className="px-4 py-2.5 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-400 font-medium">{value.length} selected</span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onChange([]); }}
                className="text-xs font-bold text-red-400 hover:text-red-600 transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-red-500 text-xs font-bold pl-2">{error}</p>}
    </div>
  );
};

export default MultiSelectSearch;
