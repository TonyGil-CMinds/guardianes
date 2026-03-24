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

const MousePixels = ({ containerRef }) => {
  const canvasRef = useRef(null);
  const pixelsRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0, isMoving: false });
  const mouseTimeoutRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.isMoving = true;

      // Create pixels at mouse position
      for (let i = 0; i < 3; i++) {
        pixelsRef.current.push({
          x: e.clientX + (Math.random() - 0.5) * 20,
          y: e.clientY + (Math.random() - 0.5) * 20,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2 - 0.5,
          life: 1,
          size: Math.random() * 3 + 2,
        });
      }

      clearTimeout(mouseTimeoutRef.current);
      mouseTimeoutRef.current = setTimeout(() => {
        mouseRef.current.isMoving = false;
      }, 100);
    };

    const handleWindowResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleWindowResize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      pixelsRef.current = pixelsRef.current.filter((pixel) => {
        pixel.x += pixel.vx;
        pixel.y += pixel.vy;
        pixel.life -= 0.02;
        pixel.vy -= 0.1; // gravity

        if (pixel.life > 0) {
          ctx.fillStyle = `rgba(163, 230, 53, ${pixel.life * 0.8})`;
          ctx.fillRect(pixel.x, pixel.y, pixel.size, pixel.size);
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
      clearTimeout(mouseTimeoutRef.current);
    };
  }, []);

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
        { x: "-100%" },
        {
          x: "0%",
          duration: 0.8,
          ease: "elastic.out(1, 0.5)",
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
      <MousePixels containerRef={containerRef} />
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
                <Button
                  onClick={() => handleNavigate("/visor")}
                  className="bg-black hover:bg-gray-900 text-white font-semibold px-8 py-3 flex items-center gap-2 group"
                >
                  Ver Lista
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
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