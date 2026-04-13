// app/dashboard/DashboardAdmin.tsx
"use client";

import { useState, useEffect } from "react";
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
  TbTrendingUp,
  TbEdit,
  TbTrash,
  TbCheck,
  TbX,
  TbEye,
  TbDownload,
  TbRefresh,
  TbSearch,
  TbFilter,
  TbMail,
  TbPhone,
  TbId,
  TbCalendarEvent,
  TbAward,
  TbStar,
  TbClock,
  TbBook,
  TbUserCheck,
  TbUserX,
  TbUserPlus,
  TbVideo,
  TbPhoto,
  TbChartLine,
} from "react-icons/tb";

const BASE_URL = "https://desktop-api-4f850b3f9733.herokuapp.com";

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
  };
  ativo: boolean;
  dataCadastro: string;
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

export default function DashboardAdmin() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<AdminDashboard | null>(null);
  const [membros, setMembros] = useState<Membro[]>([]);
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [estatisticasAulas, setEstatisticasAulas] = useState<EstatisticasAulas | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [selectedMembro, setSelectedMembro] = useState<Membro | null>(null);
  const [showMembroModal, setShowMembroModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    membroId: "",
    valor: 250,
    formaPagamento: "M-Pesa",
    referencia: "",
  });
  const [notification, setNotification] = useState<{ type: string; message: string } | null>(null);
  const [showCandidaturaModal, setShowCandidaturaModal] = useState(false);
  const [selectedCandidato, setSelectedCandidato] = useState<Candidato | null>(null);
  const [parecerText, setParecerText] = useState("");
  const [showAulaModal, setShowAulaModal] = useState(false);
  const [selectedAula, setSelectedAula] = useState<Aula | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const membroId = localStorage.getItem("membroId");
      const tipoMembro = localStorage.getItem("tipoMembro");
      
      if (!membroId || tipoMembro !== "administrador") {
        router.push("/login");
        return;
      }

      await Promise.all([
        fetchDashboard(),
        fetchMembros(),
        fetchCandidatos(),
        fetchAulas(),
        fetchEstatisticasAulas()
      ]);
    };

    checkAuth();
  }, [router]);

  const fetchDashboard = async () => {
    try {
      const response = await fetch(`${BASE_URL}/getDashboard`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const result = await response.json();
      
      if (result.returnCode === 200) {
        setDashboardData(result.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      showNotification("error", "Erro ao carregar dashboard");
    }
  };

  const fetchMembros = async () => {
    try {
      const response = await fetch(`${BASE_URL}/getMembroList`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ curPage: 1, pageSize: 100 }),
      });

      const result = await response.json();
      
      if (result.returnCode === 200) {
        setMembros(result.data.list);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
      showNotification("error", "Erro ao carregar membros");
    }
  };

  const fetchCandidatos = async () => {
    try {
      const response = await fetch(`${BASE_URL}/getMembroList`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          tipoMembro: "candidato_formador",
          curPage: 1, 
          pageSize: 100 
        }),
      });

      const result = await response.json();
      
      if (result.returnCode === 200) {
        setCandidatos(result.data.list);
      }
    } catch (error) {
      console.error("Error fetching candidates:", error);
      showNotification("error", "Erro ao carregar candidatos");
    }
  };

  const fetchAulas = async () => {
    try {
      const response = await fetch(`${BASE_URL}/getAulaList`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageSize: 50 }),
      });

      const result = await response.json();
      
      if (result.returnCode === 200) {
        setAulas(result.data.list);
      }
    } catch (error) {
      console.error("Error fetching aulas:", error);
      showNotification("error", "Erro ao carregar aulas");
    }
  };

  const fetchEstatisticasAulas = async () => {
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
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type: string, message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const handleRegisterPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
            mesReferente: {
              mes: new Date().getMonth() + 1,
              ano: new Date().getFullYear()
            }
          }
        }),
      });

      const result = await response.json();
      
      if (result.returnCode === 200) {
        showNotification("success", "Pagamento registrado com sucesso!");
        setShowPaymentModal(false);
        setPaymentData({ membroId: "", valor: 250, formaPagamento: "M-Pesa", referencia: "" });
        fetchMembros();
        fetchDashboard();
      } else {
        showNotification("error", result.returnMsg || "Erro ao registrar pagamento");
      }
    } catch (error) {
      showNotification("error", "Erro de conexão com o servidor");
    }
  };

  const handleProcessCandidatura = async (aprovado: boolean) => {
    if (!selectedCandidato) return;

    try {
      const response = await fetch(`${BASE_URL}/processarCandidatura`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          membroId: selectedCandidato.membroId,
          aprovado,
          parecer: parecerText,
          analisadoPor: localStorage.getItem("nomeCompleto") || "Administrador"
        }),
      });

      const result = await response.json();
      
      if (result.returnCode === 200) {
        showNotification("success", aprovado ? "Candidatura aprovada!" : "Candidatura rejeitada!");
        setShowCandidaturaModal(false);
        setSelectedCandidato(null);
        setParecerText("");
        fetchCandidatos();
        fetchDashboard();
      } else {
        showNotification("error", result.returnMsg || "Erro ao processar candidatura");
      }
    } catch (error) {
      showNotification("error", "Erro de conexão com o servidor");
    }
  };

  const handleToggleMembroStatus = async (membro: Membro) => {
    try {
      const response = await fetch(`${BASE_URL}/updateMembro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          membroId: membro.membroId,
          ativo: !membro.ativo,
          observacoes: membro.ativo ? "Membro desativado pelo administrador" : "Membro reativado pelo administrador"
        }),
      });

      const result = await response.json();
      
      if (result.returnCode === 200) {
        showNotification("success", membro.ativo ? "Membro desativado" : "Membro reativado");
        fetchMembros();
        fetchDashboard();
      } else {
        showNotification("error", result.returnMsg || "Erro ao alterar status");
      }
    } catch (error) {
      showNotification("error", "Erro de conexão com o servidor");
    }
  };

  const handleExportRelatorio = async () => {
    try {
      const response = await fetch(`${BASE_URL}/getRelatorioFinanceiro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mes: new Date().getMonth() + 1,
          ano: new Date().getFullYear()
        }),
      });

      const result = await response.json();
      
      if (result.returnCode === 200) {
        const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `relatorio_financeiro_${new Date().toISOString().split("T")[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showNotification("success", "Relatório exportado com sucesso!");
      }
    } catch (error) {
      showNotification("error", "Erro ao exportar relatório");
    }
  };

  const handleVerAula = (aula: Aula) => {
    setSelectedAula(aula);
    setShowAulaModal(true);
  };

  const filteredMembros = membros.filter(membro => {
    if (filterStatus !== "todos" && membro.cotas.statusPagamento !== filterStatus) return false;
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return membro.nomeCompleto.toLowerCase().includes(search) ||
             membro.matricula.toLowerCase().includes(search) ||
             membro.contato.email.toLowerCase().includes(search);
    }
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "em_dia": return "text-green-400 bg-green-500/20";
      case "pendente": return "text-yellow-400 bg-yellow-500/20";
      case "atrasado": return "text-red-400 bg-red-500/20";
      default: return "text-gray-400 bg-gray-500/20";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "em_dia": return "✅ Em dia";
      case "pendente": return "⚠️ Pendente";
      case "atrasado": return "❌ Atrasado";
      default: return status;
    }
  };

  const getStatusAulaColor = (status: string) => {
    switch (status) {
      case "publicado": return "text-green-400 bg-green-500/20";
      case "rascunho": return "text-yellow-400 bg-yellow-500/20";
      case "arquivado": return "text-gray-400 bg-gray-500/20";
      case "em_revisao": return "text-blue-400 bg-blue-500/20";
      default: return "text-gray-400 bg-gray-500/20";
    }
  };

  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case "iniciante": return "text-green-400 bg-green-500/20";
      case "intermediario": return "text-blue-400 bg-blue-500/20";
      case "avancado": return "text-purple-400 bg-purple-500/20";
      case "mestre": return "text-orange-400 bg-orange-500/20";
      default: return "text-gray-400 bg-gray-500/20";
    }
  };

  const getCategoriaText = (categoria: string) => {
    const categorias: Record<string, string> = {
      aberturas: "Aberturas",
      meio_jogo: "Meio Jogo",
      finais: "Finais",
      tatica: "Tática",
      estrategia: "Estratégia",
      analise_partidas: "Análise de Partidas",
      historia_xadrez: "História do Xadrez",
      treinamento: "Treinamento",
      torneios: "Torneios",
      exercicios: "Exercícios",
    };
    return categorias[categoria] || categoria;
  };

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

  if (!dashboardData) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 pt-20 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-400">Erro ao carregar dados</p>
            <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-yellow-600 rounded-lg">
              Tentar novamente
            </button>
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
        {/* Notification Toast */}
        {notification && (
          <div className={`fixed top-24 right-4 z-50 p-4 rounded-lg shadow-lg ${
            notification.type === "success" ? "bg-green-500/90" : "bg-red-500/90"
          } text-white animate-slide-in`}>
            {notification.message}
          </div>
        )}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Botão menu mobile */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden fixed bottom-4 right-4 z-50 p-3 bg-yellow-600 rounded-full shadow-lg"
          >
            <TbUserCheck className="w-6 h-6 text-white" />
          </button>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className={`
              fixed lg:relative inset-y-0 left-0 z-40 w-72 bg-gray-800/95 backdrop-blur-sm border-r border-white/10 transform transition-transform duration-300 overflow-y-auto
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}>
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-full flex items-center justify-center mb-4">
                    <TbChess className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-white font-semibold">Administrador</h3>
                  <p className="text-sm text-gray-400">Real Chess Club</p>
                  <p className="text-xs text-yellow-500 mt-1">{localStorage.getItem("nomeCompleto")}</p>
                </div>

                <div className="space-y-2">
                  <button onClick={() => { setActiveTab("overview"); setSidebarOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10">
                    <TbChartBar className="w-5 h-5" />
                    <span>Visão Geral</span>
                  </button>
                  <button onClick={() => { setActiveTab("membros"); setSidebarOpen(false); fetchMembros(); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10">
                    <TbUsers className="w-5 h-5" />
                    <span>Membros</span>
                  </button>
                  <button onClick={() => { setActiveTab("aulas"); setSidebarOpen(false); fetchAulas(); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10">
                    <TbBook className="w-5 h-5" />
                    <span>Aulas</span>
                  </button>
                  <button onClick={() => { setActiveTab("financeiro"); setSidebarOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10">
                    <TbCoin className="w-5 h-5" />
                    <span>Financeiro</span>
                  </button>
                  <button onClick={() => { setActiveTab("cursos"); setSidebarOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10">
                    <TbSchool className="w-5 h-5" />
                    <span>Cursos</span>
                  </button>
                  <button onClick={() => { setActiveTab("candidaturas"); setSidebarOpen(false); fetchCandidatos(); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10">
                    <TbFileText className="w-5 h-5" />
                    <span>Candidaturas</span>
                  </button>
                  <button onClick={() => { setActiveTab("relatorios"); setSidebarOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10">
                    <TbActivity className="w-5 h-5" />
                    <span>Relatórios</span>
                  </button>
                  <button onClick={() => { setActiveTab("configuracoes"); setSidebarOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10">
                    <TbSettings className="w-5 h-5" />
                    <span>Configurações</span>
                  </button>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10">
                    <TbLogout className="w-5 h-5" />
                    <span>Sair</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Conteúdo Principal */}
            <div className="flex-1">
              {/* Visão Geral */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-yellow-600/20 to-yellow-800/20 rounded-2xl p-6 border border-yellow-500/30">
                    <h1 className="text-2xl font-bold text-white mb-2">Painel Administrativo</h1>
                    <p className="text-gray-300">Visão geral do clube Real Chess Mahotas</p>
                    <p className="text-xs text-gray-400 mt-2">Última atualização: {new Date().toLocaleString()}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white/10 rounded-xl p-4 border border-white/20 hover:border-yellow-500/50 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <TbUsers className="w-6 h-6 text-yellow-500" />
                      </div>
                      <p className="text-2xl font-bold text-white">{dashboardData.resumo.totalMembros}</p>
                      <p className="text-sm text-gray-400">Total de Membros</p>
                      <div className="text-xs text-gray-500 mt-1">
                        {dashboardData.resumo.totalAlunos} alunos | {dashboardData.resumo.totalFormadores} formadores
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 border border-white/20 hover:border-yellow-500/50 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <TbBook className="w-6 h-6 text-yellow-500" />
                      </div>
                      <p className="text-2xl font-bold text-white">{estatisticasAulas?.totalAulas || 0}</p>
                      <p className="text-sm text-gray-400">Total de Aulas</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 border border-white/20 hover:border-yellow-500/50 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <TbCoin className="w-6 h-6 text-yellow-500" />
                      </div>
                      <p className="text-2xl font-bold text-white">{dashboardData.resumo.arrecadacaoMes.toLocaleString()} MZN</p>
                      <p className="text-sm text-gray-400">Arrecadação do Mês</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 border border-white/20 hover:border-yellow-500/50 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <TbBell className="w-6 h-6 text-red-400" />
                      </div>
                      <p className="text-2xl font-bold text-white">{dashboardData.resumo.inadimplentes}</p>
                      <p className="text-sm text-gray-400">Inadimplentes ({dashboardData.resumo.taxaInadimplencia}%)</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <TbCalendar className="w-5 h-5 text-yellow-500" />
                        Atividades do Mês
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between p-2 bg-white/5 rounded-lg">
                          <span className="text-gray-300">Presenças</span>
                          <span className="text-white font-semibold">{dashboardData.resumo.totalPresencasMes}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-white/5 rounded-lg">
                          <span className="text-gray-300">Horas de Aula</span>
                          <span className="text-white font-semibold">{dashboardData.resumo.totalHorasMes}</span>
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
                          <span className="text-gray-300">Taxa de Conclusão</span>
                          <span className="text-white font-semibold">
                            {estatisticasAulas?.totalAlunosInscritos ? 
                              ((estatisticasAulas.totalConcluintes / estatisticasAulas.totalAlunosInscritos) * 100).toFixed(1) : 0}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                    <h3 className="text-lg font-semibold text-white mb-4">Distribuição por Nível de Xadrez</h3>
                    <div className="space-y-3">
                      {dashboardData.distribuicaoNivel.map((nivel) => (
                        <div key={nivel._id}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-300 capitalize">{nivel._id}</span>
                            <span className="text-white">{nivel.count} alunos</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div
                              className="bg-yellow-500 rounded-full h-2 transition-all duration-500"
                              style={{ width: `${(nivel.count / dashboardData.resumo.totalAlunos) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                    <h3 className="text-lg font-semibold text-white mb-4">Top Alunos (Pontuação)</h3>
                    <div className="space-y-2">
                      {dashboardData.topAlunos.map((aluno, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition">
                          <div className="flex items-center gap-3">
                            <span className="text-yellow-500 font-bold">#{idx + 1}</span>
                            <div>
                              <span className="text-white">{aluno.nomeCompleto}</span>
                              <p className="text-xs text-gray-500">{aluno.matricula}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-400">Nível {aluno.gamificacao.nivel}</span>
                            <span className="text-yellow-500 font-semibold">{aluno.gamificacao.pontos} pts</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Gestão de Membros */}
              {activeTab === "membros" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <h2 className="text-2xl font-bold text-white">Gestão de Membros</h2>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <TbSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Buscar membro..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-9 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
                        />
                      </div>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                      >
                        <option value="todos" className="text-black">Todos</option>
                        <option value="em_dia" className="text-black">Em dia</option>
                        <option value="pendente" className="text-black">Pendente</option>
                        <option value="atrasado" className="text-black">Atrasado</option>
                      </select>
                      <button onClick={fetchMembros} className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition">
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
                            <th className="text-left p-3 text-gray-400 text-sm">Nome</th>
                            <th className="text-left p-3 text-gray-400 text-sm">Email</th>
                            <th className="text-left p-3 text-gray-400 text-sm">Telefone</th>
                            <th className="text-left p-3 text-gray-400 text-sm">Status Cota</th>
                            <th className="text-left p-3 text-gray-400 text-sm">Status</th>
                            <th className="text-left p-3 text-gray-400 text-sm">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredMembros.map((membro) => (
                            <tr key={membro.membroId} className="border-b border-white/10 hover:bg-white/5 transition">
                              <td className="p-3 text-white text-sm">{membro.matricula}</td>
                              <td className="p-3 text-white text-sm">{membro.nomeCompleto}</td>
                              <td className="p-3 text-gray-300 text-sm">{membro.contato.email}</td>
                              <td className="p-3 text-gray-300 text-sm">{membro.contato.telefone}</td>
                              <td className="p-3">
                                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(membro.cotas.statusPagamento)}`}>
                                  {getStatusText(membro.cotas.statusPagamento)}
                                </span>
                              </td>
                              <td className="p-3">
                                <span className={`px-2 py-1 rounded-full text-xs ${membro.ativo ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                                  {membro.ativo ? "Ativo" : "Inativo"}
                                </span>
                              </td>
                              <td className="p-3">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => {
                                      setSelectedMembro(membro);
                                      setPaymentData({ ...paymentData, membroId: membro.membroId });
                                      setShowPaymentModal(true);
                                    }}
                                    className="p-1 text-blue-400 hover:text-blue-300 transition"
                                    title="Registrar Pagamento"
                                  >
                                    <TbCoin className="w-5 h-5" />
                                  </button>
                                  <button
                                    onClick={() => handleToggleMembroStatus(membro)}
                                    className="p-1 text-yellow-400 hover:text-yellow-300 transition"
                                    title={membro.ativo ? "Desativar" : "Reativar"}
                                  >
                                    {membro.ativo ? <TbUserX className="w-5 h-5" /> : <TbUserCheck className="w-5 h-5" />}
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedMembro(membro);
                                      setShowMembroModal(true);
                                    }}
                                    className="p-1 text-gray-400 hover:text-gray-300 transition"
                                    title="Ver Detalhes"
                                  >
                                    <TbEye className="w-5 h-5" />
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
                        Nenhum membro encontrado
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Aulas */}
              {activeTab === "aulas" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <h2 className="text-2xl font-bold text-white">Todas as Aulas</h2>
                    <button onClick={fetchAulas} className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition">
                      <TbRefresh className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {aulas.map((aula) => (
                      <div key={aula.aulaId} className="bg-white/10 rounded-xl p-4 border border-white/20 hover:border-yellow-500/50 transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <h3 className="text-lg font-semibold text-white">{aula.titulo}</h3>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusAulaColor(aula.status)}`}>
                                {aula.status === "publicado" ? "Publicado" : 
                                 aula.status === "rascunho" ? "Rascunho" : 
                                 aula.status === "arquivado" ? "Arquivado" : 
                                 aula.status === "em_revisao" ? "Em Revisão" : aula.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-400 line-clamp-2">{aula.descricao}</p>
                            <div className="flex items-center gap-3 mt-2 flex-wrap">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${getNivelColor(aula.nivel)}`}>
                                {aula.nivel}
                              </span>
                              <span className="text-xs text-gray-500">{getCategoriaText(aula.categoria)}</span>
                              <span className="text-xs text-gray-500">👁️ {aula.visualizacoes}</span>
                              <span className="text-xs text-gray-500">👨‍🏫 {aula.formadorNome}</span>
                            </div>
                            {aula.tags && aula.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {aula.tags.slice(0, 3).map((tag, idx) => (
                                  <span key={idx} className="text-xs text-gray-500">#{tag}</span>
                                ))}
                              </div>
                            )}
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

              {/* Financeiro */}
              {activeTab === "financeiro" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">Relatórios Financeiros</h2>
                    <button
                      onClick={handleExportRelatorio}
                      className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition"
                    >
                      <TbDownload className="w-4 h-4" />
                      Exportar Relatório
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                      <p className="text-gray-400 text-sm">Arrecadação Total</p>
                      <p className="text-3xl font-bold text-white">{dashboardData.resumo.arrecadacaoMes.toLocaleString()} MZN</p>
                      <p className="text-xs text-gray-500 mt-2">Mês atual</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                      <p className="text-gray-400 text-sm">Inadimplência</p>
                      <p className="text-3xl font-bold text-red-400">{dashboardData.resumo.taxaInadimplencia}%</p>
                      <p className="text-xs text-gray-500 mt-2">{dashboardData.resumo.inadimplentes} membros</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                      <p className="text-gray-400 text-sm">Valor em Atraso</p>
                      <p className="text-3xl font-bold text-yellow-400">-- MZN</p>
                      <p className="text-xs text-gray-500 mt-2">Total devido</p>
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                    <h3 className="text-lg font-semibold text-white mb-4">Membros Inadimplentes</h3>
                    <div className="space-y-2">
                      {membros.filter(m => m.cotas.statusPagamento === "atrasado").map((membro) => (
                        <div key={membro.membroId} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div>
                            <p className="text-white">{membro.nomeCompleto}</p>
                            <p className="text-xs text-gray-400">{membro.matricula}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-red-400 font-semibold">{membro.cotas.valorTotalDevido} MZN</span>
                            <button
                              onClick={() => {
                                setPaymentData({ ...paymentData, membroId: membro.membroId });
                                setShowPaymentModal(true);
                              }}
                              className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-sm transition"
                            >
                              Registrar Pagamento
                            </button>
                          </div>
                        </div>
                      ))}
                      {membros.filter(m => m.cotas.statusPagamento === "atrasado").length === 0 && (
                        <p className="text-gray-400 text-center py-4">Nenhum membro inadimplente</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Cursos */}
              {activeTab === "cursos" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white">Gestão de Cursos</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dashboardData.cursosAtivos.map((curso, idx) => (
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
                  </div>
                </div>
              )}

              {/* Candidaturas */}
              {activeTab === "candidaturas" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white">Candidaturas a Formador</h2>
                  <div className="space-y-3">
                    {candidatos.map((candidato) => (
                      <div key={candidato.membroId} className="bg-white/10 rounded-xl p-4 border border-white/20">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div>
                            <p className="font-semibold text-white">{candidato.nomeCompleto}</p>
                            <p className="text-sm text-gray-400">Matrícula: {candidato.matricula}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                              <TbMail className="w-3 h-3" /> {candidato.contato.email}
                              <TbPhone className="w-3 h-3 ml-2" /> {candidato.contato.telefone}
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
                              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition"
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

              {/* Relatórios */}
              {activeTab === "relatorios" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white">Relatórios do Sistema</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                      <h3 className="text-lg font-semibold text-white mb-3">Relatório de Membros</h3>
                      <p className="text-gray-400 text-sm mb-4">Exportar lista completa de membros</p>
                      <button className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition">
                        Exportar Membros
                      </button>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                      <h3 className="text-lg font-semibold text-white mb-3">Relatório Financeiro</h3>
                      <p className="text-gray-400 text-sm mb-4">Exportar relatório de pagamentos</p>
                      <button onClick={handleExportRelatorio} className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition">
                        Exportar Financeiro
                      </button>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                      <h3 className="text-lg font-semibold text-white mb-3">Relatório de Presenças</h3>
                      <p className="text-gray-400 text-sm mb-4">Exportar histórico de presenças</p>
                      <button className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition">
                        Exportar Presenças
                      </button>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                      <h3 className="text-lg font-semibold text-white mb-3">Relatório de Cursos</h3>
                      <p className="text-gray-400 text-sm mb-4">Exportar dados de cursos e alunos</p>
                      <button className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition">
                        Exportar Cursos
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Configurações */}
              {activeTab === "configuracoes" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white">Configurações do Sistema</h2>
                  <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                    <p className="text-gray-400 text-center py-8">Configurações em desenvolvimento</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Detalhes do Membro */}
      {showMembroModal && selectedMembro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-2xl w-full mx-4 border border-yellow-500/30 max-h-[80vh] overflow-y-auto">
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
                  <p className="text-white">{selectedMembro.matricula}</p>
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
                  <p className="text-gray-400 text-sm">Status Cota</p>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedMembro.cotas.statusPagamento)}`}>
                    {getStatusText(selectedMembro.cotas.statusPagamento)}
                  </span>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Data Cadastro</p>
                  <p className="text-white">{new Date(selectedMembro.dataCadastro).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => {
                    setPaymentData({ ...paymentData, membroId: selectedMembro.membroId });
                    setShowMembroModal(false);
                    setShowPaymentModal(true);
                  }}
                  className="flex-1 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition"
                >
                  Registrar Pagamento
                </button>
                <button
                  onClick={() => handleToggleMembroStatus(selectedMembro)}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
                >
                  {selectedMembro.ativo ? "Desativar" : "Reativar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes da Aula */}
      {showAulaModal && selectedAula && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-2xl w-full mx-4 border border-yellow-500/30 max-h-[80vh] overflow-y-auto">
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
                  <p className="text-white">{selectedAula.titulo}</p>
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
                {selectedAula.duracaoEstimada && (
                  <div>
                    <p className="text-gray-400 text-sm">Duração Estimada</p>
                    <p className="text-white">{selectedAula.duracaoEstimada} minutos</p>
                  </div>
                )}
              </div>
              <div>
                <p className="text-gray-400 text-sm">Descrição</p>
                <p className="text-white">{selectedAula.descricao}</p>
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
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAulaModal(false)}
                  className="flex-1 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Pagamento */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4 border border-yellow-500/30">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Registrar Pagamento</h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-white">
                <TbX className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleRegisterPayment} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2 text-sm">Valor (MZN)</label>
                <input
                  type="number"
                  value={paymentData.valor}
                  onChange={(e) => setPaymentData({ ...paymentData, valor: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  required
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
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setShowPaymentModal(false)} className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition font-semibold">
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Análise de Candidatura */}
      {showCandidaturaModal && selectedCandidato && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4 border border-yellow-500/30">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Analisar Candidatura</h3>
              <button onClick={() => setShowCandidaturaModal(false)} className="text-gray-400 hover:text-white">
                <TbX className="w-6 h-6" />
              </button>
            </div>
            <div className="mb-4">
              <p className="text-gray-400 text-sm">Candidato</p>
              <p className="text-white font-semibold">{selectedCandidato.nomeCompleto}</p>
              <p className="text-xs text-gray-500">{selectedCandidato.matricula}</p>
            </div>
            <div className="mb-4">
              <p className="text-gray-400 text-sm">Data da Candidatura</p>
              <p className="text-white">{new Date(selectedCandidato.formador.candidatura.dataCandidatura).toLocaleDateString()}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2 text-sm">Parecer</label>
              <textarea
                value={parecerText}
                onChange={(e) => setParecerText(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                rows={3}
                placeholder="Digite seu parecer..."
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleProcessCandidatura(false)}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition flex items-center justify-center gap-2"
              >
                <TbX className="w-4 h-4" />
                Rejeitar
              </button>
              <button
                onClick={() => handleProcessCandidatura(true)}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition flex items-center justify-center gap-2"
              >
                <TbCheck className="w-4 h-4" />
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
      `}</style>
    </>
  );
}