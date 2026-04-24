"use client";

import { useState } from "react";
import Image from "next/image";
import FilterButton from "@/components/FilterButton";

const guardians = [
  { id: 1, name: "Bryan Ruiz",     role: "Head of creative • CMinds",   country: "COLOMBIA",  image: "/ASSETS/guard1.png" },
  { id: 2, name: "Marcos Ito",     role: "Conservacionista",             country: "BRASIL",    image: "/ASSETS/guard2.png" },
  { id: 3, name: "Silvio Mora",    role: "Líder comunitario",            country: "MÉXICO",    image: "/ASSETS/guard3.png" },
  { id: 4, name: "Kenji Tanaka",   role: "Investigador marino",          country: "CHILE",     image: "/ASSETS/guard4.png" },
  { id: 5, name: "Daniel Vélez",   role: "Guardián de bosques",          country: "PERÚ",      image: "/ASSETS/guard1.png" },
  { id: 6, name: "Omar Castillo",  role: "Agroecólogo",                  country: "ECUADOR",   image: "/ASSETS/guard2.png" },
  { id: 7, name: "Rafa Mendez",    role: "Biólogo marino",               country: "ARGENTINA", image: "/ASSETS/guard3.png" },
  { id: 8, name: "Luis Herrera",   role: "Etnobotánico",                 country: "BOLIVIA",   image: "/ASSETS/guard4.png" },
  { id: 9, name: "Carlos Pinto",   role: "Chef & regenerador",           country: "COLOMBIA",  image: "/ASSETS/guard1.png" },
];

const filters = [
  {
    label: "Bioregion",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={18} height={18}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
    options: ["Cuenca amazónica", "Región Mar Caribe", "Cordillera de los Andes", "Sabanas del cerrado", "Pastizales de la Pampa", "Bosque Seco del Chaco", "Corredor Mesoamericano", "Estepa Patagónica"],
  },
  {
    label: "Liderazgo",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={18} height={18}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    options: ["Comunitario", "Político", "Científico", "Empresarial", "Cultural", "Juvenil", "Indígena", "Religioso"],
  },
  {
    label: "Enfoque",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={18} height={18}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg>,
    options: ["Biodiversidad", "Agua", "Suelo", "Clima", "Bosques", "Océanos", "Agricultura", "Energía"],
  },
];

const PIXEL_POSITIONS = [
  { top: "10%", right: "8%"  },
  { top: "18%", right: "8%"  },
  { top: "26%", right: "8%"  },
  { top: "18%", right: "16%" },
  { top: "30%", right: "16%" },
  { top: "22%", right: "16%" },
  { top: "14%", right: "16%" },
  { top: "22%", right: "24%" },
];

export default function ListaPage() {
  const [selectedId, setSelectedId] = useState<number>(1);
  const [search, setSearch]         = useState("");

  const filtered = guardians.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.root}>
      {/* ── Sidebar ── */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarTop}>
          {/* Logo row */}
          <div style={styles.logoRow}>
            <Image src="/ASSETS/logo.svg" alt="IOG" width={80} height={32} style={{ objectFit: "contain" }} />
            <button style={styles.iconBtn}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={18} height={18}>
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            </button>
          </div>

          {/* Search */}
          <div style={styles.searchWrap}>
            <input
              type="text"
              placeholder="Encuentra un Guardian"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
            />
            <svg style={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={16} height={16}>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>

          {/* Filters */}
          <div style={styles.filtersSection}>
            <span style={styles.filtersLabel}>Filtrar por</span>
            {filters.map((f) => (
              <FilterButton
                key={f.label}
                icon={f.icon}
                label={f.label}
                count={10}
                options={f.options}
              />
            ))}
          </div>
        </div>

        {/* Compartir */}
        <button style={styles.shareBtn}>
          Compartir
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width={16} height={16}>
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </button>
      </aside>

      {/* ── Main ── */}
      <main style={styles.main}>
        {/* Topbar */}
        <div style={styles.topbar}>
          <button style={styles.topbarBtn}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={16} height={16}>
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            Ver mapa
          </button>
          <div style={styles.topbarBtn}>
            Resultados
            <span style={styles.badge}>{filtered.length}</span>
          </div>
        </div>

        {/* Grid */}
        <div style={styles.gridWrap}>
          <div style={styles.grid}>
            {filtered.map((guardian) => {
              const isSelected = guardian.id === selectedId;
              return (
                <div
                  key={guardian.id}
                  onClick={() => setSelectedId(guardian.id)}
                  style={{
                    ...styles.card,
                    ...(isSelected ? styles.cardSelected : {}),
                    filter: isSelected ? "none" : undefined,
                  }}
                  className={isSelected ? "" : "guardian-card"}
                >
                  <Image
                    src={guardian.image}
                    alt={guardian.name}
                    fill
                    sizes="(max-width: 1200px) 33vw, 300px"
                    style={{ objectFit: "cover" }}
                  />

                  {isSelected && (
                    <>
                      {/* Pixel overlay */}
                      {PIXEL_POSITIONS.map((pos, i) => (
                        <span key={i} style={{ ...styles.pixel, top: pos.top, right: pos.right }} />
                      ))}

                      {/* Country badge */}
                      <div style={styles.countryBadge}>
                        <svg viewBox="0 0 24 24" fill="currentColor" width={12} height={12} style={{ color: "#666" }}>
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                        <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: "0.1em" }}>{guardian.country}</span>
                      </div>

                      {/* Dejar de reconocer */}
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedId(0); }}
                        style={styles.unrecoBtn}
                      >
                        Dejar de Reconocer
                      </button>

                      {/* Check badge */}
                      <div style={styles.checkBadge}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" width={16} height={16}>
                          <path d="M9 12l2 2 4-4" />
                          <circle cx="12" cy="12" r="10" />
                        </svg>
                      </div>

                      {/* Name card */}
                      <div style={styles.nameCard}>
                        <div>
                          <p style={styles.guardianName}>{guardian.name}</p>
                          <p style={styles.guardianRole}>{guardian.role}</p>
                        </div>
                        <div style={styles.linkedinBtn}>
                          <svg viewBox="0 0 24 24" fill="white" width={16} height={16}>
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
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
      <div style={styles.accentBar} />

      <style>{`
        .guardian-card { filter: grayscale(1); transition: filter 0.3s ease; }
        .guardian-card:hover { filter: grayscale(0); }
      `}</style>
    </div>
  );
}

/* ── Styles ── */
const styles: Record<string, React.CSSProperties> = {
  root: {
    display: "flex",
    height: "100vh",
    overflow: "hidden",
    background: "var(--background)",
    fontFamily: "var(--font-sans)",
  },
  sidebar: {
    width: 300,
    minWidth: 300,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 24,
    background: "#F5F5F5",
    borderRight: "1px solid #E5E5E5",
  },
  sidebarTop: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconBtn: {
    width: 32,
    height: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#999",
  },
  searchWrap: {
    position: "relative",
  },
  searchInput: {
    width: "100%",
    background: "white",
    border: "1px solid #E5E5E5",
    borderRadius: 999,
    padding: "10px 40px 10px 16px",
    fontSize: 13,
    fontWeight: 700,
    color: "#555",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "var(--font-sans)",
  },
  searchIcon: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",
    color: "#999",
    pointerEvents: "none",
  },
  filtersSection: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  filtersLabel: {
    fontSize: 11,
    fontWeight: 900,
    color: "#aaa",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  filterBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: "12px 16px",
    borderRadius: 16,
    border: "1px solid #E5E5E5",
    background: "white",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 900,
    fontFamily: "var(--font-sans)",
    transition: "background 0.2s",
  },
  filterBtnActive: {
    background: "var(--primary-green)",
    borderColor: "var(--primary-green)",
  },
  filterBtnLeft: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: "#333",
  },
  filterCount: {
    background: "var(--primary-green)",
    color: "black",
    fontSize: 11,
    fontWeight: 900,
    borderRadius: 999,
    width: 24,
    height: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  shareBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    background: "var(--primary-green)",
    color: "black",
    fontWeight: 900,
    fontSize: 16,
    border: "none",
    borderRadius: 16,
    padding: "16px 0",
    cursor: "pointer",
    fontFamily: "var(--font-sans)",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  topbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 12,
    padding: "16px 24px",
    borderBottom: "1px solid #F0F0F0",
  },
  topbarBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 16px",
    borderRadius: 999,
    border: "1px solid #E5E5E5",
    background: "white",
    fontSize: 13,
    fontWeight: 900,
    cursor: "pointer",
    fontFamily: "var(--font-sans)",
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
  },
  gridWrap: {
    flex: 1,
    overflowY: "auto",
    padding: 24,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 16,
  },
  card: {
    position: "relative",
    borderRadius: 16,
    overflow: "hidden",
    cursor: "pointer",
    aspectRatio: "3 / 4",
    transition: "box-shadow 0.2s",
  },
  cardSelected: {
    boxShadow: "0 0 0 2px var(--primary-green)",
  },
  pixel: {
    position: "absolute",
    width: 16,
    height: 16,
    background: "var(--primary-green)",
    opacity: 0.9,
    pointerEvents: "none",
  },
  countryBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(4px)",
    borderRadius: 999,
    padding: "4px 10px",
  },
  unrecoBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(4px)",
    border: "none",
    borderRadius: 999,
    padding: "4px 10px",
    fontSize: 10,
    fontWeight: 900,
    cursor: "pointer",
    fontFamily: "var(--font-sans)",
  },
  checkBadge: {
    position: "absolute",
    left: 12,
    bottom: 56,
    width: 36,
    height: 36,
    background: "var(--primary-green)",
    borderRadius: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  nameCard: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(4px)",
    padding: "10px 12px",
  },
  guardianName: {
    fontSize: 13,
    fontWeight: 900,
    margin: 0,
    lineHeight: 1.2,
  },
  guardianRole: {
    fontSize: 11,
    fontWeight: 700,
    color: "#888",
    margin: 0,
  },
  linkedinBtn: {
    width: 32,
    height: 32,
    background: "#0077B5",
    borderRadius: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  accentBar: {
    width: 4,
    background: "var(--primary-green)",
    flexShrink: 0,
  },
};
