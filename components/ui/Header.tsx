import { colors } from "@/styles/tokens";
import { ReactNode } from "react";

interface HeaderProps {
  label?: string;
  title: string;
  subtitle?: string;
  right?: ReactNode;
}

export default function Header({ label, title, subtitle, right }: HeaderProps) {
  return (
    <div style={{
      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
      padding: "52px 24px 28px",
      position: "relative",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          {label && (
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", margin: "0 0 4px", letterSpacing: "0.08em" }}>
              {label}
            </p>
          )}
          <h1 style={{ fontSize: "26px", fontWeight: 600, color: "#fff", margin: 0, letterSpacing: "-0.03em", lineHeight: 1.2 }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", margin: "6px 0 0" }}>
              {subtitle}
            </p>
          )}
        </div>
        {right && <div>{right}</div>}
      </div>

      {/* Decoration circles */}
      <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "120px", height: "120px", borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
      <div style={{ position: "absolute", top: "20px", right: "40px", width: "60px", height: "60px", borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
    </div>
  );
}