import React, { useState, useRef, useCallback, useEffect } from "react";
import { Linkedin, MapPin } from "lucide-react";

const PIXEL_SIZE = 28; // px — size of each pixel cell

function buildPixels(w, h) {
  const cols = Math.ceil(w / PIXEL_SIZE);
  const rows = Math.ceil(h / PIXEL_SIZE);
  return Array.from({ length: cols * rows }, () => ({
    show: Math.random() > 0.48,
    duration: 80 + Math.floor(Math.random() * 200),
    delay: Math.floor(Math.random() * 400),
  }));
}

export default function GuardianCard({ guardian, isGray, onHoverChange }) {
  const [isHovered, setIsHovered] = useState(false);
  const [pixels, setPixels] = useState([]);
  const [gridSize, setGridSize] = useState({ cols: 0, rows: 0 });
  const cardRef = useRef(null);

  // Measure card and build pixel data
  const buildGrid = useCallback(() => {
    if (!cardRef.current) return;
    const { offsetWidth: w, offsetHeight: h } = cardRef.current;
    const cols = Math.ceil(w / PIXEL_SIZE);
    const rows = Math.ceil(h / PIXEL_SIZE);
    setGridSize({ cols, rows });
    setPixels(buildPixels(w, h));
  }, []);

  useEffect(() => {
    buildGrid();
    window.addEventListener("resize", buildGrid);
    return () => window.removeEventListener("resize", buildGrid);
  }, [buildGrid]);

  const handleMouseEnter = useCallback(() => {
    // Re-randomize on each hover for variety
    if (cardRef.current) {
      const { offsetWidth: w, offsetHeight: h } = cardRef.current;
      setPixels(buildPixels(w, h));
    }
    setIsHovered(true);
    onHoverChange(guardian.id);
  }, [guardian.id, onHoverChange]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    onHoverChange(null);
  }, [onHoverChange]);

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
    >
      {/* Image */}
      <img
        src={guardian.image_url}
        alt={guardian.name}
        className="absolute inset-0 w-full h-full object-cover"
        draggable="false"
        style={{
          filter: isGray ? "grayscale(100%)" : "grayscale(0%)",
          transform: isHovered ? "scale(1.06)" : "scale(1)",
          transition: "filter 0.5s ease, transform 0.6s ease",
        }}
      />

      {/* Pixel grid — full image coverage */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${gridSize.cols}, ${PIXEL_SIZE}px)`,
          gridTemplateRows: `repeat(${gridSize.rows}, ${PIXEL_SIZE}px)`,
        }}
      >
        {pixels.map((p, i) => (
          <div
            key={i}
            style={{
              width: PIXEL_SIZE,
              height: PIXEL_SIZE,
              backgroundColor: "#C8FF00",
              opacity: isHovered && p.show ? 0.88 : 0,
              transition: isHovered
                ? `opacity ${p.duration}ms ${p.delay}ms`
                : `opacity 150ms 0ms`,
            }}
          />
        ))}
      </div>

      {/* Dark gradient */}
      <div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)",
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      />

      {/* Country badge */}
      {guardian.country && (
        <div
          className="absolute top-3 left-3 z-30"
          style={{
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? "translateY(0)" : "translateY(-6px)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
          }}
        >
          <span className="bg-white/90 backdrop-blur-sm text-black text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <MapPin className="w-3 h-3" />
            {guardian.country}
          </span>
        </div>
      )}

      {/* Badge */}
      {guardian.badge_text && (
        <div
          className="absolute top-3 right-3 z-30"
          style={{
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? "translateY(0)" : "translateY(-6px)",
            transition: "opacity 0.3s ease 0.05s, transform 0.3s ease 0.05s",
          }}
        >
          <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full">
            {guardian.badge_text}
          </span>
        </div>
      )}

      {/* Bottom info panel */}
      <div
        className="absolute bottom-0 left-0 right-0 p-3 z-30"
        style={{
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 0.35s ease 0.05s, transform 0.35s ease 0.05s",
        }}
      >
        <div className="bg-white/90 backdrop-blur-md rounded-xl p-3 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-bold text-black truncate">{guardian.name}</p>
            <p className="text-xs text-gray-500 truncate">
              {guardian.role}{guardian.organization && ` · ${guardian.organization}`}
            </p>
          </div>
          {guardian.linkedin_url && (
            <a
              href={guardian.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="shrink-0 w-8 h-8 rounded-lg bg-black flex items-center justify-center hover:bg-gray-800 transition-colors"
            >
              <Linkedin className="w-4 h-4 text-white" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}