"use client";

import type { ChangeEvent, ReactNode } from "react";

/* ==========================================================================
 * FloatingField
 * --------------------------------------------------------------------------
 * Reusable form-field wrapper with a "floats-up" label:
 *   - The label starts inside the field at the same y as the text.
 *   - When the field is :focus or has content, the label translates up
 *     and shrinks, revealing the value.
 *   - Underline-only border for the line-of-code aesthetic.
 *
 * Works with <input>, <textarea>, and <select>.
 * ========================================================================== */

interface BaseProps {
  id: string;
  label: string;
  required?: boolean;
  autoComplete?: string;
}

interface InputProps extends BaseProps {
  type: "text" | "email" | "tel";
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

interface TextareaProps extends BaseProps {
  type: "textarea";
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}

interface SelectProps extends BaseProps {
  type: "select";
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}

export type FloatingFieldProps = InputProps | TextareaProps | SelectProps;

export default function FloatingField(props: FloatingFieldProps) {
  const { id, label, required } = props;

  const baseClasses =
    "peer block w-full bg-transparent font-mono text-sm text-[color:var(--text-primary)] placeholder-transparent transition-colors duration-200 outline-none";
  const underline =
    "border-0 border-b border-white/15 focus:border-[color:var(--accent-primary)]";

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    props.onChange(e.target.value);

  let control: ReactNode = null;

  if (props.type === "textarea") {
    control = (
      <textarea
        id={id}
        value={props.value}
        onChange={onChange}
        placeholder=" "
        rows={props.rows ?? 4}
        required={required}
        data-cursor="text"
        className={`${baseClasses} ${underline} resize-none pt-6 pb-2`}
      />
    );
  } else if (props.type === "select") {
    control = (
      <select
        id={id}
        value={props.value}
        onChange={onChange}
        required={required}
        data-cursor="hover"
        className={`${baseClasses} ${underline} appearance-none pr-8 pt-6 pb-2`}
      >
        <option value="" disabled hidden>
          {label}
        </option>
        {props.options.map((o) => (
          <option
            key={o.value}
            value={o.value}
            className="bg-[color:var(--bg-secondary)]"
          >
            {o.label}
          </option>
        ))}
      </select>
    );
  } else {
    control = (
      <input
        id={id}
        type={props.type}
        value={props.value}
        onChange={onChange}
        placeholder=" "
        required={required}
        autoComplete={props.autoComplete}
        data-cursor="text"
        className={`${baseClasses} ${underline} pt-6 pb-2`}
      />
    );
  }

  // For select inputs the value is always "defined" visually, so the label
  // must float permanently once a value is chosen. Force the "filled" state.
  const alwaysFloat = props.type === "select" && props.value !== "";

  return (
    <div className="relative">
      {control}

      <label
        htmlFor={id}
        className={`pointer-events-none absolute left-0 origin-left font-mono uppercase transition-all duration-200 ease-out
          peer-placeholder-shown:top-[22px] peer-placeholder-shown:text-[13px] peer-placeholder-shown:tracking-[0.02em] peer-placeholder-shown:text-[color:var(--text-muted)]
          peer-focus:top-0 peer-focus:text-[9px] peer-focus:tracking-[0.32em] peer-focus:text-[color:var(--accent-primary)]
          top-0 text-[9px] tracking-[0.32em] text-[color:var(--text-muted)]
          ${alwaysFloat ? "!top-0 !text-[9px] !tracking-[0.32em]" : ""}
        `}
      >
        {label}
        {required && <span className="ml-1 text-[color:var(--accent-tertiary)]">*</span>}
      </label>

      {/* Select caret */}
      {props.type === "select" && (
        <span
          aria-hidden
          className="pointer-events-none absolute right-1 top-6 text-[color:var(--text-muted)]"
        >
          ▾
        </span>
      )}
    </div>
  );
}
