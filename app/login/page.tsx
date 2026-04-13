// app/login/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { TbChessBishop, TbChessKing, TbChessQueen, TbChess } from "react-icons/tb";
import { AiFillFacebook, AiOutlineEye, AiOutlineEyeInvisible, AiOutlineGoogle } from "react-icons/ai";

const BASE_URL = "https://desktop-api-4f850b3f9733.herokuapp.com";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();
  const pageRef = useRef<HTMLDivElement>(null);

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });

  const [registerData, setRegisterData] = useState({
    nomeCompleto: "",
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    telefone: "",
    dataNascimento: "",
    genero: "outro",
    bi: "",
    nuit: "",
    endereco: "",
    bairro: "",
    cidade: "Maputo",
    provincia: "Maputo",
    nivelXadrez: "iniciante",
    acceptTerms: false,
  });

  const isVisible = true;

  // Função para validar BI Moçambique (12 números + 1 letra = 13 caracteres)
  const validateBI = (bi: string) => {
    // Formato: 12 dígitos + 1 letra (ex: 123456789012A)
    const biRegex = /^[0-9]{12}[A-Za-z]$/;
    return biRegex.test(bi.toUpperCase());
  };

  // Função para formatar BI automaticamente
  const handleBIChange = (value: string) => {
    // Remove caracteres não numéricos/letras
    let cleaned = value.replace(/[^0-9A-Za-z]/g, '');
    
    // Limita a 13 caracteres
    if (cleaned.length > 13) {
      cleaned = cleaned.slice(0, 13);
    }
    
    // Converte a última letra para maiúscula se for letra
    if (cleaned.length === 13) {
      const numbers = cleaned.slice(0, 12);
      const letter = cleaned.slice(12, 13).toUpperCase();
      cleaned = numbers + letter;
    }
    
    return cleaned;
  };

  // Função para validar telefone Moçambique
  const validatePhone = (phone: string) => {
    const phoneRegex = /^[8|7|6][0-9]{8}$/;
    return phoneRegex.test(phone);
  };

  // Função para calcular idade
  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${BASE_URL}/validateMembro`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: loginData.username,
          password: loginData.password,
        }),
      });

      const result = await response.json();

      if (result.returnCode === 200) {
        // Login bem-sucedido
        localStorage.setItem("membroId", result.data.membro.membroId);
        localStorage.setItem("matricula", result.data.membro.matricula);
        localStorage.setItem("nomeCompleto", result.data.membro.nomeCompleto);
        localStorage.setItem("tipoMembro", result.data.membro.tipoMembro);
        localStorage.setItem("email", result.data.membro.email);
        
        if (loginData.rememberMe) {
          localStorage.setItem("rememberMe", "true");
          localStorage.setItem("savedUsername", loginData.username);
        } else {
          localStorage.removeItem("rememberMe");
          localStorage.removeItem("savedUsername");
        }

        setSuccessMessage("✅ Login realizado com sucesso! Bem-vindo ao Real Chess Club.");
        
        // Redirecionar baseado no tipo de membro
        setTimeout(() => {
          if (result.data.membro.tipoMembro === "formador") {
            router.push("/dashboard");
          } else if (result.data.membro.tipoMembro === "administrador") {
            router.push("/dashboard");
          } else {
            router.push("/dashboard");
          }
        }, 1500);
      } else {
        setErrorMessage(result.returnMsg || "Erro ao fazer login. Verifique suas credenciais.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Erro de conexão com o servidor. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    // Validações
    if (registerData.password !== registerData.confirmPassword) {
      setErrorMessage("❌ As senhas não coincidem. Por favor, verifique.");
      setIsSubmitting(false);
      return;
    }

    if (registerData.password.length < 6) {
      setErrorMessage("❌ A senha deve ter no mínimo 6 caracteres.");
      setIsSubmitting(false);
      return;
    }

    if (!registerData.acceptTerms) {
      setErrorMessage("❌ Você precisa aceitar os Termos de Uso e Política de Privacidade.");
      setIsSubmitting(false);
      return;
    }

    // Validar BI (12 números + 1 letra = 13 caracteres)
    if (!validateBI(registerData.bi)) {
      setErrorMessage("❌ BI inválido. Deve conter 12 números e terminar com uma letra (ex: 123456789012A).");
      setIsSubmitting(false);
      return;
    }

    if (!registerData.telefone) {
      setErrorMessage("❌ Telefone é obrigatório.");
      setIsSubmitting(false);
      return;
    }

    if (!validatePhone(registerData.telefone)) {
      setErrorMessage("❌ Telefone inválido. Use o formato: 84XXXXXXX, 85XXXXXXX, etc.");
      setIsSubmitting(false);
      return;
    }

    if (!registerData.dataNascimento) {
      setErrorMessage("❌ Data de nascimento é obrigatória.");
      setIsSubmitting(false);
      return;
    }

    const age = calculateAge(registerData.dataNascimento);
    if (age < 5) {
      setErrorMessage("❌ Idade mínima para cadastro é 5 anos.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Preparar dados para API
      const membroData = {
        nomeCompleto: registerData.nomeCompleto,
        dataNascimento: registerData.dataNascimento,
        genero: registerData.genero,
        bi: registerData.bi.toUpperCase(), // Converter para maiúsculas
        nuit: registerData.nuit || undefined,
        contato: {
          telefone: registerData.telefone,
          email: registerData.email,
          endereco: {
            rua: registerData.endereco || "",
            bairro: registerData.bairro || "",
            cidade: registerData.cidade,
            provincia: registerData.provincia,
          },
        },
        usuario: {
          username: registerData.username,
          password: registerData.password,
          ativo: true,
        },
        aluno: {
          nivelXadrez: registerData.nivelXadrez,
          dataInscricao: new Date().toISOString(),
        },
        tipoMembro: "aluno",
        origem: "web",
      };

      console.log("Enviando dados:", membroData);

      const response = await fetch(`${BASE_URL}/createMembro`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(membroData),
      });

      const result = await response.json();

      if (result.returnCode === 201) {
        setSuccessMessage("✅ Cadastro realizado com sucesso! Bem-vindo ao Real Chess Club. Você já pode fazer login.");
        
        // Limpar formulário
        setRegisterData({
          nomeCompleto: "",
          email: "",
          password: "",
          confirmPassword: "",
          username: "",
          telefone: "",
          dataNascimento: "",
          genero: "outro",
          bi: "",
          nuit: "",
          endereco: "",
          bairro: "",
          cidade: "Maputo",
          provincia: "Maputo",
          nivelXadrez: "iniciante",
          acceptTerms: false,
        });
        
        // Preencher username no login para facilitar
        setLoginData(prev => ({ ...prev, username: registerData.username }));
        
        // Mudar para tela de login após 2 segundos
        setTimeout(() => {
          setIsLogin(true);
          setSuccessMessage("");
        }, 2000);
      } else {
        setErrorMessage(result.returnMsg || "Erro ao realizar cadastro. Verifique os dados e tente novamente.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage("Erro de conexão com o servidor. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (isLogin) {
      setLoginData({
        ...loginData,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
      });
    } else {
      // Aplicar formatação especial para o campo BI
      if (name === 'bi') {
        const formattedValue = handleBIChange(value);
        setRegisterData({
          ...registerData,
          [name]: formattedValue,
        });
      } else {
        setRegisterData({
          ...registerData,
          [name]: value,
        });
      }
    }
  };

  // Carregar username salvo ao montar componente
  useEffect(() => {
    const savedUsername = localStorage.getItem("savedUsername");
    if (savedUsername) {
      setLoginData(prev => ({ ...prev, username: savedUsername, rememberMe: true }));
    }
  }, []);

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
                <TbChess className="mr-2 w-5 h-5" />
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

          {/* Messages */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm text-center">
              {errorMessage}
            </div>
          )}
          
          {successMessage && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 text-sm text-center">
              {successMessage}
            </div>
          )}

          {/* Form Card */}
          <div className={`
            bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20
            transition-all duration-700 delay-300
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            {/* Toggle Buttons */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => {
                  setIsLogin(true);
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  isLogin 
                    ? 'bg-linear-to-r from-yellow-600 to-yellow-700 text-white' 
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                Entrar
              </button>
              <button
                onClick={() => {
                  setIsLogin(false);
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
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
                  <label className="block text-gray-300 mb-2 text-sm">Usuário *</label>
                  <input
                    type="text"
                    name="username"
                    required
                    value={loginData.username}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors"
                    placeholder="Seu nome de usuário"
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
              <form onSubmit={handleRegisterSubmit} className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                <div>
                  <label className="block text-gray-300 mb-2 text-sm">Nome Completo *</label>
                  <input
                    type="text"
                    name="nomeCompleto"
                    required
                    value={registerData.nomeCompleto}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors"
                    placeholder="Seu nome completo"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 text-sm">Nome de Usuário *</label>
                  <input
                    type="text"
                    name="username"
                    required
                    value={registerData.username}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors"
                    placeholder="Escolha um nome de usuário"
                  />
                  <p className="text-xs text-gray-500 mt-1">Usado para fazer login no sistema</p>
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
                  <label className="block text-gray-300 mb-2 text-sm">BI/NU (Número do Bilhete) *</label>
                  <input
                    type="text"
                    name="bi"
                    required
                    value={registerData.bi}
                    onChange={handleChange}
                    maxLength={13}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors uppercase"
                    placeholder="123456789012A (12 números + 1 letra)"
                  />
                  <p className="text-xs text-gray-500 mt-1">12 números + 1 letra (ex: 123456789012A)</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm">Senha *</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      value={registerData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors"
                      placeholder="Mínimo 6 caracteres"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm">Confirmar Senha *</label>
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
                    <label className="block text-gray-300 mb-2 text-sm">Telefone *</label>
                    <input
                      type="tel"
                      name="telefone"
                      required
                      value={registerData.telefone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors"
                      placeholder="84XXXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm">Data de Nascimento *</label>
                    <input
                      type="date"
                      name="dataNascimento"
                      required
                      value={registerData.dataNascimento}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Campo Gênero */}
                <div>
                  <label className="block text-gray-300 mb-2 text-sm">Gênero *</label>
                  <select
                    name="genero"
                    required
                    value={registerData.genero}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors"
                  >
                    <option value="masculino" className="text-black">Masculino</option>
                    <option value="feminino" className="text-black">Feminino</option>
                    <option value="outro" className="text-black">Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 text-sm">Nível de Xadrez</label>
                  <select
                    name="nivelXadrez"
                    value={registerData.nivelXadrez}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors"
                  >
                    <option value="iniciante" className="text-black">Iniciante</option>
                    <option value="intermediario" className="text-black">Intermediário</option>
                    <option value="avancado" className="text-black">Avançado</option>
                    <option value="competidor" className="text-black">Competidor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 text-sm">NUIT (Opcional)</label>
                  <input
                    type="text"
                    name="nuit"
                    value={registerData.nuit}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors"
                    placeholder="NUIT (se aplicável)"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 text-sm">Endereço</label>
                  <input
                    type="text"
                    name="endereco"
                    value={registerData.endereco}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors"
                    placeholder="Rua/Avenida"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      name="bairro"
                      value={registerData.bairro}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors"
                      placeholder="Bairro"
                    />
                  </div>
                  <div>
                    <select
                      name="cidade"
                      value={registerData.cidade}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors"
                    >
                      <option value="Maputo" className="text-black">Maputo</option>
                      <option value="Matola" className="text-black">Matola</option>
                      <option value="Beira" className="text-black">Beira</option>
                      <option value="Nampula" className="text-black">Nampula</option>
                      <option value="Quelimane" className="text-black">Quelimane</option>
                      <option value="Tete" className="text-black">Tete</option>
                      <option value="Xai-Xai" className="text-black">Xai-Xai</option>
                      <option value="Inhambane" className="text-black">Inhambane</option>
                      <option value="Lichinga" className="text-black">Lichinga</option>
                      <option value="Pemba" className="text-black">Pemba</option>
                      <option value="Chimoio" className="text-black">Chimoio</option>
                    </select>
                  </div>
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
                onClick={() => {
                  setErrorMessage("Funcionalidade em desenvolvimento. Use cadastro tradicional.");
                }}
              >
                <AiFillFacebook className="text-blue-600 w-5 h-5" />
                <span className="text-gray-300">Continuar com Facebook</span>
              </button>
              <button
                className="w-full flex items-center justify-center gap-3 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300"
                onClick={() => {
                  setErrorMessage("Funcionalidade em desenvolvimento. Use cadastro tradicional.");
                }}
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
            <p className="text-xs text-gray-500 mt-2">
              Cota mensal: <span className="text-yellow-500 font-semibold">250 MZN</span> - Pague após o cadastro
            </p>
          </div>
        </div>
      </main>
      <Footer />

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(234,179,8,0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(234,179,8,0.8);
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite 2s;
        }
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }
        .uppercase {
          text-transform: uppercase;
        }
      `}</style>
    </>
  );
}