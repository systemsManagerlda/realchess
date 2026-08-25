/* eslint-disable @typescript-eslint/no-explicit-any */
// app/dashboard/DashboardFinanceiro.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  TbChess, 
  TbLogout, 
  TbRefresh, 
  TbCheck, 
  TbX, 
  TbClock, 
  TbUser, 
  TbPhone, 
  TbMail,
  TbEye,
  TbDownload,
  TbCalendar,
  TbFileText,
  TbWallet
} from "react-icons/tb";

const BASE_URL = "https://desktop-api-4f850b3f9733.herokuapp.com";

interface Pagamento {
  membroId: string;
  nomeCompleto: string;
  matricula: string;
  contato: {
    email: string;
    telefone: string;
  };
  pagamento: {
    pagamentoId: string;
    referencia: string;
    dataPagamento: string;
    valor: number;
    formaPagamento: string;
    comprovante: string;
    observacoes: string;
    status: string;
    confirmadoPor?: string;
    dataConfirmacao?: string;
    dadosTransacao: {
      numeroTransacao: string;
      operador: string;
    };
  };
}

interface ResumoFinanceiro {
  totalPendentes: number;
  valorPendente: number;
  totalConfirmados: number;
  valorConfirmado: number;
  totalCancelados: number;
  valorCancelado: number;
  totalGeral: number;
  valorGeral: number;
}

export default function DashboardFinanceiro() {
  const router = useRouter();
  const [pagamentosPendentes, setPagamentosPendentes] = useState<Pagamento[]>([]);
  const [pagamentosConfirmados, setPagamentosConfirmados] = useState<Pagamento[]>([]);
  const [pagamentosCancelados, setPagamentosCancelados] = useState<Pagamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmando, setConfirmando] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: string; message: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPagamento, setSelectedPagamento] = useState<Pagamento | null>(null);
  const [showDetalhesModal, setShowDetalhesModal] = useState(false);
  const [activeTab, setActiveTab] = useState("pendentes");
  const [resumo, setResumo] = useState<ResumoFinanceiro>({
    totalPendentes: 0,
    valorPendente: 0,
    totalConfirmados: 0,
    valorConfirmado: 0,
    totalCancelados: 0,
    valorCancelado: 0,
    totalGeral: 0,
    valorGeral: 0
  });

  useEffect(() => {
    const checkAuth = async () => {
      const membroId = localStorage.getItem("membroId");
      const tipoMembro = localStorage.getItem("tipoMembro");

      if (!membroId || (tipoMembro !== "administrador" && tipoMembro !== "financeiro")) {
        router.push("/login");
        return;
      }

      await fetchTodosPagamentos();
    };

    checkAuth();
  }, [router]);

  const fetchTodosPagamentos = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/getTodosPagamentos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const result = await response.json();

      if (result.returnCode === 200) {
        const todosPagamentos = result.data;
        
        // Separar por status
        const pendentes = todosPagamentos.filter((p: Pagamento) => p.pagamento.status === "aguardando_confirmacao");
        const confirmados = todosPagamentos.filter((p: Pagamento) => p.pagamento.status === "confirmado");
        const cancelados = todosPagamentos.filter((p: Pagamento) => p.pagamento.status === "cancelado");
        
        setPagamentosPendentes(pendentes);
        setPagamentosConfirmados(confirmados);
        setPagamentosCancelados(cancelados);
        
        // Calcular resumo
        const totalPendentes = pendentes.length;
        const valorPendente = pendentes.reduce((acc: any, p: { pagamento: { valor: any; }; }) => acc + p.pagamento.valor, 0);
        const totalConfirmados = confirmados.length;
        const valorConfirmado = confirmados.reduce((acc: any, p: { pagamento: { valor: any; }; }) => acc + p.pagamento.valor, 0);
        const totalCancelados = cancelados.length;
        const valorCancelado = cancelados.reduce((acc: any, p: { pagamento: { valor: any; }; }) => acc + p.pagamento.valor, 0);
        
        setResumo({
          totalPendentes,
          valorPendente,
          totalConfirmados,
          valorConfirmado,
          totalCancelados,
          valorCancelado,
          totalGeral: totalPendentes + totalConfirmados + totalCancelados,
          valorGeral: valorPendente + valorConfirmado + valorCancelado
        });
      } else {
        showNotification("error", result.returnMsg || "Erro ao carregar pagamentos");
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      showNotification("error", "Erro de conexão com o servidor");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type: string, message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleConfirmarPagamento = async (pagamentoId: string) => {
    setConfirmando(pagamentoId);

    try {
      const response = await fetch(`${BASE_URL}/confirmarPagamento`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pagamentoId,
          confirmadoPor: localStorage.getItem("nomeCompleto") || "Gestor Financeiro",
          observacoes: "Pagamento confirmado pela tesouraria",
        }),
      });

      const result = await response.json();

      if (result.returnCode === 200) {
        showNotification("success", "✅ Pagamento confirmado com sucesso!");
        await fetchTodosPagamentos();
        setShowDetalhesModal(false);
      } else {
        showNotification("error", result.returnMsg || "Erro ao confirmar pagamento");
      }
    } catch (error) {
      showNotification("error", "Erro de conexão com o servidor");
    } finally {
      setConfirmando(null);
    }
  };

  const handleRejeitarPagamento = async (pagamentoId: string) => {
    setConfirmando(pagamentoId);

    try {
      const response = await fetch(`${BASE_URL}/rejeitarPagamento`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pagamentoId,
          rejeitadoPor: localStorage.getItem("nomeCompleto") || "Gestor Financeiro",
          motivo: "Pagamento com inconsistências - verificar com o membro",
        }),
      });

      const result = await response.json();

      if (result.returnCode === 200) {
        showNotification("warning", "⚠️ Pagamento rejeitado.");
        await fetchTodosPagamentos();
        setShowDetalhesModal(false);
      } else {
        showNotification("error", result.returnMsg || "Erro ao rejeitar pagamento");
      }
    } catch (error) {
      showNotification("error", "Erro de conexão com o servidor");
    } finally {
      setConfirmando(null);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const getFormaPagamentoIcon = (forma: string) => {
    const icons: Record<string, string> = {
      "M-Pesa": "📱",
      "E-mola": "📱",
      dinheiro: "💵",
      transferencia: "🏦",
      multicaixa: "💳",
    };
    return icons[forma] || "💰";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "aguardando_confirmacao":
        return { text: "⏳ Pendente", color: "bg-yellow-500/20 text-yellow-400" };
      case "confirmado":
        return { text: "✅ Confirmado", color: "bg-green-500/20 text-green-400" };
      case "cancelado":
        return { text: "❌ Cancelado", color: "bg-red-500/20 text-red-400" };
      default:
        return { text: status, color: "bg-gray-500/20 text-gray-400" };
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-MZ', { 
      style: 'currency', 
      currency: 'MZN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  const renderPagamentosList = (pagamentos: Pagamento[], title: string) => {
    if (pagamentos.length === 0) {
      return (
        <div className="bg-white/5 rounded-xl p-8 text-center border border-white/10">
          <p className="text-gray-400">Nenhum pagamento {title.toLowerCase()}</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {pagamentos.map((item) => {
          const statusInfo = getStatusBadge(item.pagamento.status);
          return (
            <div
              key={item.pagamento.pagamentoId}
              className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-yellow-500/30 transition-all cursor-pointer"
              onClick={() => {
                setSelectedPagamento(item);
                setShowDetalhesModal(true);
              }}
            >
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="text-lg font-semibold text-white truncate">{item.nomeCompleto}</h3>
                    <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full text-xs whitespace-nowrap">
                      {item.matricula}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs whitespace-nowrap ${statusInfo.color}`}>
                      {statusInfo.text}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                    <div className="flex items-center gap-1 text-gray-300">
                      <span>💰</span>
                      <span className="font-semibold text-yellow-400">{item.pagamento.valor} MZN</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-300">
                      <span>📅</span>
                      <span>{new Date(item.pagamento.dataPagamento).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-300">
                      <span>{getFormaPagamentoIcon(item.pagamento.formaPagamento)}</span>
                      <span className="truncate">{item.pagamento.formaPagamento}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-300">
                      <span>📝</span>
                      <span className="truncate">{item.pagamento.referencia}</span>
                    </div>
                  </div>
                  {item.pagamento.confirmadoPor && (
                    <div className="mt-1 text-xs text-gray-500">
                      Confirmado por: {item.pagamento.confirmadoPor}
                      {item.pagamento.dataConfirmacao && ` em ${new Date(item.pagamento.dataConfirmacao).toLocaleDateString()}`}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPagamento(item);
                      setShowDetalhesModal(true);
                    }}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
                    title="Ver Detalhes"
                  >
                    <TbEye className="w-4 h-4 text-gray-400" />
                  </button>
                  {item.pagamento.status === "aguardando_confirmacao" && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleConfirmarPagamento(item.pagamento.pagamentoId);
                        }}
                        disabled={confirmando === item.pagamento.pagamentoId}
                        className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition disabled:opacity-50"
                        title="Confirmar"
                      >
                        {confirmando === item.pagamento.pagamentoId ? (
                          <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                        ) : (
                          <TbCheck className="w-4 h-4 text-white" />
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRejeitarPagamento(item.pagamento.pagamentoId);
                        }}
                        disabled={confirmando === item.pagamento.pagamentoId}
                        className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition disabled:opacity-50"
                        title="Rejeitar"
                      >
                        <TbX className="w-4 h-4 text-white" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-400">Carregando pagamentos...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 pt-20">
        {notification && (
          <div
            className={`fixed top-24 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
              notification.type === "success"
                ? "bg-green-500/90"
                : notification.type === "warning"
                ? "bg-yellow-500/90"
                : "bg-red-500/90"
            } text-white animate-slide-in`}
          >
            {notification.message}
          </div>
        )}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Botão menu mobile */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden fixed bottom-4 right-4 z-50 p-3 bg-yellow-600 rounded-full shadow-lg"
          >
            <TbUser className="w-6 h-6 text-white" />
          </button>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div
              className={`fixed lg:relative inset-y-0 left-0 z-40 w-72 bg-gray-800/95 backdrop-blur-sm border-r border-white/10 transform transition-transform duration-300 overflow-y-auto ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
              }`}
            >
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-full flex items-center justify-center mb-4">
                    <TbChess className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-white font-semibold">Gestor Financeiro</h3>
                  <p className="text-sm text-gray-400">Real Chess Mahotas</p>
                  <p className="text-xs text-yellow-500 mt-1">{localStorage.getItem("nomeCompleto")}</p>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setActiveTab("pendentes");
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      activeTab === "pendentes"
                        ? "bg-yellow-600/20 text-yellow-400"
                        : "text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    <TbClock className="w-5 h-5" />
                    <span>Pendentes</span>
                    {resumo.totalPendentes > 0 && (
                      <span className="ml-auto bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full text-xs">
                        {resumo.totalPendentes}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("confirmados");
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      activeTab === "confirmados"
                        ? "bg-green-600/20 text-green-400"
                        : "text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    <TbCheck className="w-5 h-5" />
                    <span>Confirmados</span>
                    {resumo.totalConfirmados > 0 && (
                      <span className="ml-auto bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full text-xs">
                        {resumo.totalConfirmados}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("cancelados");
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      activeTab === "cancelados"
                        ? "bg-red-600/20 text-red-400"
                        : "text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    <TbX className="w-5 h-5" />
                    <span>Cancelados</span>
                    {resumo.totalCancelados > 0 && (
                      <span className="ml-auto bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full text-xs">
                        {resumo.totalCancelados}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("resumo");
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      activeTab === "resumo"
                        ? "bg-blue-600/20 text-blue-400"
                        : "text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    <TbWallet className="w-5 h-5" />
                    <span>Resumo</span>
                  </button>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10"
                  >
                    <TbLogout className="w-5 h-5" />
                    <span>Sair</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Conteúdo Principal */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-white">Gestão de Pagamentos</h1>
                  <p className="text-sm text-gray-400 mt-1">
                    {activeTab === "pendentes" && "Pagamentos aguardando confirmação"}
                    {activeTab === "confirmados" && "Pagamentos já confirmados"}
                    {activeTab === "cancelados" && "Pagamentos cancelados"}
                    {activeTab === "resumo" && "Resumo financeiro do clube"}
                  </p>
                </div>
                <button
                  onClick={fetchTodosPagamentos}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
                >
                  <TbRefresh className="w-4 h-4" />
                  <span className="text-sm">Atualizar</span>
                </button>
              </div>

              {/* Resumo rápido no topo */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div className="bg-white/10 rounded-xl p-3 border border-white/20">
                  <p className="text-gray-400 text-xs">Total Pagamentos</p>
                  <p className="text-xl font-bold text-white">{resumo.totalGeral}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3 border border-white/20">
                  <p className="text-gray-400 text-xs">Valor Total</p>
                  <p className="text-xl font-bold text-yellow-400">{formatCurrency(resumo.valorGeral)}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3 border border-white/20">
                  <p className="text-gray-400 text-xs">Confirmados</p>
                  <p className="text-xl font-bold text-green-400">{resumo.totalConfirmados}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3 border border-white/20">
                  <p className="text-gray-400 text-xs">Pendentes</p>
                  <p className="text-xl font-bold text-yellow-400">{resumo.totalPendentes}</p>
                </div>
              </div>

              {/* Conteúdo da aba */}
              {activeTab === "pendentes" && renderPagamentosList(pagamentosPendentes, "Pendentes")}
              {activeTab === "confirmados" && renderPagamentosList(pagamentosConfirmados, "Confirmados")}
              {activeTab === "cancelados" && renderPagamentosList(pagamentosCancelados, "Cancelados")}

              {/* Resumo detalhado */}
              {activeTab === "resumo" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-yellow-500/10 rounded-xl p-6 border border-yellow-500/30">
                      <div className="flex items-center gap-3 mb-2">
                        <TbClock className="w-6 h-6 text-yellow-400" />
                        <h3 className="text-lg font-semibold text-white">Pendentes</h3>
                      </div>
                      <p className="text-3xl font-bold text-yellow-400">{resumo.totalPendentes}</p>
                      <p className="text-sm text-gray-400 mt-1">Pagamentos aguardando confirmação</p>
                      <p className="text-lg font-semibold text-yellow-400 mt-2">{formatCurrency(resumo.valorPendente)}</p>
                    </div>

                    <div className="bg-green-500/10 rounded-xl p-6 border border-green-500/30">
                      <div className="flex items-center gap-3 mb-2">
                        <TbCheck className="w-6 h-6 text-green-400" />
                        <h3 className="text-lg font-semibold text-white">Confirmados</h3>
                      </div>
                      <p className="text-3xl font-bold text-green-400">{resumo.totalConfirmados}</p>
                      <p className="text-sm text-gray-400 mt-1">Pagamentos já confirmados</p>
                      <p className="text-lg font-semibold text-green-400 mt-2">{formatCurrency(resumo.valorConfirmado)}</p>
                    </div>

                    <div className="bg-red-500/10 rounded-xl p-6 border border-red-500/30">
                      <div className="flex items-center gap-3 mb-2">
                        <TbX className="w-6 h-6 text-red-400" />
                        <h3 className="text-lg font-semibold text-white">Cancelados</h3>
                      </div>
                      <p className="text-3xl font-bold text-red-400">{resumo.totalCancelados}</p>
                      <p className="text-sm text-gray-400 mt-1">Pagamentos cancelados/rejeitados</p>
                      <p className="text-lg font-semibold text-red-400 mt-2">{formatCurrency(resumo.valorCancelado)}</p>
                    </div>
                  </div>

                  {/* Resumo geral */}
                  <div className="bg-yellow-600/10 rounded-xl p-6 border border-yellow-500/30">
                    <h3 className="text-lg font-semibold text-white mb-4">Resumo Geral</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white/5 rounded-lg p-4">
                        <p className="text-gray-400 text-sm">Total de Pagamentos</p>
                        <p className="text-2xl font-bold text-white">{resumo.totalGeral}</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4">
                        <p className="text-gray-400 text-sm">Valor Total</p>
                        <p className="text-2xl font-bold text-yellow-400">{formatCurrency(resumo.valorGeral)}</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4">
                        <p className="text-gray-400 text-sm">Taxa de Confirmação</p>
                        <p className="text-2xl font-bold text-green-400">
                          {resumo.totalGeral > 0 ? Math.round((resumo.totalConfirmados / resumo.totalGeral) * 100) : 0}%
                        </p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4">
                        <p className="text-gray-400 text-sm">Valor Médio</p>
                        <p className="text-2xl font-bold text-white">
                          {resumo.totalGeral > 0 ? formatCurrency(resumo.valorGeral / resumo.totalGeral) : formatCurrency(0)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Últimos pagamentos confirmados */}
                  {pagamentosConfirmados.length > 0 && (
                    <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                      <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <TbFileText className="w-5 h-5 text-green-400" />
                        Últimos Pagamentos Confirmados
                      </h3>
                      <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                        {pagamentosConfirmados.slice(0, 5).map((item) => (
                          <div key={item.pagamento.pagamentoId} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                            <div>
                              <p className="text-white text-sm">{item.nomeCompleto}</p>
                              <p className="text-xs text-gray-400">{item.matricula}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-yellow-400 font-semibold">{item.pagamento.valor} MZN</p>
                              <p className="text-xs text-gray-400">{new Date(item.pagamento.dataPagamento).toLocaleDateString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Detalhes do Pagamento */}
      {showDetalhesModal && selectedPagamento && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-yellow-500/30">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Detalhes do Pagamento</h3>
              <button
                onClick={() => setShowDetalhesModal(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <TbX className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Status */}
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-gray-400">Status</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(selectedPagamento.pagamento.status).color}`}>
                  {getStatusBadge(selectedPagamento.pagamento.status).text}
                </span>
              </div>

              {/* Dados do Membro */}
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-400 mb-3">Dados do Membro</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-white">
                    <TbUser className="w-4 h-4 text-yellow-500" />
                    <span className="font-semibold">{selectedPagamento.nomeCompleto}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300 text-sm">
                    <span>Matrícula: {selectedPagamento.matricula}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300 text-sm">
                    <TbMail className="w-4 h-4 text-yellow-500" />
                    <span>{selectedPagamento.contato.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300 text-sm">
                    <TbPhone className="w-4 h-4 text-yellow-500" />
                    <span>{selectedPagamento.contato.telefone}</span>
                  </div>
                </div>
              </div>

              {/* Dados do Pagamento */}
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-400 mb-3">Dados do Pagamento</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-gray-400 text-sm">Valor</p>
                    <p className="text-white font-semibold text-lg">{selectedPagamento.pagamento.valor} MZN</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Data</p>
                    <p className="text-white">{new Date(selectedPagamento.pagamento.dataPagamento).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Forma de Pagamento</p>
                    <p className="text-white">{selectedPagamento.pagamento.formaPagamento}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Referência</p>
                    <p className="text-white text-sm">{selectedPagamento.pagamento.referencia}</p>
                  </div>
                  {selectedPagamento.pagamento.dadosTransacao?.numeroTransacao && (
                    <div className="col-span-2">
                      <p className="text-gray-400 text-sm">Nº Transação</p>
                      <p className="text-white text-sm">{selectedPagamento.pagamento.dadosTransacao.numeroTransacao}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Comprovante */}
              {selectedPagamento.pagamento.comprovante && (
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">Comprovante</h4>
                  <a
                    href={selectedPagamento.pagamento.comprovante}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-yellow-500 hover:text-yellow-400 transition text-sm flex items-center gap-2"
                  >
                    📎 Ver comprovante
                  </a>
                </div>
              )}

              {/* Observações */}
              {selectedPagamento.pagamento.observacoes && (
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">Observações</h4>
                  <p className="text-gray-300 text-sm">{selectedPagamento.pagamento.observacoes}</p>
                </div>
              )}

              {/* Ações - só para pendentes */}
              {selectedPagamento.pagamento.status === "aguardando_confirmacao" && (
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => handleRejeitarPagamento(selectedPagamento.pagamento.pagamentoId)}
                    disabled={confirmando === selectedPagamento.pagamento.pagamentoId}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {confirmando === selectedPagamento.pagamento.pagamentoId ? (
                      <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                    ) : (
                      <>
                        <TbX className="w-4 h-4" />
                        Rejeitar
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleConfirmarPagamento(selectedPagamento.pagamento.pagamentoId)}
                    disabled={confirmando === selectedPagamento.pagamento.pagamentoId}
                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {confirmando === selectedPagamento.pagamento.pagamentoId ? (
                      <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                    ) : (
                      <>
                        <TbCheck className="w-4 h-4" />
                        Confirmar
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(234, 179, 8, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(234, 179, 8, 0.8);
        }
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </>
  );
}