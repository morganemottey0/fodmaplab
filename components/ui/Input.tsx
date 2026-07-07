import { colors, radius } from "@/styles/tokens";
import { CSSProperties } from "react";

interface InputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  label?: string;
  type?: string;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  style?: CSSProperties;
}

export default function Input({
  value,
  onChange,
  placeholder,
  label,
  type = "text",
  onKeyDown,
  style,
}: InputProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {label && (
        <label style={{ fontSize: "11px", color: colors.textMuted, letterSpacing: "0.08em" }}>
          {label.toUpperCase()}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        style={{
          background: colors.primaryLight,
          border: `1px solid ${colors.primaryBorder}`,
          borderRadius: radius.md,
          padding: "13px 16px",
          fontSize: "15px",
          color: colors.textPrimary,
          outline: "none",
          width: "100%",
          boxSizing: "border-box",
          fontFamily: "inherit",
          ...style,
        }}
      />
    </div>
  );
}