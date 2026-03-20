import React, { useState, useMemo, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import gsap from "gsap";
import Sidebar from "@/components/sidebar/Sidebar";
import GuardianGrid from "@/components/cards/GuardianGrid";
import GuardianNetworkMap from "@/components/map/GuardianNetworkMap";
import { fetchGuardians } from "@/api/guardiansData";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const SIDEBAR_EXPANDED = 256;
const SIDEBAR_COLLAPSED = 80;

const PageTransition = () => {
  const transitionRef = useRef(null);

  useEffect(() => {
    if (transitionRef.current) {
      gsap.fromTo(
        transitionRef.current,
        { x: "-100%" },
        {
          x: "100%",
          duration: 0.8,
          ease: "elastic.out(1, 0.5)",
        }
      );
    }
  }, []);

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

export default function Visor() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [showMap, setShowMap] = useState(false);

  const sidebarWidth = sidebarCollapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED;

  const { data: guardians = [], isLoading } = useQuery({
    queryKey: ["guardians"],
    queryFn: fetchGuardians,
  });

  const filteredGuardians = useMemo(() => {
    let result = guardians;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (g) =>
          g.name?.toLowerCase().includes(q) ||
          g.role?.toLowerCase().includes(q) ||
          g.organization?.toLowerCase().includes(q) ||
          g.country?.toLowerCase().includes(q)
      );
    }
    if (activeCategory) {
      result = result.filter((g) => g.category === activeCategory);
    }
    return result;
  }, [guardians, searchQuery, activeCategory]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Enlace copiado al portapapeles");
  };

  return (
    <div className="min-h-screen bg-background font-outfit">
      <PageTransition />
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        onShare={handleShare}
        showMap={showMap}
        onToggleMap={() => setShowMap((prev) => !prev)}
      />

      <main
        className="transition-all duration-300 ease-in-out"
        style={{ marginLeft: sidebarWidth }}
      >
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : showMap ? (
            <GuardianNetworkMap guardians={filteredGuardians} />
          ) : (
            <GuardianGrid
              guardians={filteredGuardians}
              sidebarWidth={sidebarWidth}
            />
          )}
        </div>
      </main>
    </div>
  );
}
