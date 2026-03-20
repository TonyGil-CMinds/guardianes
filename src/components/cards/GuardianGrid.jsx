import React, { useState, useEffect, useRef, useCallback } from "react";
import GuardianCard from "./GuardianCard";

const MAX_DISTANCE = 480;
const MIN_SCALE = 0.84;

export default function GuardianGrid({ guardians, sidebarWidth }) {
  const [hoveredId, setHoveredId] = useState(null);
  const [mousePos, setMousePos] = useState(null);
  const [isInSidebar, setIsInSidebar] = useState(false);
  const cardRefs = useRef([]);
  const cardCenters = useRef([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const inSidebar = e.clientX < sidebarWidth;
      setIsInSidebar(inSidebar);
      setMousePos(inSidebar ? null : { x: e.clientX, y: e.clientY });
    };
    const handleMouseLeave = () => { setMousePos(null); setIsInSidebar(false); };
    window.addEventListener("mousemove", handleMouseMove);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [sidebarWidth]);

  const measureCards = useCallback(() => {
    cardCenters.current = cardRefs.current.map((el) => {
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    });
  }, []);

  useEffect(() => {
    measureCards();
    window.addEventListener("resize", measureCards);
    window.addEventListener("scroll", measureCards);
    return () => {
      window.removeEventListener("resize", measureCards);
      window.removeEventListener("scroll", measureCards);
    };
  }, [guardians, measureCards]);

  const getScale = (index) => {
    if (!mousePos || isInSidebar) return 1;
    const center = cardCenters.current[index];
    if (!center) return 1;
    const dx = mousePos.x - center.x;
    const dy = mousePos.y - center.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const t = Math.min(dist / MAX_DISTANCE, 1);
    return 1 - t * (1 - MIN_SCALE);
  };

  if (!guardians || guardians.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground text-lg">No se encontraron guardianes</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {guardians.map((guardian, index) => (
        <div
          key={guardian.id}
          ref={(el) => {
            cardRefs.current[index] = el;
            if (el) {
              const rect = el.getBoundingClientRect();
              cardCenters.current[index] = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
            }
          }}
          style={{
            transform: `scale(${getScale(index)})`,
            transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
            transformOrigin: "center center",
          }}
        >
          <GuardianCard
            guardian={guardian}
            isGray={hoveredId !== null && hoveredId !== guardian.id}
            onHoverChange={setHoveredId}
          />
        </div>
      ))}
    </div>
  );
}