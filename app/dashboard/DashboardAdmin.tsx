/* eslint-disable @typescript-eslint/no-explicit-any */
// app/dashboard/DashboardAdmin.tsx
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  TbChess,
  TbUsers,
  TbSchool,
  TbChartBar,
  TbLogout,
  TbCoin,
  TbCalendar,
  TbFileText,
  TbSettings,
  TbBell,
  TbActivity,
  TbEdit,
  TbTrash,
  TbCheck,
  TbX,
  TbEye,
  TbDownload,
  TbRefresh,
  TbSearch,
  TbMail,
  TbPhone,
  TbId,
  TbCalendarEvent,
  TbAward,
  TbClock,
  TbBook,
  TbUserCheck,
  TbUserX,
  TbChartLine,
  TbCash,
  TbReceipt,
  TbChecklist,
  TbAlertCircle,
  TbLoader2,
  TbFilter,
  TbSortAscending,
  TbSortDescending,
  TbInfoCircle,
} from "react-icons/tb";

const BASE_URL = "https://desktop-api-4f850b3f9733.herokuapp.com";
const ITEMS_PER_PAGE = 10;

// ========== INTERFACES ATUALIZADAS ==========
interface AdminDashboard {
  resumo: {
    totalMembros: number;
    totalAlunos: number;
    totalFormadores: number;
    inadimplentes: number;
    taxaInadimplencia: number;
    candidatosPendentes: number;
    arrecadacaoMes: number;
    totalPresencasMes: number;
    totalHorasMes: number;
  };
  distribuicaoNivel: Array<{ _id: string; count: number }>;
  cursosAtivos: Array<{
    nome: string;
    totalAlunos: number;
    progressoMedio: number;
  }>;
  topAlunos: Array<{
    nomeCompleto: string;
    matricula: string;
    gamificacao: { pontos: number; nivel: number };
  }>;
  evolucaoMensal: Array<{ count: number; mes: string; ano: string }>;
  periodo: {
    mesAtual: string;
    inicioMes: Date;
    fimMes: Date;
  };
}

interface Membro {
  membroId: string;
  matricula: string;
  nomeCompleto: string;
  tipoMembro: string;
  contato: {
    email: string;
    telefone: string;
  };
  cotas: {
    statusPagamento: string;
    valorTotalDevido: number;
    proximoVencimento: Date;
    valorMensal: number;
    ultimoPagamento?: Date;
  };
  ativo: boolean;
  dataCadastro: string;
  aluno?: {
    nivelXadrez: string;
    rating: { pontuacao: number; tipo: string };
  };
  formador?: {
    candidatura: {
      status: string;
      dataCandidatura: string;
    };
  };
  gamificacao?: {
    pontos: number;
    nivel: number;
  };
}

interface PagamentoPendente {
  membroId: string;
  nomeCompleto: string;
  matricula: string;
  contato: { email: string; telefone: string };
  pagamento: {
    pagamentoId: string;
    valor: number;
    dataPagamento: Date;
    referencia: string;
    formaPagamento: string;
    mesReferente: { mes: number; ano: number };
    observacoes: string;
  };
}

interface Candidato {
  membroId: string;
  matricula: string;
  nomeCompleto: string;
  contato: { email: string; telefone: string };
  formador: {
    candidatura: {
      dataCandidatura: string;
      status: string;
      parecer?: string;
      documentosAnexados: Array<{ nome: string; url: string }>;
    };
  };
}

interface Aula {
  aulaId: string;
  titulo: string;
  descricao: string;
  categoria: string;
  nivel: string;
  status: string;
  visualizacoes: number;
  totalExercicios: number;
  totalVideos?: number;
  totalImagens?: number;
  duracaoEstimada?: number;
  estatisticas: {
    totalAlunosInscritos: number;
    totalConcluintes: number;
    avaliacaoMedia: number;
    taxaConclusao?: number;
  };
  dataCriacao: string;
  dataPublicacao?: string;
  formadorId: string;
  formadorNome: string;
  tags?: string[];
}

interface EstatisticasAulas {
  totalAulas: number;
  totalPublicadas: number;
  totalVisualizacoes: number;
  totalAlunosInscritos: number;
  totalConcluintes: number;
  avaliacaoMedia: number;
  totalExercicios: number;
  taxaAcertoMedia: number;
}

interface Notificacao {
  id: string;
  tipo: "success" | "error" | "info" | "warning";
  mensagem: string;
  timestamp: Date;
}

// ========== COMPONENTE PRINCIPAL ==========
export default function DashboardAdmin() {
  const router = useRouter();

  // ========== STATES ==========
  const [dashboardData, setDashboardData] = useState<AdminDashboard | null>(null);
  const [membros, setMembros] = useState<Membro[]>([]);
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [pagamentosPendentes, setPagamentosPendentes] = useState<PagamentoPendente[]>([]);
  const [estatisticasAulas, setEstatisticasAulas] = useState<EstatisticasAulas | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Filtros e Paginação
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [filterTipo, setFilterTipo] = useState("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<"nome" | "data" | "status">("data");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  // Modais
  const [selectedMembro, setSelectedMembro] = useState<Membro | null>(null);
  const [showMembroModal, setShowMembroModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  const [paymentData, setPaymentData] = useState({
    membroId: "",
    valor: 100,
    formaPagamento: "M-Pesa",
    referencia: "",
    observacoes: "",
  });
  
  const [notifications, setNotifications] = useState<Notificacao[]>([]);
  const [showCandidaturaModal, setShowCandidaturaModal] = useState(false);
  const [selectedCandidato, setSelectedCandidato] = useState<Candidato | null>(null);
  const [parecerText, setParecerText] = useState("");
  const [showAulaModal, setShowAulaModal] = useState(false);
  const [selectedAula, setSelectedAula] = useState<Aula | null>(null);

  // ========== FUNÇÕES DE NOTIFICAÇÃO ==========
  const addNotification = useCallback((tipo: Notificacao["tipo"], mensagem: string) => {
    const newNotif: Notificacao = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      tipo,
      mensagem,
      timestamp: new Date(),
    };
    setNotifications(prev => [newNotif, ...prev]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotif.id));
    }, 5000);
  }, []);

  // ========== FUNÇÕES DE BUSCA ==========
  const fetchDashboard = useCallback(async () => {
    try {
      console.log("🔄 Buscando dashboard...");
      const response = await fetch(`${BASE_URL}/getDashboard`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const result = await response.json();
      console.log("📊 Resposta do dashboard:", result);

      if (result.returnCode === 200) {
        setDashboardData(result.data);
        console.log("✅ Dashboard carregado:", result.data);
        console.log(`📊 Total de membros: ${result.data?.resumo?.totalMembros || 0}`);
      } else {
        console.error("❌ Erro na API:", result.returnMsg);
        setError(result.returnMsg || "Erro ao carregar dados do dashboard");
        addNotification("error", "Erro ao carregar dados do dashboard");
      }
    } catch (error) {
      console.error("❌ Error fetching dashboard:", error);
      setError("Erro de conexão com o servidor");
      addNotification("error", "Erro de conexão com o servidor");
    }
  }, [addNotification]);

  const fetchMembros = useCallback(async () => {
    try {
      console.log("🔄 Buscando membros...");
      const filter: any = { curPage: currentPage, pageSize: 100 }; // Aumentado para pegar todos
      
      if (filterTipo !== "todos") {
        filter.tipoMembro = filterTipo;
      }
      
      if (filterStatus !== "todos") {
        filter.statusPagamento = filterStatus;
      }
      
      if (searchTerm) {
        filter.nome = searchTerm;
      }

      const response = await fetch(`${BASE_URL}/getMembroList`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filter),
      });

      const result = await response.json();
      console.log("📊 Membros carregados:", result.data?.list?.length || 0);

      if (result.returnCode === 200) {
        setMembros(result.data.list || []);
      } else {
        addNotification("error", result.returnMsg || "Erro ao carregar membros");
      }
    } catch (error) {
      console.error("❌ Error fetching members:", error);
      addNotification("error", "Erro ao carregar membros");
    }
  }, [currentPage, filterTipo, filterStatus, searchTerm, addNotification]);

  const fetchPagamentosPendentes = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/getPagamentosPendentes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const result = await response.json();

      if (result.returnCode === 200) {
        setPagamentosPendentes(result.data || []);
        console.log(`📊 Pagamentos pendentes: ${result.data?.length || 0}`);
      }
    } catch (error) {
      console.error("❌ Error fetching pending payments:", error);
    }
  }, []);

  const fetchCandidatos = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/getMembroList`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipoMembro: "candidato_formador",
          curPage: 1,
          pageSize: 100,
        }),
      });

      const result = await response.json();

      if (result.returnCode === 200) {
        setCandidatos(result.data.list || []);
      }
    } catch (error) {
      console.error("Error fetching candidates:", error);
      addNotification("error", "Erro ao carregar candidatos");
    }
  }, [addNotification]);

  const fetchAulas = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/getAulaList`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageSize: 50 }),
      });

      const result = await response.json();

      if (result.returnCode === 200) {
        setAulas(result.data.list || []);
      }
    } catch (error) {
      console.error("Error fetching aulas:", error);
      addNotification("error", "Erro ao carregar aulas");
    }
  }, [addNotification]);

  const fetchEstatisticasAulas = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/getEstatisticasAulas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const result = await response.json();

      if (result.returnCode === 200) {
        setEstatisticasAulas(result.data);
      }
    } catch (error) {
      console.error("Error fetching aulas statistics:", error);
    }
  }, []);

  // ========== CARREGAMENTO INICIAL ==========
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Carregar tudo em paralelo
        await Promise.all([
          fetchDashboard(),
          fetchMembros(),
          fetchCandidatos(),
          fetchAulas(),
          fetchEstatisticasAulas(),
          fetchPagamentosPendentes(),
        ]);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError("Erro ao carregar dados. Tente novamente.");
        addNotification("error", "Erro ao carregar dados do sistema");
      } finally {
        setLoading(false);
      }
    };

    // Verificar autenticação
    const membroId = localStorage.getItem("membroId");
    const tipoMembro = localStorage.getItem("tipoMembro");

    if (!membroId || tipoMembro !== "administrador") {
      router.push("/login");
      return;
    }

    loadData();
  }, [router, addNotification]);

  // ========== FUNÇÕES DE AÇÃO ==========
  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const handleRegisterPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingMore(true);

    try {
      const response = await fetch(`${BASE_URL}/registerPayment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          membroId: paymentData.membroId,
          paymentData: {
            valor: paymentData.valor,
            formaPagamento: paymentData.formaPagamento,
            referencia: paymentData.referencia,
            observacoes: paymentData.observacoes || "Registrado pelo administrador",
            mesReferente: {
              mes: new Date().getMonth() + 1,
              ano: new Date().getFullYear(),
            },
          },
        }),
      });

      const result = await response.json();

      if (result.returnCode === 200) {
        addNotification("success", "✅ Pagamento registrado! Aguardando confirmação do financeiro.");
        setShowPaymentModal(false);
        setPaymentData({ membroId: "", valor: 100, formaPagamento: "M-Pesa", referencia: "", observacoes: "" });
        await Promise.all([fetchMembros(), fetchDashboard(), fetchPagamentosPendentes()]);
      } else {
        addNotification("error", result.returnMsg || "Erro ao registrar pagamento");
      }
    } catch (error) {
      addNotification("error", "Erro de conexão com o servidor");
    } finally {
      setLoadingMore(false);
    }
  };

  const handleProcessCandidatura = async (aprovado: boolean) => {
    if (!selectedCandidato) return;
    setLoadingMore(true);

    try {
      const response = await fetch(`${BASE_URL}/processarCandidatura`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          membroId: selectedCandidato.membroId,
          aprovado,
          parecer: parecerText || (aprovado ? "Aprovado pela administração" : "Não atende aos requisitos"),
          analisadoPor: localStorage.getItem("nomeCompleto") || "Administrador",
        }),
      });

      const result = await response.json();

      if (result.returnCode === 200) {
        addNotification("success", aprovado ? "✅ Candidatura aprovada!" : "⚠️ Candidatura rejeitada!");
        setShowCandidaturaModal(false);
        setSelectedCandidato(null);
        setParecerText("");
        await Promise.all([fetchCandidatos(), fetchDashboard(), fetchMembros()]);
      } else {
        addNotification("error", result.returnMsg || "Erro ao processar candidatura");
      }
    } catch (error) {
      addNotification("error", "Erro de conexão com o servidor");
    } finally {
      setLoadingMore(false);
    }
  };

  const handleToggleMembroStatus = async (membro: Membro) => {
    if (!confirm(`Tem certeza que deseja ${membro.ativo ? 'desativar' : 'reativar'} ${membro.nomeCompleto}?`)) return;
    
    setLoadingMore(true);
    try {
      const response = await fetch(`${BASE_URL}/updateMembro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          membroId: membro.membroId,
          ativo: !membro.ativo,
          observacoes: membro.ativo ? "Membro desativado pelo administrador" : "Membro reativado pelo administrador",
        }),
      });

      const result = await response.json();

      if (result.returnCode === 200) {
        addNotification("success", membro.ativo ? "🚫 Membro desativado" : "✅ Membro reativado");
        await Promise.all([fetchMembros(), fetchDashboard()]);
      } else {
        addNotification("error", result.returnMsg || "Erro ao alterar status");
      }
    } catch (error) {
      addNotification("error", "Erro de conexão com o servidor");
    } finally {
      setLoadingMore(false);
    }
  };

  const handleExportRelatorio = async (tipo: "financeiro" | "membros" | "presencas" | "cursos") => {
    try {
      let url = "";
      let fileName = "";
      
      switch (tipo) {
        case "financeiro":
          url = `${BASE_URL}/getRelatorioFinanceiro`;
          fileName = `relatorio_financeiro_${new Date().toISOString().split("T")[0]}.json`;
          break;
        case "membros":
          url = `${BASE_URL}/getMembroList`;
          fileName = `membros_${new Date().toISOString().split("T")[0]}.json`;
          break;
        default:
          addNotification("error", "Tipo de relatório não suportado");
          return;
      }

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          tipo === "financeiro" 
            ? { mes: new Date().getMonth() + 1, ano: new Date().getFullYear() }
            : { curPage: 1, pageSize: 1000 }
        ),
      });

      const result = await response.json();

      if (result.returnCode === 200) {
        const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: "application/json" });
        const urlBlob = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = urlBlob;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(urlBlob);
        addNotification("success", "📊 Relatório exportado com sucesso!");
      } else {
        addNotification("error", result.returnMsg || "Erro ao exportar relatório");
      }
    } catch (error) {
      addNotification("error", "Erro ao exportar relatório");
    }
  };

  const handleVerAula = (aula: Aula) => {
    setSelectedAula(aula);
    setShowAulaModal(true);
  };

  // ========== FUNÇÕES AUXILIARES ==========
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      "em_dia": "text-green-400 bg-green-500/20",
      "pendente": "text-yellow-400 bg-yellow-500/20",
      "atrasado": "text-red-400 bg-red-500/20",
      "aguardando_confirmacao": "text-blue-400 bg-blue-500/20",
      "confirmado": "text-green-400 bg-green-500/20",
      "cancelado": "text-gray-400 bg-gray-500/20",
    };
    return colors[status] || "text-gray-400 bg-gray-500/20";
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      "em_dia": "✅ Em dia",
      "pendente": "⚠️ Pendente",
      "atrasado": "❌ Atrasado",
      "aguardando_confirmacao": "⏳ Aguardando",
      "confirmado": "✅ Confirmado",
      "cancelado": "🚫 Cancelado",
    };
    return texts[status] || status;
  };

  const getStatusAulaColor = (status: string) => {
    const colors: Record<string, string> = {
      "publicado": "text-green-400 bg-green-500/20",
      "rascunho": "text-yellow-400 bg-yellow-500/20",
      "arquivado": "text-gray-400 bg-gray-500/20",
      "em_revisao": "text-blue-400 bg-blue-500/20",
    };
    return colors[status] || "text-gray-400 bg-gray-500/20";
  };

  const getNivelColor = (nivel: string) => {
    const colors: Record<string, string> = {
      "iniciante": "text-green-400 bg-green-500/20",
      "intermediario": "text-blue-400 bg-blue-500/20",
      "avancado": "text-purple-400 bg-purple-500/20",
      "mestre": "text-orange-400 bg-orange-500/20",
      "competidor": "text-red-400 bg-red-500/20",
    };
    return colors[nivel] || "text-gray-400 bg-gray-500/20";
  };

  const getCategoriaText = (categoria: string) => {
    const categorias: Record<string, string> = {
      aberturas: "Aberturas",
      meio_jogo: "Meio Jogo",
      finais: "Finais",
      tatica: "Táctica",
      estrategia: "Estratégia",
      analise_partidas: "Análise de Partidas",
      historia_xadrez: "História do Xadrez",
      treinamento: "Treinamento",
      torneios: "Torneios",
      exercicios: "Exercícios",
    };
    return categorias[categoria] || categoria;
  };

  const getTipoMembroText = (tipo: string) => {
    const tipos: Record<string, string> = {
      aluno: "🎓 Aluno",
      formador: "👨‍🏫 Formador",
      candidato_formador: "📋 Candidato",
      administrador: "⚙️ Admin",
      financeiro: "💰 Financeiro",
    };
    return tipos[tipo] || tipo;
  };

  // ========== MEMBROS FILTRADOS E ORDENADOS ==========
  const filteredMembros = useMemo(() => {
    let filtered = [...membros];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.nomeCompleto.toLowerCase().includes(search) ||
          m.matricula.toLowerCase().includes(search) ||
          m.contato.email.toLowerCase().includes(search)
      );
    }

    if (filterStatus !== "todos") {
      filtered = filtered.filter((m) => m.cotas.statusPagamento === filterStatus);
    }

    if (filterTipo !== "todos") {
      filtered = filtered.filter((m) => m.tipoMembro === filterTipo);
    }

    // Ordenação
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "nome":
          comparison = a.nomeCompleto.localeCompare(b.nomeCompleto);
          break;
        case "data":
          comparison = new Date(a.dataCadastro).getTime() - new Date(b.dataCadastro).getTime();
          break;
        case "status":
          comparison = a.cotas.statusPagamento.localeCompare(b.cotas.statusPagamento);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [membros, searchTerm, filterStatus, filterTipo, sortField, sortOrder]);

  // ========== RENDERIZAÇÃO DE LOADING ==========
  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-400">Carregando dashboard administrativo...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // ========== RENDERIZAÇÃO DE ERRO ==========
  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 pt-20 flex items-center justify-center">
          <div className="text-center bg-red-500/10 border border-red-500/30 rounded-2xl p-8 max-w-md">
            <TbAlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <p className="text-red-400 text-lg">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition flex items-center gap-2 mx-auto"
            >
              <TbRefresh className="w-4 h-4" />
              Tentar novamente
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // ========== RENDERIZAÇÃO PRINCIPAL ==========
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 pt-20">
        {/* Notification Toast Container */}
        <div className="fixed top-24 right-4 z-50 space-y-2 max-w-sm w-full">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-lg shadow-lg animate-slide-in ${
                notif.tipo === "success"
                  ? "bg-green-500/90"
                  : notif.tipo === "error"
                  ? "bg-red-500/90"
                  : notif.tipo === "warning"
                  ? "bg-yellow-500/90"
                  : "bg-blue-500/90"
              } text-white`}
            >
              {notif.mensagem}
            </div>
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Botão menu mobile */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden fixed bottom-4 right-4 z-50 p-3 bg-yellow-600 rounded-full shadow-lg hover:bg-yellow-700 transition"
          >
            <TbUserCheck className="w-6 h-6 text-white" />
          </button>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* ========== SIDEBAR ========== */}
            <div
              className={`fixed lg:relative inset-y-0 left-0 z-40 w-72 bg-gray-800/95 backdrop-blur-sm border-r border-white/10 transform transition-transform duration-300 overflow-y-auto ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
              }`}
            >
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <TbChess className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-white font-semibold">Administrador</h3>
                  <p className="text-sm text-gray-400">Real Chess Mahotas</p>
                  <p className="text-xs text-yellow-500 mt-1">{localStorage.getItem("nomeCompleto")}</p>
                </div>

                <div className="space-y-1">
                  {[
                    { id: "overview", label: "Visão Geral", icon: TbChartBar, color: "text-yellow-400" },
                    { id: "membros", label: "Membros", icon: TbUsers, color: "text-blue-400" },
                    { id: "pagamentos", label: "Pagamentos", icon: TbCash, color: "text-green-400", badge: pagamentosPendentes.length },
                    { id: "aulas", label: "Aulas", icon: TbBook, color: "text-purple-400" },
                    { id: "financeiro", label: "Financeiro", icon: TbCoin, color: "text-green-400" },
                    { id: "cursos", label: "Cursos", icon: TbSchool, color: "text-orange-400" },
                    { id: "candidaturas", label: "Candidaturas", icon: TbFileText, color: "text-yellow-400", badge: candidatos.length },
                    { id: "relatorios", label: "Relatórios", icon: TbActivity, color: "text-red-400" },
                    { id: "configuracoes", label: "Configurações", icon: TbSettings, color: "text-gray-400" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setSidebarOpen(false);
                        if (item.id === "pagamentos") fetchPagamentosPendentes();
                        if (item.id === "membros") fetchMembros();
                        if (item.id === "candidaturas") fetchCandidatos();
                        if (item.id === "aulas") fetchAulas();
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition ${
                        activeTab === item.id
                          ? "bg-white/10 text-white"
                          : "text-gray-300 hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={`w-5 h-5 ${item.color}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && item.badge > 0 && (
                        <span className="px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition"
                  >
                    <TbLogout className="w-5 h-5" />
                    <span>Sair</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ========== CONTEÚDO PRINCIPAL ========== */}
            <div className="flex-1 min-w-0">
              {/* ===== VISÃO GERAL ===== */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-yellow-600/20 to-yellow-800/20 rounded-2xl p-6 border border-yellow-500/30">
                    <h1 className="text-2xl font-bold text-white mb-2">Painel Administrativo</h1>
                    <p className="text-gray-300">Visão geral do clube Real Chess Mahotas</p>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm">
                      <span className="text-gray-400">
                        📅 {new Date().toLocaleDateString("pt-MZ", { day: "2-digit", month: "long", year: "numeric" })}
                      </span>
                      <span className="text-gray-400">
                        🕐 {new Date().toLocaleTimeString("pt-MZ", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <button
                        onClick={() => {
                          fetchDashboard();
                          fetchMembros();
                          fetchPagamentosPendentes();
                          addNotification("info", "🔄 Dados atualizados!");
                        }}
                        className="flex items-center gap-1 text-yellow-400 hover:text-yellow-300 transition"
                      >
                        <TbRefresh className="w-4 h-4" />
                        Atualizar
                      </button>
                    </div>
                  </div>

                  {/* Cards de Resumo - CORRIGIDO */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white/10 rounded-xl p-4 border border-white/20 hover:border-yellow-500/50 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <TbUsers className="w-6 h-6 text-yellow-500" />
                      </div>
                      <p className="text-2xl font-bold text-white">{dashboardData?.resumo?.totalMembros ?? 0}</p>
                      <p className="text-sm text-gray-400">Total de Membros</p>
                      <div className="text-xs text-gray-500 mt-1">
                        {dashboardData?.resumo?.totalAlunos ?? 0} alunos | {dashboardData?.resumo?.totalFormadores ?? 0} formadores
                      </div>
                    </div>
                    
                    <div className="bg-white/10 rounded-xl p-4 border border-white/20 hover:border-yellow-500/50 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <TbBook className="w-6 h-6 text-yellow-500" />
                      </div>
                      <p className="text-2xl font-bold text-white">{estatisticasAulas?.totalAulas || 0}</p>
                      <p className="text-sm text-gray-400">Total de Aulas</p>
                      <div className="text-xs text-gray-500 mt-1">
                        {estatisticasAulas?.totalPublicadas || 0} publicadas
                      </div>
                    </div>
                    
                    <div className="bg-white/10 rounded-xl p-4 border border-white/20 hover:border-yellow-500/50 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <TbCoin className="w-6 h-6 text-yellow-500" />
                      </div>
                      <p className="text-2xl font-bold text-white">{dashboardData?.resumo?.arrecadacaoMes?.toLocaleString() ?? 0} MZN</p>
                      <p className="text-sm text-gray-400">Arrecadação do Mês</p>
                    </div>
                    
                    <div className="bg-white/10 rounded-xl p-4 border border-white/20 hover:border-yellow-500/50 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <TbBell className="w-6 h-6 text-red-400" />
                      </div>
                      <p className="text-2xl font-bold text-white">{dashboardData?.resumo?.inadimplentes ?? 0}</p>
                      <p className="text-sm text-gray-400">Inadimplentes</p>
                      <div className="text-xs text-red-400 mt-1">
                        Taxa: {dashboardData?.resumo?.taxaInadimplencia ?? 0}%
                      </div>
                    </div>
                  </div>

                  {/* Pagamentos Pendentes - APENAS VISUALIZAÇÃO (sem botão confirmar) */}
                  {pagamentosPendentes.length > 0 && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                          <TbCash className="w-5 h-5 text-yellow-400" />
                          Pagamentos Aguardando Confirmação
                          <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-500 text-black rounded-full">
                            {pagamentosPendentes.length}
                          </span>
                        </h3>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <TbInfoCircle className="w-4 h-4" />
                          Aguardando ação do financeiro
                        </span>
                      </div>
                      <div className="space-y-2">
                        {pagamentosPendentes.slice(0, 5).map((p) => (
                          <div key={p.pagamento.pagamentoId} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition">
                            <div>
                              <p className="text-white font-medium">{p.nomeCompleto}</p>
                              <p className="text-xs text-gray-400">{p.matricula} • {p.pagamento.formaPagamento}</p>
                              <p className="text-xs text-gray-500">Ref: {p.pagamento.referencia}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-yellow-400 font-semibold">{p.pagamento.valor} MZN</span>
                              <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-full">
                                Pendente
                              </span>
                            </div>
                          </div>
                        ))}
                        {pagamentosPendentes.length > 5 && (
                          <button
                            onClick={() => setActiveTab("pagamentos")}
                            className="w-full text-center text-sm text-yellow-400 hover:text-yellow-300 transition py-2"
                          >
                            Ver todos os {pagamentosPendentes.length} pagamentos pendentes →
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <TbCalendar className="w-5 h-5 text-yellow-500" />
                        Atividades do Mês
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between p-2 bg-white/5 rounded-lg">
                          <span className="text-gray-300">Presenças</span>
                          <span className="text-white font-semibold">{dashboardData?.resumo?.totalPresencasMes ?? 0}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-white/5 rounded-lg">
                          <span className="text-gray-300">Horas de Aula</span>
                          <span className="text-white font-semibold">{dashboardData?.resumo?.totalHorasMes ?? 0}h</span>
                        </div>
                        <div className="flex justify-between p-2 bg-white/5 rounded-lg">
                          <span className="text-gray-300">Candidaturas Pendentes</span>
                          <span className="text-white font-semibold">{dashboardData?.resumo?.candidatosPendentes ?? 0}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <TbChartLine className="w-5 h-5 text-yellow-500" />
                        Estatísticas das Aulas
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between p-2 bg-white/5 rounded-lg">
                          <span className="text-gray-300">Aulas Publicadas</span>
                          <span className="text-white font-semibold">{estatisticasAulas?.totalPublicadas || 0}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-white/5 rounded-lg">
                          <span className="text-gray-300">Total de Visualizações</span>
                          <span className="text-white font-semibold">{estatisticasAulas?.totalVisualizacoes || 0}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-white/5 rounded-lg">
                          <span className="text-gray-300">Alunos Inscritos</span>
                          <span className="text-white font-semibold">{estatisticasAulas?.totalAlunosInscritos || 0}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-white/5 rounded-lg">
                          <span className="text-gray-300">Avaliação Média</span>
                          <span className="text-white font-semibold">⭐ {estatisticasAulas?.avaliacaoMedia?.toFixed(1) || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                    <h3 className="text-lg font-semibold text-white mb-4">Distribuição por Nível de Xadrez</h3>
                    <div className="space-y-3">
                      {(dashboardData?.distribuicaoNivel || []).map((nivel) => (
                        <div key={nivel._id}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-300 capitalize">{nivel._id}</span>
                            <span className="text-white">{nivel.count} alunos</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div
                              className="bg-yellow-500 rounded-full h-2 transition-all duration-500"
                              style={{ width: `${(nivel.count / (dashboardData?.resumo?.totalAlunos || 1)) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                    <h3 className="text-lg font-semibold text-white mb-4">🏆 Top Alunos</h3>
                    <div className="space-y-2">
                      {(dashboardData?.topAlunos || []).map((aluno, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition">
                          <div className="flex items-center gap-3">
                            <span className={`font-bold ${idx < 3 ? 'text-yellow-400' : 'text-gray-400'}`}>
                              #{idx + 1}
                            </span>
                            <div>
                              <span className="text-white">{aluno.nomeCompleto}</span>
                              <p className="text-xs text-gray-500">{aluno.matricula}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-400">Nível {aluno.gamificacao?.nivel || 1}</span>
                            <span className="text-yellow-500 font-semibold">{aluno.gamificacao?.pontos || 0} pts</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ===== MEMBROS ===== */}
              {activeTab === "membros" && (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <h2 className="text-2xl font-bold text-white">👥 Gestão de Membros</h2>
                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                      <div className="relative flex-1 md:flex-none">
                        <TbSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Buscar membro..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full md:w-48 pl-9 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 text-sm"
                        />
                      </div>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-500"
                      >
                        <option value="todos" className="text-black">Status Cota</option>
                        <option value="em_dia" className="text-black">Em dia</option>
                        <option value="pendente" className="text-black">Pendente</option>
                        <option value="atrasado" className="text-black">Atrasado</option>
                      </select>
                      <select
                        value={filterTipo}
                        onChange={(e) => setFilterTipo(e.target.value)}
                        className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-500"
                      >
                        <option value="todos" className="text-black">Todos os Tipos</option>
                        <option value="aluno" className="text-black">Alunos</option>
                        <option value="formador" className="text-black">Formadores</option>
                        <option value="candidato_formador" className="text-black">Candidatos</option>
                      </select>
                      <button
                        onClick={() => fetchMembros()}
                        className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
                        title="Atualizar"
                      >
                        <TbRefresh className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-xl overflow-hidden border border-white/20">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-white/5 border-b border-white/10">
                          <tr>
                            <th className="text-left p-3 text-gray-400 text-sm">Matrícula</th>
                            <th className="text-left p-3 text-gray-400 text-sm cursor-pointer hover:text-white" onClick={() => {
                              if (sortField === "nome") setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                              else { setSortField("nome"); setSortOrder("asc"); }
                            }}>
                              Nome {sortField === "nome" && (sortOrder === "asc" ? <TbSortAscending className="inline" /> : <TbSortDescending className="inline" />)}
                            </th>
                            <th className="text-left p-3 text-gray-400 text-sm hidden md:table-cell">Tipo</th>
                            <th className="text-left p-3 text-gray-400 text-sm hidden lg:table-cell">Email</th>
                            <th className="text-left p-3 text-gray-400 text-sm">Status Cota</th>
                            <th className="text-left p-3 text-gray-400 text-sm hidden sm:table-cell">Status</th>
                            <th className="text-left p-3 text-gray-400 text-sm">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredMembros.map((membro) => (
                            <tr key={membro.membroId} className="border-b border-white/10 hover:bg-white/5 transition">
                              <td className="p-3 text-white text-sm font-mono">{membro.matricula}</td>
                              <td className="p-3">
                                <span className="text-white text-sm font-medium">{membro.nomeCompleto}</span>
                                {membro.aluno?.nivelXadrez && (
                                  <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${getNivelColor(membro.aluno.nivelXadrez)}`}>
                                    {membro.aluno.nivelXadrez}
                                  </span>
                                )}
                              </td>
                              <td className="p-3 text-gray-300 text-sm hidden md:table-cell">
                                {getTipoMembroText(membro.tipoMembro)}
                              </td>
                              <td className="p-3 text-gray-300 text-sm hidden lg:table-cell">{membro.contato.email}</td>
                              <td className="p-3">
                                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(membro.cotas.statusPagamento)}`}>
                                  {getStatusText(membro.cotas.statusPagamento)}
                                </span>
                                {membro.cotas.statusPagamento === "atrasado" && (
                                  <span className="ml-1 text-xs text-red-400">
                                    {membro.cotas.valorTotalDevido} MZN
                                  </span>
                                )}
                              </td>
                              <td className="p-3 hidden sm:table-cell">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    membro.ativo ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                                  }`}
                                >
                                  {membro.ativo ? "Ativo" : "Inativo"}
                                </span>
                              </td>
                              <td className="p-3">
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => {
                                      setSelectedMembro(membro);
                                      setPaymentData({ ...paymentData, membroId: membro.membroId });
                                      setShowPaymentModal(true);
                                    }}
                                    className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded transition"
                                    title="Registrar Pagamento"
                                  >
                                    <TbCoin className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleToggleMembroStatus(membro)}
                                    className="p-1.5 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 rounded transition"
                                    title={membro.ativo ? "Desativar" : "Reativar"}
                                  >
                                    {membro.ativo ? <TbUserX className="w-4 h-4" /> : <TbUserCheck className="w-4 h-4" />}
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedMembro(membro);
                                      setShowMembroModal(true);
                                    }}
                                    className="p-1.5 text-gray-400 hover:text-gray-300 hover:bg-white/5 rounded transition"
                                    title="Ver Detalhes"
                                  >
                                    <TbEye className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {filteredMembros.length === 0 && (
                      <div className="text-center py-8 text-gray-400">
                        <TbUsers className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        Nenhum membro encontrado
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ===== PAGAMENTOS ===== */}
              {activeTab === "pagamentos" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <h2 className="text-2xl font-bold text-white">💰 Gestão de Pagamentos</h2>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-400 flex items-center gap-1">
                        <TbInfoCircle className="w-4 h-4" />
                        Apenas o financeiro pode confirmar/rejeitar
                      </span>
                      <button
                        onClick={() => fetchPagamentosPendentes()}
                        className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
                      >
                        <TbRefresh className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-300">Atualizar</span>
                      </button>
                    </div>
                  </div>

                  {/* Pagamentos Pendentes - APENAS VISUALIZAÇÃO */}
                  <div className="bg-white/10 rounded-xl p-4 border border-yellow-500/30">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <TbClock className="w-5 h-5 text-yellow-400" />
                      Pagamentos Aguardando Confirmação
                      <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-500 text-black rounded-full">
                        {pagamentosPendentes.length}
                      </span>
                    </h3>
                    {pagamentosPendentes.length === 0 ? (
                      <div className="text-center py-6 text-gray-400">
                        <TbChecklist className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        Nenhum pagamento pendente
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {pagamentosPendentes.map((p) => (
                          <div key={p.pagamento.pagamentoId} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 flex-wrap">
                                <p className="text-white font-medium">{p.nomeCompleto}</p>
                                <span className="text-xs text-gray-400 font-mono">{p.matricula}</span>
                                <span className="text-xs text-gray-400">{p.contato.email}</span>
                              </div>
                              <div className="flex items-center gap-4 mt-1 text-sm text-gray-400 flex-wrap">
                                <span>📅 {new Date(p.pagamento.dataPagamento).toLocaleDateString()}</span>
                                <span>💳 {p.pagamento.formaPagamento}</span>
                                <span>📋 Ref: {p.pagamento.referencia}</span>
                                {p.pagamento.mesReferente && (
                                  <span>📆 {p.pagamento.mesReferente.mes}/{p.pagamento.mesReferente.ano}</span>
                                )}
                              </div>
                              {p.pagamento.observacoes && (
                                <p className="text-xs text-gray-500 mt-1">📝 {p.pagamento.observacoes}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                              <span className="text-yellow-400 font-bold whitespace-nowrap">{p.pagamento.valor} MZN</span>
                              <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-full whitespace-nowrap">
                                ⏳ Aguardando
                              </span>
                              {/* REMOVIDOS botões de confirmar/rejeitar - apenas financeiro pode fazer isso */}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Histórico de Pagamentos - Resumo */}
                  <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                    <h3 className="text-lg font-semibold text-white mb-4">📊 Resumo Financeiro</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-3 bg-white/5 rounded-lg text-center">
                        <p className="text-sm text-gray-400">Pagamentos Pendentes</p>
                        <p className="text-2xl font-bold text-yellow-400">{pagamentosPendentes.length}</p>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg text-center">
                        <p className="text-sm text-gray-400">Arrecadação Mês</p>
                        <p className="text-2xl font-bold text-green-400">{dashboardData?.resumo?.arrecadacaoMes?.toLocaleString() || 0} MZN</p>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg text-center">
                        <p className="text-sm text-gray-400">Inadimplentes</p>
                        <p className="text-2xl font-bold text-red-400">{dashboardData?.resumo?.inadimplentes || 0}</p>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg text-center">
                        <p className="text-sm text-gray-400">Taxa Inadimplência</p>
                        <p className="text-2xl font-bold text-orange-400">{dashboardData?.resumo?.taxaInadimplencia || 0}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ===== AULAS ===== */}
              {activeTab === "aulas" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <h2 className="text-2xl font-bold text-white">📚 Todas as Aulas</h2>
                    <button onClick={fetchAulas} className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition">
                      <TbRefresh className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {aulas.map((aula) => (
                      <div key={aula.aulaId} className="bg-white/10 rounded-xl p-4 border border-white/20 hover:border-yellow-500/50 transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <h3 className="text-lg font-semibold text-white truncate">{aula.titulo}</h3>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusAulaColor(aula.status)}`}>
                                {aula.status === "publicado"
                                  ? "Publicado"
                                  : aula.status === "rascunho"
                                  ? "Rascunho"
                                  : aula.status === "arquivado"
                                  ? "Arquivado"
                                  : aula.status === "em_revisao"
                                  ? "Em Revisão"
                                  : aula.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-400 line-clamp-2">{aula.descricao}</p>
                            <div className="flex items-center gap-3 mt-2 flex-wrap">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${getNivelColor(aula.nivel)}`}>{aula.nivel}</span>
                              <span className="text-xs text-gray-500">{getCategoriaText(aula.categoria)}</span>
                              <span className="text-xs text-gray-500">👁️ {aula.visualizacoes}</span>
                              <span className="text-xs text-gray-500">👨‍🏫 {aula.formadorNome}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-white/10">
                          <div className="flex items-center gap-3">
                            <div className="text-center">
                              <p className="text-xs text-gray-400">Alunos</p>
                              <p className="text-white font-semibold">{aula.estatisticas?.totalAlunosInscritos || 0}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-gray-400">Concluintes</p>
                              <p className="text-white font-semibold">{aula.estatisticas?.totalConcluintes || 0}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-gray-400">Avaliação</p>
                              <p className="text-white font-semibold">{aula.estatisticas?.avaliacaoMedia?.toFixed(1) || 0} ★</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleVerAula(aula)}
                            className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-sm transition"
                          >
                            Ver Detalhes
                          </button>
                        </div>
                      </div>
                    ))}
                    {aulas.length === 0 && (
                      <div className="col-span-2 bg-white/10 rounded-xl p-12 text-center border border-white/20">
                        <TbBook className="w-16 h-16 text-gray-500 mx-auto mb-4 opacity-50" />
                        <p className="text-gray-400">Nenhuma aula encontrada</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ===== FINANCEIRO ===== */}
              {activeTab === "financeiro" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <h2 className="text-2xl font-bold text-white">📊 Relatórios Financeiros</h2>
                    <button
                      onClick={() => handleExportRelatorio("financeiro")}
                      className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition"
                    >
                      <TbDownload className="w-4 h-4" />
                      Exportar Relatório
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                      <p className="text-gray-400 text-sm">Arrecadação do Mês</p>
                      <p className="text-3xl font-bold text-green-400">{dashboardData?.resumo?.arrecadacaoMes?.toLocaleString() ?? 0} MZN</p>
                      <p className="text-xs text-gray-500 mt-2">Mês atual</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                      <p className="text-gray-400 text-sm">Inadimplência</p>
                      <p className="text-3xl font-bold text-red-400">{dashboardData?.resumo?.taxaInadimplencia ?? 0}%</p>
                      <p className="text-xs text-gray-500 mt-2">{dashboardData?.resumo?.inadimplentes ?? 0} membros</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                      <p className="text-gray-400 text-sm">Valor em Atraso</p>
                      <p className="text-3xl font-bold text-yellow-400">
                        {membros
                          .filter((m) => m.cotas.statusPagamento === "atrasado")
                          .reduce((acc, m) => acc + (m.cotas.valorTotalDevido || 0), 0)
                          .toLocaleString() || 0} MZN
                      </p>
                      <p className="text-xs text-gray-500 mt-2">Total devido</p>
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                    <h3 className="text-lg font-semibold text-white mb-4">⚠️ Membros Inadimplentes</h3>
                    <div className="space-y-2">
                      {membros
                        .filter((m) => m.cotas.statusPagamento === "atrasado")
                        .map((membro) => (
                          <div key={membro.membroId} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-white/5 rounded-lg gap-2">
                            <div>
                              <p className="text-white font-medium">{membro.nomeCompleto}</p>
                              <p className="text-xs text-gray-400">{membro.matricula}</p>
                            </div>
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                              <span className="text-red-400 font-semibold">{membro.cotas.valorTotalDevido || 0} MZN</span>
                              <button
                                onClick={() => {
                                  setPaymentData({ ...paymentData, membroId: membro.membroId });
                                  setShowPaymentModal(true);
                                }}
                                className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-sm transition whitespace-nowrap"
                              >
                                Registrar Pagamento
                              </button>
                            </div>
                          </div>
                        ))}
                      {membros.filter((m) => m.cotas.statusPagamento === "atrasado").length === 0 && (
                        <p className="text-gray-400 text-center py-4">✅ Nenhum membro inadimplente</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ===== CURSOS ===== */}
              {activeTab === "cursos" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white">📖 Gestão de Cursos</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(dashboardData?.cursosAtivos || []).map((curso, idx) => (
                      <div key={idx} className="bg-white/10 rounded-xl p-4 border border-white/20 hover:border-yellow-500/50 transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-white">{curso.nome}</h3>
                            <p className="text-xs text-gray-400">{curso.totalAlunos} alunos matriculados</p>
                          </div>
                          <TbBook className="w-6 h-6 text-yellow-500" />
                        </div>
                        <div className="mb-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Progresso Médio</span>
                            <span className="text-yellow-500">{curso.progressoMedio.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div
                              className="bg-yellow-500 rounded-full h-2 transition-all duration-500"
                              style={{ width: `${curso.progressoMedio}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    {(!dashboardData?.cursosAtivos || dashboardData.cursosAtivos.length === 0) && (
                      <div className="col-span-2 bg-white/10 rounded-xl p-12 text-center border border-white/20">
                        <TbSchool className="w-16 h-16 text-gray-500 mx-auto mb-4 opacity-50" />
                        <p className="text-gray-400">Nenhum curso ativo no momento</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ===== CANDIDATURAS ===== */}
              {activeTab === "candidaturas" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white">📋 Candidaturas a Formador</h2>
                  <div className="space-y-3">
                    {candidatos.map((candidato) => (
                      <div key={candidato.membroId} className="bg-white/10 rounded-xl p-4 border border-white/20 hover:border-yellow-500/30 transition">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div>
                            <p className="font-semibold text-white text-lg">{candidato.nomeCompleto}</p>
                            <p className="text-sm text-gray-400">Matrícula: {candidato.matricula}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                              <TbMail className="w-3 h-3" /> {candidato.contato.email}
                              <span className="ml-2"><TbPhone className="w-3 h-3 inline" /> {candidato.contato.telefone}</span>
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              📅 Candidatura: {new Date(candidato.formador.candidatura.dataCandidatura).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">
                              Pendente
                            </span>
                            <button
                              onClick={() => {
                                setSelectedCandidato(candidato);
                                setParecerText("");
                                setShowCandidaturaModal(true);
                              }}
                              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition text-sm"
                            >
                              Analisar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {candidatos.length === 0 && (
                      <div className="bg-white/10 rounded-xl p-12 text-center border border-white/20">
                        <TbFileText className="w-16 h-16 text-gray-500 mx-auto mb-4 opacity-50" />
                        <p className="text-gray-400">Nenhuma candidatura pendente</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ===== RELATÓRIOS ===== */}
              {activeTab === "relatorios" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white">📊 Relatórios do Sistema</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { id: "financeiro", label: "Relatório Financeiro", desc: "Exportar relatório de pagamentos", icon: TbCoin },
                      { id: "membros", label: "Relatório de Membros", desc: "Exportar lista completa de membros", icon: TbUsers },
                    ].map((item) => (
                      <div key={item.id} className="bg-white/10 rounded-xl p-4 border border-white/20 hover:border-yellow-500/50 transition-all">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-yellow-500/20 rounded-lg">
                            <item.icon className="w-6 h-6 text-yellow-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white font-semibold">{item.label}</h3>
                            <p className="text-gray-400 text-sm">{item.desc}</p>
                            <button
                              onClick={() => handleExportRelatorio(item.id as any)}
                              className="mt-3 px-4 py-1.5 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-sm transition flex items-center gap-2"
                            >
                              <TbDownload className="w-4 h-4" />
                              Exportar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ===== CONFIGURAÇÕES ===== */}
              {activeTab === "configuracoes" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white">⚙️ Configurações do Sistema</h2>
                  <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                    <div className="space-y-4">
                      {[
                        { label: "Valor da Cota Mensal", value: "100 MZN", desc: "Definir o valor padrão da cota" },
                        { label: "Dias para Vencimento", value: "30 dias", desc: "Prazo para pagamento da cota" },
                        { label: "Multa por Atraso", value: "5%", desc: "Percentual de multa mensal" },
                        { label: "Máximo de Atraso", value: "3 meses", desc: "Meses permitidos antes do bloqueio" },
                      ].map((item, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-white/5 rounded-lg gap-2">
                          <div>
                            <p className="text-white font-semibold">{item.label}</p>
                            <p className="text-sm text-gray-400">{item.desc}</p>
                          </div>
                          <div className="flex items-center gap-3 w-full sm:w-auto">
                            <span className="text-yellow-400 font-bold">{item.value}</span>
                            <button className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-sm transition">
                              Editar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-white/10">
                      <button className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white font-semibold transition">
                        💾 Salvar Configurações
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========== MODAIS ========== */}

      {/* Modal de Detalhes do Membro */}
      {showMembroModal && selectedMembro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-2xl w-full border border-yellow-500/30 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Detalhes do Membro</h3>
              <button onClick={() => setShowMembroModal(false)} className="text-gray-400 hover:text-white">
                <TbX className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Nome Completo</p>
                  <p className="text-white">{selectedMembro.nomeCompleto}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Matrícula</p>
                  <p className="text-white font-mono">{selectedMembro.matricula}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white">{selectedMembro.contato.email}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Telefone</p>
                  <p className="text-white">{selectedMembro.contato.telefone}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Tipo</p>
                  <p className="text-white">{getTipoMembroText(selectedMembro.tipoMembro)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Status Cota</p>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedMembro.cotas.statusPagamento)}`}>
                    {getStatusText(selectedMembro.cotas.statusPagamento)}
                  </span>
                </div>
                {selectedMembro.aluno?.nivelXadrez && (
                  <div>
                    <p className="text-gray-400 text-sm">Nível de Xadrez</p>
                    <span className={`px-2 py-1 rounded-full text-xs ${getNivelColor(selectedMembro.aluno.nivelXadrez)}`}>
                      {selectedMembro.aluno.nivelXadrez}
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-gray-400 text-sm">Data Cadastro</p>
                  <p className="text-white">{new Date(selectedMembro.dataCadastro).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs ${selectedMembro.ativo ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {selectedMembro.ativo ? "Ativo" : "Inativo"}
                  </span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <button
                  onClick={() => {
                    setPaymentData({ ...paymentData, membroId: selectedMembro.membroId });
                    setShowMembroModal(false);
                    setShowPaymentModal(true);
                  }}
                  className="flex-1 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition text-center"
                >
                  💰 Registrar Pagamento
                </button>
                <button
                  onClick={() => {
                    handleToggleMembroStatus(selectedMembro);
                    setShowMembroModal(false);
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg transition text-center ${selectedMembro.ativo ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                >
                  {selectedMembro.ativo ? "🚫 Desativar" : "✅ Reativar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes da Aula */}
      {showAulaModal && selectedAula && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-2xl w-full border border-yellow-500/30 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Detalhes da Aula</h3>
              <button onClick={() => setShowAulaModal(false)} className="text-gray-400 hover:text-white">
                <TbX className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Título</p>
                  <p className="text-white font-semibold">{selectedAula.titulo}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusAulaColor(selectedAula.status)}`}>
                    {selectedAula.status}
                  </span>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Nível</p>
                  <span className={`px-2 py-1 rounded-full text-xs ${getNivelColor(selectedAula.nivel)}`}>
                    {selectedAula.nivel}
                  </span>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Categoria</p>
                  <p className="text-white">{getCategoriaText(selectedAula.categoria)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Formador</p>
                  <p className="text-white">{selectedAula.formadorNome}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Data de Criação</p>
                  <p className="text-white">{new Date(selectedAula.dataCriacao).toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Descrição</p>
                <p className="text-white text-sm">{selectedAula.descricao}</p>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-2 border-t border-white/10">
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <p className="text-gray-400 text-sm">Visualizações</p>
                  <p className="text-2xl font-bold text-white">{selectedAula.visualizacoes}</p>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <p className="text-gray-400 text-sm">Alunos Inscritos</p>
                  <p className="text-2xl font-bold text-white">{selectedAula.estatisticas?.totalAlunosInscritos || 0}</p>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <p className="text-gray-400 text-sm">Avaliação Média</p>
                  <p className="text-2xl font-bold text-white">{selectedAula.estatisticas?.avaliacaoMedia?.toFixed(1) || 0} ★</p>
                </div>
              </div>
              <button onClick={() => setShowAulaModal(false)} className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition">
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Registro de Pagamento */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full border border-yellow-500/30">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">💰 Registrar Pagamento</h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-white">
                <TbX className="w-6 h-6" />
              </button>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              O pagamento ficará aguardando confirmação do financeiro.
            </p>
            <form onSubmit={handleRegisterPayment} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2 text-sm">Valor (MZN)</label>
                <input
                  type="number"
                  value={paymentData.valor}
                  onChange={(e) => setPaymentData({ ...paymentData, valor: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  required
                  min="1"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2 text-sm">Forma de Pagamento</label>
                <select
                  value={paymentData.formaPagamento}
                  onChange={(e) => setPaymentData({ ...paymentData, formaPagamento: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                >
                  <option value="M-Pesa" className="text-black">M-Pesa</option>
                  <option value="E-mola" className="text-black">E-mola</option>
                  <option value="dinheiro" className="text-black">Dinheiro</option>
                  <option value="transferencia" className="text-black">Transferência Bancária</option>
                  <option value="multicaixa" className="text-black">Multicaixa</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 mb-2 text-sm">Referência/Nº Transação</label>
                <input
                  type="text"
                  value={paymentData.referencia}
                  onChange={(e) => setPaymentData({ ...paymentData, referencia: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  placeholder="Código da transação"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2 text-sm">Observações</label>
                <textarea
                  value={paymentData.observacoes}
                  onChange={(e) => setPaymentData({ ...paymentData, observacoes: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500 text-sm"
                  rows={2}
                  placeholder="Observações adicionais..."
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition"
                  disabled={loadingMore}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition font-semibold flex items-center justify-center gap-2"
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <>
                      <TbLoader2 className="w-4 h-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    "Registrar Pagamento"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Análise de Candidatura */}
      {showCandidaturaModal && selectedCandidato && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full border border-yellow-500/30">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">📋 Analisar Candidatura</h3>
              <button onClick={() => setShowCandidaturaModal(false)} className="text-gray-400 hover:text-white">
                <TbX className="w-6 h-6" />
              </button>
            </div>
            <div className="mb-4 p-3 bg-white/5 rounded-lg">
              <p className="text-gray-400 text-sm">Candidato</p>
              <p className="text-white font-medium">{selectedCandidato.nomeCompleto}</p>
              <p className="text-xs text-gray-400">{selectedCandidato.matricula}</p>
              <p className="text-xs text-gray-500 mt-1">{selectedCandidato.contato.email} • {selectedCandidato.contato.telefone}</p>
              <p className="text-xs text-gray-500">
                📅 {new Date(selectedCandidato.formador.candidatura.dataCandidatura).toLocaleDateString()}
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2 text-sm">Parecer</label>
              <textarea
                value={parecerText}
                onChange={(e) => setParecerText(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500 text-sm"
                rows={3}
                placeholder="Digite seu parecer sobre a candidatura..."
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleProcessCandidatura(false)}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition flex items-center justify-center gap-2"
                disabled={loadingMore}
              >
                {loadingMore ? <TbLoader2 className="w-4 h-4 animate-spin" /> : <TbX className="w-4 h-4" />}
                Rejeitar
              </button>
              <button
                onClick={() => handleProcessCandidatura(true)}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition flex items-center justify-center gap-2"
                disabled={loadingMore}
              >
                {loadingMore ? <TbLoader2 className="w-4 h-4 animate-spin" /> : <TbCheck className="w-4 h-4" />}
                Aprovar
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />

      <style jsx>{`
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
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        @media print {
          .fixed {
            position: relative !important;
          }
          .min-h-screen {
            min-height: auto !important;
          }
          .overflow-y-auto {
            overflow-y: visible !important;
          }
          .max-h-\\[90vh\\] {
            max-height: none !important;
          }
        }
      `}</style>
    </>
  );
}