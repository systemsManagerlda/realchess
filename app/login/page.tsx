// app/login/page.tsx
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { TbChessBishop, TbChessKing, TbChessQueen, TbChess } from "react-icons/tb";
import { AiFillFacebook, AiOutlineEye, AiOutlineEyeInvisible, AiOutlineGoogle } from "react-icons/ai";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const pageRef = useRef<HTMLDivElement>(null);

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

  const isVisible = true;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate login
    setTimeout(() => {
      alert("✅ Login realizado com sucesso! Bem-vindo ao Real Chess Club.");
      setIsSubmitting(false);
      router.push("/");
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
    
    // Simulate registration
    setTimeout(() => {
      alert("✅ Cadastro realizado com sucesso! Bem-vindo ao Real Chess Club. Um email de confirmação foi enviado.");
      setIsSubmitting(false);
      router.push("/");
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

  return (
    <>
      <Header />
      <main ref={pageRef} className="relative bg-linear-to-b from-gray-900 to-gray-950 min-h-screen mt-10">
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

        <div className="relative max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`
              inline-block mb-6 transition-all duration-700
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-yellow-500/20 text-yellow-400 backdrop-blur-sm border border-yellow-500/30">
                <TbChess  className="mr-2 w-5 h-5" />
                Real Chess Club
              </span>
            </div>
            <h1 className={`
              text-3xl md:text-4xl font-bold mb-4 transition-all duration-700 delay-100
              bg-linear-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              {isLogin ? "Bem-vindo de Volta" : "Crie sua Conta"}
            </h1>
            <div className={`
              w-24 h-1 bg-yellow-500 mx-auto mb-4 rounded-full transition-all duration-700 delay-150
              ${isVisible ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}
            `} />
            <p className={`
              text-gray-300 text-sm transition-all duration-700 delay-200
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              {isLogin 
                ? "Acesse sua conta para participar de torneios e eventos" 
                : "Preencha os dados abaixo para se tornar membro do clube"}
            </p>
          </div>

          {/* Form Card */}
          <div className={`
            bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20
            transition-all duration-700 delay-300
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            {/* Toggle Buttons */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  isLogin 
                    ? 'bg-linear-to-r from-yellow-600 to-yellow-700 text-white' 
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                Entrar
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  !isLogin 
                    ? 'bg-linear-to-r from-yellow-600 to-yellow-700 text-white' 
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                Registrar
              </button>
            </div>

            {/* Login Form */}
            {isLogin && (
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                <div>
                  <label className="block text-gray-300 mb-2 text-sm">Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={loginData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors"
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 text-sm">Senha *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      value={loginData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors"
                    >
                      {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
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
                    <span className="text-sm text-gray-400">Lembrar-me</span>
                  </label>
                  <Link href="/recuperar-senha" className="text-sm text-yellow-500 hover:text-yellow-400 transition-colors">
                    Esqueceu a senha?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-linear-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Entrando..." : "Entrar"}
                </button>
              </form>
            )}

            {/* Register Form */}
            {!isLogin && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2 text-sm">Nome Completo *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={registerData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors"
                    placeholder="Seu nome completo"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 text-sm">Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={registerData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors"
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 text-sm">Senha *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      value={registerData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors pr-10"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 text-sm">Confirmar Senha *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      required
                      value={registerData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm">Telefone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={registerData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors"
                      placeholder="+258 84 000 0000"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm">Rating FIDE</label>
                    <input
                      type="number"
                      name="rating"
                      value={registerData.rating}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors"
                      placeholder="Opcional"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 text-sm">Data de Nascimento</label>
                  <input
                    type="date"
                    name="birthDate"
                    value={registerData.birthDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors"
                  />
                </div>

                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    required
                    checked={registerData.acceptTerms}
                    onChange={handleChange}
                    className="w-4 h-4 mt-1 bg-white/10 border-white/20 rounded focus:ring-yellow-500"
                  />
                  <label className="text-sm text-gray-400">
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
                  className="w-full bg-linear-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Criando conta..." : "Criar Conta"}
                </button>
              </form>
            )}

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900/50 text-gray-500">ou</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="space-y-3">
              <button
                className="w-full flex items-center justify-center gap-3 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300"
              >
                <AiFillFacebook className="text-blue-600 w-5 h-5" />
                <span className="text-gray-300">Continuar com Facebook</span>
              </button>
              <button
                className="w-full flex items-center justify-center gap-3 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300"
              >
                <AiOutlineGoogle className="text-red-500 w-5 h-5" />
                <span className="text-gray-300">Continuar com Google</span>
              </button>
            </div>
          </div>

          {/* Info Note */}
          <div className={`
            mt-6 text-center transition-all duration-700 delay-400
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <p className="text-xs text-gray-500">
              Ao criar uma conta, você concorda em receber comunicações sobre eventos, torneios e novidades do clube.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}