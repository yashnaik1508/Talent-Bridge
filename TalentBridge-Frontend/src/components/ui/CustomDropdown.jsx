import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export default function CustomDropdown({ 
  options = [], 
  value, 
  onChange, 
  placeholder = "-- Select --", 
  label,
  icon: Icon,
  className = "",
  emptyMessage = "No options available"
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const dropdownHeight = 200; // Estimated max height
      setDropUp(spaceBelow < dropdownHeight && rect.top > dropdownHeight);
    }
  }, [isOpen]);

  const selectedOption = options.find(opt => opt.value?.toString() === value?.toString());

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{label}</label>}
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={18} />}
        
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full ${Icon ? 'pl-10' : 'px-4'} pr-10 py-2.5 text-left bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 dark:text-white flex justify-between items-center shadow-sm`}
        >
          <span className={!selectedOption ? "text-slate-400" : ""}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown className={`text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} size={16} />
        </button>

        {isOpen && (
          <div className={`absolute z-50 w-full ${dropUp ? "bottom-full mb-2" : "mt-2"} bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-${dropUp ? "bottom" : "top"}-2 duration-200`}>
            <div className="max-h-[200px] overflow-y-auto custom-scrollbar p-1">
              {options.map((opt) => {
                const isSelected = value?.toString() === opt.value?.toString();
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 rounded-lg flex items-center justify-between transition-colors ${
                      isSelected 
                      ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold" 
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && <Check size={16} className="text-blue-600 dark:text-blue-400" />}
                  </button>
                );
              })}
              {options.length === 0 && (
                <div className="px-4 py-3 text-sm text-slate-500 text-center">{emptyMessage}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
