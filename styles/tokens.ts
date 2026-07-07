export const colors = {
    // Primaires
    primary: "#6C63D4",
    primaryDark: "#4C45A5",
    primaryLight: "#F0EEFF",
    primaryBorder: "#DDD8F5",
  
    // Surfaces
    background: "#F9F8FF",
    surface: "#FFFFFF",
    surfaceAlt: "#F0EEFF",
  
    // Textes
    textPrimary: "#2D2660",
    textSecondary: "#7B74C0",
    textMuted: "#A89FE0",
  
    // Statuts
    low: { bg: "#E8F5E9", border: "#C8E6C9", dot: "#4CAF50", text: "#1B5E20" },
    medium: { bg: "#FFF8E1", border: "#FFE0B2", dot: "#FF9800", text: "#E65100" },
    high: { bg: "#FFEBEE", border: "#FFCDD2", dot: "#F44336", text: "#B71C1C" },
  } as const;
  
  export const radius = {
    sm: "10px",
    md: "16px",
    lg: "20px",
    xl: "28px",
    full: "9999px",
  } as const;
  
  export const spacing = {
    xs: "8px",
    sm: "12px",
    md: "16px",
    lg: "24px",
    xl: "32px",
  } as const;