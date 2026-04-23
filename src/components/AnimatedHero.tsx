"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function AnimatedHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      // Create a GSAP timeline for sequenced animations
      const tl = gsap.timeline();

      // Animate text elements (fade in + slide up)
      tl.from([textRef.current, subtitleRef.current], {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
      });

      // Animate the SVG element (fade in, scale up, and rotate continuously)
      tl.from(
        svgRef.current,
        {
          scale: 0,
          opacity: 0,
          rotation: -180,
          duration: 1.5,
          ease: "elastic.out(1, 0.5)",
        },
        "-=0.5" // Start this slightly before the previous animation ends
      );

      // Add a continuous floating/rotating effect to the SVG
      gsap.to(svgRef.current, {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: "linear",
      });
      
      gsap.to(svgRef.current, {
        y: -15,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center min-h-[70vh] w-full text-center px-4"
    >
      <div className="relative mb-12 flex items-center justify-center">
        {/* Decorative background glow behind the SVG */}
        <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full w-full h-full pointer-events-none" />
        
        {/* Animated SVG (A placeholder geometric shape for now) */}
        <svg
          ref={svgRef}
          width="160"
          height="160"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-2xl z-10"
        >
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          <path
            d="M100 0L195.106 30.9017L158.779 123.607L100 200L41.2215 123.607L4.89435 30.9017L100 0Z"
            fill="url(#grad1)"
            opacity="0.8"
          />
          <circle cx="100" cy="100" r="50" fill="url(#grad2)" />
        </svg>
      </div>

      <h1
        ref={textRef}
        className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6"
      >
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Guardianes
        </span>
      </h1>
      
      <p
        ref={subtitleRef}
        className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto"
      >
        Uniendo fuerzas para proteger lo que más importa. Innovación, seguridad y tecnología avanzada a tu alcance.
      </p>
    </div>
  );
}
