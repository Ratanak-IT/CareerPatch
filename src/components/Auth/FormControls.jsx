
import { useState } from "react";
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
            onClick={() => setShow(s => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-2.5 top-1/2 -translate-y-1/2
                       text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-white
                       transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded"
          >
            {show ? <FiEye size={13}/> : <FiEyeOff size={13}/>}
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

/* ─── FormSelect ─────────────────────────────────────────────────────────── */
export const FormSelect = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  options,
  placeholder,
  error,
  height = "h-9",
}) => {
  const id = `field-${name}`;
  const hasError = Boolean(error);

  return (
    <div className="flex flex-col gap-0.5">
      <div className="relative">
        <label htmlFor={id} className={labelBase}>
          {label}
        </label>
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`${inputBase} ${height} pr-8 appearance-none ${hasError ? inputError : inputNormal}`}
          aria-describedby={hasError ? `${id}-error` : undefined}
          aria-invalid={hasError}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map(o => (
            <option key={o.value ?? o} value={o.value ?? o} className="bg-white dark:bg-[#0f172a]">
              {o.label ?? o}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 dark:text-slate-500"
          fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
        </svg>
      </div>
      {hasError && (
        <p id={`${id}-error`} role="alert" className="text-[10px] text-red-500 dark:text-red-400 pl-1 leading-tight">
          {error}
        </p>
      )}
    </div>
  );
};

/* ─── FormRadio ──────────────────────────────────────────────────────────── */
export const FormRadio = ({ name, value, checked, onChange, label }) => (
  <label className="flex items-center gap-1.5 cursor-pointer select-none">
    <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="sr-only"/>
    <span
      className={`grid place-items-center w-3.5 h-3.5 rounded-full border-2 transition shrink-0
                  ${checked ? "border-blue-500" : "border-gray-300 dark:border-slate-600"}`}
    >
      {checked && <span className="w-1.5 h-1.5 rounded-full bg-blue-500"/>}
    </span>
    <span className={`text-xs transition ${checked ? "text-blue-600 dark:text-blue-400 font-medium" : "text-gray-600 dark:text-slate-400"}`}>
      {label}
    </span>
  </label>
);