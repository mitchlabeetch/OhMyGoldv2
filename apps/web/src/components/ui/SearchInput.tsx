import { useEffect, useState, type ChangeEvent } from "react";
import { Search, X } from "lucide-react";

type SearchInputProps = {
  placeholder?: string;
  onSearch: (value: string) => void;
  debounceMs?: number;
  defaultValue?: string;
  className?: string;
  "aria-label"?: string;
};

export function SearchInput({
  placeholder = "Search…",
  onSearch,
  debounceMs = 300,
  defaultValue = "",
  className = "",
  "aria-label": ariaLabel,
}: SearchInputProps) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    const timer = setTimeout(() => onSearch(value), debounceMs);
    return () => clearTimeout(timer);
  }, [value, debounceMs, onSearch]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleClear = () => {
    setValue("");
    onSearch("");
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      <Search
        className="absolute left-3 w-4 h-4 text-text-muted pointer-events-none"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label={ariaLabel ?? placeholder}
        className="w-full pl-9 pr-9 py-2 bg-surface-card border border-border rounded-lg text-sm text-white placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400/50 transition-colors"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-3 text-text-muted hover:text-white transition-colors"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
