// app/recuperar-senha/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RecuperarSenha() {
  const [step, setStep] = useState(1); // 1: email, 2: codigo, 3: nova senha
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [timer, setTimer] = useState(0);
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
    if (!email) {
      alert("❌ Por favor, informe seu email.");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate sending code
    setTimeout(() => {
      alert(`✅ Código de verificação enviado para ${email}`);
      setTimer(300); // 5 minutes timer
      setStep(2);
      setIsSubmitting(false);
    }, 1000);
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join("");
    
    if (fullCode.length !== 6) {
      alert("❌ Por favor, digite o código de 6 dígitos.");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate code verification
    setTimeout(() => {
      // For demo, accept any 6-digit code
      alert("✅ Código verificado com sucesso!");
      setStep(3);
      setIsSubmitting(false);
    }, 1000);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword.length < 6) {
      alert("❌ A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      alert("❌ As senhas não coincidem.");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate password reset
    setTimeout(() => {
      alert("✅ Senha alterada com sucesso! Faça login com sua nova senha.");
      setIsSubmitting(false);
      window.location.href = "/login";
    }, 1000);
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    
    // Auto-focus next input
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

  const resendCode = () => {
    if (timer > 0) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      alert("✅ Novo código enviado!");
      setTimer(300);
      setIsSubmitting(false);
    }, 1000);
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
          <div className="absolute top-20 right-20 text-7xl animate-float">♔</div>
          <div className="absolute bottom-20 left-20 text-7xl animate-float-delayed">♕</div>
        </div>

        <div className="relative max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
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
              {step === 1 && "Digite seu email para receber o código de recuperação"}
              {step === 2 && "Digite o código de 6 dígitos enviado para seu email"}
              {step === 3 && "Crie uma nova senha para sua conta"}
            </p>
          </div>

          {/* Form Card */}
          <div className={`
            bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20
            transition-all duration-700 delay-300
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            {/* Step 1: Email */}
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

            {/* Step 2: Verification Code */}
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
                      className="text-sm text-yellow-500 hover:text-yellow-400 transition-colors"
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
                    onClick={() => setStep(1)}
                    className="text-sm text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    ← Usar outro email
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: New Password */}
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
                      placeholder="••••••••"
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

          {/* Help Text */}
          <div className={`
            mt-6 text-center transition-all duration-700 delay-400
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <p className="text-xs text-gray-500">
              {step === 1 && "Você receberá um código de 6 dígitos por email para redefinir sua senha."}
              {step === 2 && "Não recebeu o código? Verifique sua caixa de spam ou tente novamente."}
              {step === 3 && "Após alterar a senha, faça login com suas novas credenciais."}
            </p>
          </div>

          {/* Support Link */}
          <div className={`
            mt-6 text-center transition-all duration-700 delay-500
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <p className="text-xs text-gray-500">
              Precisa de ajuda?{" "}
              <Link href="/contato" className="text-yellow-500 hover:text-yellow-400 transition-colors">
                Entre em contato conosco
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}