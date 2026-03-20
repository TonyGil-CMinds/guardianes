import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import GuardianPopupCard from "./GuardianPopupCard";
import { ZoomIn, ZoomOut } from "lucide-react";

// ─── Load script utility ────────────────────────────────────────────────────
const loadScript = (src) =>
  new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement("script");
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });

// ─── Virtual canvas dimensions ───────────────────────────────────────────────
const VW = 800;
const VH = 1100;

// ─── Geographic projection: lat/lon → normalized x,y (0–1) ──────────────────
// Lon range: -120°W to -30°W  →  x = (lon + 120) / 90
// Lat range:  35°N  to  -57°S →  y = (35 - lat) / 92
const geo = (lat, lon) => [(lon + 120) / 90, (35 - lat) / 92];

// ─── Nodes: real LATAM + Caribbean cities ────────────────────────────────────
const GEO_NODES = [
  // Mexico
  geo(32.5, -117.0),  // Tijuana
  geo(30.0, -110.0),  // Sonora
  geo(28.6, -106.1),  // Chihuahua
  geo(25.7, -100.3),  // Monterrey
  geo(20.7, -103.3),  // Guadalajara
  geo(19.4,  -99.1),  // Mexico City
  geo(19.2,  -96.1),  // Veracruz
  geo(21.0,  -89.6),  // Mérida
  geo(21.2,  -86.8),  // Cancún
  // Caribbean
  geo(23.1,  -82.4),  // Havana
  geo(20.0,  -75.8),  // Santiago de Cuba
  geo(18.0,  -76.8),  // Kingston, Jamaica
  geo(18.5,  -70.0),  // Santo Domingo
  geo(18.5,  -66.1),  // San Juan PR
  geo(13.1,  -59.6),  // Barbados
  geo(10.7,  -61.5),  // Port of Spain, Trinidad
  // Central America
  geo(14.6,  -90.5),  // Guatemala City
  geo(14.1,  -87.2),  // Tegucigalpa
  geo(12.1,  -86.3),  // Managua
  geo( 9.9,  -84.1),  // San José, CR
  geo( 8.9,  -79.5),  // Panama City
  // Colombia / Venezuela
  geo(10.4,  -75.5),  // Cartagena
  geo( 4.7,  -74.1),  // Bogotá
  geo(10.5,  -66.9),  // Caracas
  geo(10.6,  -71.6),  // Maracaibo
  geo( 6.8,  -58.2),  // Georgetown, Guyana
  geo( 5.8,  -55.2),  // Paramaribo
  // Ecuador
  geo(-0.2,  -78.5),  // Quito
  geo(-2.2,  -79.9),  // Guayaquil
  // Peru
  geo(-3.7,  -73.2),  // Iquitos
  geo(-12.0, -77.0),  // Lima
  geo(-13.5, -71.9),  // Cusco
  // Bolivia
  geo(-16.5, -68.1),  // La Paz
  geo(-17.8, -63.2),  // Santa Cruz
  // Brazil – Amazon
  geo(-3.1,  -60.0),  // Manaus
  geo( 0.0,  -51.0),  // Macapá
  geo(-1.5,  -48.5),  // Belém
  // Brazil – NE bulge
  geo(-3.7,  -38.5),  // Fortaleza
  geo(-5.8,  -35.2),  // Natal
  geo(-8.1,  -34.9),  // Recife
  geo(-12.9, -38.5),  // Salvador
  // Brazil – Center / SE
  geo(-15.8, -47.9),  // Brasília
  geo(-19.9, -43.9),  // Belo Horizonte
  geo(-22.9, -43.2),  // Rio de Janeiro
  geo(-23.5, -46.6),  // São Paulo
  geo(-25.4, -49.3),  // Curitiba
  geo(-30.0, -51.2),  // Porto Alegre
  // Paraguay / Uruguay
  geo(-25.3, -57.6),  // Asunción
  geo(-34.9, -56.2),  // Montevideo
  // Argentina
  geo(-24.8, -65.4),  // Salta
  geo(-31.4, -64.2),  // Córdoba
  geo(-34.6, -58.4),  // Buenos Aires
  geo(-38.7, -62.3),  // Bahía Blanca
  geo(-38.9, -68.1),  // Neuquén
  geo(-45.9, -67.5),  // Comodoro Rivadavia
  geo(-53.1, -70.9),  // Punta Arenas
  // Chile
  geo(-18.5, -70.3),  // Arica
  geo(-23.7, -70.4),  // Antofagasta
  geo(-33.5, -70.7),  // Santiago
  geo(-36.8, -73.1),  // Concepción
  geo(-41.5, -72.9),  // Puerto Montt
];

const NODES_V = GEO_NODES.map(([x, y]) => ({ vx: x * VW, vy: y * VH }));
const NODE_SIZES = NODES_V.map((_, i) => (i % 8 === 0 ? 34 : i % 4 === 0 ? 26 : 20));

// Build edges: connect each node to its nearest neighbors within maxDist px
function buildEdges(nodes, maxDist = 120) {
  const seen = new Set();
  const edges = [];
  for (let i = 0; i < nodes.length; i++) {
    const nbrs = nodes
      .map((n, j) => ({ j, d: Math.hypot(n.vx - nodes[i].vx, n.vy - nodes[i].vy) }))
      .filter(({ j, d }) => j !== i && d < maxDist)
      .sort((a, b) => a.d - b.d)
      .slice(0, 3);
    nbrs.forEach(({ j }) => {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (!seen.has(key)) { seen.add(key); edges.push([i, j]); }
    });
  }
  return edges;
}

const EDGES = buildEdges(NODES_V);

// ─── Component ───────────────────────────────────────────────────────────────
export default function GuardianNetworkMap({ guardians }) {
  const containerRef = useRef(null);
  const canvasRef    = useRef(null);
  const videoRef     = useRef(null);
  const rafRef       = useRef(null);
  const imgCache     = useRef({});

  const panRef      = useRef({ x: 0, y: 0 });
  const zoomRef     = useRef(0.5);
  const mouseDown   = useRef(null);
  const handPos     = useRef(null);
  const gestureRef  = useRef(null);
  const prevHand    = useRef(null);
  const prevPinch   = useRef(false);

  const [, forceRender]   = useState(0);
  const [selected, setSelected]         = useState(null);
  const [camActive, setCamActive]       = useState(false);
  const [camLoading, setCamLoading]     = useState(false);
  const [gestureLabel, setGestureLabel] = useState("");

  const nodes = useMemo(() =>
    NODES_V.map((pos, i) => ({
      ...pos,
      size: NODE_SIZES[i],
      guardian: guardians.length ? guardians[i % guardians.length] : null,
    })),
    [guardians]
  );

  // Preload images
  useEffect(() => {
    nodes.forEach(({ guardian }) => {
      if (!guardian?.image_url || guardian.image_url in imgCache.current) return;
      imgCache.current[guardian.image_url] = null;
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => { imgCache.current[guardian.image_url] = img; };
      img.src = guardian.image_url;
    });
  }, [nodes]);

  // Resize canvas + fit initial zoom
  useEffect(() => {
    const sync = () => {
      const c = canvasRef.current, ct = containerRef.current;
      if (!c || !ct) return;
      c.width  = ct.clientWidth;
      c.height = ct.clientHeight;
      zoomRef.current = Math.min(c.width / VW, c.height / VH) * 0.90;
    };
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  // ─── Draw ──────────────────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const { x: px, y: py } = panRef.current;
    const z = zoomRef.current;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.translate(W / 2 + px, H / 2 + py);
    ctx.scale(z, z);
    ctx.translate(-VW / 2, -VH / 2);

    // Edges
    EDGES.forEach(([i, j]) => {
      if (!nodes[i]?.guardian || !nodes[j]?.guardian) return;
      ctx.beginPath();
      ctx.moveTo(nodes[i].vx, nodes[i].vy);
      ctx.lineTo(nodes[j].vx, nodes[j].vy);
      ctx.strokeStyle = "rgba(150, 210, 30, 0.6)";
      ctx.lineWidth = 1.6 / z;
      ctx.stroke();
    });

    // Nodes
    nodes.forEach(({ vx, vy, size, guardian }) => {
      if (!guardian) return;
      const r = size;

      // White halo
      ctx.beginPath();
      ctx.arc(vx, vy, r + 3, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      // Lime ring
      ctx.beginPath();
      ctx.arc(vx, vy, r + 2, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(150, 230, 30, 0.9)";
      ctx.lineWidth = 1.8 / z;
      ctx.stroke();

      // Image clip
      ctx.save();
      ctx.beginPath();
      ctx.arc(vx, vy, r, 0, Math.PI * 2);
      ctx.clip();
      const img = imgCache.current[guardian.image_url];
      if (img) {
        ctx.drawImage(img, vx - r, vy - r, r * 2, r * 2);
      } else {
        ctx.fillStyle = "#e5e7eb";
        ctx.fillRect(vx - r, vy - r, r * 2, r * 2);
        ctx.fillStyle = "#6b7280";
        ctx.font = `bold ${r * 0.9}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(guardian.name?.[0] ?? "?", vx, vy);
      }
      ctx.restore();
    });

    ctx.restore();

    // Hand cursor overlay
    const hp = handPos.current;
    if (hp) {
      const sx = hp.x * W, sy = hp.y * H;
      const g = gestureRef.current;
      const col = g === "pinch" ? "#aaff00"
                : g === "spread" ? "#ff9900"
                : g === "together" ? "#00aaff"
                : g === "fist" ? "#ff6666"
                : "#aaff00";
      ctx.beginPath();
      ctx.arc(sx, sy, 22, 0, Math.PI * 2);
      ctx.fillStyle = col + "33";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(sx, sy, 22, 0, Math.PI * 2);
      ctx.strokeStyle = col;
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(sx, sy, 5, 0, Math.PI * 2);
      ctx.fillStyle = col;
      ctx.fill();
    }
  }, [nodes]);

  useEffect(() => {
    const loop = () => { draw(); rafRef.current = requestAnimationFrame(loop); };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  // ─── Mouse / Wheel ────────────────────────────────────────────────────────
  const onMouseDown = (e) => {
    mouseDown.current = { x: e.clientX, y: e.clientY, pan: { ...panRef.current } };
  };
  const onMouseMove = (e) => {
    if (!mouseDown.current) return;
    panRef.current = {
      x: mouseDown.current.pan.x + (e.clientX - mouseDown.current.x),
      y: mouseDown.current.pan.y + (e.clientY - mouseDown.current.y),
    };
  };
  const onMouseUp = (e) => {
    if (mouseDown.current) {
      const dx = Math.abs(e.clientX - mouseDown.current.x);
      const dy = Math.abs(e.clientY - mouseDown.current.y);
      if (dx < 5 && dy < 5) clickAt(e.clientX, e.clientY);
    }
    mouseDown.current = null;
  };
  const onWheel = (e) => {
    e.preventDefault();
    zoomRef.current = Math.max(0.2, Math.min(5, zoomRef.current * (e.deltaY > 0 ? 0.9 : 1.1)));
  };

  const clickAt = (clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const sx = clientX - rect.left, sy = clientY - rect.top;
    const W = canvas.width, H = canvas.height;
    const z = zoomRef.current, { x: px, y: py } = panRef.current;
    const vx = (sx - W / 2 - px) / z + VW / 2;
    const vy = (sy - H / 2 - py) / z + VH / 2;
    let best = null, bestD = Infinity;
    nodes.forEach(({ guardian, vx: nx, vy: ny, size }) => {
      if (!guardian) return;
      const d = Math.hypot(vx - nx, vy - ny);
      if (d < size + 14 && d < bestD) { bestD = d; best = guardian; }
    });
    setSelected(best);
  };

  const adjustZoom = (f) => {
    zoomRef.current = Math.max(0.2, Math.min(5, zoomRef.current * f));
    forceRender(n => n + 1);
  };

  // ─── Hand tracking ─────────────────────────────────────────────────────────
  const startCamera = async () => {
    try {
      setCamLoading(true);
      await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js");
      await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js");

      const hands = new window.Hands({
        locateFile: (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`,
      });
      hands.setOptions({ maxNumHands: 1, modelComplexity: 1, minDetectionConfidence: 0.7, minTrackingConfidence: 0.5 });

      hands.onResults((results) => {
        if (!results.multiHandLandmarks?.length) {
          handPos.current = null;
          gestureRef.current = null;
          prevHand.current = null;
          prevPinch.current = false;
          setGestureLabel("");
          return;
        }

        const lm = results.multiHandLandmarks[0];
        // Mirror X so hand matches video preview
        const pos = { x: 1 - lm[9].x, y: lm[9].y };

        // ── Gesture detection ──────────────────────────────────────────────
        // Pinch: thumb tip close to index tip
        const pinchD = Math.hypot(lm[4].x - lm[8].x, lm[4].y - lm[8].y);
        const isPinch = pinchD < 0.07;

        // Count extended fingers (index, middle, ring, pinky)
        let ext = 0;
        const tips = [lm[8], lm[12], lm[16], lm[20]];
        const mcps = [lm[5], lm[9], lm[13], lm[17]];
        for (let i = 0; i < 4; i++) {
          const td = Math.hypot(tips[i].x - lm[0].x, tips[i].y - lm[0].y);
          const md = Math.hypot(mcps[i].x - lm[0].x, mcps[i].y - lm[0].y);
          if (td > md * 1.15) ext++;
        }
        // Thumb extension
        const thumbD = Math.hypot(lm[4].x - lm[5].x, lm[4].y - lm[5].y);
        const thumbBase = Math.hypot(lm[2].x - lm[5].x, lm[2].y - lm[5].y);
        const thumbExt = thumbD > thumbBase * 0.8;
        const totalExt = ext + (thumbExt ? 1 : 0);

        // Finger spread: distance between index tip [8] and pinky tip [20]
        const spreadD = Math.hypot(lm[8].x - lm[20].x, lm[8].y - lm[20].y);

        const isFist    = totalExt <= 1 && !isPinch;
        const isOpen    = totalExt >= 4;
        const isSpread  = isOpen && spreadD > 0.17;   // 🖐 fingers wide → ZOOM OUT
        const isTogether = isOpen && spreadD < 0.10;  // 🤚 fingers together → ZOOM IN

        let newGest;
        if (isPinch)    newGest = "pinch";
        else if (isFist) newGest = "fist";
        else if (isSpread) newGest = "spread";
        else if (isTogether) newGest = "together";
        else newGest = "partial";

        // ── Apply effects ──────────────────────────────────────────────────
        const canvas = canvasRef.current;
        const prev = prevHand.current;

        if (canvas) {
          const W = canvas.width, H = canvas.height;

          // Drag with fist
          if (isFist && prev) {
            const dx = (pos.x - prev.x) * W * 2.8;
            const dy = (pos.y - prev.y) * H * 2.8;
            panRef.current = { x: panRef.current.x + dx, y: panRef.current.y + dy };
          }

          // Zoom out: open spread hand
          if (isSpread) {
            zoomRef.current = Math.max(0.2, zoomRef.current * 0.985);
          }
          // Zoom in: open fingers together
          if (isTogether) {
            zoomRef.current = Math.min(5, zoomRef.current * 1.015);
          }

          // Pinch click (rising edge)
          if (isPinch && !prevPinch.current) {
            const sx = pos.x * W, sy = pos.y * H;
            const z = zoomRef.current, { x: px, y: py } = panRef.current;
            const vx = (sx - W / 2 - px) / z + VW / 2;
            const vy = (sy - H / 2 - py) / z + VH / 2;
            let best = null, bestD = Infinity;
            nodes.forEach(({ guardian, vx: nx, vy: ny, size }) => {
              if (!guardian) return;
              const d = Math.hypot(vx - nx, vy - ny);
              if (d < size + 35 && d < bestD) { bestD = d; best = guardian; }
            });
            if (best) setSelected(best);
          }
          prevPinch.current = isPinch;
        }

        prevHand.current = pos;
        handPos.current  = pos;
        gestureRef.current = newGest;

        setGestureLabel(
          newGest === "pinch"    ? "👌 Clic"          :
          newGest === "fist"     ? "✊ Arrastrar"      :
          newGest === "spread"   ? "🖐 Zoom out"       :
          newGest === "together" ? "🤚 Zoom in"        : ""
        );
      });

      const cam = new window.Camera(videoRef.current, {
        onFrame: async () => { await hands.send({ image: videoRef.current }); },
        width: 320, height: 240,
      });
      await cam.start();
      setCamActive(true);
      setCamLoading(false);
    } catch (err) {
      console.error("Hand tracking error:", err);
      setCamLoading(false);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div ref={containerRef} className="relative w-full h-[calc(100vh-80px)] bg-slate-50 rounded-2xl overflow-hidden select-none">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        style={{ width: "100%", height: "100%" }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={() => { mouseDown.current = null; }}
        onWheel={onWheel}
      />

      {/* Zoom buttons */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-10">
        <button onClick={() => adjustZoom(1.2)} className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
          <ZoomIn className="w-5 h-5 text-gray-700" />
        </button>
        <button onClick={() => adjustZoom(0.83)} className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
          <ZoomOut className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Camera panel */}
      <div className="absolute top-4 right-4 z-20">
        <div className="w-52 h-40 rounded-2xl overflow-hidden border-2 border-white shadow-xl relative bg-gray-100">
          <video
            ref={videoRef}
            autoPlay muted playsInline
            className="w-full h-full object-cover"
            style={{ transform: "scaleX(-1)", display: camActive ? "block" : "none" }}
          />
          {!camActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4">
              <span className="text-3xl">👋</span>
              <p className="text-xs text-gray-500 text-center leading-tight">
                Activa la cámara para controlar con gestos
              </p>
              <button
                onClick={startCamera}
                disabled={camLoading}
                className="bg-black text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-colors mt-1"
              >
                {camLoading ? "Cargando..." : "Activar Cámara"}
              </button>
            </div>
          )}
          {camActive && gestureLabel && (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center pointer-events-none">
              <span className="bg-black/70 text-white text-xs font-semibold px-3 py-1 rounded-full">
                {gestureLabel}
              </span>
            </div>
          )}
          <div className="absolute bottom-0 left-4 right-4 h-1 bg-[#aaff00] rounded-full" />
        </div>

        {camActive && (
          <div className="mt-2 bg-white/85 backdrop-blur-sm rounded-xl px-3 py-2 text-xs text-gray-600 shadow text-center leading-relaxed">
            👌 pinch = clic &nbsp;·&nbsp; ✊ puño = arrastrar<br/>
            🖐 abierta = zoom out &nbsp;·&nbsp; 🤚 junta = zoom in
          </div>
        )}
      </div>

      {selected && <GuardianPopupCard guardian={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}