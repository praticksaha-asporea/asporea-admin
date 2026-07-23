import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, User, X, Loader2 } from "lucide-react";

interface Option {
  label: string;
  value: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;

  onSearchChange: (text: string) => void;
  loading?: boolean;
  placeholder?: string;
}

export const SearchableSelect = ({
  options,
  value,
  onChange,
  onSearchChange,
  loading = false,
  placeholder = "All Users in Role",
}: SearchableSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setSearch(text);
    onSearchChange(text);
  };

  const handleClear = () => {
    setSearch("");
    onSearchChange("");
  };

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative w-60" ref={dropdownRef}>
      {/* Main Clickable Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 bg-white px-3 py-2.5 rounded-2xl shadow-sm border border-gray-100 text-sm font-bold text-gray-600 hover:border-gray-200 transition-all cursor-pointer"
      >
        <div className="flex items-center gap-2 truncate">
          <User className="w-4 h-4 text-[#fc7728] shrink-0" />
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Popup Overlay */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 p-2 space-y-2">
          {/* Server Search Input */}
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-gray-400 absolute left-3" />
            <input
              type="text"
              value={search}
              onChange={handleInputChange}
              placeholder="Search user by name/phone..."
              className="w-full pl-9 pr-8 py-2 bg-gray-50 rounded-xl text-xs font-bold text-gray-700 outline-none border border-transparent focus:border-[#fc7728]/30 focus:bg-white transition-all"
              autoFocus
            />
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 text-[#fc7728] animate-spin absolute right-2.5" />
            ) : search ? (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-2.5 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : null}
          </div>

          {/* User List Options */}
          <div className="max-h-48 overflow-y-auto space-y-1">
            <button
              type="button"
              onClick={() => {
                onChange("");
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                value === ""
                  ? "bg-orange-50 text-[#fc7728]"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              All Users in Role
            </button>

            {options.length > 0 ? (
              options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold truncate transition-colors cursor-pointer ${
                    value === opt.value
                      ? "bg-orange-50 text-[#fc7728]"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))
            ) : (
              <div className="p-3 text-center text-xs font-bold text-gray-400">
                {loading ? "Searching server..." : "No matching user found"}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
