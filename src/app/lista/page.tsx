"use client";

import { useState } from "react";
import Image from "next/image";

const guardians = [
  {
    id: 1,
    name: "Bryan Ruiz",
    role: "Head of creative • CMinds",
    country: "COLOMBIA",
    image: "/ASSETS/guard1.png",
    featured: true,
  },
  { id: 2, name: "Marcos Ito", role: "Conservacionista", country: "BRASIL", image: "/ASSETS/guard2.png" },
  { id: 3, name: "Silvio Mora", role: "Líder comunitario", country: "MÉXICO", image: "/ASSETS/guard3.png" },
  { id: 4, name: "Kenji Tanaka", role: "Investigador marino", country: "CHILE", image: "/ASSETS/guard4.png" },
  { id: 5, name: "Daniel Vélez", role: "Guardián de bosques", country: "PERÚ", image: "/ASSETS/guard1.png" },
  { id: 6, name: "Omar Castillo", role: "Agroecólogo", country: "ECUADOR", image: "/ASSETS/guard2.png" },
  { id: 7, name: "Rafa Mendez", role: "Biólogo marino", country: "ARGENTINA", image: "/ASSETS/guard3.png" },
  { id: 8, name: "Luis Herrera", role: "Etnobotánico", country: "BOLIVIA", image: "/ASSETS/guard4.png" },
  { id: 9, name: "Carlos Pinto", role: "Chef & regenerador", country: "COLOMBIA", image: "/ASSETS/guard1.png" },
];

const filters = [
  { label: "Bioregion", icon: "🌐", count: 10 },
  { label: "Liderazgo", icon: "🛡️", count: 10 },
  { label: "Enfoque", icon: "◎", count: 10 },
];

export default function ListaPage() {
  const [selectedId, setSelectedId] = useState<number>(1);
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const toggleFilter = (label: string) => {
    setActiveFilters((prev) =>
      prev.includes(label) ? prev.filter((f) => f !== label) : [...prev, label]
    );
  };

  const filtered = guardians.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.country.toLowerCase().includes(search.toLowerCase())
  );

  const selected = guardians.find((g) => g.id === selectedId);

  return (
    <div className="flex h-screen overflow-hidden bg-white font-sans">
      {/* Sidebar */}
      <aside className="w-[300px] min-w-[300px] flex flex-col justify-between p-6 bg-[#F5F5F5] border-r border-gray-200">
        <div className="flex flex-col gap-6">
          {/* Logo */}
          <div className="flex items-center justify-between">
            <Image src="/ASSETS/logo.svg" alt="IOG Logo" width={80} height={32} className="object-contain" />
            <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Encuentra un Guardian"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-full px-4 py-2.5 pr-10 text-sm text-gray-600 placeholder-gray-400 outline-none focus:border-gray-400 transition-colors"
            />
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-gray-400 tracking-widest uppercase font-bold mb-1">Filtrar por</span>
            {filters.map((f) => (
              <button
                key={f.label}
                onClick={() => toggleFilter(f.label)}
                className={`flex items-center justify-between w-full px-4 py-3 rounded-2xl border text-left transition-all ${
                  activeFilters.includes(f.label)
                    ? "bg-[#D0FF4F] border-[#D0FF4F] text-black"
                    : "bg-white border-gray-200 text-black hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2 text-sm font-bold">
                  <span className="text-gray-500">{f.icon}</span>
                  {f.label}
                </div>
                <span className="bg-[#D0FF4F] text-black text-xs font-black rounded-full w-6 h-6 flex items-center justify-center">
                  {f.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Compartir */}
        <button className="flex items-center justify-center gap-2 w-full bg-[#D0FF4F] text-black font-black text-base rounded-2xl py-4 hover:brightness-105 transition-all">
          Compartir
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-b border-gray-100">
          <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-sm font-bold hover:bg-gray-50 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            Ver mapa
          </button>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-sm font-bold">
            Resultados
            <span className="bg-[#D0FF4F] text-black text-xs font-black rounded-full w-6 h-6 flex items-center justify-center">
              {filtered.length}
            </span>
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-3 gap-4">
            {filtered.map((guardian) => {
              const isSelected = guardian.id === selectedId;
              return (
                <div
                  key={guardian.id}
                  onClick={() => setSelectedId(guardian.id)}
                  className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all ${
                    isSelected ? "ring-2 ring-[#D0FF4F]" : "grayscale hover:grayscale-0"
                  }`}
                  style={{ aspectRatio: "3/4" }}
                >
                  <Image
                    src={guardian.image}
                    alt={guardian.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1200px) 33vw, 300px"
                  />

                  {isSelected && (
                    <>
                      {/* Pixel overlay */}
                      <div className="absolute inset-0 pointer-events-none">
                        {[...Array(8)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute bg-[#D0FF4F]"
                            style={{
                              width: 16,
                              height: 16,
                              top: `${[10, 18, 26, 18, 30, 22, 14, 22][i]}%`,
                              right: `${[8, 8, 8, 16, 16, 16, 16, 24][i]}%`,
                              opacity: 0.9,
                            }}
                          />
                        ))}
                      </div>

                      {/* Top badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-gray-500">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                        <span className="text-[10px] font-black tracking-wider">{guardian.country}</span>
                      </div>

                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedId(0); }}
                        className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[10px] font-black px-2.5 py-1 rounded-full hover:bg-white transition-colors"
                      >
                        Dejar de Reconocer
                      </button>

                      {/* Handshake badge */}
                      <div className="absolute left-3 bottom-14 w-9 h-9 bg-[#D0FF4F] rounded-full flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" className="w-4 h-4">
                          <path d="M9 12l2 2 4-4" />
                          <path d="M3 12c0-4.97 4.03-9 9-9s9 4.03 9 9-4.03 9-9 9-9-4.03-9-9z" />
                        </svg>
                      </div>

                      {/* Name card */}
                      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-white/95 backdrop-blur-sm px-3 py-2.5">
                        <div>
                          <p className="text-sm font-black leading-tight">{guardian.name}</p>
                          <p className="text-[11px] text-gray-500 font-bold">{guardian.role}</p>
                        </div>
                        <div className="w-8 h-8 bg-[#0077B5] rounded-full flex items-center justify-center flex-shrink-0">
                          <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                            <rect x="2" y="9" width="4" height="12" />
                            <circle cx="4" cy="4" r="2" />
                          </svg>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Right accent bar */}
      <div className="w-1 bg-[#D0FF4F] flex-shrink-0" />
    </div>
  );
}
