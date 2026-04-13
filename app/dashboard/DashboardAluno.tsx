// app/dashboard/DashboardAluno.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  TbChess,
  TbTrophy,
  TbCalendar,
  TbCoin,
  TbChartBar,
  TbBook,
  TbClock,
  TbUser,
  TbLogout,
  TbCheckbox,
  TbStar,
  TbTrendingUp,
  TbSchool,
  TbWallet,
  TbAward,
  TbTarget,
  TbEdit,
  TbMail,
  TbPhone,
  TbMapPin,
  TbId,
  TbCalendarEvent,
  TbCreditCard,
  TbDownload,
  TbRefresh,
  TbInfoCircle,
  TbVideo,
  TbPhoto,
  TbFileText,
  TbPlayerPlay,
  TbX,
  TbPlus,
  TbEye,
  TbSearch,
} from "react-icons/tb";

const BASE_URL = "https://desktop-api-4f850b3f9733.herokuapp.com";

interface Aula {
  aulaId: string;
  titulo: string;
  subtitulo?: string;
  descricao: string;
  categoria: string;
  nivel: string;
  status?: string;
  visualizacoes: number;
  duracaoEstimada?: number;
  totalExercicios?: number;
  totalVideos?: number;
  totalImagens?: number;
  progresso: number;
  concluido: boolean;
  certificadoGerado: boolean;
  ultimoAcesso?: string;
  formadorNome?: string;
  estatisticas?: {
    totalAlunosInscritos: number;
    avaliacaoMedia: number;
  };
  conteudo?: {
    textoExplicativo: string;
    imagens: Array<{ url: string; titulo: string; descricao?: string }>;
    videos: Array<{
      url: string;
      titulo: string;
      duracao: number;
      plataforma?: string;
    }>;
    materiais: Array<{ url: string; nome: string; tipo?: string }>;
  };
}

interface DashboardData {
  dadosPessoais: {
    nome: string;
    matricula: string;
    nivel: string;
    rating: {
      pontuacao: number;
      tipo: string;
    };
  };
  financeiro: {
    statusCota: string;
    proximoVencimento: string;
    valorDevido: number;
    diasParaVencimento?: number;
  };
  academico: {
    cursosInscritos: number;
    cursosConcluidos: number;
    progressoMedio: number;
    presencaMedia: number;
  };
  desempenho: {
    totalPartidas: number;
    taxaVitorias: number;
    evolucaoRating: Array<{ data: string; rating: number }>;
  };
  gamificacao: {
    pontos: number;
    nivel: number;
    insignias: Array<{
      nome: string;
      descricao: string;
      dataConquista: string;
    }>;
  };
  ultimasAtividades: {
    presencas: Array<{ data: string; cursoNome: string; presente: boolean }>;
    pagamentos: Array<{ dataPagamento: string; valor: number; status: string }>;
  };
}

interface PerfilData {
  nomeCompleto: string;
  email: string;
  telefone: string;
  bi: string;
  dataNascimento: string;
  endereco: string;
  bairro: string;
  cidade: string;
  provincia: string;
}

export default function DashboardAluno() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [perfilData, setPerfilData] = useState<PerfilData | null>(null);
  const [aulasData, setAulasData] = useState<Aula[]>([]);
  const [aulasDisponiveis, setAulasDisponiveis] = useState<Aula[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDisponiveis, setLoadingDisponiveis] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingPerfil, setEditingPerfil] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    valor: 250,
    formaPagamento: "M-Pesa",
    referencia: "",
  });
  const [notification, setNotification] = useState<{
    type: string;
    message: string;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterNivel, setFilterNivel] = useState("todos");
  const [filterCategoria, setFilterCategoria] = useState("todas");

  useEffect(() => {
    const fetchDashboard = async () => {
      const membroId = localStorage.getItem("membroId");

      if (!membroId) {
        router.push("/login");
        return;
      }

      try {
        // Buscar dados do dashboard
        const response = await fetch(`${BASE_URL}/getDashboardAluno`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ membroId }),
        });

        const result = await response.json();

        if (result.returnCode === 200) {
          setDashboardData(result.data);
        }

        // Buscar dados completos do perfil
        const perfilResponse = await fetch(`${BASE_URL}/getMembroDetail`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ membroId }),
        });

        const perfilResult = await perfilResponse.json();

        if (perfilResult.returnCode === 200) {
          const membro = perfilResult.data;
          setPerfilData({
            nomeCompleto: membro.nomeCompleto,
            email: membro.contato.email,
            telefone: membro.contato.telefone,
            bi: membro.bi,
            dataNascimento: new Date(
              membro.dataNascimento,
            ).toLocaleDateString(),
            endereco: membro.contato.endereco?.rua || "",
            bairro: membro.contato.endereco?.bairro || "",
            cidade: membro.contato.endereco?.cidade || "Maputo",
            provincia: membro.contato.endereco?.provincia || "Maputo",
          });
        }

        // Buscar aulas do aluno (inscritas)
        await fetchMinhasAulas(membroId);

        // Buscar aulas disponíveis
        await fetchAulasDisponiveis(membroId);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
        showNotification("error", "Erro ao carregar dados. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [router]);

  const fetchMinhasAulas = async (membroId: string) => {
    try {
      const aulasResponse = await fetch(`${BASE_URL}/getAulasByAluno`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alunoId: membroId }),
      });

      const aulasResult = await aulasResponse.json();

      if (aulasResult.returnCode === 200) {
        setAulasData(aulasResult.data);
        console.log("Aulas encontradas:", aulasResult.data.length);
      } else {
        console.log("Erro ou nenhuma aula:", aulasResult);
        setAulasData([]);
      }
    } catch (error) {
      console.error("Error fetching minhas aulas:", error);
      setAulasData([]);
    }
  };

  const fetchAulasDisponiveis = async (membroId: string) => {
    setLoadingDisponiveis(true);
    try {
      const response = await fetch(`${BASE_URL}/getAulaList`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "publicado",
          pageSize: 50,
        }),
      });

      const result = await response.json();

      if (result.returnCode === 200) {
        const aulasInscritasIds = aulasData.map((a) => a.aulaId);
        const aulasNaoInscritas = result.data.list.filter(
          (aula: Aula) => !aulasInscritasIds.includes(aula.aulaId),
        );
        setAulasDisponiveis(aulasNaoInscritas);
      }
    } catch (error) {
      console.error("Error fetching available aulas:", error);
      showNotification("error", "Erro ao carregar aulas disponíveis");
    } finally {
      setLoadingDisponiveis(false);
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

  const handleUpdatePerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    const membroId = localStorage.getItem("membroId");

    try {
      const response = await fetch(`${BASE_URL}/updateMembro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          membroId,
          contato: {
            telefone: perfilData?.telefone,
            endereco: {
              rua: perfilData?.endereco,
              bairro: perfilData?.bairro,
              cidade: perfilData?.cidade,
              provincia: perfilData?.provincia,
            },
          },
        }),
      });

      const result = await response.json();

      if (result.returnCode === 200) {
        showNotification("success", "Perfil atualizado com sucesso!");
        setEditingPerfil(false);
      } else {
        showNotification(
          "error",
          result.returnMsg || "Erro ao atualizar perfil",
        );
      }
    } catch (error) {
      showNotification("error", "Erro de conexão com o servidor");
    }
  };

  const handleRegisterPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const membroId = localStorage.getItem("membroId");

    try {
      const response = await fetch(`${BASE_URL}/registerCotaPayment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          membroId,
          paymentData: {
            valor: paymentData.valor,
            formaPagamento: paymentData.formaPagamento,
            referencia: paymentData.referencia,
            mesReferente: {
              mes: new Date().getMonth() + 1,
              ano: new Date().getFullYear(),
            },
          },
        }),
      });

      const result = await response.json();

      if (result.returnCode === 200) {
        showNotification("success", "Pagamento registrado com sucesso!");
        setShowPaymentModal(false);
        setPaymentData({
          valor: 250,
          formaPagamento: "M-Pesa",
          referencia: "",
        });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        showNotification(
          "error",
          result.returnMsg || "Erro ao registrar pagamento",
        );
      }
    } catch (error) {
      console.error("Payment error:", error);
      showNotification("error", "Erro de conexão com o servidor");
    }
  };

  const handleInscreverAula = async (aula: Aula) => {
    const membroId = localStorage.getItem("membroId");

    if (!membroId) {
      showNotification("error", "Sessão expirada. Faça login novamente.");
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/inscreverCurso`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          membroId,
          cursoData: {
            cursoId: aula.aulaId,
            nome: aula.titulo,
          },
        }),
      });

      const result = await response.json();

      if (result.returnCode === 200) {
        showNotification(
          "success",
          `Inscrição na aula "${aula.titulo}" realizada com sucesso!`,
        );

        // Atualizar a lista de aulas com os dados retornados
        if (result.data.aulas) {
          setAulasData(result.data.aulas);
        } else {
          // Se não veio na resposta, buscar novamente
          await fetchMinhasAulas(membroId);
        }

        // Recarregar aulas disponíveis
        await fetchAulasDisponiveis(membroId);

        // Mudar para a aba "Minhas Aulas"
        setActiveTab("aulas");
      } else {
        showNotification(
          "error",
          result.returnMsg || "Erro ao inscrever na aula",
        );
      }
    } catch (error) {
      console.error("Enrollment error:", error);
      showNotification("error", "Erro de conexão com o servidor");
    }
  };

  const handleDownloadCertificado = async (aulaId: string) => {
    const membroId = localStorage.getItem("membroId");

    try {
      const response = await fetch(`${BASE_URL}/exportMembro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ membroId }),
      });

      const result = await response.json();

      if (result.returnCode === 200) {
        const blob = new Blob([JSON.stringify(result.data, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `certificado_aula_${aulaId}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showNotification("success", "Certificado baixado com sucesso!");
      }
    } catch (error) {
      showNotification("error", "Erro ao baixar certificado");
    }
  };

  // Função para redirecionar para a página da aula
  const handleVerAula = (aula: Aula) => {
    router.push(`/aula/${aula.aulaId}`);
  };

  // Função para visualizar aula disponível (sem inscrição)
  const handleVisualizarAulaDisponivel = (aula: Aula) => {
    router.push(`/aula/${aula.aulaId}`);
  };

  const filteredAulasDisponiveis = aulasDisponiveis.filter((aula) => {
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      const matchesSearch =
        aula.titulo.toLowerCase().includes(search) ||
        aula.descricao.toLowerCase().includes(search) ||
        (aula.formadorNome && aula.formadorNome.toLowerCase().includes(search));
      if (!matchesSearch) return false;
    }
    if (filterNivel !== "todos" && aula.nivel !== filterNivel) return false;
    if (filterCategoria !== "todas" && aula.categoria !== filterCategoria)
      return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "em_dia":
        return "text-green-400 bg-green-500/20";
      case "pendente":
        return "text-yellow-400 bg-yellow-500/20";
      case "atrasado":
        return "text-red-400 bg-red-500/20";
      default:
        return "text-gray-400 bg-gray-500/20";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "em_dia":
        return "✅ Em dia";
      case "pendente":
        return "⚠️ Pendente";
      case "atrasado":
        return "❌ Atrasado";
      default:
        return status;
    }
  };

  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case "iniciante":
        return "text-green-400 bg-green-500/20";
      case "intermediario":
        return "text-blue-400 bg-blue-500/20";
      case "avancado":
        return "text-purple-400 bg-purple-500/20";
      case "mestre":
        return "text-orange-400 bg-orange-500/20";
      default:
        return "text-gray-400 bg-gray-500/20";
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

  const getProgressoColor = (progresso: number) => {
    if (progresso < 30) return "bg-red-500";
    if (progresso < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-400">Carregando seu dashboard...</p>
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
            <p className="text-red-400">Erro ao carregar dados do dashboard</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-yellow-600 rounded-lg hover:bg-yellow-700 transition"
            >
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
        {notification && (
          <div
            className={`fixed top-24 right-4 z-50 p-4 rounded-lg shadow-lg ${
              notification.type === "success"
                ? "bg-green-500/90"
                : "bg-red-500/90"
            } text-white animate-slide-in`}
          >
            {notification.message}
          </div>
        )}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden fixed bottom-4 right-4 z-50 p-3 bg-yellow-600 rounded-full shadow-lg"
          >
            <TbUser className="w-6 h-6 text-white" />
          </button>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div
              className={`
              fixed lg:relative inset-y-0 left-0 z-40 w-72 bg-gray-800/95 backdrop-blur-sm border-r border-white/10 transform transition-transform duration-300 overflow-y-auto
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}
            >
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-full flex items-center justify-center mb-4">
                    <TbChess className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-white font-semibold">
                    {dashboardData.dadosPessoais.nome}
                  </h3>
                  <p className="text-sm text-gray-400">
                    Matrícula: {dashboardData.dadosPessoais.matricula}
                  </p>
                  <p className="text-xs text-yellow-500 mt-1">
                    Nível: {dashboardData.dadosPessoais.nivel}
                  </p>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setActiveTab("overview");
                      setSidebarOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10"
                  >
                    <TbChartBar className="w-5 h-5" />
                    <span>Visão Geral</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("aulas");
                      setSidebarOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10"
                  >
                    <TbBook className="w-5 h-5" />
                    <span>Minhas Aulas</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("disponiveis");
                      setSidebarOpen(false);
                      const membroId = localStorage.getItem("membroId");
                      if (membroId) fetchAulasDisponiveis(membroId);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10"
                  >
                    <TbPlus className="w-5 h-5" />
                    <span>Aulas Disponíveis</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("presencas");
                      setSidebarOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10"
                  >
                    <TbCalendar className="w-5 h-5" />
                    <span>Presenças</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("financeiro");
                      setSidebarOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10"
                  >
                    <TbWallet className="w-5 h-5" />
                    <span>Financeiro</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("desempenho");
                      setSidebarOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10"
                  >
                    <TbTarget className="w-5 h-5" />
                    <span>Desempenho</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("conquistas");
                      setSidebarOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10"
                  >
                    <TbAward className="w-5 h-5" />
                    <span>Conquistas</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("perfil");
                      setSidebarOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10"
                  >
                    <TbUser className="w-5 h-5" />
                    <span>Meu Perfil</span>
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
              {/* Visão Geral */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-yellow-600/20 to-yellow-800/20 rounded-2xl p-6 border border-yellow-500/30">
                    <h1 className="text-2xl font-bold text-white mb-2">
                      Bem-vindo,{" "}
                      {dashboardData.dadosPessoais.nome.split(" ")[0]}!
                    </h1>
                    <p className="text-gray-300">
                      Continue evoluindo no xadrez. Hoje é um ótimo dia para
                      aprender algo novo!
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white/10 rounded-xl p-4 border border-white/20 hover:border-yellow-500/50 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <TbSchool className="w-6 h-6 text-yellow-500" />
                        <span className="text-xs text-gray-400">Progresso</span>
                      </div>
                      <p className="text-2xl font-bold text-white">
                        {dashboardData.academico.progressoMedio.toFixed(1)}%
                      </p>
                      <p className="text-sm text-gray-400">Média dos cursos</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 border border-white/20 hover:border-yellow-500/50 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <TbTrophy className="w-6 h-6 text-yellow-500" />
                        <span className="text-xs text-gray-400">Rating</span>
                      </div>
                      <p className="text-2xl font-bold text-white">
                        {dashboardData.dadosPessoais.rating.pontuacao}
                      </p>
                      <p className="text-sm text-gray-400">Pontuação atual</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 border border-white/20 hover:border-yellow-500/50 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <TbCoin className="w-6 h-6 text-yellow-500" />
                        <span className="text-xs text-gray-400">Cota</span>
                      </div>
                      <p
                        className={`text-2xl font-bold ${dashboardData.financeiro.statusCota === "em_dia" ? "text-green-400" : "text-red-400"}`}
                      >
                        {dashboardData.financeiro.valorDevido} MZN
                      </p>
                      <p className="text-sm text-gray-400">Valor devido</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 border border-white/20 hover:border-yellow-500/50 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <TbStar className="w-6 h-6 text-yellow-500" />
                        <span className="text-xs text-gray-400">Nível</span>
                      </div>
                      <p className="text-2xl font-bold text-white">
                        {dashboardData.gamificacao.nivel}
                      </p>
                      <p className="text-sm text-gray-400">
                        {dashboardData.gamificacao.pontos} pontos
                      </p>
                    </div>
                  </div>

                  <div
                    className={`p-4 rounded-xl border ${getStatusColor(dashboardData.financeiro.statusCota)}`}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div>
                        <p className="font-semibold">Status da Cota Mensal</p>
                        <p className="text-sm opacity-90">
                          Próximo vencimento:{" "}
                          {new Date(
                            dashboardData.financeiro.proximoVencimento,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(dashboardData.financeiro.statusCota)}`}
                        >
                          {getStatusText(dashboardData.financeiro.statusCota)}
                        </span>
                        {dashboardData.financeiro.statusCota !== "em_dia" && (
                          <button
                            onClick={() => setShowPaymentModal(true)}
                            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-sm font-semibold transition"
                          >
                            Regularizar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <TbClock className="w-5 h-5 text-yellow-500" />
                        Últimas Presenças
                      </h3>
                      <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                        {dashboardData.ultimasAtividades.presencas
                          .slice(0, 5)
                          .map((presenca, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
                            >
                              <div>
                                <p className="text-sm text-white">
                                  {presenca.cursoNome || "Aula de Xadrez"}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {new Date(presenca.data).toLocaleDateString()}
                                </p>
                              </div>
                              {presenca.presente ? (
                                <TbCheckbox className="w-5 h-5 text-green-400" />
                              ) : (
                                <TbClock className="w-5 h-5 text-red-400" />
                              )}
                            </div>
                          ))}
                      </div>
                    </div>

                    <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <TbWallet className="w-5 h-5 text-yellow-500" />
                        Últimos Pagamentos
                      </h3>
                      <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                        {dashboardData.ultimasAtividades.pagamentos
                          .slice(0, 5)
                          .map((pagamento, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
                            >
                              <div>
                                <p className="text-sm text-white">
                                  {pagamento.valor} MZN
                                </p>
                                <p className="text-xs text-gray-400">
                                  {new Date(
                                    pagamento.dataPagamento,
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                              <span className="text-xs text-green-400">
                                Confirmado
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>

                  {dashboardData.desempenho.evolucaoRating.length > 0 && (
                    <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <TbTrendingUp className="w-5 h-5 text-yellow-500" />
                        Evolução do Rating
                      </h3>
                      <div className="h-64">
                        <div className="flex items-end justify-between h-48 gap-2">
                          {dashboardData.desempenho.evolucaoRating
                            .slice(-7)
                            .map((item, idx) => (
                              <div
                                key={idx}
                                className="flex-1 flex flex-col items-center"
                              >
                                <div
                                  className="w-full bg-yellow-500 rounded-t-lg transition-all duration-500 hover:bg-yellow-400"
                                  style={{
                                    height: `${Math.min((item.rating / 2000) * 100, 100)}%`,
                                  }}
                                />
                                <p className="text-xs text-gray-400 mt-2 text-center">
                                  {new Date(item.data).toLocaleDateString(
                                    undefined,
                                    { month: "short", day: "numeric" },
                                  )}
                                </p>
                                <p className="text-xs text-yellow-500 font-semibold">
                                  {item.rating}
                                </p>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Minhas Aulas */}
              {activeTab === "aulas" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">
                      Minhas Aulas
                    </h2>
                    <button
                      onClick={async () => {
                        const membroId = localStorage.getItem("membroId");
                        if (membroId) await fetchMinhasAulas(membroId);
                      }}
                      className="p-2 text-gray-400 hover:text-yellow-500 transition"
                    >
                      <TbRefresh className="w-5 h-5" />
                    </button>
                  </div>

                  {aulasData.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {aulasData.map((aula, idx) => (
                        <div
                          key={idx}
                          className="bg-white/10 rounded-xl p-4 border border-white/20 hover:border-yellow-500/50 transition-all"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <h3 className="text-lg font-semibold text-white">
                                  {aula.titulo}
                                </h3>
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full ${getNivelColor(aula.nivel)}`}
                                >
                                  {aula.nivel}
                                </span>
                              </div>
                              <p className="text-sm text-gray-400 line-clamp-2">
                                {aula.descricao}
                              </p>
                              <div className="flex items-center gap-3 mt-2 flex-wrap">
                                <span className="text-xs text-gray-500">
                                  {getCategoriaText(aula.categoria)}
                                </span>
                                {aula.duracaoEstimada && (
                                  <span className="text-xs text-gray-500">
                                    ⏱️ {aula.duracaoEstimada} min
                                  </span>
                                )}
                                {aula.totalVideos && aula.totalVideos > 0 && (
                                  <span className="text-xs text-gray-500">
                                    🎬 {aula.totalVideos} vídeos
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-400">
                                Seu Progresso
                              </span>
                              <span className="text-yellow-500">
                                {aula.progresso || 0}%
                              </span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2">
                              <div
                                className={`${getProgressoColor(aula.progresso || 0)} rounded-full h-2 transition-all duration-500`}
                                style={{ width: `${aula.progresso || 0}%` }}
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-3">
                              {aula.totalExercicios !== undefined && (
                                <div className="text-center">
                                  <p className="text-xs text-gray-400">
                                    Exercícios
                                  </p>
                                  <p className="text-white font-semibold">
                                    {aula.totalExercicios}
                                  </p>
                                </div>
                              )}
                              {aula.estatisticas?.avaliacaoMedia && (
                                <div className="text-center">
                                  <p className="text-xs text-gray-400">
                                    Avaliação
                                  </p>
                                  <p className="text-white font-semibold">
                                    {aula.estatisticas.avaliacaoMedia.toFixed(
                                      1,
                                    )}{" "}
                                    ★
                                  </p>
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => handleVerAula(aula)}
                              className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-sm transition flex items-center gap-1"
                            >
                              <TbPlayerPlay className="w-3 h-3" /> Ver Aula
                            </button>
                          </div>
                          {aula.concluido && aula.certificadoGerado && (
                            <div className="mt-2 pt-2 border-t border-white/10">
                              <div className="flex items-center gap-2 text-green-400 text-xs">
                                <TbAward className="w-4 h-4" />{" "}
                                <span>Certificado disponível</span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white/10 rounded-xl p-12 text-center border border-white/20">
                      <TbBook className="w-16 h-16 text-yellow-500 mx-auto mb-4 opacity-50" />
                      <p className="text-gray-400">
                        Você ainda não está inscrito em nenhuma aula
                      </p>
                      <button
                        onClick={() => setActiveTab("disponiveis")}
                        className="mt-4 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition"
                      >
                        Ver Aulas Disponíveis
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Aulas Disponíveis */}
              {activeTab === "disponiveis" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <h2 className="text-2xl font-bold text-white">
                      Aulas Disponíveis
                    </h2>
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="relative">
                        <TbSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Buscar aula..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-9 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 text-sm"
                        />
                      </div>
                      <select
                        value={filterNivel}
                        onChange={(e) => setFilterNivel(e.target.value)}
                        className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500 text-sm"
                      >
                        <option value="todos" className="text-black">
                          Todos os níveis
                        </option>
                        <option value="iniciante" className="text-black">
                          Iniciante
                        </option>
                        <option value="intermediario" className="text-black">
                          Intermediário
                        </option>
                        <option value="avancado" className="text-black">
                          Avançado
                        </option>
                        <option value="mestre" className="text-black">
                          Mestre
                        </option>
                      </select>
                      <select
                        value={filterCategoria}
                        onChange={(e) => setFilterCategoria(e.target.value)}
                        className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500 text-sm"
                      >
                        <option value="todas" className="text-black">
                          Todas categorias
                        </option>
                        <option value="aberturas" className="text-black">
                          Aberturas
                        </option>
                        <option value="meio_jogo" className="text-black">
                          Meio Jogo
                        </option>
                        <option value="finais" className="text-black">
                          Finais
                        </option>
                        <option value="tatica" className="text-black">
                          Tática
                        </option>
                        <option value="estrategia" className="text-black">
                          Estratégia
                        </option>
                        <option value="analise_partidas" className="text-black">
                          Análise de Partidas
                        </option>
                        <option value="exercicios" className="text-black">
                          Exercícios
                        </option>
                      </select>
                      <button
                        onClick={async () => {
                          const membroId = localStorage.getItem("membroId");
                          if (membroId) await fetchAulasDisponiveis(membroId);
                        }}
                        className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
                      >
                        <TbRefresh className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {loadingDisponiveis ? (
                    <div className="flex justify-center py-12">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-yellow-500 border-t-transparent"></div>
                    </div>
                  ) : filteredAulasDisponiveis.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredAulasDisponiveis.map((aula, idx) => (
                        <div
                          key={idx}
                          className="bg-white/10 rounded-xl p-4 border border-white/20 hover:border-yellow-500/50 transition-all"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <h3 className="text-lg font-semibold text-white">
                                  {aula.titulo}
                                </h3>
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full ${getNivelColor(aula.nivel)}`}
                                >
                                  {aula.nivel}
                                </span>
                              </div>
                              <p className="text-sm text-gray-400 line-clamp-2">
                                {aula.descricao}
                              </p>
                              <div className="flex items-center gap-3 mt-2 flex-wrap">
                                <span className="text-xs text-gray-500">
                                  {getCategoriaText(aula.categoria)}
                                </span>
                                {aula.duracaoEstimada && (
                                  <span className="text-xs text-gray-500">
                                    ⏱️ {aula.duracaoEstimada} min
                                  </span>
                                )}
                                {aula.totalVideos && aula.totalVideos > 0 && (
                                  <span className="text-xs text-gray-500">
                                    🎬 {aula.totalVideos} vídeos
                                  </span>
                                )}
                                <span className="text-xs text-gray-500">
                                  👨‍🏫 {aula.formadorNome}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-3">
                              <div className="text-center">
                                <p className="text-xs text-gray-400">Alunos</p>
                                <p className="text-white font-semibold">
                                  {aula.estatisticas?.totalAlunosInscritos || 0}
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-xs text-gray-400">
                                  Avaliação
                                </p>
                                <p className="text-white font-semibold">
                                  {aula.estatisticas?.avaliacaoMedia?.toFixed(
                                    1,
                                  ) || 0}{" "}
                                  ★
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-xs text-gray-400">
                                  Visualizações
                                </p>
                                <p className="text-white font-semibold">
                                  {aula.visualizacoes || 0}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  handleVisualizarAulaDisponivel(aula)
                                }
                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition flex items-center gap-1"
                              >
                                <TbEye className="w-3 h-3" /> Visualizar
                              </button>
                              <button
                                onClick={() => handleInscreverAula(aula)}
                                className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded-lg text-sm transition flex items-center gap-1"
                              >
                                <TbPlus className="w-3 h-3" /> Inscrever
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white/10 rounded-xl p-12 text-center border border-white/20">
                      <TbBook className="w-16 h-16 text-yellow-500 mx-auto mb-4 opacity-50" />
                      <p className="text-gray-400">
                        {searchTerm
                          ? "Nenhuma aula encontrada com os filtros selecionados"
                          : "Nenhuma aula disponível no momento"}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Presenças */}
              {activeTab === "presencas" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">
                      Histórico de Presenças
                    </h2>
                    <div className="text-sm text-gray-400">
                      Média:{" "}
                      <span className="text-yellow-500 font-semibold">
                        {dashboardData.academico.presencaMedia.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                    <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                      {dashboardData.ultimasAtividades.presencas.map(
                        (presenca, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition"
                          >
                            <div className="flex items-center gap-3">
                              {presenca.presente ? (
                                <TbCheckbox className="w-5 h-5 text-green-400" />
                              ) : (
                                <TbClock className="w-5 h-5 text-red-400" />
                              )}
                              <div>
                                <p className="text-white">
                                  {presenca.cursoNome || "Aula de Xadrez"}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {new Date(presenca.data).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <span
                              className={`text-xs px-2 py-1 rounded ${presenca.presente ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
                            >
                              {presenca.presente ? "Presente" : "Falta"}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Financeiro */}
              {activeTab === "financeiro" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">
                      Histórico Financeiro
                    </h2>
                    <button
                      onClick={() => setShowPaymentModal(true)}
                      className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-sm font-semibold transition flex items-center gap-2"
                    >
                      <TbCreditCard className="w-4 h-4" /> Registrar Pagamento
                    </button>
                  </div>

                  <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                    <div className="space-y-3">
                      {dashboardData.ultimasAtividades.pagamentos.map(
                        (pagamento, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition"
                          >
                            <div>
                              <p className="font-semibold text-white">
                                {pagamento.valor} MZN
                              </p>
                              <p className="text-sm text-gray-400">
                                {new Date(
                                  pagamento.dataPagamento,
                                ).toLocaleString()}
                              </p>
                            </div>
                            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                              Confirmado
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="bg-yellow-600/10 rounded-xl p-4 border border-yellow-500/30">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <TbInfoCircle className="w-5 h-5 text-yellow-500" />
                      Informações Importantes
                    </h3>
                    <div className="space-y-2 text-sm text-gray-300">
                      <p>
                        • Cota mensal:{" "}
                        <span className="text-yellow-500 font-semibold">
                          250 MZN
                        </span>
                      </p>
                      <p>
                        • Pagamentos podem ser feitos via: Dinheiro, M-Pesa,
                        E-mola, Transferência
                      </p>
                      <p>
                        • Após 3 meses de inadimplência, o acesso é bloqueado
                      </p>
                      <p>• Para mais informações, contacte a tesouraria</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Desempenho */}
              {activeTab === "desempenho" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white">
                    Estatísticas de Desempenho
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-xl p-6 border border-white/20 text-center">
                      <TbTrophy className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                      <p className="text-gray-400 text-sm">Total de Partidas</p>
                      <p className="text-4xl font-bold text-white">
                        {dashboardData.desempenho.totalPartidas}
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-6 border border-white/20 text-center">
                      <TbTarget className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                      <p className="text-gray-400 text-sm">Taxa de Vitórias</p>
                      <p className="text-4xl font-bold text-white">
                        {dashboardData.desempenho.taxaVitorias}%
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-600/20 to-yellow-800/20 rounded-xl p-6 border border-yellow-500/30 text-center">
                    <p className="text-gray-400 text-sm mb-2">Rating Atual</p>
                    <p className="text-5xl font-bold text-white">
                      {dashboardData.dadosPessoais.rating.pontuacao}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      Tipo: {dashboardData.dadosPessoais.rating.tipo}
                    </p>
                  </div>
                </div>
              )}

              {/* Conquistas */}
              {activeTab === "conquistas" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">
                      Minhas Conquistas
                    </h2>
                    <div className="text-sm text-gray-400">
                      Nível{" "}
                      <span className="text-yellow-500 font-bold text-xl">
                        {dashboardData.gamificacao.nivel}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dashboardData.gamificacao.insignias.map(
                      (insignia, idx) => (
                        <div
                          key={idx}
                          className="bg-white/10 rounded-xl p-4 border border-white/20 flex items-center gap-4 hover:border-yellow-500/50 transition-all"
                        >
                          <div className="w-16 h-16 bg-gradient-to-br from-yellow-500/20 to-yellow-700/20 rounded-full flex items-center justify-center">
                            <TbAward className="w-8 h-8 text-yellow-500" />
                          </div>
                          <div>
                            <p className="font-semibold text-white">
                              {insignia.nome}
                            </p>
                            <p className="text-sm text-gray-400">
                              {insignia.descricao}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(
                                insignia.dataConquista,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ),
                    )}
                  </div>

                  <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">
                        Progresso para o próximo nível
                      </span>
                      <span className="text-yellow-500">
                        {dashboardData.gamificacao.pontos % 100}/100 pts
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className="bg-yellow-500 rounded-full h-2 transition-all duration-500"
                        style={{
                          width: `${dashboardData.gamificacao.pontos % 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Perfil */}
              {activeTab === "perfil" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">
                      Meu Perfil
                    </h2>
                    <button
                      onClick={() => setEditingPerfil(!editingPerfil)}
                      className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition"
                    >
                      <TbEdit className="w-4 h-4" />{" "}
                      {editingPerfil ? "Cancelar" : "Editar"}
                    </button>
                  </div>

                  {editingPerfil ? (
                    <form
                      onSubmit={handleUpdatePerfil}
                      className="bg-white/10 rounded-xl p-6 border border-white/20"
                    >
                      <div className="space-y-4">
                        <div>
                          <label className="block text-gray-300 mb-2 text-sm">
                            Telefone
                          </label>
                          <input
                            type="tel"
                            value={perfilData?.telefone || ""}
                            onChange={(e) =>
                              setPerfilData((prev) => ({
                                ...prev!,
                                telefone: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 mb-2 text-sm">
                            Endereço
                          </label>
                          <input
                            type="text"
                            value={perfilData?.endereco || ""}
                            onChange={(e) =>
                              setPerfilData((prev) => ({
                                ...prev!,
                                endereco: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                            placeholder="Rua/Avenida"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 mb-2 text-sm">
                            Bairro
                          </label>
                          <input
                            type="text"
                            value={perfilData?.bairro || ""}
                            onChange={(e) =>
                              setPerfilData((prev) => ({
                                ...prev!,
                                bairro: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-gray-300 mb-2 text-sm">
                              Cidade
                            </label>
                            <input
                              type="text"
                              value={perfilData?.cidade || ""}
                              onChange={(e) =>
                                setPerfilData((prev) => ({
                                  ...prev!,
                                  cidade: e.target.value,
                                }))
                              }
                              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-300 mb-2 text-sm">
                              Província
                            </label>
                            <input
                              type="text"
                              value={perfilData?.provincia || ""}
                              onChange={(e) =>
                                setPerfilData((prev) => ({
                                  ...prev!,
                                  provincia: e.target.value,
                                }))
                              }
                              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                            />
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="w-full mt-4 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition font-semibold"
                        >
                          Salvar Alterações
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                          <TbUser className="w-5 h-5 text-yellow-500" />
                          <div>
                            <p className="text-gray-400 text-sm">
                              Nome Completo
                            </p>
                            <p className="text-white">
                              {perfilData?.nomeCompleto}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                          <TbMail className="w-5 h-5 text-yellow-500" />
                          <div>
                            <p className="text-gray-400 text-sm">Email</p>
                            <p className="text-white">{perfilData?.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                          <TbPhone className="w-5 h-5 text-yellow-500" />
                          <div>
                            <p className="text-gray-400 text-sm">Telefone</p>
                            <p className="text-white">
                              {perfilData?.telefone || "Não informado"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                          <TbId className="w-5 h-5 text-yellow-500" />
                          <div>
                            <p className="text-gray-400 text-sm">BI/NU</p>
                            <p className="text-white">{perfilData?.bi}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                          <TbCalendarEvent className="w-5 h-5 text-yellow-500" />
                          <div>
                            <p className="text-gray-400 text-sm">
                              Data de Nascimento
                            </p>
                            <p className="text-white">
                              {perfilData?.dataNascimento}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                          <TbMapPin className="w-5 h-5 text-yellow-500" />
                          <div>
                            <p className="text-gray-400 text-sm">Endereço</p>
                            <p className="text-white">
                              {perfilData?.endereco &&
                                `${perfilData.endereco}, `}
                              {perfilData?.bairro && `${perfilData.bairro}, `}
                              {perfilData?.cidade}, {perfilData?.provincia}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Pagamento */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4 border border-yellow-500/30">
            <h3 className="text-xl font-bold text-white mb-4">
              Registrar Pagamento
            </h3>
            <form onSubmit={handleRegisterPayment} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2 text-sm">
                  Valor (MZN)
                </label>
                <input
                  type="number"
                  value={paymentData.valor}
                  onChange={(e) =>
                    setPaymentData({
                      ...paymentData,
                      valor: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2 text-sm">
                  Forma de Pagamento
                </label>
                <select
                  value={paymentData.formaPagamento}
                  onChange={(e) =>
                    setPaymentData({
                      ...paymentData,
                      formaPagamento: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                >
                  <option value="M-Pesa" className="text-black">
                    M-Pesa
                  </option>
                  <option value="E-mola" className="text-black">
                    E-mola
                  </option>
                  <option value="dinheiro" className="text-black">
                    Dinheiro
                  </option>
                  <option value="transferencia" className="text-black">
                    Transferência Bancária
                  </option>
                  <option value="multicaixa" className="text-black">
                    Multicaixa
                  </option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 mb-2 text-sm">
                  Referência/Nº Transação
                </label>
                <input
                  type="text"
                  value={paymentData.referencia}
                  onChange={(e) =>
                    setPaymentData({
                      ...paymentData,
                      referencia: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  placeholder="Código da transação"
                  required
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition font-semibold"
                >
                  Confirmar Pagamento
                </button>
              </div>
            </form>
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