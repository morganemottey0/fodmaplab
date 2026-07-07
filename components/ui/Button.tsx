import { colors, radius } from "@/styles/tokens";
import { CSSProperties, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: Variant;
  disabled?: boolean;
  fullWidth?: boolean;
  type?: "button" | "submit";
  style?: CSSProperties;
}

const styles: Record<Variant, CSSProperties> = {
  primary: {
    background: colors.primary,
    color: "#fff",
    border: "none",
  },
  secondary: {
    background: colors.primaryLight,
    color: colors.primary,
    border: `1px solid ${colors.primaryBorder}`,
  },
  ghost: {
    background: "transparent",
    color: colors.textSecondary,
    border: `1px solid ${colors.primaryBorder}`,
  },
};

export default function Button({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  fullWidth = false,
  type = "button",
  style,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles[variant],
        width: fullWidth ? "100%" : "auto",
        padding: "14px 20px",
        borderRadius: radius.md,
        fontSize: "14px",
        fontWeight: 500,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        fontFamily: "inherit",
        transition: "opacity 0.2s",
        ...style,
      }}
    >
      {children}
    </button>
  );
}