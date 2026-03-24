
import { useState, useRef, useEffect } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

const labelBase =
  "absolute left-3 -top-2 px-1 text-[10px] leading-none z-10 " +
  "text-gray-500 dark:text-slate-400 bg-white dark:bg-[#1e293b]";

const inputBase =
  "w-full px-3 text-sm rounded-lg border outline-none transition " +
  "bg-white dark:bg-[#0f172a] " +
  "text-gray-800 dark:text-white " +
  "focus:ring-2 focus:ring-offset-0 ";

const inputNormal =
  "border-gray-300 dark:border-slate-600 " +
  "focus:border-blue-400 dark:focus:border-blue-500 " +
  "focus:ring-blue-100 dark:focus:ring-blue-900/30";

const inputError =
  "border-red-400 dark:border-red-500 " +
  "focus:border-red-400 dark:focus:border-red-500 " +
  "focus:ring-red-100 dark:focus:ring-red-900/30";

/* ─── FormField ──────────────────────────────────────────────────────────── */
export const FormField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  height = "h-9",
  autoComplete,
}) => {
  const [show, setShow] = useState(false);
  const isPwd = type === "password";
  const id = `field-${name}`;
  const hasError = Boolean(error);

  return (
    <div className="flex flex-col gap-0.5">
      <div className="relative">
        <label htmlFor={id} className={labelBase}>
          {label}
        </label>
        <input
          id={id}
          name={name}
          type={isPwd ? (show ? "text" : "password") : type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          autoComplete={autoComplete}
          style={isPwd ? { paddingRight: "2.2rem" } : {}}
          className={`${inputBase} ${height} ${hasError ? inputError : inputNormal}`}
          aria-describedby={hasError ? `${id}-error` : undefined}
          aria-invalid={hasError}
        />
        {isPwd && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-2.5 top-1/2 -translate-y-1/2
                       text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-white
                       transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded"
          >
            {show ? <FiEye size={13} /> : <FiEyeOff size={13} />}
          </button>
        )}
      </div>
      {hasError && (
        <p id={`${id}-error`} role="alert" className="text-[10px] text-red-500 dark:text-red-400 pl-1 leading-tight">
          {error}
        </p>
      )}
    </div>
  );
};

/* ─── FormSelect — custom dropdown (same style as CreateJobModal) ─────────── */
export const FormSelect = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  options,
  placeholder,
  error,
}) => {
  const [open, setOpen] = useState(false);
  const ref             = useRef(null);
  const id              = `field-${name}`;
  const hasError        = Boolean(error);

  // Normalise options to { value, label }
  const normalised = options.map((o) =>
    typeof o === "string" ? { value: o, label: o } : o
  );

  const selected = normalised.find((o) => o.value === value);

  // Close on outside click — do NOT trigger onBlur here,
  // only validate after the user has actually picked a value
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (opt) => {
    onChange?.({ target: { name, value: opt.value } });
    setOpen(false);
    // Trigger blur ONLY after a real selection so Zod validates the chosen value
    onBlur?.({ target: { name } });
  };

  return (
    <div className="flex flex-col gap-0.5">
      <div ref={ref} className="relative">

        {/* Floating label */}
        <label
          htmlFor={id}
          className={`absolute left-3 px-1 text-[10px] leading-none z-10
                      bg-white dark:bg-[#1e293b] transition-all pointer-events-none
                      ${open || selected
                        ? "-top-2 text-gray-500 dark:text-slate-400"
                        : "top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500"
                      }`}
        >
          {label}
        </label>

        {/* Trigger button */}
        <button
          id={id}
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-describedby={hasError ? `${id}-error` : undefined}
          className={`w-full h-9 flex items-center justify-between
                      px-3 text-sm rounded-lg border outline-none transition-all
                      bg-white dark:bg-[#0f172a] text-left
                      focus:ring-2 focus:ring-offset-0
                      ${hasError
                        ? "border-red-400 dark:border-red-500 focus:ring-red-100 dark:focus:ring-red-900/30"
                        : open
                          ? "border-blue-400 dark:border-blue-500 ring-2 ring-blue-100 dark:ring-blue-900/30"
                          : "border-gray-300 dark:border-slate-600 hover:border-gray-400 dark:hover:border-slate-500"
                      }`}
        >
          <span className={selected ? "text-gray-800 dark:text-white" : "text-transparent"}>
            {selected ? selected.label : placeholder || "—"}
          </span>

          {/* Chevron */}
          <svg
            width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            className={`shrink-0 text-gray-400 dark:text-slate-500 transition-transform duration-200
                        ${open ? "rotate-180" : ""}`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {/* Dropdown panel */}
        {open && (
          <div
            role="listbox"
            aria-label={label}
            className="absolute z-50 left-0 right-0 top-full mt-1
                       bg-white dark:bg-[#1e293b]
                       border border-gray-200 dark:border-slate-600
                       rounded-xl shadow-xl dark:shadow-black/50
                       overflow-hidden"
          >
            <ul className="max-h-48 overflow-y-auto py-1">
              {normalised.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <li key={opt.value} role="option" aria-selected={isSelected}>
                    <button
                      type="button"
                      onClick={() => handleSelect(opt)}
                      className={`w-full flex items-center justify-between gap-2
                                  px-3 py-2 text-sm text-left transition-colors duration-100
                                  ${isSelected
                                    ? "bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 font-semibold"
                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/60"
                                  }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0
                          ${isSelected ? "bg-blue-500" : "bg-gray-300 dark:bg-slate-600"}`} />
                        {opt.label}
                      </span>
                      {isSelected && (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                             stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" className="shrink-0">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {hasError && (
        <p id={`${id}-error`} role="alert" className="text-[10px] text-red-500 dark:text-red-400 pl-1 leading-tight">
          {error}
        </p>
      )}
    </div>
  );
};


export const FormRadio = ({ name, value, checked, onChange, label }) => (
  <label className="flex items-center gap-1.5 cursor-pointer select-none">
    <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="sr-only" />
    <span
      className={`grid place-items-center w-3.5 h-3.5 rounded-full border-2 transition shrink-0
                  ${checked ? "border-blue-500" : "border-gray-300 dark:border-slate-600"}`}
    >
      {checked && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
    </span>
    <span className={`text-xs transition ${checked ? "text-blue-600 dark:text-blue-400 font-medium" : "text-gray-600 dark:text-slate-400"}`}>
      {label}
    </span>
  </label>
);