"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function PixelBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [gridSize, setGridSize] = useState({ cols: 0, rows: 0 });
  const pixelSize = 40; // Size of each square

  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setGridSize({
        cols: Math.ceil(width / pixelSize),
        rows: Math.ceil(height / pixelSize),
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePixelHover = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    
    // Immediately turn the pixel green
    gsap.set(target, { backgroundColor: "#D0FF4F", opacity: 1 });
    
    // Slowly fade it out back to transparent
    gsap.to(target, {
      backgroundColor: "transparent",
      opacity: 0,
      duration: 1.5,
      ease: "power2.out",
    });
  };

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 overflow-hidden pointer-events-auto z-0 flex flex-wrap"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${gridSize.cols}, ${pixelSize}px)`,
        gridTemplateRows: `repeat(${gridSize.rows}, ${pixelSize}px)`,
      }}
    >
      {Array.from({ length: gridSize.cols * gridSize.rows }).map((_, i) => (
        <div
          key={i}
          className="w-full h-full border border-gray-100/50" // very faint grid lines
          onMouseEnter={handlePixelHover}
          style={{ opacity: 0 }} // Start invisible
        />
      ))}
      
      {/* Some permanent floating pixels as seen in the static image */}
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={`static-${i}`}
          className="absolute bg-primary-green pointer-events-none"
          style={{
            width: pixelSize,
            height: pixelSize,
            left: `${Math.floor(Math.random() * gridSize.cols) * pixelSize}px`,
            top: `${Math.floor(Math.random() * gridSize.rows) * pixelSize}px`,
            opacity: Math.random() > 0.5 ? 1 : 0.5,
          }}
        />
      ))}
    </div>
  );
}
