// components/Footer.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import { SiLichess, SiChessdotcom } from "react-icons/si";
import {
  AiOutlineTrophy,
  AiOutlineBarChart,
  AiOutlineDownload,
  AiOutlineBook,
  AiOutlineMail,
} from "react-icons/ai";

const SOCIAL_LINKS = [
  {
    name: "Facebook",
    url: "https://facebook.com",
    icon: <FaFacebookF />,
    color: "hover:bg-[#1877f2]",
  },
  {
    name: "Instagram",
    url: "https://instagram.com",
    icon: <FaInstagram />,
    color: "hover:bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045]",
  },
  {
    name: "Lichess",
    url: "https://lichess.org",
    icon: <SiLichess />,
    color: "hover:bg-[#23ac5e]",
  },
  {
    name: "Chess.com",
    url: "https://chess.com",
    icon: <SiChessdotcom />,
    color: "hover:bg-[#81b64c]",
  },
  {
    name: "WhatsApp",
    url: "https://wa.me/258840000000",
    icon: <FaWhatsapp />,
    color: "hover:bg-[#25d366]",
  },
  {
    name: "YouTube",
    url: "https://youtube.com",
    icon: <FaYoutube />,
    color: "hover:bg-[#ff0000]",
  },
];

const QUICK_LINKS = [
  { name: "Próximos Torneios", href: "/eventos", icon: <AiOutlineTrophy /> },
  { name: "Ranking de Membros", href: "/membros", icon: <AiOutlineBarChart /> },
  { name: "Downloads", href: "/recursos", icon: <AiOutlineDownload /> },
  { name: "Contato", href: "/contato", icon: <AiOutlineMail /> },
  { name: "Sobre Nós", href: "/sobre", icon: <AiOutlineBook /> },
];

const INFO_LINKS = [
  { name: "Política de Privacidade", href: "/privacidade" },
  { name: "Termos de Uso", href: "/termos" },
  { name: "Regulamento", href: "/regulamento" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-linear-to-b from-gray-900 to-gray-950 text-white mt-16">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              {/* Logo Circular */}
              <div className="relative">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-yellow-600 flex items-center justify-center">
                  <Image
                    src="/images/realchesslogo.png"
                    alt="Real Chess Club Logo"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Opcional: efeito de brilho */}
                <div className="absolute inset-0 bg-yellow-500 rounded-full blur-sm opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none" />
              </div>
              <h3 className="text-xl font-bold bg-linear-to-r from-white to-yellow-400 bg-clip-text text-transparent">
                Real Chess Club
              </h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              O mais tradicional clube de xadrez de Moçambique, formando
              campeões e promovendo o esporte no país desde 2009.
            </p>
            <div className="space-y-2 text-sm text-gray-300">
              <p className="flex items-start gap-2">
                <span className="text-yellow-500">📍</span>
                <span>Bairro das Mahotas, Maputo - Moçambique</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-yellow-500">📞</span>
                <a
                  href="tel:+258840000000"
                  className="hover:text-yellow-400 transition"
                >
                  +258 84 000 0000
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-yellow-500">✉️</span>
                <a
                  href="mailto:contato@realchess.co.mz"
                  className="hover:text-yellow-400 transition"
                >
                  contato@realchess.co.mz
                </a>
              </p>
            </div>
          </div>
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-yellow-500 rounded-full"></span>
              Links Rápidos
            </h3>
            <ul className="space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-gray-300 hover:text-yellow-400 transition-all duration-300"
                  >
                    <span className="text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      {link.icon}
                    </span>
                    <span>{link.name}</span>
                    <svg
                      className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-yellow-500 rounded-full"></span>
              Informações
            </h3>
            <ul className="space-y-3">
              {INFO_LINKS.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-yellow-400 transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-yellow-500 rounded-full"></span>
              Conecte-se
            </h3>

            {/* Social Links */}
            <div className="flex flex-wrap gap-3 mb-6">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    group relative w-10 h-10 rounded-full bg-gray-800 
                    flex items-center justify-center text-xl
                    transition-all duration-300 hover:scale-110
                    ${social.color.split(" ")[0]}
                  `}
                  title={social.name}
                  aria-label={`Siga-nos no ${social.name}`}
                >
                  <span className="relative z-10 group-hover:scale-110 transition-transform">
                    {social.icon}
                  </span>
                  <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-white/10" />
                </a>
              ))}
            </div>

            {/* Newsletter */}
            <div className="mt-4">
              <p className="text-sm text-gray-400 mb-3">
                Receba novidades e eventos exclusivos
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Seu e-mail"
                  className="flex-1 px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white placeholder-gray-500"
                  aria-label="Email para newsletter"
                />
                <button
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-sm font-semibold transition-colors duration-300"
                  aria-label="Inscrever-se na newsletter"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {currentYear} Real Chess Club - Moçambique. Todos os direitos
              reservados.
            </p>
            <div className="flex gap-4 text-xs text-gray-500">
              <span>🇲🇿 Orgulho Moçambicano</span>
              <span>•</span>
              <span>Filiado à FMOX</span>
              <span>•</span>
              <span>v1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
