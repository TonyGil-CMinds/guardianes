import React from "react";
import { Search, ChevronLeft, ChevronRight, Map, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = [
  {
    id: "bioregion",
    label: "Bioregion",
    icon: "https://media.base44.com/images/public/69bc1d66f587e6c886c40dd3/00f109f62_bioregionicono.png",
  },
  {
    id: "liderazgo",
    label: "Liderazgo",
    icon: "https://media.base44.com/images/public/69bc1d66f587e6c886c40dd3/474c6d815_liderazgoicono.png",
  },
  {
    id: "enfoque",
    label: "Enfoque",
    icon: "https://media.base44.com/images/public/69bc1d66f587e6c886c40dd3/a484597bb_enfoqueicono.png",
  },
];

export default function Sidebar({
  collapsed,
  onToggle,
  searchQuery,
  onSearchChange,
  activeCategory,
  onCategoryChange,
  onShare,
  showMap,
  onToggleMap,
}) {
  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 300 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed left-0 top-0 h-full z-40 bg-white border-r border-gray-100 flex flex-col overflow-hidden"
      style={{ paddingTop: 24, paddingBottom: 24 }}
    >
      /* Logo + toggle */}
        <div className="relative flex items-center justify-center px-5 mb-8" style={{ minHeight: 48 }}>
          <AnimatePresence mode="wait">
            {!collapsed ? (
          <motion.div key="logo-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-center flex-1">
            <a href="https://www.naturatech.org/guardianes" target="_blank" rel="noopener noreferrer">
              <img
            src="https://media.base44.com/images/public/69bc1d66f587e6c886c40dd3/d919161da_100logo.png"
            alt="Logo"
            className="h-10 w-auto object-contain"
              />
            </a>
          </motion.div>
            ) : (
          <motion.div key="logo-icon" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <a href="https://www.naturatech.org/guardianes" target="_blank" rel="noopener noreferrer">
              <img
            src="https://media.base44.com/images/public/69bc1d66f587e6c886c40dd3/d919161da_100logo.png"
            alt="Logo"
            className="h-7 w-auto object-contain"
              />
            </a>
          </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={onToggle}
            className="absolute right-4 w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            {collapsed
          ? <ChevronRight className="w-4 h-4 text-gray-500" />
          : <ChevronLeft className="w-4 h-4 text-gray-500" />
            }
          </button>
        </div>

        {/* Search */}
      <div className="px-4 mb-6">
        {!collapsed ? (
          <div className="relative">
            <input
              type="text"
              placeholder="Encuentra un Guardian"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full h-11 pl-4 pr-10 rounded-2xl border border-gray-200 bg-white text-sm text-gray-600 placeholder-gray-400 outline-none focus:border-gray-300"
              style={{ fontFamily: "inherit" }}
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        ) : (
          <button
            onClick={onToggle}
            className="w-11 h-11 mx-auto flex items-center justify-center rounded-2xl bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <Search className="w-5 h-5 text-gray-400" />
          </button>
        )}
      </div>

      {/* Categories label */}
      {!collapsed && (
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-5">
          Categorías
        </p>
      )}

      {/* Category buttons */}
      <div className="px-4 flex-1 flex flex-col gap-3">
        {CATEGORIES.map(({ id, label, icon }) => {
          const isActive = activeCategory === id;
          return (
            <button
              key={id}
              onClick={() => onCategoryChange(isActive ? null : id)}
              className="w-full flex items-center rounded-2xl transition-all duration-200"
              style={{
                padding: collapsed ? "16px 0" : "18px 20px",
                justifyContent: collapsed ? "center" : "flex-start",
                gap: 12,
                background: isActive
                  ? "linear-gradient(135deg, #e8f9d0 0%, #c8f0a0 100%)"
                  : "#f3f4f6",
              }}
            >
              <img
                src={icon}
                alt=""
                className="w-6 h-6 object-contain shrink-0"
                style={{ filter: isActive ? "none" : "grayscale(80%) opacity(0.6)" }}
              />
              {!collapsed && (
                <span
                  className="font-semibold"
                  style={{
                    fontSize: 20,
                    color: isActive ? "#2a5a10" : "#374151",
                    lineHeight: 1.2,
                  }}
                >
                  {label}
                </span>
              )}
            </button>
          );
        })}

        {/* Map toggle */}
        <button
          onClick={onToggleMap}
          className="w-full flex items-center rounded-2xl transition-all duration-200"
          style={{
            padding: collapsed ? "16px 0" : "18px 20px",
            justifyContent: collapsed ? "center" : "flex-start",
            gap: 12,
            background: "#f3f4f6",
          }}
        >
          <Map className="w-6 h-6 shrink-0 text-gray-400" />
          {!collapsed && (
            <span className="font-semibold" style={{ fontSize: 20, color: "#374151", lineHeight: 1.2 }}>
              {showMap ? "Ver Grid" : "Mapa"}
            </span>
          )}
        </button>
      </div>

      {/* Share button */}
      <div className="px-4 mt-4">
        {!collapsed ? (
          <button
            onClick={onShare}
            className="w-full flex items-center justify-center rounded-2xl font-bold transition-colors"
            style={{ padding: "20px 24px", gap: 12, background: "#aaff00" }}
          >
            <span style={{ fontSize: 20, color: "#0f2d0f", lineHeight: 1.2, fontWeight: 700 }}>
              Compartir
            </span>
            <Share2 className="w-5 h-5" style={{ color: "#0f2d0f" }} />
          </button>
        ) : (
          <button
            onClick={onShare}
            className="w-11 h-11 mx-auto flex items-center justify-center rounded-2xl transition-colors"
            style={{ background: "#aaff00" }}
          >
            <Share2 className="w-5 h-5" style={{ color: "#0f2d0f" }} />
          </button>
        )}
      </div>
    </motion.aside>
  );
}