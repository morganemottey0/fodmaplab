import { colors, radius, spacing } from "@/styles/tokens";
import { CSSProperties, ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  style?: CSSProperties;
  onClick?: () => void;
}

export default function Card({ children, style, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        background: colors.surface,
        border: `1px solid ${colors.primaryBorder}`,
        borderRadius: radius.xl,
        padding: spacing.md,
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
}