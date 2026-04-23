import AnimatedHero from "@/components/AnimatedHero";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 md:p-24 bg-gray-950 overflow-hidden">
      {/* Background radial gradient for premium look */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-black -z-10 pointer-events-none" />
      
      {/* Navbar placeholder */}
      <header className="w-full max-w-6xl flex justify-between items-center py-6 border-b border-gray-800/50 mb-12">
        <div className="text-xl font-bold text-white tracking-widest uppercase">Guardianes</div>
        <nav className="hidden md:flex gap-8">
          <a href="#" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Inicio</a>
          <a href="#" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Servicios</a>
          <a href="#" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Nosotros</a>
          <a href="#" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Contacto</a>
        </nav>
      </header>

      {/* Hero Section */}
      <AnimatedHero />

      {/* Footer placeholder */}
      <footer className="w-full max-w-6xl mt-auto py-8 text-center text-sm text-gray-500 border-t border-gray-800/50">
        &copy; {new Date().getFullYear()} Guardianes. Todos los derechos reservados.
      </footer>
    </main>
  );
}
