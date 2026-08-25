// app/recuperar-senha/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const BASE_URL = "https://desktop-api-4f850b3f9733.herokuapp.com";

export default function RecuperarSenha() {
  const [step, setStep] = useState(1); // 1: email, 2: codigo, 3: nova senha
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [timer, setTimer] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const pageRef = useRef<HTMLDivElement>(null);

  const isVisible = true;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    
    if (!email) {
      setErrorMessage("❌ Por favor, informe o seu email.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${BASE_URL}/recuperar-senha`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (result.returnCode === 200) {
        setSuccessMessage(`✅ Código de verificação enviado para ${email}`);
        setVerificationId(result.data.verificationId);
        setTimer(300); // 5 minutos
        setStep(2);
      } else {
        setErrorMessage(result.returnMsg || "❌ Email não encontrado. Verifique e tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao enviar código:", error);
      setErrorMessage("❌ Erro de conexão com o servidor. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    
    const fullCode = code.join("");
    
    if (fullCode.length !== 6) {
      setErrorMessage("❌ Por favor, digite o código de 6 dígitos.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${BASE_URL}/verificar-codigoChess`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code: fullCode,
          verificationId,
        }),
      });

      const result = await response.json();

      if (result.returnCode === 200) {
        setSuccessMessage("✅ Código verificado com sucesso!");
        setStep(3);
      } else {
        setErrorMessage(result.returnMsg || "❌ Código inválido. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao verificar código:", error);
      setErrorMessage("❌ Erro de conexão com o servidor. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    
    if (newPassword.length < 6) {
      setErrorMessage("❌ A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setErrorMessage("❌ As senhas não coincidem.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${BASE_URL}/redefinir-senhaChess`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          newPassword,
          verificationId,
        }),
      });

      const result = await response.json();

      if (result.returnCode === 200) {
        setSuccessMessage("✅ Senha alterada com sucesso! Faça login com a sua nova senha.");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        setErrorMessage(result.returnMsg || "❌ Erro ao alterar senha. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao redefinir senha:", error);
      setErrorMessage("❌ Erro de conexão com o servidor. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    
    // Auto-focus no próximo input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const resendCode = async () => {
    if (timer > 0) return;
    
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${BASE_URL}/reenviar-codigoChess`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (result.returnCode === 200) {
        setSuccessMessage("✅ Novo código enviado!");
        setTimer(300);
        setVerificationId(result.data.verificationId);
        setCode(["", "", "", "", "", ""]);
      } else {
        setErrorMessage(result.returnMsg || "❌ Erro ao reenviar código.");
      }
    } catch (error) {
      console.error("Erro ao reenviar código:", error);
      setErrorMessage("❌ Erro de conexão com o servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main ref={pageRef} className="relative bg-linear-to-b from-gray-900 to-gray-950 min-h-screen mt-10">
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

        <div className="relative max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Cabeçalho */}
          <div className="text-center mb-8">
            <div className={`
              inline-block mb-6 transition-all duration-700
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-yellow-500/20 text-yellow-400 backdrop-blur-sm border border-yellow-500/30">
                <span className="mr-2">🔐</span>
                Recuperar Acesso
              </span>
            </div>
            <h1 className={`
              text-3xl md:text-4xl font-bold mb-4 transition-all duration-700 delay-100
              bg-linear-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              {step === 1 && "Recuperar Senha"}
              {step === 2 && "Verificar Código"}
              {step === 3 && "Nova Senha"}
            </h1>
            <div className={`
              w-24 h-1 bg-yellow-500 mx-auto mb-4 rounded-full transition-all duration-700 delay-150
              ${isVisible ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}
            `} />
            <p className={`
              text-gray-300 text-sm transition-all duration-700 delay-200
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              {step === 1 && "Digite o seu email para receber o código de recuperação"}
              {step === 2 && "Digite o código de 6 dígitos enviado para o seu email"}
              {step === 3 && "Crie uma nova senha para a sua conta"}
            </p>
          </div>

          {/* Mensagens de Feedback */}
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

          {/* Cartão do Formulário */}
          <div className={`
            bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20
            transition-all duration-700 delay-300
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            {/* Passo 1: Email */}
            {step === 1 && (
              <form onSubmit={handleSendCode} className="space-y-5">
                <div>
                  <label className="block text-gray-300 mb-2 text-sm">Email *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors"
                    placeholder="seu@email.com"
                    autoFocus
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Insira o email utilizado no cadastro do Real Chess Club
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-linear-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Enviando..." : "Enviar Código"}
                </button>

                <div className="text-center">
                  <Link href="/login" className="text-sm text-gray-400 hover:text-yellow-400 transition-colors">
                    ← Voltar para o login
                  </Link>
                </div>
              </form>
            )}

            {/* Passo 2: Código de Verificação */}
            {step === 2 && (
              <form onSubmit={handleVerifyCode} className="space-y-5">
                <div>
                  <label className="block text-gray-300 mb-3 text-sm text-center">
                    Código de Verificação
                  </label>
                  <div className="flex justify-center gap-2">
                    {code.map((digit, index) => (
                      <input
                        key={index}
                        id={`code-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleCodeChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-12 h-12 text-center text-xl font-bold bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors"
                        autoFocus={index === 0}
                      />
                    ))}
                  </div>
                  <p className="text-center text-sm text-gray-500 mt-3">
                    Código enviado para <span className="text-yellow-400">{email}</span>
                  </p>
                </div>

                <div className="text-center">
                  {timer > 0 ? (
                    <p className="text-sm text-gray-400">
                      Reenviar em <span className="text-yellow-400">{formatTimer(timer)}</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={resendCode}
                      disabled={isSubmitting}
                      className="text-sm text-yellow-500 hover:text-yellow-400 transition-colors disabled:opacity-50"
                    >
                      Reenviar código
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-linear-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Verificando..." : "Verificar Código"}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setErrorMessage("");
                      setSuccessMessage("");
                      setCode(["", "", "", "", "", ""]);
                    }}
                    className="text-sm text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    ← Usar outro email
                  </button>
                </div>

                <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <p className="text-xs text-gray-400 text-center">
                    💡 Verifique também a sua caixa de <strong>spam</strong> ou <strong>lixo eletrónico</strong>.
                    Se não recebeu o código após alguns minutos, tente reenviar.
                  </p>
                </div>
              </form>
            )}

            {/* Passo 3: Nova Senha */}
            {step === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-5">
                <div>
                  <label className="block text-gray-300 mb-2 text-sm">Nova Senha *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors pr-10"
                      placeholder="Mínimo 6 caracteres"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors"
                    >
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Mínimo de 6 caracteres</p>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 text-sm">Confirmar Nova Senha *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <p className="text-xs text-gray-400 text-center">
                    🔒 Dica: Use uma senha com pelo menos 8 caracteres, incluindo letras maiúsculas, 
                    minúsculas, números e símbolos para maior segurança.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-linear-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Alterando..." : "Alterar Senha"}
                </button>

                <div className="text-center">
                  <Link href="/login" className="text-sm text-gray-400 hover:text-yellow-400 transition-colors">
                    ← Voltar para o login
                  </Link>
                </div>
              </form>
            )}
          </div>

          {/* Texto de Ajuda */}
          <div className={`
            mt-6 text-center transition-all duration-700 delay-400
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <p className="text-xs text-gray-500">
              {step === 1 && "Você receberá um código de 6 dígitos por email para redefinir a sua senha."}
              {step === 2 && "Não recebeu o código? Verifique a sua caixa de spam ou tente reenviar."}
              {step === 3 && "Após alterar a senha, faça login com as suas novas credenciais."}
            </p>
          </div>

          {/* Link de Suporte */}
          <div className={`
            mt-6 text-center transition-all duration-700 delay-500
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <p className="text-xs text-gray-500">
              Precisa de ajuda?{" "}
              <Link href="/contato" className="text-yellow-500 hover:text-yellow-400 transition-colors">
                Entre em contacto connosco
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}