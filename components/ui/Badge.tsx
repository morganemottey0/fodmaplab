import { colors } from "@/styles/tokens";

type Level = "low" | "medium" | "high";

const LABELS: Record<Level, string> = {
  low: "Low FODMAP",
  medium: "Modéré",
  high: "High FODMAP",
};

export default function Badge({ level }: { level: Level }) {
  const cfg = colors[level];
  return (
    <span style={{
      background: cfg.bg,
      border: `1px solid ${cfg.border}`,
      color: cfg.text,
      fontSize: "11px",
      fontWeight: 500,
      padding: "4px 12px",
      borderRadius: "9999px",
      display: "inline-block",
    }}>
      {LABELS[level]}
    </span>
  );
}