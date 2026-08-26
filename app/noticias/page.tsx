// app/noticias/page.tsx
"use client";

import { useState, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Article {
  id: number;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content?: string;
  author?: string;
  image?: string;
  readTime?: string;
  tournamentResults?: {
    position: number;
    name: string;
    rating: number;
    points: number;
    fideId?: string;
  }[];
  tournamentDetails?: {
    totalPlayers: number;
    rounds: number;
    date: string;
    location: string;
  };
}

export default function Noticias() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [email, setEmail] = useState("");
  const [expandedTournament, setExpandedTournament] = useState<number | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  const isVisible = true;

  const news: Article[] = [
    {
      id: 1,
      title: "REAL CHESS MAHOTAS TWO 2026: FM Donaldo Paiva conquista o título",
      date: "2026-05-23",
      category: "Resultados",
      excerpt: "O Mestre FIDE Donaldo Paiva venceu o torneio REAL CHESS MAHOTAS TWO 2026, que contou com a participação de 27 enxadristas. Ivan Andrade ficou em segundo lugar e João Rubene Guambe completou o pódio.",
      author: "Departamento de Comunicação",
      readTime: "4 min",
      tournamentDetails: {
        totalPlayers: 27,
        rounds: 7,
        date: "23 de Maio de 2026",
        location: "Sede do Real Chess Mahotas, Maputo"
      },
      tournamentResults: [
        { position: 1, name: "FM Paiva, Donaldo", rating: 2255, points: 6.5, fideId: "14800098" },
        { position: 2, name: "FM Andrade, Ivan", rating: 2108, points: 6.0, fideId: "14800039" },
        { position: 3, name: "Guambe, Joao Rubene", rating: 2029, points: 5.5, fideId: "14806339" },
        { position: 4, name: "CM Napoleao, Lourenco", rating: 1964, points: 5.0, fideId: "14801302" },
        { position: 5, name: "Chirindza, Rafael Bernardo", rating: 1940, points: 4.5, fideId: "14800764" },
        { position: 6, name: "CM Joao, Farisse", rating: 1920, points: 4.5, fideId: "14800730" },
        { position: 7, name: "Magagule, Senzo Frederico", rating: 1910, points: 4.0, fideId: "14802287" },
        { position: 8, name: "Cardoso, Bruno Artur", rating: 1828, points: 4.0, fideId: "14802279" },
        { position: 9, name: "Macuacua, Marcos Simao", rating: 1828, points: 3.5, fideId: "14801248" },
        { position: 10, name: "Uamusse, Stelio Henriques", rating: 1809, points: 3.5, fideId: "14805839" },
        { position: 11, name: "Carquete, Galilei", rating: 1807, points: 3.5, fideId: "14804174" },
        { position: 12, name: "Mahassule, Jubilio Alberto", rating: 1761, points: 3.5, fideId: "14802023" },
        { position: 13, name: "Cossa, Luis Manuel", rating: 1734, points: 3.0, fideId: "14807688" },
        { position: 14, name: "Mabote, Sa Adolfo", rating: 1673, points: 3.0, fideId: "14801159" },
        { position: 15, name: "Gaspar Martins, Pedro Miguel", rating: 1650, points: 2.5, fideId: "17702208" },
        { position: 16, name: "Mucavel, Marcelo Joao", rating: 1633, points: 2.5, fideId: "14810034" },
        { position: 17, name: "Marcelo, Lucas Coutinho", rating: 1624, points: 2.0, fideId: "14810743" },
        { position: 18, name: "Tule, Zefanias Manuel", rating: 1600, points: 2.0, fideId: "14810565" },
        { position: 19, name: "Jakissone, Alvin Mateus", rating: 0, points: 2.0, fideId: "14810808" },
        { position: 20, name: "Macuacua, Afonso Octavio", rating: 0, points: 1.5, fideId: "14807785" },
        { position: 21, name: "Cossa, Wesly", rating: 0, points: 1.5, fideId: "" },
        { position: 22, name: "Goenha, Antonio", rating: 0, points: 1.0, fideId: "" },
        { position: 23, name: "Pambo, Alberto", rating: 0, points: 1.0, fideId: "" },
        { position: 24, name: "Cimino, Francesco", rating: 0, points: 1.0, fideId: "" },
        { position: 25, name: "Sozinho, Lidia", rating: 0, points: 0.5, fideId: "" },
        { position: 26, name: "Cossa, Remigio", rating: 0, points: 0.5, fideId: "" },
        { position: 27, name: "Tualifa, Briany", rating: 0, points: 0.0, fideId: "" }
      ]
    },
    {
      id: 2,
      title: "TORNEIO DE XADREZ FIM DO ANO 2025: FM Donaldo Paiva campeão",
      date: "2025-12-20",
      category: "Resultados",
      excerpt: "FM Donaldo Paiva (2199) venceu o TORNEIO DE XADREZ FIM DO ANO 2025, com Ivan Andrade (2158) em segundo e CM Lourenço Napoleão (1969) em terceiro. O torneio teve 46 participantes.",
      author: "Departamento de Comunicação",
      readTime: "4 min",
      tournamentDetails: {
        totalPlayers: 46,
        rounds: 7,
        date: "20 de Dezembro de 2025",
        location: "Sede do Real Chess Mahotas, Maputo"
      },
      tournamentResults: [
        { position: 1, name: "FM Paiva, Donaldo", rating: 2199, points: 6.5, fideId: "14800098" },
        { position: 2, name: "FM Andrade, Ivan", rating: 2158, points: 6.0, fideId: "14800039" },
        { position: 3, name: "CM Napoleao, Lourenco", rating: 1969, points: 5.5, fideId: "14801302" },
        { position: 4, name: "CM Joao, Farisse", rating: 1959, points: 5.0, fideId: "14800730" },
        { position: 5, name: "Guambe, Joao Rubene", rating: 1868, points: 4.5, fideId: "14806339" },
        { position: 6, name: "Macuacua, Marcos Simao", rating: 1839, points: 4.5, fideId: "14801248" },
        { position: 7, name: "Magagule, Senzo Frederico", rating: 1839, points: 4.0, fideId: "14802287" },
        { position: 8, name: "Carquete, Galilei", rating: 1806, points: 4.0, fideId: "14804174" },
        { position: 9, name: "Cossa, Remigio Enoque", rating: 1790, points: 3.5, fideId: "14803607" },
        { position: 10, name: "Alar, Yuran Edgar", rating: 1789, points: 3.5, fideId: "14809435" },
        { position: 11, name: "Manhica, Heldo Luis", rating: 1711, points: 3.0, fideId: "14803488" },
        { position: 12, name: "Fernandes, Miguel Eduardo Taibo", rating: 1705, points: 3.0, fideId: "14806746" },
        { position: 13, name: "Mabote, Sa Adolfo", rating: 1702, points: 3.0, fideId: "14801159" },
        { position: 14, name: "Mahassule, Jubilio Alberto", rating: 1700, points: 3.0, fideId: "14802023" },
        { position: 15, name: "WCM Castro, Neusa Aridas De", rating: 1692, points: 2.5, fideId: "14800250" },
        { position: 16, name: "Jacinto, Humberto Fonseca", rating: 1593, points: 2.5, fideId: "1937316" },
        { position: 17, name: "Ngovene, Alberto Jose", rating: 1587, points: 2.0, fideId: "14802945" },
        { position: 18, name: "Bulande, Bento", rating: 1581, points: 2.0, fideId: "14801655" },
        { position: 19, name: "Malenda, Ana", rating: 1555, points: 2.0, fideId: "14800209" },
        { position: 20, name: "Zimba, Domingos Fabiao", rating: 1551, points: 1.5, fideId: "14802902" },
        { position: 21, name: "Victorino Mafuca, Amelia Carlos", rating: 1465, points: 1.5, fideId: "14803704" },
        { position: 22, name: "Mangumo, Helder Moiseis", rating: 1415, points: 1.0, fideId: "14804441" },
        { position: 23, name: "Aziz, Nazir Abdul", rating: 0, points: 1.0, fideId: "14810417" },
        { position: 24, name: "Bazilio, Danial Manzur", rating: 0, points: 1.0, fideId: "14810352" },
        { position: 25, name: "Cossa, Luis Manuel", rating: 0, points: 1.0, fideId: "14807688" },
        { position: 26, name: "Ernesto, Tiago Liam Banze", rating: 0, points: 0.5, fideId: "14805790" },
        { position: 27, name: "Farooq, Adam Nurmohomed", rating: 0, points: 0.5, fideId: "14810042" },
        { position: 28, name: "Farooq, Lais Nurmohamed", rating: 0, points: 0.0, fideId: "14810050" },
        { position: 29, name: "Gemo, Eileen Geovanni Pedro", rating: 0, points: 0.0, fideId: "14808404" },
        { position: 30, name: "Guambe, Beneth Carlos", rating: 0, points: 0.0, fideId: "14807211" },
        { position: 31, name: "Guambe, Ketlyn Carlos", rating: 0, points: 0.0, fideId: "14806061" },
        { position: 32, name: "Guambe, Lizzy Carlos", rating: 0, points: 0.0, fideId: "14807637" },
        { position: 33, name: "Jonasse, Fiquelque Jose", rating: 0, points: 0.0, fideId: "14810360" },
        { position: 34, name: "Junior, Emilio Eduardo Mabjaia", rating: 0, points: 0.0, fideId: "14810344" },
        { position: 35, name: "Malate, Malik Menelik Da Silva", rating: 0, points: 0.0, fideId: "14810387" },
        { position: 36, name: "Malate, Marron Marcelo Da Silva", rating: 0, points: 0.0, fideId: "14810395" },
        { position: 37, name: "Meireles, Alessandro De Henrique", rating: 0, points: 0.0, fideId: "14809109" },
        { position: 38, name: "Meireles, Guilherme De Henrique", rating: 0, points: 0.0, fideId: "14809095" },
        { position: 39, name: "Momade, Ismayk Ismael", rating: 0, points: 0.0, fideId: "14807246" },
        { position: 40, name: "Mucavel, Marcelo Joao", rating: 0, points: 0.0, fideId: "14810034" },
        { position: 41, name: "Neto, Anasse Alima Omar", rating: 0, points: 0.0, fideId: "14809214" },
        { position: 42, name: "Silva, Sanes Lacerda", rating: 0, points: 0.0, fideId: "14808986" },
        { position: 43, name: "Sozinho, Lidia Jose", rating: 0, points: 0.0, fideId: "14807564" },
        { position: 44, name: "Zimila, Antonio Joao", rating: 0, points: 0.0, fideId: "14810379" },
        { position: 45, name: "Alejandro, Petur Weng Petursson", rating: 0, points: 0.0, fideId: "14805480" },
        { position: 46, name: "CM Jamal, Hamid Harmon Gulamo", rating: 2001, points: 0.0, fideId: "14801221" }
      ]
    },
    {
      id: 3,
      title: "TORNEO DE XADREZ SUPER REAL CHESS 2025: FM Ivan Andrade vence",
      date: "2025-11-03",
      category: "Resultados",
      excerpt: "FM Ivan Andrade (2136) conquistou o título do TORNEO DE XADREZ SUPER REAL CHESS 2025. João Rubene Guambe (2002) e CM Hamid Jamal (1993) completaram os três primeiros lugares.",
      author: "Departamento de Comunicação",
      readTime: "3 min",
      tournamentDetails: {
        totalPlayers: 25,
        rounds: 7,
        date: "03 de Novembro de 2025",
        location: "Sede do Real Chess Mahotas, Maputo"
      },
      tournamentResults: [
        { position: 1, name: "FM Andrade, Ivan", rating: 2136, points: 6.5, fideId: "14800039" },
        { position: 2, name: "Guambe, Joao Rubene", rating: 2002, points: 6.0, fideId: "14806339" },
        { position: 3, name: "CM Jamal, Hamid Harmon Gulamo", rating: 1993, points: 5.5, fideId: "14801221" },
        { position: 4, name: "CM Napoleao, Lourenco", rating: 1958, points: 5.0, fideId: "14801302" },
        { position: 5, name: "Rafael, Chirinza", rating: 1868, points: 4.5, fideId: "14800764" },
        { position: 6, name: "Alberto, Ananias Pambo", rating: 1854, points: 4.0, fideId: "14803291" },
        { position: 7, name: "Magagule, Senzo Frederico", rating: 1839, points: 4.0, fideId: "14802287" },
        { position: 8, name: "Uamusse, Stelio Henriques", rating: 1834, points: 4.0, fideId: "14805839" },
        { position: 9, name: "Cardoso, Bruno Artur", rating: 1823, points: 3.5, fideId: "14802279" },
        { position: 10, name: "Carquete, Galilei", rating: 1809, points: 3.5, fideId: "14804174" },
        { position: 11, name: "Cossa, Luis Manuel", rating: 1807, points: 3.0, fideId: "14807688" },
        { position: 12, name: "Cossa Cossa, Remigio Enoque", rating: 1788, points: 3.0, fideId: "14803607" },
        { position: 13, name: "Mabote, Sa Adolfo", rating: 1738, points: 2.5, fideId: "14801159" },
        { position: 14, name: "Mahassule, Jubilio Alberto", rating: 1679, points: 2.5, fideId: "14802023" },
        { position: 15, name: "WCM Castro, Neusa Aridas De", rating: 1672, points: 2.5, fideId: "14800250" },
        { position: 16, name: "Jacinto, Humberto Fonseca", rating: 1593, points: 2.0, fideId: "1937316" },
        { position: 17, name: "Sitoe, Sheila Judite Jacinto", rating: 1581, points: 2.0, fideId: "14800470" },
        { position: 18, name: "Malenda, Ana", rating: 1520, points: 1.5, fideId: "14800209" },
        { position: 19, name: "Gaspar Martins, Pedro Miguel", rating: 0, points: 1.5, fideId: "17702208" },
        { position: 20, name: "Gulele, Claudio Henriques", rating: 0, points: 1.0, fideId: "14810107" },
        { position: 21, name: "Gulele, Edilson Henriques", rating: 0, points: 1.0, fideId: "14810115" },
        { position: 22, name: "Jangua, Lourenco Augusto", rating: 0, points: 1.0, fideId: "14809931" },
        { position: 23, name: "Leal Freitas, Joao Pedro", rating: 0, points: 0.5, fideId: "14810131" },
        { position: 24, name: "Mucavel, Marcelo Joao", rating: 0, points: 0.5, fideId: "14810034" },
        { position: 25, name: "Sozinho, Lidia Jose", rating: 0, points: 0.0, fideId: "14807564" }
      ]
    }
  ];

  const categories = ["Todos", "Resultados", "Dicas", "Análises", "Eventos do Clube"];

  const filteredNews = selectedCategory === "Todos" 
    ? news 
    : news.filter(article => article.category === selectedCategory);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-MZ', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    switch(category) {
      case "Resultados": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Dicas": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Análises": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "Eventos do Clube": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      alert(`✅ Inscrição realizada com sucesso! Você receberá as nossas novidades em ${email}`);
      setEmail("");
    }
  };

  const toggleTournament = (id: number) => {
    setExpandedTournament(expandedTournament === id ? null : id);
  };

  const renderTournamentTable = (article: Article) => {
    if (!article.tournamentResults || article.tournamentResults.length === 0) return null;

    // Separar top 10 e restante
    const top10 = article.tournamentResults.slice(0, 10);
    const rest = article.tournamentResults.slice(10);

    return (
      <div className="mt-4 space-y-4">
        <button
          onClick={() => toggleTournament(article.id)}
          className="w-full flex items-center justify-between px-4 py-2 bg-yellow-600/20 hover:bg-yellow-600/30 rounded-lg text-yellow-400 font-semibold transition-all duration-300"
        >
          <span>📊 Ver Tabela de Classificação</span>
          <svg className={`w-5 h-5 transition-transform duration-300 ${expandedTournament === article.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {expandedTournament === article.id && (
          <div className="bg-white/5 rounded-xl overflow-hidden border border-white/10">
            {/* Detalhes do Torneio */}
            {article.tournamentDetails && (
              <div className="p-4 bg-yellow-500/10 border-b border-white/10">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                  <div>
                    <p className="text-gray-400">Participantes</p>
                    <p className="text-white font-semibold">{article.tournamentDetails.totalPlayers}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Rodadas</p>
                    <p className="text-white font-semibold">{article.tournamentDetails.rounds}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Data</p>
                    <p className="text-white text-xs">{article.tournamentDetails.date}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Local</p>
                    <p className="text-white text-xs truncate">{article.tournamentDetails.location}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tabela */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-yellow-500/10">
                  <tr>
                    <th className="px-4 py-3 text-left text-gray-300 text-sm font-semibold">#</th>
                    <th className="px-4 py-3 text-left text-gray-300 text-sm font-semibold">Jogador</th>
                    <th className="px-4 py-3 text-center text-gray-300 text-sm font-semibold">Rating</th>
                    <th className="px-4 py-3 text-center text-gray-300 text-sm font-semibold">Pontos</th>
                    <th className="px-4 py-3 text-center text-gray-300 text-sm font-semibold">FIDE ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {top10.map((player) => (
                    <tr key={player.position} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3">
                        <span className={`
                          inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold
                          ${player.position === 1 ? 'bg-yellow-500/20 text-yellow-400' : 
                            player.position === 2 ? 'bg-gray-500/20 text-gray-300' :
                            player.position === 3 ? 'bg-orange-500/20 text-orange-400' :
                            'text-gray-400'}
                        `}>
                          {player.position}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-white text-sm font-medium">{player.name}</td>
                      <td className="px-4 py-3 text-center text-gray-300 text-sm">{player.rating || '-'}</td>
                      <td className="px-4 py-3 text-center text-yellow-400 text-sm font-semibold">{player.points}</td>
                      <td className="px-4 py-3 text-center text-gray-500 text-xs font-mono">{player.fideId || '-'}</td>
                    </tr>
                  ))}
                </tbody>
                {rest.length > 0 && (
                  <tbody className="divide-y divide-white/5 border-t border-white/10">
                    {rest.map((player) => (
                      <tr key={player.position} className="hover:bg-white/5 transition-colors opacity-70">
                        <td className="px-4 py-2 text-gray-500 text-xs">{player.position}</td>
                        <td className="px-4 py-2 text-gray-400 text-xs">{player.name}</td>
                        <td className="px-4 py-2 text-center text-gray-500 text-xs">{player.rating || '-'}</td>
                        <td className="px-4 py-2 text-center text-yellow-400/70 text-xs font-semibold">{player.points}</td>
                        <td className="px-4 py-2 text-center text-gray-600 text-xs font-mono">{player.fideId || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                )}
              </table>
            </div>
            <div className="p-3 bg-white/5 text-xs text-gray-500 text-center border-t border-white/10">
              {article.tournamentResults.length} jogadores • {article.tournamentDetails?.rounds || 0} rodadas
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Header />
      <main ref={pageRef} className="relative bg-linear-to-b from-gray-900 to-gray-950 mt-10">
        {/* Padrão de Fundo */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '30px 30px'
          }} />
        </div>

        {/* Peças de Xadrez Animadas */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-20 right-20 text-7xl animate-float">♔</div>
          <div className="absolute bottom-20 left-20 text-7xl animate-float-delayed">♕</div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Cabeçalho */}
          <div className="text-center mb-12">
            <div className={`
              inline-block mb-6 transition-all duration-700
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-yellow-500/20 text-yellow-400 backdrop-blur-sm border border-yellow-500/30">
                <span className="mr-2">📰</span>
                Últimas Novidades
              </span>
            </div>
            <h1 className={`
              text-4xl md:text-5xl lg:text-6xl font-bold mb-6 transition-all duration-700 delay-100
              bg-linear-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              Notícias e Blog
            </h1>
            <div className={`
              w-24 h-1 bg-yellow-500 mx-auto mb-6 rounded-full transition-all duration-700 delay-150
              ${isVisible ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}
            `} />
            <p className={`
              text-gray-300 max-w-2xl mx-auto text-lg transition-all duration-700 delay-200
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              Fique por dentro de todas as novidades, resultados e dicas do Real Chess Club
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Conteúdo Principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Filtro de Categorias */}
              <div className={`
                flex flex-wrap gap-2 mb-6 transition-all duration-700 delay-300
                ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
              `}>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`
                      px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300
                      ${selectedCategory === category
                        ? 'bg-yellow-600 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }
                    `}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Artigos */}
              {filteredNews.map((article, index) => (
                <article
                  key={article.id}
                  className={`
                    group bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden
                    border border-white/20 hover:border-yellow-500/50
                    transition-all duration-500 hover:-translate-y-1
                    ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}
                  `}
                  style={{ animationDelay: `${300 + index * 100}ms` }}
                >
                  <div className="p-6">
                    {/* Categoria e Data */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(article.category)}`}>
                          {article.category}
                        </span>
                        <span className="text-xs text-gray-500">{article.readTime} de leitura</span>
                      </div>
                      <span className="text-sm text-gray-500">{formatDate(article.date)}</span>
                    </div>

                    {/* Título */}
                    <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">
                      {article.title}
                    </h2>

                    {/* Resumo */}
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      {article.excerpt}
                    </p>

                    {/* Tabela do Torneio */}
                    {article.category === "Resultados" && renderTournamentTable(article)}

                    {/* Autor e Leia Mais */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                          <span className="text-sm">✍️</span>
                        </div>
                        <span className="text-sm text-gray-400">{article.author}</span>
                      </div>
                      <button className="group inline-flex items-center gap-2 text-yellow-500 hover:text-yellow-400 font-semibold transition-colors">
                        <span>Leia mais</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Borda Animada */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-yellow-500 via-yellow-600 to-yellow-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </article>
              ))}

              {/* Botão Carregar Mais */}
              {filteredNews.length >= 6 && (
                <div className="text-center pt-6">
                  <button className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300">
                    <span>Carregar Mais</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Barra Lateral */}
            <div className={`
              space-y-6 transition-all duration-700 delay-400
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              {/* Cartão de Categorias */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-yellow-500 rounded-full"></span>
                  Categorias
                </h2>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`
                        block w-full text-left px-4 py-2 rounded-lg transition-all duration-300
                        ${selectedCategory === category
                          ? 'bg-yellow-600/20 text-yellow-400'
                          : 'text-gray-300 hover:bg-white/10'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <span>{category}</span>
                        <span className="text-xs text-gray-500">
                          {category === "Todos" ? news.length : news.filter(a => a.category === category).length}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cartão de Newsletter */}
              <div className="bg-linear-to-br from-yellow-600/20 to-orange-600/20 rounded-2xl p-6 border border-yellow-500/30">
                <h2 className="text-xl font-bold text-white mb-2">Newsletter</h2>
                <p className="text-gray-300 text-sm mb-4">
                  Receba as últimas notícias e dicas diretamente no seu email
                </p>
                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  <input
                    type="email"
                    placeholder="O seu melhor email"
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-linear-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    Inscrever-se
                  </button>
                </form>
                <p className="text-xs text-gray-500 mt-3 text-center">
                  ✨ Não enviamos spam. Pode cancelar a qualquer momento.
                </p>
              </div>

              {/* Destaque da Semana */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-2xl">⭐</span>
                  Destaque da Semana
                </h2>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-yellow-400">
                    Torneio REAL CHESS MAHOTAS TWO 2026
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    &quot;FM Donaldo Paiva sagrou-se campeão com 2255 pontos e 6.5 pontos, 
                    consolidando seu domínio no xadrez moçambicano.&quot;
                  </p>
                  <p className="text-xs text-gray-500">- 23 de Maio de 2026</p>
                </div>
              </div>

              {/* Redes Sociais */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-2xl">🔗</span>
                  Redes Sociais
                </h2>
                <div className="flex gap-3">
                  <button className="flex-1 bg-white/10 hover:bg-white/20 p-3 rounded-lg transition-all duration-300">
                    <span className="block text-2xl">📘</span>
                    <span className="text-xs text-gray-400 mt-1">Facebook</span>
                  </button>
                  <button className="flex-1 bg-white/10 hover:bg-white/20 p-3 rounded-lg transition-all duration-300">
                    <span className="block text-2xl">📷</span>
                    <span className="text-xs text-gray-400 mt-1">Instagram</span>
                  </button>
                  <button className="flex-1 bg-white/10 hover:bg-white/20 p-3 rounded-lg transition-all duration-300">
                    <span className="block text-2xl">🐦</span>
                    <span className="text-xs text-gray-400 mt-1">Twitter</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}