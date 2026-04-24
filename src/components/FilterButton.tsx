"use client";

import { useState } from "react";

interface FilterButtonProps {
  icon: React.ReactNode;
  label: string;
  count: number;
  options?: string[];
}

export default function FilterButton({ icon, label, count, options = [] }: FilterButtonProps) {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const isActive = hovered || expanded;

  const toggleOption = (opt: string) => {
    setSelectedOptions((prev) =>
      prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]
    );
  };

  return (
    <div
      style={{
        ...styles.wrapper,
        background: isActive
          ? "linear-gradient(135deg, rgba(208,255,79,0.35) 0%, rgba(208,255,79,0.08) 100%)"
          : "white",
        borderColor: isActive ? "rgba(208,255,79,0.6)" : "#E5E5E5",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Header row */}
      <button
        style={styles.header}
        onClick={() => setExpanded((v) => !v)}
      >
        <span style={styles.headerLeft}>
          <span style={styles.iconWrap}>{icon}</span>
          <span style={styles.labelText}>{label}</span>
        </span>
        <span style={styles.badge}>{count}</span>
      </button>

      {/* Expanded options */}
      {expanded && options.length > 0 && (
        <div style={styles.optionsGrid}>
          {options.map((opt) => {
            const sel = selectedOptions.includes(opt);
            return (
              <button
                key={opt}
                onClick={() => toggleOption(opt)}
                style={{
                  ...styles.optionPill,
                  borderColor: sel ? "var(--foreground)" : "#bbb",
                  fontWeight: sel ? 900 : 700,
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    borderRadius: 16,
    border: "1px solid #E5E5E5",
    overflow: "hidden",
    transition: "background 0.25s ease, border-color 0.25s ease",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: "12px 16px",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontFamily: "var(--font-sans)",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  iconWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#555",
    fontSize: 16,
  },
  labelText: {
    fontSize: 15,
    fontWeight: 900,
    color: "var(--foreground)",
  },
  badge: {
    background: "var(--primary-green)",
    color: "black",
    fontSize: 11,
    fontWeight: 900,
    borderRadius: 999,
    width: 24,
    height: 24,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  optionsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 8,
    padding: "0 12px 12px",
  },
  optionPill: {
    background: "none",
    border: "1.5px dashed #bbb",
    borderRadius: 999,
    padding: "6px 10px",
    fontSize: 11,
    fontWeight: 700,
    color: "var(--foreground)",
    cursor: "pointer",
    fontFamily: "var(--font-sans)",
    textAlign: "center",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    transition: "border-color 0.15s ease, font-weight 0.15s ease",
  },
};
