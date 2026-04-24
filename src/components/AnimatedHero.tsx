"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import PixelBackground from "./PixelBackground";

export default function AnimatedHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageGalleryRef = useRef<HTMLDivElement>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // The 4 images to cycle through
  const images = [
    "/ASSETS/guard1.png",
    "/ASSETS/guard2.png",
    "/ASSETS/guard3.png",
    "/ASSETS/guard4.png",
  ];

  // Calculate which image to show based on mouse X position over the container
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageGalleryRef.current) return;
    const rect = imageGalleryRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the element
    const width = rect.width;
    const percentage = Math.max(0, Math.min(1, x / width));
    
    // Map percentage (0-1) to an index (0-3)
    const index = Math.floor(percentage * images.length);
    setActiveImageIndex(Math.min(index, images.length - 1));
  };

  useGSAP(
    () => {
      // Entrance animation for left column text
      gsap.from(".left-col-item", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        delay: 0.2,
      });

      // Entrance for right column text
      gsap.from(".right-col-item", {
        x: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        delay: 0.5,
      });

      // Entrance for main image
      gsap.from(".hero-image", {
        scale: 0.9,
        opacity: 0,
        duration: 1.5,
        ease: "expo.out",
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="relative w-full min-h-screen bg-white text-black overflow-hidden flex flex-col justify-center items-center">
      
      {/* Interactive Pixel Background */}
      <PixelBackground />

      <div className="relative z-10 w-full max-w-[1440px] px-8 py-12 flex flex-col lg:flex-row justify-between items-center h-full pointer-events-none">
        
        {/* LEFT COLUMN */}
        <div className="w-full lg:w-[30%] flex flex-col justify-center pointer-events-auto mt-20 lg:mt-0">
          <h1 className="left-col-item text-6xl lg:text-[5rem] leading-[0.9] font-black tracking-tight mb-8">
            <span className="flex items-center gap-2">
              <span className="font-sans font-black tracking-tighter">100</span>
              <Image src="/ASSETS/logo.svg" alt="100 Logo" width={60} height={60} className="object-contain inline-block" />
            </span>
            <br />
            Personas
            <br />
            Guardianas de la
            <br />
            Naturaleza
          </h1>

          <button className="left-col-item bg-black text-white w-max flex items-center justify-between gap-6 px-6 py-4 rounded-sm hover:scale-105 transition-transform group">
            <span className="font-bold text-lg">Ver Lista</span>
            <div className="bg-primary-green p-1 flex items-center justify-center group-hover:bg-white transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                <path d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </div>
          </button>

          {/* Floating Card */}
          <div className="left-col-item mt-16 bg-[#f3f4f6] rounded-2xl p-4 flex gap-4 items-center shadow-xl w-max relative">
            <div className="absolute -top-3 left-6 flex items-center gap-2">
              <span className="w-3 h-3 bg-primary-green inline-block"></span>
              <span className="text-xs font-bold uppercase tracking-wider bg-white px-2 py-1 rounded-sm shadow-sm">Historias</span>
            </div>
            
            <div className="w-32 h-20 rounded-lg overflow-hidden relative">
              <Image src="/ASSETS/thumbnail1.png" alt="Thumbnail" fill className="object-cover" />
            </div>
            
            <div className="flex flex-col">
              <h3 className="text-xl font-black leading-tight">Conoce a Soheil<br/>González</h3>
              <button className="flex items-center gap-2 mt-2 text-xs font-bold hover:opacity-70 transition-opacity">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polygon points="10 8 16 12 10 16 10 8"></polygon>
                </svg>
                Watch Video
              </button>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN (IMAGE GALLERY) */}
        <div className="w-full lg:w-[40%] h-[600px] flex justify-center items-end relative pointer-events-auto"
             ref={imageGalleryRef}
             onMouseMove={handleMouseMove}
             onMouseLeave={() => setActiveImageIndex(0)}>
          {images.map((src, idx) => (
            <Image
              key={src}
              src={src}
              alt={`Guard ${idx}`}
              fill
              priority={idx === 0}
              className={`object-contain object-bottom hero-image transition-opacity duration-300 ease-in-out ${idx === activeImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            />
          ))}
        </div>

        {/* RIGHT COLUMN */}
        <div className="w-full lg:w-[25%] flex flex-col pointer-events-auto self-start mt-10 lg:mt-0 relative">
          
          {/* Menu Button */}
          <button className="absolute -top-6 right-0 bg-primary-green w-12 h-12 flex flex-col items-center justify-center gap-1.5 hover:bg-black group transition-colors">
            <span className="w-6 h-0.5 bg-black group-hover:bg-primary-green transition-colors"></span>
            <span className="w-6 h-0.5 bg-black group-hover:bg-primary-green transition-colors"></span>
            <span className="w-6 h-0.5 bg-black group-hover:bg-primary-green transition-colors"></span>
          </button>

          <div className="mt-20 flex flex-col gap-8">
            <div className="right-col-item flex flex-col gap-4">
              <Image src="/ASSETS/ntl-socios-logos.svg" alt="Logos Partners" width={300} height={50} className="object-contain" />
            </div>

            <p className="right-col-item text-sm font-bold leading-relaxed text-gray-800">
              100 Guardianes de la Naturaleza es un programa impulsado por NaturaTech LAC, liderado por BID Lab y C Minds, que busca visibilizar y reconocer a personas que lideran esfuerzos de conservación y regeneración en América Latina y el Caribe.
            </p>

            <div className="right-col-item flex flex-col gap-4 pt-4 border-t border-gray-200">
              <Image src="/ASSETS/ntl-funders-logo.svg" alt="Logos Funders" width={300} height={50} className="object-contain" />
            </div>

            <p className="right-col-item text-xs font-bold leading-relaxed text-gray-800">
              NaturaTech LAC es una iniciativa financiada por el Gobierno Francés, Amazonia Por Siempre, el Laboratorio del Capital Natural de Grupo BID, la Asociación Sueca para la Cooperación Internacional y Climate Collective.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
