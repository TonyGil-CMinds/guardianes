import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import { ChevronRight, Play } from "lucide-react";

const stories = [
  {
    id: 1,
    title: "Conozca a Soheil González",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=600&fit=crop",
    description: "Watch Video",
  },
  {
    id: 2,
    title: "La Historia de María",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=600&fit=crop",
    description: "Watch Video",
  },
  {
    id: 3,
    title: "Carlos y Su Misión",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=600&fit=crop",
    description: "Watch Video",
  },
];

const MousePixels = ({ containerRef, isExiting }) => {
  const canvasRef = useRef(null);
  const gridPixelsRef = useRef([]);
  const mouseTrailRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const lastMousePositionRef = useRef({ x: -1, y: -1 });

  const GRID_SIZE = 12;
  const PIXEL_SIZE = 8;
  const GRID_GAP = 2;

  // Initialize grid pixels
  const initializeGrid = () => {
    const newGrid = [];
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        newGrid.push({
          row,
          col,
          x: col * (PIXEL_SIZE + GRID_GAP),
          y: row * (PIXEL_SIZE + GRID_GAP),
          isActive: false,
          fadeTime: 0,
        });
      }
    }
    return newGrid;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || isExiting) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    gridPixelsRef.current = initializeGrid();

    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;

      const distance = Math.hypot(
        e.clientX - lastMousePositionRef.current.x,
        e.clientY - lastMousePositionRef.current.y
      );

      if (distance > 5) {
        // Add to trail
        mouseTrailRef.current.push({
          x: e.clientX,
          y: e.clientY,
          life: 1,
        });
        lastMousePositionRef.current = { x: e.clientX, y: e.clientY };
      }

      // Activate grid pixels near mouse
      const gridCenterX = canvas.width / 2 - (GRID_SIZE * (PIXEL_SIZE + GRID_GAP)) / 2;
      const gridCenterY = canvas.height / 2 - (GRID_SIZE * (PIXEL_SIZE + GRID_GAP)) / 2;

      gridPixelsRef.current.forEach((pixel) => {
        const pixelX = gridCenterX + pixel.x + PIXEL_SIZE / 2;
        const pixelY = gridCenterY + pixel.y + PIXEL_SIZE / 2;
        const dist = Math.hypot(pixelX - e.clientX, pixelY - e.clientY);

        if (dist < 80) {
          pixel.isActive = true;
          pixel.fadeTime = 1;
        } else {
          pixel.fadeTime = Math.max(0, pixel.fadeTime - 0.02);
          if (pixel.fadeTime === 0) pixel.isActive = false;
        }
      });
    };

    const handleWindowResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleWindowResize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gridCenterX = canvas.width / 2 - (GRID_SIZE * (PIXEL_SIZE + GRID_GAP)) / 2;
      const gridCenterY = canvas.height / 2 - (GRID_SIZE * (PIXEL_SIZE + GRID_GAP)) / 2;

      // Draw grid
      gridPixelsRef.current.forEach((pixel) => {
        const x = gridCenterX + pixel.x;
        const y = gridCenterY + pixel.y;

        if (pixel.fadeTime > 0) {
          ctx.fillStyle = `rgba(163, 230, 53, ${pixel.fadeTime * 0.9})`;
          ctx.fillRect(x, y, PIXEL_SIZE, PIXEL_SIZE);
        } else {
          ctx.fillStyle = "rgba(200, 200, 200, 0.15)";
          ctx.fillRect(x, y, PIXEL_SIZE, PIXEL_SIZE);
        }
      });

      // Draw trail
      mouseTrailRef.current = mouseTrailRef.current.filter((point) => {
        point.life -= 0.03;
        if (point.life > 0) {
          ctx.fillStyle = `rgba(163, 230, 53, ${point.life * 0.6})`;
          ctx.fillRect(point.x - 2, point.y - 2, 4, 4);
          return true;
        }
        return false;
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [isExiting]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-20"
    />
  );
};

const PageTransition = ({ isExiting }) => {
  const transitionRef = useRef(null);

  useEffect(() => {
    if (isExiting && transitionRef.current) {
      gsap.fromTo(
        transitionRef.current,
        { x: "-100%", opacity: 1 },
        {
          x: "0%",
          duration: 0.8,
          ease: "elastic.out(1, 0.5)",
          onComplete: () => {
            // Hide the transition overlay after animation completes
            if (transitionRef.current) {
              transitionRef.current.style.display = "none";
            }
          },
        }
      );
    }
  }, [isExiting]);

  return (
    <div
      ref={transitionRef}
      className="fixed inset-0 z-50 pointer-events-none"
      style={{
        background: "linear-gradient(90deg, rgba(163, 230, 53, 0.8) 0%, rgba(163, 230, 53, 0.4) 50%, transparent 100%)",
      }}
    />
  );
};

export default function Home() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const buttonRef = useRef(null);
  const storiesContainerRef = useRef(null);
  const [currentStory, setCurrentStory] = useState(0);
  const [progressBars, setProgressBars] = useState(stories.map(() => 0));
  const [isExiting, setIsExiting] = useState(false);
  const progressIntervalRef = useRef(null);

  // Split title into words for animation
  const titleWords = "100 Personas Guardianas de la Naturaleza".split(" ");

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate title words with stagger
      titleWords.forEach((_, index) => {
        const wordElement = document.querySelector(
          `[data-word="${index}"]`
        );
        if (wordElement) {
          gsap.fromTo(
            wordElement,
            { x: -50, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.8,
              delay: 0.2 + index * 0.15,
              ease: "back.out(1.7)",
            }
          );
        }
      });

      // Description animation
      gsap.fromTo(
        descriptionRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 0.8,
          ease: "power2.out",
        }
      );

      // Button animation
      gsap.fromTo(
        buttonRef.current,
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          delay: 1,
          ease: "back.out(1.7)",
        }
      );

      // Story container animation
      gsap.fromTo(
        storiesContainerRef.current,
        { x: 100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          delay: 0.6,
          ease: "power2.out",
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [titleWords.length]);

  // Story progress animation
  useEffect(() => {
    clearInterval(progressIntervalRef.current);

    progressIntervalRef.current = setInterval(() => {
      setProgressBars((prev) => {
        const updated = [...prev];
        updated[currentStory] = Math.min(updated[currentStory] + 2, 100);

        if (updated[currentStory] >= 100) {
          setCurrentStory((prev) => (prev + 1) % stories.length);
          updated.forEach((_, i) => {
            updated[i] = 0;
          });
        }

        return updated;
      });
    }, 50);

    return () => clearInterval(progressIntervalRef.current);
  }, [currentStory]);

  const handleNextStory = () => {
    setCurrentStory((prev) => (prev + 1) % stories.length);
    setProgressBars(stories.map(() => 0));
  };

  const handleNavigate = (path) => {
    setIsExiting(true);
    setTimeout(() => {
      navigate(path);
    }, 600);
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-white overflow-hidden relative"
    >
      <MousePixels containerRef={containerRef} isExiting={isExiting} />
      <PageTransition isExiting={isExiting} />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left side - Title and CTA */}
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-black mb-8 leading-tight">
                {titleWords.map((word, index) => (
                  <span key={index} data-word={index} className="inline-block mr-3">
                    {word}
                  </span>
                ))}
              </h1>

              <div ref={buttonRef} className="flex gap-4 items-start">
                <button
                  onClick={() => handleNavigate("/visor")}
                  className="bg-black hover:bg-gray-900 text-white font-semibold px-8 py-3 flex items-center gap-2 group rounded"
                >
                  Ver Lista
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Stories section */}
              <div ref={storiesContainerRef} className="mt-16">
                <div className="text-sm font-semibold text-black mb-4">
                  ■ Historias
                </div>
                <div className="bg-gray-100 rounded-lg p-4 w-full max-w-sm">
                  <img
                    src={stories[currentStory].image}
                    alt={stories[currentStory].title}
                    className="w-full h-40 object-cover rounded-md mb-4"
                  />
                  <h3 className="font-bold text-black mb-2">
                    {stories[currentStory].title}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600 cursor-pointer hover:text-black transition">
                    <Play className="w-4 h-4" />
                    <span className="text-sm">{stories[currentStory].description}</span>
                  </div>

                  {/* Instagram-style progress bars */}
                  <div className="flex gap-1 mt-4">
                    {progressBars.map((progress, index) => (
                      <div
                        key={index}
                        className="flex-1 h-1 bg-gray-300 rounded-full overflow-hidden"
                      >
                        <div
                          className="h-full bg-black rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleNextStory}
                    className="mt-4 text-sm font-semibold text-black hover:opacity-70 transition"
                  >
                    Siguiente →
                  </button>
                </div>
              </div>
            </div>

            {/* Right side - Description and content */}
            <div
              ref={descriptionRef}
              className="md:col-start-2 mt-12 md:mt-0"
            >
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <img src="/img/logos1.svg" alt="Logo" className="w-8 h-8" />
                  <span className="text-sm font-semibold text-gray-600">
                    BID LAB | C MINDS
                  </span>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  100 Guardianes de la Naturaleza es un programa impulsado por
                  NaturaTech LAC, liderado por BID Lab y C Minds, que busca
                  visibilizar y reconocer a personas que lideran esfuerzos de
                  conservación y regeneración en América Latina y el Caribe.
                </p>
              </div>

              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  <p className="font-semibold text-black mb-2">
                    Apoyo de Gobiernos e Instituciones:
                  </p>
                  
                <div className="flex gap-4 items-center flex-wrap mt-3">
                  <img src="/img/logos2.svg" alt="Supporting organizations" className="h-8" />
                </div>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed">
                  NaturaTech LAC es una iniciativa financiada por el Gobierno
                  Francés, Amazonía Por Siempre, el Laboratorio del Capital
                  Natural de Grupo BID, la Asociación Sueca para la Cooperación
                  Internacional y Climate Collectiva.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}