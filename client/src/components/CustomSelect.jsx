import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

const CustomSelect = ({ value, onChange, options, name }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2.5 rounded-md bg-slate-900 border border-slate-800 text-sm font-medium text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-left"
      >
        <span className="truncate">{value}</span>
        <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-slate-900 border border-slate-800 rounded-lg shadow-xl overflow-hidden py-2 max-h-60 overflow-y-auto animate-fade-in">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange({ target: { name, value: opt } });
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:bg-slate-800 ${
                value === opt ? 'text-blue-400 bg-slate-800/50' : 'text-slate-300'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
