// components/Header.tsx (versão com autenticação)
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

interface MenuItem {
  name: string;
  path: string;
}

const MENU_ITEMS: MenuItem[] = [
  { name: "Home", path: "/" },
  { name: "Sobre", path: "/sobre" },
  { name: "Eventos", path: "/eventos" },
  { name: "Membros", path: "/membros" },
  { name: "Partidas", path: "/partidas" },
  { name: "Notícias", path: "/noticias" },
  { name: "Recursos", path: "/recursos" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  // Check if user is logged in (simulated)
  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("userName");
    if (token) {
      // setIsLoggedIn(true);
      // setUserName(name || "Membro");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setIsLoggedIn(false);
    router.push("/");
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    // setIsMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const isActiveRoute = (path: string) => {
    if (path === "/") return pathname === path;
    return pathname.startsWith(path);
  };

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 right-0 z-50 
          transition-all duration-300
          ${
            isScrolled
              ? "bg-linear-to-r from-gray-900/95 to-gray-800/95 backdrop-blur-md shadow-2xl"
              : "bg-linear-to-r from-gray-900 to-gray-800 shadow-lg"
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded-lg"
              aria-label="Real Chess Club - Página inicial"
            >
              {/* Logo Circular */}
              <div className="relative">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-yellow-600 flex items-center justify-center transition-transform group-hover:scale-110 duration-300">
                  <Image
                    src="/images/realchesslogo.png"
                    alt="Real Chess Club Logo"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
                <div className="absolute inset-0 bg-yellow-500 rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg md:text-2xl font-bold tracking-tight text-white">
                  Real Chess Club
                </h1>
                <p className="text-xs text-gray-300 hidden md:block">
                  Onde campeões são feitos
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav
              className="hidden md:flex items-center space-x-1 lg:space-x-2"
              aria-label="Navegação principal"
            >
              {MENU_ITEMS.map((item) => {
                const isActive = isActiveRoute(item.path);
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`
                      relative px-3 lg:px-4 py-2 rounded-lg text-sm lg:text-base font-medium
                      transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-yellow-500
                      ${
                        isActive
                          ? "text-yellow-400"
                          : "text-gray-300 hover:text-yellow-400"
                      }
                    `}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Auth Button - Versão com autenticação */}
            <div className="hidden md:block">
              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <span className="text-gray-300 text-sm">
                    Olá,{" "}
                    <span className="text-yellow-400 font-semibold">
                      {userName}
                    </span>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-all duration-300"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <Link href="/login">
                  <button
                    className="relative group overflow-hidden px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                    aria-label="Entrar ou registrar no clube"
                  >
                    <span className="absolute inset-0 bg-yellow-600 group-hover:bg-yellow-700 transition-colors duration-300" />
                    <span className="relative text-white">
                      Entrar / Registrar
                    </span>
                  </button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden relative w-10 h-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={isMenuOpen}
            >
              <div className="relative w-6 h-6 mx-auto">
                <span
                  className={`
                    absolute left-0 top-1/2 w-6 h-0.5 bg-white rounded-full 
                    transition-all duration-300 transform -translate-y-2
                    ${isMenuOpen ? "rotate-45 translate-y-0" : ""}
                  `}
                />
                <span
                  className={`
                    absolute left-0 top-1/2 w-6 h-0.5 bg-white rounded-full 
                    transition-all duration-300
                    ${isMenuOpen ? "opacity-0" : ""}
                  `}
                />
                <span
                  className={`
                    absolute left-0 top-1/2 w-6 h-0.5 bg-white rounded-full 
                    transition-all duration-300 transform translate-y-2
                    ${isMenuOpen ? "-rotate-45 translate-y-0" : ""}
                  `}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute top-16 right-0 bottom-0 w-64 bg-linear-to-b from-gray-900 to-gray-800 shadow-2xl animate-slide-in-right">
            <nav className="flex flex-col p-4" aria-label="Menu mobile">
              {MENU_ITEMS.map((item) => {
                const isActive = isActiveRoute(item.path);
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`
                      px-4 py-3 rounded-lg transition-all duration-300 font-medium
                      ${
                        isActive
                          ? "bg-yellow-600/20 text-yellow-400"
                          : "text-gray-300 hover:bg-white/10 hover:text-yellow-400"
                      }
                    `}
                    onClick={() => setIsMenuOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.name}
                  </Link>
                );
              })}
              <div className="border-t border-gray-700 my-4" />
              {isLoggedIn ? (
                <>
                  <div className="px-4 py-2 text-gray-300 text-sm">
                    Olá,{" "}
                    <span className="text-yellow-400 font-semibold">
                      {userName}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <Link href="/login">
                  <button
                    className="w-full bg-yellow-600 hover:bg-yellow-700 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    aria-label="Entrar ou registrar no clube"
                  >
                    Entrar / Registrar
                  </button>
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
