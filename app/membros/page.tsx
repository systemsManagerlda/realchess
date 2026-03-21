// app/membros/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { TbChess, TbChessBishop, TbChessKing, TbChessQueen } from "react-icons/tb";
import { AiFillFacebook, AiOutlineEye, AiOutlineEyeInvisible, AiOutlineGoogle } from "react-icons/ai";

interface Member {
  id: number;
  name: string;
  rating: number;
  joinedDate: string;
  wins: number;
  losses: number;
  draws?: number;
  title?: string;
  avatar?: string;
}

export default function Membros() {
  const [isLogin, setIsLogin] = useState(true);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);

  const isVisible = true;

  const [members] = useState<Member[]>([
    { id: 1, name: "João Silva", rating: 2100, joinedDate: "2022-01-15", wins: 45, losses: 12, draws: 8, title: "Candidato a Mestre" },
    { id: 2, name: "Maria Santos", rating: 1950, joinedDate: "2022-03-20", wins: 38, losses: 15, draws: 10, title: "Mestre Nacional" },
    { id: 3, name: "Pedro Oliveira", rating: 1850, joinedDate: "2023-01-10", wins: 25, losses: 20, draws: 7, title: "Classe A" },
    { id: 4, name: "Ana Costa", rating: 1750, joinedDate: "2023-06-15", wins: 18, losses: 12, draws: 5, title: "Classe B" },
    { id: 5, name: "Carlos Mendes", rating: 1650, joinedDate: "2024-01-20", wins: 12, losses: 8, draws: 3, title: "Classe C" },
  ]);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    rating: "",
    phone: "",
    birthDate: "",
    acceptTerms: false,
  });

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      alert("✅ Login realizado com sucesso! Bem-vindo ao Real Chess Club.");
      setIsSubmitting(false);
    }, 1000);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerData.password !== registerData.confirmPassword) {
      alert("❌ As senhas não coincidem. Por favor, verifique.");
      return;
    }
    
    if (!registerData.acceptTerms) {
      alert("❌ Você precisa aceitar os Termos de Uso e Política de Privacidade.");
      return;
    }
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      alert("✅ Cadastro realizado com sucesso! Bem-vindo ao Real Chess Club. Um email de confirmação foi enviado.");
      setIsSubmitting(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (isLogin) {
      setLoginData({
        ...loginData,
        [name]: type === 'checkbox' ? checked : value,
      });
    } else {
      setRegisterData({
        ...registerData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-MZ', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 2000) return "text-yellow-400";
    if (rating >= 1800) return "text-blue-400";
    if (rating >= 1600) return "text-green-400";
    return "text-gray-400";
  };

  const getWinRate = (wins: number, losses: number) => {
    const total = wins + losses;
    if (total === 0) return 0;
    return Math.round((wins / total) * 100);
  };

  const sortedMembers = [...members].sort((a, b) => b.rating - a.rating);

  return (
    <>
      <Header />
      <main ref={pageRef} className="relative bg-gradient-to-b from-gray-900 to-gray-950 min-h-screen pt-20">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '30px 30px'
          }} />
        </div>

        {/* Animated Chess Pieces */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-20 left-20 text-7xl animate-float"><TbChessKing /></div>
          <div className="absolute bottom-20 right-20 text-7xl animate-float-delayed"><TbChessQueen /></div>
          <div className="absolute top-1/3 right-1/4 text-5xl animate-float-slow"><TbChessBishop /></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className={`
              inline-block mb-4 sm:mb-6 transition-all duration-700
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              <span className="inline-flex items-center px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold bg-yellow-500/20 text-yellow-400 backdrop-blur-sm border border-yellow-500/30">
                <TbChess className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                Comunidade Real Chess
              </span>
            </div>
            <h1 className={`
              text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 transition-all duration-700 delay-100
              bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              Área de Membros
            </h1>
            <div className={`
              w-20 sm:w-24 h-1 bg-yellow-500 mx-auto mb-4 sm:mb-6 rounded-full transition-all duration-700 delay-150
              ${isVisible ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}
            `} />
            <p className={`
              text-gray-300 max-w-2xl mx-auto text-base sm:text-lg px-4 transition-all duration-700 delay-200
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              Conheça nossos membros, acompanhe o ranking e faça parte da maior comunidade
              de xadrez de Moçambique!
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              {/* Ranking - Versão Desktop (Tabela) e Mobile (Cards) */}
              <div className={`
                bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20
                transition-all duration-700 delay-300
                ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
              `}>
                <div className="p-4 sm:p-6 border-b border-white/20">
                  <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                    <span className="text-2xl sm:text-3xl">🏆</span>
                    Ranking de Membros
                  </h2>
                  <p className="text-gray-400 text-xs sm:text-sm mt-1">Classificação baseada no rating FIDE</p>
                </div>
                
                {/* Desktop Table - hidden on mobile */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead className="bg-yellow-500/10">
                      <tr className="text-gray-300 text-xs sm:text-sm">
                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left">Posição</th>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left">Membro</th>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left">Título</th>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left">Rating</th>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left">V/D/E</th>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left">Aproveit.</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {sortedMembers.map((member, index) => {
                        const winRate = getWinRate(member.wins, member.losses);
                        return (
                          <tr 
                            key={member.id} 
                            className="hover:bg-white/5 transition-colors cursor-pointer"
                            onClick={() => setSelectedMember(member)}
                          >
                            <td className="px-4 sm:px-6 py-3 sm:py-4">
                              <span className={`
                                inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full font-bold text-sm
                                ${index === 0 ? 'bg-yellow-500/20 text-yellow-400' : 
                                  index === 1 ? 'bg-gray-500/20 text-gray-300' :
                                  index === 2 ? 'bg-orange-500/20 text-orange-400' :
                                  'bg-white/10 text-gray-400'}
                              `}>
                                {index + 1}
                              </span>
                             </td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4">
                              <div>
                                <p className="font-semibold text-white text-sm sm:text-base">{member.name}</p>
                                <p className="text-xs text-gray-500 hidden sm:block">desde {formatDate(member.joinedDate)}</p>
                              </div>
                             </td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4">
                              <span className="px-2 py-1 bg-yellow-500/10 rounded-full text-xs text-yellow-400 whitespace-nowrap">
                                {member.title}
                              </span>
                             </td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4">
                              <span className={`font-bold text-base sm:text-lg ${getRatingColor(member.rating)}`}>
                                {member.rating}
                              </span>
                             </td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4">
                              <div className="flex gap-1 sm:gap-2 text-xs sm:text-sm">
                                <span className="text-green-400">{member.wins}V</span>
                                <span className="text-red-400">{member.losses}D</span>
                                <span className="text-gray-400">{member.draws || 0}E</span>
                              </div>
                             </td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4">
                              <div className="w-12 sm:w-16 h-1.5 sm:h-2 bg-white/10 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-yellow-500 rounded-full"
                                  style={{ width: `${winRate}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-400 mt-1 block">{winRate}%</span>
                             </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards - visible only on mobile */}
                <div className="md:hidden divide-y divide-white/10">
                  {sortedMembers.map((member, index) => {
                    const winRate = getWinRate(member.wins, member.losses);
                    return (
                      <div
                        key={member.id}
                        className="p-4 hover:bg-white/5 transition-colors cursor-pointer"
                        onClick={() => setSelectedMember(member)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className={`
                              inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm
                              ${index === 0 ? 'bg-yellow-500/20 text-yellow-400' : 
                                index === 1 ? 'bg-gray-500/20 text-gray-300' :
                                index === 2 ? 'bg-orange-500/20 text-orange-400' :
                                'bg-white/10 text-gray-400'}
                            `}>
                              {index + 1}º
                            </span>
                            <div>
                              <p className="font-semibold text-white">{member.name}</p>
                              <p className="text-xs text-gray-500">{member.title}</p>
                            </div>
                          </div>
                          <span className={`font-bold text-lg ${getRatingColor(member.rating)}`}>
                            {member.rating}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-white/10">
                          <div>
                            <p className="text-xs text-gray-500">Histórico</p>
                            <div className="flex gap-2 text-sm mt-1">
                              <span className="text-green-400">{member.wins}V</span>
                              <span className="text-red-400">{member.losses}D</span>
                              <span className="text-gray-400">{member.draws || 0}E</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Aproveitamento</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-yellow-500 rounded-full"
                                  style={{ width: `${winRate}%` }}
                                />
                              </div>
                              <span className="text-xs text-yellow-400">{winRate}%</span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-xs text-gray-500 mt-3">
                          Membro desde {formatDate(member.joinedDate)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Members List */}
              <div className={`
                bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20
                transition-all duration-700 delay-400
                ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
              `}>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
                  <span className="w-1 h-5 sm:h-6 bg-yellow-500 rounded-full"></span>
                  Lista de Membros Ativos
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="group bg-white/5 hover:bg-white/10 rounded-xl p-3 sm:p-4 border border-white/10 hover:border-yellow-500/50 transition-all duration-300 cursor-pointer"
                      onClick={() => setSelectedMember(member)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-white group-hover:text-yellow-400 transition-colors text-sm sm:text-base truncate">
                            {member.name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">{member.title}</p>
                          <div className="flex flex-wrap gap-2 sm:gap-3 mt-2">
                            <span className={`text-xs sm:text-sm font-semibold ${getRatingColor(member.rating)}`}>
                              {member.rating} rating
                            </span>
                            <span className="text-xs text-gray-500">
                              🏆 {member.wins} vitórias
                            </span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-2">
                          <div className="text-xl sm:text-2xl">♟️</div>
                          <div className="text-xs text-gray-500 mt-1">
                            desde {member.joinedDate.split('-')[0]}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar - Auth Form (idêntico ao login) */}
            <div className={`
              transition-all duration-700 delay-500
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              <div className="sticky top-24 bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20">
                {/* Toggle Buttons */}
                <div className="flex gap-2 mb-4 sm:mb-6">
                  <button
                    onClick={() => setIsLogin(true)}
                    className={`flex-1 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base ${
                      isLogin 
                        ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white' 
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    Entrar
                  </button>
                  <button
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base ${
                      !isLogin 
                        ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white' 
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    Registrar
                  </button>
                </div>

                {/* Login Form */}
                {isLogin && (
                  <form onSubmit={handleLoginSubmit} className="space-y-4 sm:space-y-5">
                    <div>
                      <label className="block text-gray-300 mb-1 sm:mb-2 text-xs sm:text-sm">Email *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={loginData.email}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors text-sm"
                        placeholder="seu@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-1 sm:mb-2 text-xs sm:text-sm">Senha *</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          required
                          value={loginData.password}
                          onChange={handleChange}
                          className="w-full px-3 sm:px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors pr-10 text-sm"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors"
                        >
                          {showPassword ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="rememberMe"
                          checked={loginData.rememberMe}
                          onChange={handleChange}
                          className="w-4 h-4 bg-white/10 border-white/20 rounded focus:ring-yellow-500"
                        />
                        <span className="text-xs sm:text-sm text-gray-400">Lembrar-me</span>
                      </label>
                      <Link href="/recuperar-senha" className="text-xs sm:text-sm text-yellow-500 hover:text-yellow-400 transition-colors">
                        Esqueceu a senha?
                      </Link>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                      {isSubmitting ? "Entrando..." : "Entrar"}
                    </button>
                  </form>
                )}

                {/* Register Form */}
                {!isLogin && (
                  <form onSubmit={handleRegisterSubmit} className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-gray-300 mb-1 sm:mb-2 text-xs sm:text-sm">Nome Completo *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={registerData.name}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors text-sm"
                        placeholder="Seu nome completo"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-1 sm:mb-2 text-xs sm:text-sm">Email *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={registerData.email}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors text-sm"
                        placeholder="seu@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-1 sm:mb-2 text-xs sm:text-sm">Senha *</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          required
                          value={registerData.password}
                          onChange={handleChange}
                          className="w-full px-3 sm:px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors pr-10 text-sm"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-1 sm:mb-2 text-xs sm:text-sm">Confirmar Senha *</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="confirmPassword"
                          required
                          value={registerData.confirmPassword}
                          onChange={handleChange}
                          className="w-full px-3 sm:px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors text-sm"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <div>
                        <label className="block text-gray-300 mb-1 sm:mb-2 text-xs sm:text-sm">Telefone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={registerData.phone}
                          onChange={handleChange}
                          className="w-full px-3 sm:px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors text-sm"
                          placeholder="+258 84 000 0000"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-1 sm:mb-2 text-xs sm:text-sm">Rating FIDE</label>
                        <input
                          type="number"
                          name="rating"
                          value={registerData.rating}
                          onChange={handleChange}
                          className="w-full px-3 sm:px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors text-sm"
                          placeholder="Opcional"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-1 sm:mb-2 text-xs sm:text-sm">Data de Nascimento</label>
                      <input
                        type="date"
                        name="birthDate"
                        value={registerData.birthDate}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors text-sm"
                      />
                    </div>

                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        name="acceptTerms"
                        required
                        checked={registerData.acceptTerms}
                        onChange={handleChange}
                        className="w-4 h-4 mt-0.5 bg-white/10 border-white/20 rounded focus:ring-yellow-500"
                      />
                      <label className="text-xs text-gray-400">
                        Li e aceito os{" "}
                        <Link href="/termos" className="text-yellow-500 hover:text-yellow-400 transition-colors">
                          Termos de Uso
                        </Link>{" "}
                        e a{" "}
                        <Link href="/privacidade" className="text-yellow-500 hover:text-yellow-400 transition-colors">
                          Política de Privacidade
                        </Link>{" "}
                        *
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                      {isSubmitting ? "Criando conta..." : "Criar Conta"}
                    </button>
                  </form>
                )}

                {/* Divider */}
                <div className="relative my-4 sm:my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-900/50 text-gray-500">ou</span>
                  </div>
                </div>

                {/* Social Login */}
                <div className="space-y-2 sm:space-y-3">
                  <button
                    className="w-full flex items-center justify-center gap-3 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300"
                  >
                    <AiFillFacebook className="text-blue-600 w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-gray-300 text-sm">Continuar com Facebook</span>
                  </button>
                  <button
                    className="w-full flex items-center justify-center gap-3 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300"
                  >
                    <AiOutlineGoogle className="text-red-500 w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-gray-300 text-sm">Continuar com Google</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Banner */}
          <div className={`
            grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 mt-8 sm:mt-12 transition-all duration-700 delay-600
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <div className="text-center p-3 sm:p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="text-xl sm:text-2xl font-bold text-yellow-500">{members.length}+</div>
              <div className="text-xs text-gray-400 mt-1">Membros Ativos</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="text-xl sm:text-2xl font-bold text-yellow-500">
                {Math.round(members.reduce((acc, m) => acc + m.rating, 0) / members.length)}
              </div>
              <div className="text-xs text-gray-400 mt-1">Rating Médio</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="text-xl sm:text-2xl font-bold text-yellow-500">
                {members.reduce((acc, m) => acc + m.wins, 0)}
              </div>
              <div className="text-xs text-gray-400 mt-1">Vitórias Totais</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="text-xl sm:text-2xl font-bold text-yellow-500">📍</div>
              <div className="text-xs text-gray-400 mt-1">Mahotas, Maputo</div>
            </div>
          </div>

          {/* Member Details Modal */}
          {selectedMember && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-gradient-to-b from-gray-900 to-gray-950 rounded-2xl p-5 sm:p-8 max-w-md w-full border border-white/20 shadow-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto">
                <div className="text-center mb-4 sm:mb-6">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center border-2 border-yellow-500/30">
                    <span className="text-4xl sm:text-5xl">♟️</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">{selectedMember.name}</h2>
                  <p className="text-yellow-500 text-xs sm:text-sm mt-1">{selectedMember.title}</p>
                </div>
                
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  <div className="flex justify-between p-2 sm:p-3 bg-white/5 rounded-lg text-sm">
                    <span className="text-gray-400">Rating FIDE</span>
                    <span className={`font-bold ${getRatingColor(selectedMember.rating)}`}>{selectedMember.rating}</span>
                  </div>
                  <div className="flex justify-between p-2 sm:p-3 bg-white/5 rounded-lg text-sm">
                    <span className="text-gray-400">Membro desde</span>
                    <span className="text-white">{formatDate(selectedMember.joinedDate)}</span>
                  </div>
                  <div className="flex justify-between p-2 sm:p-3 bg-white/5 rounded-lg text-sm">
                    <span className="text-gray-400">Histórico</span>
                    <span className="text-white">{selectedMember.wins}V - {selectedMember.losses}D - {selectedMember.draws || 0}E</span>
                  </div>
                  <div className="flex justify-between p-2 sm:p-3 bg-white/5 rounded-lg text-sm">
                    <span className="text-gray-400">Aproveitamento</span>
                    <span className="text-white">{getWinRate(selectedMember.wins, selectedMember.losses)}%</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedMember(null)}
                  className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base"
                >
                  Fechar
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}