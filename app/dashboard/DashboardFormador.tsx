/* eslint-disable @typescript-eslint/no-explicit-any */
// app/dashboard/DashboardFormador.tsx
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
  TbStar,
  TbCoin,
  TbClock,
  TbUser,
  TbEye,
  TbX,
  TbTrendingUp,
  TbSearch,
  TbBook,
  TbPlus,
  TbChartLine,
  TbTrash,
  TbVideo,
  TbPhoto,
  TbFileText,
  TbAward,
  TbCategory,
  TbTag,
} from "react-icons/tb";

const BASE_URL = "https://desktop-api-4f850b3f9733.herokuapp.com";

interface Exercicio {
  exercicioId?: string;
  titulo: string;
  descricao: string;
  tipo: string;
  configuracaoTabuleiro: {
    fenInicial: string;
    orientacao: "white" | "black";
  };
  nivel: string;
  pontos: number;
  solucao?: {
    movimentos: Array<{ ordem: number; from: string; to: string; notacao: string }>;
    explicacao?: string;
  };
}

interface PosicaoXadrez {
  posicaoId?: string;
  titulo: string;
  descricao: string;
  fen: string;
  movimentos?: Array<{ notacao: string; from: string; to: string; comentario?: string }>;
}

interface Aula {
  aulaId: string;
  titulo: string;
  subtitulo?: string;
  descricao: string;
  categoria: string;
  subcategoria?: string;
  nivel: string;
  status: string;
  visualizacoes: number;
  totalExercicios?: number;
  totalVideos?: number;
  totalImagens?: number;
  duracaoEstimada?: number;
  estatisticas: {
    totalAlunosInscritos: number;
    totalConcluintes: number;
    avaliacaoMedia: number;
    taxaConclusao?: number;
  };
  conteudo?: {
    textoExplicativo: string;
    imagens: Array<{ url: string; titulo: string; descricao?: string }>;
    videos: Array<{ url: string; titulo: string; duracao: number; plataforma?: string }>;
    materiais: Array<{ url: string; nome: string; tipo?: string }>;
    posicoesXadrez?: PosicaoXadrez[];
  };
  exercicios?: Exercicio[];
  tags?: string[];
  dataCriacao: string;
  dataPublicacao?: string;
  formadorId: string;
  formadorNome: string;
}

interface FormadorDashboard {
  dadosPessoais: {
    nome: string;
    matricula: string;
    especializacao: string;
  };
  turmas: {
    atuais: Array<{
      turmaId: string;
      nome: string;
      totalAlunos: number;
      horario: string;
    }>;
    totalAlunos: number;
  };
  desempenho: {
    avaliacaoMedia: number;
    totalAvaliacoes: number;
    taxaAprovacaoAlunos: number;
  };
  alunos: Array<{
    id: string;
    nome: string;
    nivel: string;
    progresso: number;
    presenca: number;
  }>;
  financeiro: {
    remuneracao: {
      tipo: string;
      valor: number;
    };
    ultimoPagamento: string;
  };
}

interface AlunoDetalhe {
  membroId: string;
  nomeCompleto: string;
  matricula: string;
  email: string;
  telefone: string;
  nivelXadrez: string;
  rating: number;
  presencas: Array<{ data: string; presente: boolean }>;
  avaliacoes: Array<{ nota: number; comentario: string; data: string }>;
}

interface EstatisticasAulas {
  totalAulas: number;
  totalPublicadas: number;
  totalVisualizacoes: number;
  totalAlunos: number;
  totalConcluintes: number;
  avaliacaoMedia: number;
  totalExercicios: number;
  taxaAcertoMedia: number;
}

export default function DashboardFormador() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<FormadorDashboard | null>(null);
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [estatisticasAulas, setEstatisticasAulas] = useState<EstatisticasAulas | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAluno, setSelectedAluno] = useState<AlunoDetalhe | null>(null);
  const [showAlunoModal, setShowAlunoModal] = useState(false);
  const [showAvaliacaoModal, setShowAvaliacaoModal] = useState(false);
  const [avaliacaoData, setAvaliacaoData] = useState({
    alunoId: "",
    alunoNome: "",
    nota: 5,
    comentario: "",
  });
  const [notification, setNotification] = useState<{ type: string; message: string } | null>(null);
  const [showPresencaModal, setShowPresencaModal] = useState(false);
  const [presencaForm, setPresencaForm] = useState({
    alunoId: "",
    alunoNome: "",
    cursoNome: "",
    duracaoHoras: 1,
    conteudo: "",
    presente: true,
  });
  
  // Estados para gestão de aulas
  const [showAulaModal, setShowAulaModal] = useState(false);
  const [editingAula, setEditingAula] = useState<Aula | null>(null);
  const [aulaForm, setAulaForm] = useState({
    titulo: "",
    subtitulo: "",
    descricao: "",
    categoria: "tatica",
    subcategoria: "",
    nivel: "iniciante",
    conteudo: {
      textoExplicativo: "",
      imagens: [] as Array<{ url: string; titulo: string; descricao: string }>,
      videos: [] as Array<{ url: string; titulo: string; descricao: string; duracao: number; plataforma: string }>,
      materiais: [] as Array<{ url: string; nome: string; tipo: string }>,
      posicoesXadrez: [] as PosicaoXadrez[],
    },
    exercicios: [] as Exercicio[],
    duracaoEstimada: 60,
    tags: [] as string[],
    visibilidade: "publico" as "publico" | "alunos" | "turma" | "privado",
  });
  const [novaTag, setNovaTag] = useState("");
  
  // Estados para formulários de conteúdo
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [showImagemForm, setShowImagemForm] = useState(false);
  const [showMaterialForm, setShowMaterialForm] = useState(false);
  const [showPosicaoForm, setShowPosicaoForm] = useState(false);
  const [showExercicioForm, setShowExercicioForm] = useState(false);
  
  // Dados temporários para formulários
  const [novoVideo, setNovoVideo] = useState({ url: "", titulo: "", duracao: 0, plataforma: "youtube", descricao: "" });
  const [novaImagem, setNovaImagem] = useState({ url: "", titulo: "", descricao: "" });
  const [novoMaterial, setNovoMaterial] = useState({ url: "", nome: "", tipo: "" });
  const [novaPosicao, setNovaPosicao] = useState<PosicaoXadrez>({ titulo: "", descricao: "", fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", movimentos: [] });
  const [novoExercicio, setNovoExercicio] = useState<Exercicio>({
    titulo: "",
    descricao: "",
    tipo: "tatica",
    configuracaoTabuleiro: {
      fenInicial: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      orientacao: "white",
    },
    nivel: "medio",
    pontos: 10,
    solucao: { movimentos: [], explicacao: "" },
  });
  const [novoMovimentoSolucao, setNovoMovimentoSolucao] = useState({ from: "", to: "", notacao: "" });

  useEffect(() => {
    const fetchData = async () => {
      const membroId = localStorage.getItem("membroId");
      
      if (!membroId) {
        router.push("/login");
        return;
      }

      try {
        // Buscar dashboard do formador
        const dashboardResponse = await fetch(`${BASE_URL}/getDashboardFormador`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ membroId }),
        });
        const dashboardResult = await dashboardResponse.json();
        
        if (dashboardResult.returnCode === 200) {
          setDashboardData(dashboardResult.data);
        }

        // Buscar estatísticas das aulas do formador
        const statsResponse = await fetch(`${BASE_URL}/getFormadorAulasDashboard`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ formadorId: membroId }),
        });
        const statsResult = await statsResponse.json();
        
        if (statsResult.returnCode === 200) {
          setEstatisticasAulas(statsResult.data.estatisticas);
        }

        // Buscar aulas do formador
        await fetchAulas(membroId);
        
      } catch (error) {
        console.error("Error fetching data:", error);
        showNotification("error", "Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const fetchAulas = async (membroId: string) => {
    try {
      const aulasResponse = await fetch(`${BASE_URL}/getAulaList`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formadorId: membroId, pageSize: 50 }),
      });
      const aulasResult = await aulasResponse.json();
      
      if (aulasResult.returnCode === 200) {
        setAulas(aulasResult.data.list);
      }
    } catch (error) {
      console.error("Error fetching aulas:", error);
      showNotification("error", "Erro ao carregar aulas");
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

  const fetchAlunoDetalhes = async (alunoId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/getMembroDetail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ membroId: alunoId }),
      });

      const result = await response.json();
      
      if (result.returnCode === 200) {
        const aluno = result.data;
        setSelectedAluno({
          membroId: aluno.membroId,
          nomeCompleto: aluno.nomeCompleto,
          matricula: aluno.matricula,
          email: aluno.contato.email,
          telefone: aluno.contato.telefone,
          nivelXadrez: aluno.aluno?.nivelXadrez || "iniciante",
          rating: aluno.aluno?.rating?.pontuacao || 0,
          presencas: aluno.presencas?.slice(-10).reverse() || [],
          avaliacoes: aluno.avaliacoes?.filter((a: any) => a.para?.id === localStorage.getItem("membroId")) || [],
        });
        setShowAlunoModal(true);
      }
    } catch (error) {
      console.error("Error fetching aluno details:", error);
      showNotification("error", "Erro ao carregar detalhes do aluno");
    }
  };

  const handleRegistrarPresenca = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${BASE_URL}/registerPresenca`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          membroId: presencaForm.alunoId,
          presencaData: {
            data: new Date().toISOString(),
            tipo: "aula_pratica",
            cursoNome: presencaForm.cursoNome,
            formadorId: localStorage.getItem("membroId"),
            formadorNome: localStorage.getItem("nomeCompleto"),
            duracaoHoras: presencaForm.duracaoHoras,
            conteudo: presencaForm.conteudo,
            presente: presencaForm.presente,
          }
        }),
      });

      const result = await response.json();
      
      if (result.returnCode === 200) {
        showNotification("success", `Presença ${presencaForm.presente ? "registrada" : "registrada como falta"} com sucesso!`);
        setShowPresencaModal(false);
        setPresencaForm({
          alunoId: "",
          alunoNome: "",
          cursoNome: "",
          duracaoHoras: 1,
          conteudo: "",
          presente: true,
        });
      } else {
        showNotification("error", result.returnMsg || "Erro ao registrar presença");
      }
    } catch (error) {
      showNotification("error", "Erro de conexão com o servidor");
    }
  };

  const handleRegistrarAvaliacao = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${BASE_URL}/registrarAvaliacao`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          membroId: localStorage.getItem("membroId"),
          avaliacaoData: {
            tipo: "formador_para_aluno",
            para: {
              id: avaliacaoData.alunoId,
              nome: avaliacaoData.alunoNome,
            },
            nota: avaliacaoData.nota,
            comentario: avaliacaoData.comentario,
          }
        }),
      });

      const result = await response.json();
      
      if (result.returnCode === 200) {
        showNotification("success", "Avaliação registrada com sucesso!");
        setShowAvaliacaoModal(false);
        setAvaliacaoData({
          alunoId: "",
          alunoNome: "",
          nota: 5,
          comentario: "",
        });
      } else {
        showNotification("error", result.returnMsg || "Erro ao registrar avaliação");
      }
    } catch (error) {
      showNotification("error", "Erro de conexão com o servidor");
    }
  };

  // CRUD de Aulas
  const handleCriarAula = async (e: React.FormEvent) => {
    e.preventDefault();
    const formadorId = localStorage.getItem("membroId");
    
    try {
      const response = await fetch(`${BASE_URL}/createAula`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...aulaForm,
          formadorId,
          status: "rascunho",
        }),
      });

      const result = await response.json();
      
      if (result.returnCode === 201) {
        showNotification("success", "Aula criada com sucesso!");
        setShowAulaModal(false);
        resetAulaForm();
        await fetchAulas(formadorId!);
      } else {
        showNotification("error", result.returnMsg || "Erro ao criar aula");
      }
    } catch (error) {
      console.error("Error creating aula:", error);
      showNotification("error", "Erro de conexão com o servidor");
    }
  };

  const resetAulaForm = () => {
    setAulaForm({
      titulo: "",
      subtitulo: "",
      descricao: "",
      categoria: "tatica",
      subcategoria: "",
      nivel: "iniciante",
      conteudo: {
        textoExplicativo: "",
        imagens: [],
        videos: [],
        materiais: [],
        posicoesXadrez: [],
      },
      exercicios: [],
      duracaoEstimada: 60,
      tags: [],
      visibilidade: "publico",
    });
    setNovaTag("");
    setNovoVideo({ url: "", titulo: "", duracao: 0, plataforma: "youtube", descricao: "" });
    setNovaImagem({ url: "", titulo: "", descricao: "" });
    setNovoMaterial({ url: "", nome: "", tipo: "" });
    setNovaPosicao({ titulo: "", descricao: "", fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", movimentos: [] });
    setNovoExercicio({
      titulo: "",
      descricao: "",
      tipo: "tatica",
      configuracaoTabuleiro: {
        fenInicial: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        orientacao: "white",
      },
      nivel: "medio",
      pontos: 10,
      solucao: { movimentos: [], explicacao: "" },
    });
    setShowVideoForm(false);
    setShowImagemForm(false);
    setShowMaterialForm(false);
    setShowPosicaoForm(false);
    setShowExercicioForm(false);
  };

  const handlePublicarAula = async (aulaId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/publishAula`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aulaId }),
      });

      const result = await response.json();
      
      if (result.returnCode === 200) {
        showNotification("success", "Aula publicada com sucesso!");
        const formadorId = localStorage.getItem("membroId");
        await fetchAulas(formadorId!);
      } else {
        showNotification("error", result.returnMsg || "Erro ao publicar aula");
      }
    } catch (error) {
      showNotification("error", "Erro de conexão com o servidor");
    }
  };

  const handleArquivarAula = async (aulaId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/archiveAula`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aulaId }),
      });

      const result = await response.json();
      
      if (result.returnCode === 200) {
        showNotification("success", "Aula arquivada com sucesso!");
        const formadorId = localStorage.getItem("membroId");
        await fetchAulas(formadorId!);
      } else {
        showNotification("error", result.returnMsg || "Erro ao arquivar aula");
      }
    } catch (error) {
      showNotification("error", "Erro de conexão com o servidor");
    }
  };

  // Funções para adicionar conteúdo
  const handleAdicionarTag = () => {
    if (novaTag && !aulaForm.tags.includes(novaTag)) {
      setAulaForm({ ...aulaForm, tags: [...aulaForm.tags, novaTag] });
      setNovaTag("");
    }
  };

  const handleRemoverTag = (tag: string) => {
    setAulaForm({ ...aulaForm, tags: aulaForm.tags.filter(t => t !== tag) });
  };

  const handleAdicionarVideo = () => {
    if (novoVideo.url && novoVideo.titulo) {
      setAulaForm({
        ...aulaForm,
        conteudo: {
          ...aulaForm.conteudo,
          videos: [...aulaForm.conteudo.videos, { ...novoVideo, descricao: novoVideo.descricao || "" }],
        },
      });
      setNovoVideo({ url: "", titulo: "", duracao: 0, plataforma: "youtube", descricao: "" });
      setShowVideoForm(false);
      showNotification("success", "Vídeo adicionado!");
    }
  };

  const handleRemoverVideo = (index: number) => {
    const novosVideos = [...aulaForm.conteudo.videos];
    novosVideos.splice(index, 1);
    setAulaForm({
      ...aulaForm,
      conteudo: { ...aulaForm.conteudo, videos: novosVideos },
    });
  };

  const handleAdicionarImagem = () => {
    if (novaImagem.url && novaImagem.titulo) {
      setAulaForm({
        ...aulaForm,
        conteudo: {
          ...aulaForm.conteudo,
          imagens: [...aulaForm.conteudo.imagens, novaImagem],
        },
      });
      setNovaImagem({ url: "", titulo: "", descricao: "" });
      setShowImagemForm(false);
      showNotification("success", "Imagem adicionada!");
    }
  };

  const handleRemoverImagem = (index: number) => {
    const novasImagens = [...aulaForm.conteudo.imagens];
    novasImagens.splice(index, 1);
    setAulaForm({
      ...aulaForm,
      conteudo: { ...aulaForm.conteudo, imagens: novasImagens },
    });
  };

  const handleAdicionarMaterial = () => {
    if (novoMaterial.url && novoMaterial.nome) {
      setAulaForm({
        ...aulaForm,
        conteudo: {
          ...aulaForm.conteudo,
          materiais: [...aulaForm.conteudo.materiais, novoMaterial],
        },
      });
      setNovoMaterial({ url: "", nome: "", tipo: "" });
      setShowMaterialForm(false);
      showNotification("success", "Material adicionado!");
    }
  };

  const handleRemoverMaterial = (index: number) => {
    const novosMateriais = [...aulaForm.conteudo.materiais];
    novosMateriais.splice(index, 1);
    setAulaForm({
      ...aulaForm,
      conteudo: { ...aulaForm.conteudo, materiais: novosMateriais },
    });
  };

  const handleAdicionarPosicao = () => {
    if (novaPosicao.titulo && novaPosicao.fen) {
      setAulaForm({
        ...aulaForm,
        conteudo: {
          ...aulaForm.conteudo,
          posicoesXadrez: [...aulaForm.conteudo.posicoesXadrez, { ...novaPosicao, posicaoId: `POS-${Date.now()}` }],
        },
      });
      setNovaPosicao({ titulo: "", descricao: "", fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", movimentos: [] });
      setShowPosicaoForm(false);
      showNotification("success", "Posição de xadrez adicionada!");
    }
  };

  const handleRemoverPosicao = (index: number) => {
    const novasPosicoes = [...aulaForm.conteudo.posicoesXadrez];
    novasPosicoes.splice(index, 1);
    setAulaForm({
      ...aulaForm,
      conteudo: { ...aulaForm.conteudo, posicoesXadrez: novasPosicoes },
    });
  };

  const handleAdicionarExercicio = () => {
    if (novoExercicio.titulo && novoExercicio.descricao) {
      setAulaForm({
        ...aulaForm,
        exercicios: [...aulaForm.exercicios, { ...novoExercicio, exercicioId: `EX-${Date.now()}` }],
      });
      setNovoExercicio({
        titulo: "",
        descricao: "",
        tipo: "tatica",
        configuracaoTabuleiro: {
          fenInicial: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
          orientacao: "white",
        },
        nivel: "medio",
        pontos: 10,
        solucao: { movimentos: [], explicacao: "" },
      });
      setShowExercicioForm(false);
      showNotification("success", "Exercício adicionado!");
    }
  };

  const handleRemoverExercicio = (index: number) => {
    const novosExercicios = [...aulaForm.exercicios];
    novosExercicios.splice(index, 1);
    setAulaForm({ ...aulaForm, exercicios: novosExercicios });
  };

  const handleAdicionarMovimentoSolucao = () => {
    if (novoMovimentoSolucao.from && novoMovimentoSolucao.to) {
      const novoMov = {
        ordem: (novoExercicio.solucao?.movimentos.length || 0) + 1,
        from: novoMovimentoSolucao.from,
        to: novoMovimentoSolucao.to,
        notacao: novoMovimentoSolucao.notacao || `${novoMovimentoSolucao.from}-${novoMovimentoSolucao.to}`,
      };
      setNovoExercicio({
        ...novoExercicio,
        solucao: {
          ...novoExercicio.solucao!,
          movimentos: [...(novoExercicio.solucao?.movimentos || []), novoMov],
        },
      });
      setNovoMovimentoSolucao({ from: "", to: "", notacao: "" });
    }
  };

  const handleRemoverMovimentoSolucao = (index: number) => {
    const novosMovimentos = [...(novoExercicio.solucao?.movimentos || [])];
    novosMovimentos.splice(index, 1);
    // Reordenar
    novosMovimentos.forEach((mov, idx) => { mov.ordem = idx + 1; });
    setNovoExercicio({
      ...novoExercicio,
      solucao: { ...novoExercicio.solucao!, movimentos: novosMovimentos },
    });
  };

  const filteredAlunos = dashboardData?.alunos.filter(aluno =>
    aluno.nome.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "publicado": return "text-green-400 bg-green-500/20";
      case "rascunho": return "text-yellow-400 bg-yellow-500/20";
      case "arquivado": return "text-gray-400 bg-gray-500/20";
      case "em_revisao": return "text-blue-400 bg-blue-500/20";
      default: return "text-gray-400 bg-gray-500/20";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "publicado": return "Publicado";
      case "rascunho": return "Rascunho";
      case "arquivado": return "Arquivado";
      case "em_revisao": return "Em Revisão";
      default: return status;
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
            <p className="mt-4 text-gray-400">Carregando dashboard...</p>
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
            <TbUser className="w-6 h-6 text-white" />
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
                  <h3 className="text-white font-semibold">{dashboardData.dadosPessoais.nome}</h3>
                  <p className="text-sm text-gray-400">Formador • {dashboardData.dadosPessoais.especializacao || "Não definida"}</p>
                  <p className="text-xs text-gray-500 mt-1">{dashboardData.dadosPessoais.matricula}</p>
                </div>

                <div className="space-y-2">
                  <button onClick={() => { setActiveTab("overview"); setSidebarOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10">
                    <TbChartBar className="w-5 h-5" />
                    <span>Visão Geral</span>
                  </button>
                  <button onClick={() => { setActiveTab("aulas"); setSidebarOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10">
                    <TbBook className="w-5 h-5" />
                    <span>Minhas Aulas</span>
                  </button>
                  <button onClick={() => { setActiveTab("turmas"); setSidebarOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10">
                    <TbSchool className="w-5 h-5" />
                    <span>Minhas Turmas</span>
                  </button>
                  <button onClick={() => { setActiveTab("alunos"); setSidebarOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10">
                    <TbUsers className="w-5 h-5" />
                    <span>Meus Alunos</span>
                  </button>
                  <button onClick={() => { setActiveTab("financeiro"); setSidebarOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10">
                    <TbCoin className="w-5 h-5" />
                    <span>Financeiro</span>
                  </button>
                  <button onClick={() => { setActiveTab("avaliacoes"); setSidebarOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10">
                    <TbStar className="w-5 h-5" />
                    <span>Avaliações</span>
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
                    <h1 className="text-2xl font-bold text-white mb-2">Olá, Professor {dashboardData.dadosPessoais.nome.split(" ")[0]}!</h1>
                    <p className="text-gray-300">Continue inspirando e ensinando xadrez. Seu trabalho é fundamental para o clube!</p>
                    <p className="text-xs text-gray-400 mt-2">Último acesso: {new Date().toLocaleString()}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white/10 rounded-xl p-4 border border-white/20 hover:border-yellow-500/50 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <TbUsers className="w-6 h-6 text-yellow-500" />
                      </div>
                      <p className="text-2xl font-bold text-white">{dashboardData.turmas.totalAlunos}</p>
                      <p className="text-sm text-gray-400">Total de Alunos</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 border border-white/20 hover:border-yellow-500/50 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <TbSchool className="w-6 h-6 text-yellow-500" />
                      </div>
                      <p className="text-2xl font-bold text-white">{dashboardData.turmas.atuais.length}</p>
                      <p className="text-sm text-gray-400">Turmas Ativas</p>
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
                        <TbStar className="w-6 h-6 text-yellow-500" />
                      </div>
                      <p className="text-2xl font-bold text-white">{dashboardData.desempenho.avaliacaoMedia.toFixed(1)} ★</p>
                      <p className="text-sm text-gray-400">Avaliação Média</p>
                    </div>
                  </div>

                  {/* Estatísticas das Aulas */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <TbChartLine className="w-5 h-5 text-yellow-500" />
                        Estatísticas das Aulas
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between p-2 bg-white/5 rounded-lg">
                          <span className="text-gray-300">Total de Aulas</span>
                          <span className="text-white font-semibold">{estatisticasAulas?.totalAulas || 0}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-white/5 rounded-lg">
                          <span className="text-gray-300">Aulas Publicadas</span>
                          <span className="text-white font-semibold">{estatisticasAulas?.totalPublicadas || 0}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-white/5 rounded-lg">
                          <span className="text-gray-300">Total de Visualizações</span>
                          <span className="text-white font-semibold">{estatisticasAulas?.totalVisualizacoes || 0}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-white/5 rounded-lg">
                          <span className="text-gray-300">Total de Alunos Inscritos</span>
                          <span className="text-white font-semibold">{estatisticasAulas?.totalAlunos || 0}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-white/5 rounded-lg">
                          <span className="text-gray-300">Total de Exercícios</span>
                          <span className="text-white font-semibold">{estatisticasAulas?.totalExercicios || 0}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <TbTrendingUp className="w-5 h-5 text-yellow-500" />
                        Desempenho dos Alunos
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between p-2 bg-white/5 rounded-lg">
                          <span className="text-gray-300">Taxa de Aprovação</span>
                          <span className="text-white font-semibold">{dashboardData.desempenho.taxaAprovacaoAlunos}%</span>
                        </div>
                        <div className="flex justify-between p-2 bg-white/5 rounded-lg">
                          <span className="text-gray-300">Taxa de Conclusão</span>
                          <span className="text-white font-semibold">
                            {estatisticasAulas?.totalAlunos ? 
                              ((estatisticasAulas.totalConcluintes / estatisticasAulas.totalAlunos) * 100).toFixed(1) : 0}%
                          </span>
                        </div>
                        <div className="flex justify-between p-2 bg-white/5 rounded-lg">
                          <span className="text-gray-300">Taxa de Acerto em Exercícios</span>
                          <span className="text-white font-semibold">{estatisticasAulas?.taxaAcertoMedia?.toFixed(1) || 0}%</span>
                        </div>
                        <div className="mt-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Taxa de Aprovação</span>
                            <span className="text-yellow-500">{dashboardData.desempenho.taxaAprovacaoAlunos}%</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div
                              className="bg-yellow-500 rounded-full h-2 transition-all duration-500"
                              style={{ width: `${dashboardData.desempenho.taxaAprovacaoAlunos}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Turmas Atuais */}
                  <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <TbSchool className="w-5 h-5 text-yellow-500" />
                      Minhas Turmas
                    </h3>
                    <div className="space-y-3">
                      {dashboardData.turmas.atuais.map((turma) => (
                        <div key={turma.turmaId} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition">
                          <div>
                            <p className="text-white font-semibold">{turma.nome}</p>
                            <p className="text-xs text-gray-400">{turma.totalAlunos} alunos</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <TbClock className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-300">{turma.horario}</span>
                          </div>
                        </div>
                      ))}
                      {dashboardData.turmas.atuais.length === 0 && (
                        <p className="text-gray-400 text-center py-4">Nenhuma turma atribuída</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Minhas Aulas */}
              {activeTab === "aulas" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <h2 className="text-2xl font-bold text-white">Minhas Aulas</h2>
                    <button
                      onClick={() => {
                        setEditingAula(null);
                        resetAulaForm();
                        setShowAulaModal(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition"
                    >
                      <TbPlus className="w-4 h-4" />
                      Nova Aula
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {aulas.map((aula) => (
                      <div key={aula.aulaId} className="bg-white/10 rounded-xl p-4 border border-white/20 hover:border-yellow-500/50 transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <h3 className="text-lg font-semibold text-white">{aula.titulo}</h3>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(aula.status)}`}>
                                {getStatusText(aula.status)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-400 line-clamp-2">{aula.descricao}</p>
                            <div className="flex items-center gap-3 mt-2 flex-wrap">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${getNivelColor(aula.nivel)}`}>
                                {aula.nivel}
                              </span>
                              <span className="text-xs text-gray-500">{getCategoriaText(aula.categoria)}</span>
                              <span className="text-xs text-gray-500">👁️ {aula.visualizacoes}</span>
                              {aula.duracaoEstimada && (
                                <span className="text-xs text-gray-500">⏱️ {aula.duracaoEstimada} min</span>
                              )}
                            </div>
                            {aula.tags && aula.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {aula.tags.slice(0, 3).map((tag, idx) => (
                                  <span key={idx} className="text-xs text-gray-500">#{tag}</span>
                                ))}
                                {aula.tags.length > 3 && (
                                  <span className="text-xs text-gray-500">+{aula.tags.length - 3}</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-white/10">
                          <div className="flex items-center gap-3">
                            {aula.totalVideos !== undefined && (
                              <div className="text-center">
                                <p className="text-xs text-gray-400">Vídeos</p>
                                <p className="text-white font-semibold">{aula.totalVideos || 0}</p>
                              </div>
                            )}
                            {aula.totalImagens !== undefined && (
                              <div className="text-center">
                                <p className="text-xs text-gray-400">Imagens</p>
                                <p className="text-white font-semibold">{aula.totalImagens || 0}</p>
                              </div>
                            )}
                            <div className="text-center">
                              <p className="text-xs text-gray-400">Exercícios</p>
                              <p className="text-white font-semibold">{aula.totalExercicios || 0}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-gray-400">Alunos</p>
                              <p className="text-white font-semibold">{aula.estatisticas?.totalAlunosInscritos || 0}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-gray-400">Avaliação</p>
                              <p className="text-white font-semibold">{aula.estatisticas?.avaliacaoMedia?.toFixed(1) || 0} ★</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {aula.status === "rascunho" && (
                              <button
                                onClick={() => handlePublicarAula(aula.aulaId)}
                                className="px-2 py-1 bg-green-600 hover:bg-green-700 rounded-lg text-xs transition"
                              >
                                Publicar
                              </button>
                            )}
                            {aula.status === "publicado" && (
                              <button
                                onClick={() => handleArquivarAula(aula.aulaId)}
                                className="px-2 py-1 bg-gray-600 hover:bg-gray-700 rounded-lg text-xs transition"
                              >
                                Arquivar
                              </button>
                            )}
                            <button
                              onClick={() => router.push(`/aula/${aula.aulaId}`)}
                              className="px-2 py-1 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-xs transition"
                            >
                              Ver
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {aulas.length === 0 && (
                      <div className="col-span-2 bg-white/10 rounded-xl p-12 text-center border border-white/20">
                        <TbBook className="w-16 h-16 text-gray-500 mx-auto mb-4 opacity-50" />
                        <p className="text-gray-400">Nenhuma aula criada ainda</p>
                        <button
                          onClick={() => setShowAulaModal(true)}
                          className="mt-4 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition"
                        >
                          Criar Primeira Aula
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Turmas */}
              {activeTab === "turmas" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white">Minhas Turmas</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dashboardData.turmas.atuais.map((turma) => (
                      <div key={turma.turmaId} className="bg-white/10 rounded-xl p-4 border border-white/20 hover:border-yellow-500/50 transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-white">{turma.nome}</h3>
                            <p className="text-xs text-gray-400">ID: {turma.turmaId}</p>
                          </div>
                          <div className="flex items-center gap-2 px-2 py-1 bg-yellow-500/20 rounded-lg">
                            <TbClock className="w-3 h-3 text-yellow-500" />
                            <span className="text-xs text-yellow-500">{turma.horario}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-white/10">
                          <div className="flex items-center gap-2">
                            <TbUsers className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-300">{turma.totalAlunos} alunos</span>
                          </div>
                          <button className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-sm transition">
                            Ver Turma
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Alunos */}
              {activeTab === "alunos" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <h2 className="text-2xl font-bold text-white">Meus Alunos</h2>
                    <div className="relative">
                      <TbSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Buscar aluno..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    {filteredAlunos.map((aluno) => (
                      <div key={aluno.id} className="bg-white/10 rounded-xl p-4 border border-white/20 hover:border-yellow-500/50 transition-all">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-yellow-600/20 rounded-full flex items-center justify-center">
                                <TbUser className="w-5 h-5 text-yellow-500" />
                              </div>
                              <div>
                                <p className="font-semibold text-white">{aluno.nome}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${getNivelColor(aluno.nivel)}`}>
                                    {aluno.nivel}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-center">
                              <p className="text-xs text-gray-400">Progresso</p>
                              <p className="text-white font-semibold">{aluno.progresso}%</p>
                              <div className="w-16 bg-white/10 rounded-full h-1 mt-1">
                                <div
                                  className={`${getProgressoColor(aluno.progresso)} rounded-full h-1 transition-all duration-500`}
                                  style={{ width: `${aluno.progresso}%` }}
                                />
                              </div>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-gray-400">Presença</p>
                              <p className="text-white font-semibold">{aluno.presenca}%</p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setPresencaForm({
                                    ...presencaForm,
                                    alunoId: aluno.id,
                                    alunoNome: aluno.nome,
                                  });
                                  setShowPresencaModal(true);
                                }}
                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition"
                                title="Registrar Presença"
                              >
                                <TbClock className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setAvaliacaoData({
                                    ...avaliacaoData,
                                    alunoId: aluno.id,
                                    alunoNome: aluno.nome,
                                  });
                                  setShowAvaliacaoModal(true);
                                }}
                                className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm transition"
                                title="Avaliar Aluno"
                              >
                                <TbStar className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => fetchAlunoDetalhes(aluno.id)}
                                className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-sm transition"
                                title="Ver Detalhes"
                              >
                                <TbEye className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {filteredAlunos.length === 0 && (
                      <div className="bg-white/10 rounded-xl p-12 text-center border border-white/20">
                        <TbUsers className="w-16 h-16 text-gray-500 mx-auto mb-4 opacity-50" />
                        <p className="text-gray-400">Nenhum aluno encontrado</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Financeiro */}
              {activeTab === "financeiro" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white">Remuneração</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                          <span className="text-gray-400">Tipo de Remuneração</span>
                          <span className="text-white font-semibold capitalize">{dashboardData.financeiro.remuneracao.tipo || "Não definido"}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                          <span className="text-gray-400">Valor Base</span>
                          <span className="text-white font-semibold">{dashboardData.financeiro.remuneracao.valor || 0} MZN</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                          <span className="text-gray-400">Último Pagamento</span>
                          <span className="text-white">
                            {dashboardData.financeiro.ultimoPagamento 
                              ? new Date(dashboardData.financeiro.ultimoPagamento).toLocaleDateString()
                              : "Aguardando primeiro pagamento"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-yellow-600/10 rounded-xl p-6 border border-yellow-500/30">
                      <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <TbInfoCircle className="w-5 h-5 text-yellow-500" />
                        Informações
                      </h3>
                      <div className="space-y-2 text-sm text-gray-300">
                        <p>• Pagamentos são processados mensalmente</p>
                        <p>• Remuneração baseada no tipo de contrato</p>
                        <p>• Dúvidas contactar a administração</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Avaliações */}
              {activeTab === "avaliacoes" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white">Minhas Avaliações</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-xl p-6 border border-white/20 text-center">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-500/20 rounded-full mb-4">
                        <TbStar className="w-10 h-10 text-yellow-500" />
                      </div>
                      <p className="text-4xl font-bold text-white">{dashboardData.desempenho.avaliacaoMedia.toFixed(1)} ★</p>
                      <p className="text-gray-400 mt-2">Avaliação Média</p>
                      <p className="text-sm text-gray-500 mt-2">Total de avaliações: {dashboardData.desempenho.totalAvaliacoes}</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                      <h3 className="text-lg font-semibold text-white mb-4">Distribuição das Avaliações</h3>
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((nota) => (
                          <div key={nota}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-400">{nota} ★</span>
                              <span className="text-yellow-500">--%</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2">
                              <div className="bg-yellow-500 rounded-full h-2" style={{ width: "0%" }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Criação/Edição de Aula (COMPLETO) */}
      {showAulaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm overflow-y-auto py-8">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-4xl w-full mx-4 border border-yellow-500/30 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-gray-800 pb-2">
              <h3 className="text-xl font-bold text-white">{editingAula ? "Editar Aula" : "Nova Aula"}</h3>
              <button onClick={() => setShowAulaModal(false)} className="text-gray-400 hover:text-white">
                <TbX className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleCriarAula} className="space-y-6">
              {/* Informações Básicas */}
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <TbBook className="w-5 h-5 text-yellow-500" />
                  Informações Básicas
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm">Título *</label>
                    <input
                      type="text"
                      value={aulaForm.titulo}
                      onChange={(e) => setAulaForm({ ...aulaForm, titulo: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm">Subtítulo</label>
                    <input
                      type="text"
                      value={aulaForm.subtitulo}
                      onChange={(e) => setAulaForm({ ...aulaForm, subtitulo: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                      placeholder="Opcional"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-gray-300 mb-2 text-sm">Descrição *</label>
                  <textarea
                    value={aulaForm.descricao}
                    onChange={(e) => setAulaForm({ ...aulaForm, descricao: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm flex items-center gap-2">
                      <TbCategory className="w-4 h-4" /> Categoria
                    </label>
                    <select
                      value={aulaForm.categoria}
                      onChange={(e) => setAulaForm({ ...aulaForm, categoria: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                    >
                      <option value="aberturas" className="text-black">Aberturas</option>
                      <option value="meio_jogo" className="text-black">Meio Jogo</option>
                      <option value="finais" className="text-black">Finais</option>
                      <option value="tatica" className="text-black">Tática</option>
                      <option value="estrategia" className="text-black">Estratégia</option>
                      <option value="analise_partidas" className="text-black">Análise de Partidas</option>
                      <option value="historia_xadrez" className="text-black">História do Xadrez</option>
                      <option value="treinamento" className="text-black">Treinamento</option>
                      <option value="torneios" className="text-black">Torneios</option>
                      <option value="exercicios" className="text-black">Exercícios</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm flex items-center gap-2">
                      <TbAward className="w-4 h-4" /> Nível
                    </label>
                    <select
                      value={aulaForm.nivel}
                      onChange={(e) => setAulaForm({ ...aulaForm, nivel: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                    >
                      <option value="iniciante" className="text-black">Iniciante</option>
                      <option value="intermediario" className="text-black">Intermediário</option>
                      <option value="avancado" className="text-black">Avançado</option>
                      <option value="mestre" className="text-black">Mestre</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm flex items-center gap-2">
                      <TbClock className="w-4 h-4" /> Duração Estimada (minutos)
                    </label>
                    <input
                      type="number"
                      value={aulaForm.duracaoEstimada}
                      onChange={(e) => setAulaForm({ ...aulaForm, duracaoEstimada: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm flex items-center gap-2">
                      <TbUser className="w-4 h-4" /> Visibilidade
                    </label>
                    <select
                      value={aulaForm.visibilidade}
                      onChange={(e) => setAulaForm({ ...aulaForm, visibilidade: e.target.value as any })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                    >
                      <option value="publico" className="text-black">Público</option>
                      <option value="alunos" className="text-black">Apenas Alunos</option>
                      <option value="turma" className="text-black">Apenas Turmas Específicas</option>
                      <option value="privado" className="text-black">Privado</option>
                    </select>
                  </div>
                </div>

                {/* Tags */}
                <div className="mt-3">
                  <label className="block text-gray-300 mb-2 text-sm flex items-center gap-2">
                    <TbTag className="w-4 h-4" /> Tags
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={novaTag}
                      onChange={(e) => setNovaTag(e.target.value)}
                      className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                      placeholder="Adicionar tag"
                    />
                    <button
                      type="button"
                      onClick={handleAdicionarTag}
                      className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition"
                    >
                      Adicionar
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {aulaForm.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-yellow-600/20 text-yellow-400 rounded-full text-sm flex items-center gap-1">
                        #{tag}
                        <button type="button" onClick={() => handleRemoverTag(tag)} className="hover:text-white">
                          <TbX className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Conteúdo Explicativo */}
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <TbFileText className="w-5 h-5 text-yellow-500" />
                  Conteúdo Explicativo
                </h4>
                <textarea
                  value={aulaForm.conteudo.textoExplicativo}
                  onChange={(e) => setAulaForm({ 
                    ...aulaForm, 
                    conteudo: { ...aulaForm.conteudo, textoExplicativo: e.target.value } 
                  })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  rows={6}
                  placeholder="Digite o conteúdo explicativo da aula..."
                  required
                />
              </div>

              {/* Vídeos */}
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                    <TbVideo className="w-5 h-5 text-yellow-500" />
                    Vídeos
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowVideoForm(!showVideoForm)}
                    className="text-sm text-yellow-500 hover:text-yellow-400"
                  >
                    {showVideoForm ? "Cancelar" : "+ Adicionar Vídeo"}
                  </button>
                </div>
                {showVideoForm && (
                  <div className="bg-white/5 rounded-lg p-3 mb-3 space-y-2">
                    <input
                      type="text"
                      placeholder="URL do vídeo (YouTube, Vimeo)"
                      value={novoVideo.url}
                      onChange={(e) => setNovoVideo({ ...novoVideo, url: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Título"
                      value={novoVideo.titulo}
                      onChange={(e) => setNovoVideo({ ...novoVideo, titulo: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                    />
                    <textarea
                      placeholder="Descrição (opcional)"
                      value={novoVideo.descricao}
                      onChange={(e) => setNovoVideo({ ...novoVideo, descricao: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Duração (segundos)"
                        value={novoVideo.duracao || ""}
                        onChange={(e) => setNovoVideo({ ...novoVideo, duracao: parseInt(e.target.value) || 0 })}
                        className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                      />
                      <select
                        value={novoVideo.plataforma}
                        onChange={(e) => setNovoVideo({ ...novoVideo, plataforma: e.target.value })}
                        className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                      >
                        <option value="youtube" className="text-black">YouTube</option>
                        <option value="vimeo" className="text-black">Vimeo</option>
                        <option value="local" className="text-black">Local</option>
                        <option value="outro" className="text-black">Outro</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={handleAdicionarVideo}
                      className="w-full py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm transition"
                    >
                      Adicionar Vídeo
                    </button>
                  </div>
                )}
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {aulaForm.conteudo.videos.map((video, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                      <div className="flex-1">
                        <p className="text-white text-sm font-semibold">{video.titulo}</p>
                        <p className="text-xs text-gray-400">{video.url.substring(0, 50)}...</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoverVideo(idx)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <TbTrash className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Imagens */}
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                    <TbPhoto className="w-5 h-5 text-yellow-500" />
                    Imagens
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowImagemForm(!showImagemForm)}
                    className="text-sm text-yellow-500 hover:text-yellow-400"
                  >
                    {showImagemForm ? "Cancelar" : "+ Adicionar Imagem"}
                  </button>
                </div>
                {showImagemForm && (
                  <div className="bg-white/5 rounded-lg p-3 mb-3 space-y-2">
                    <input
                      type="text"
                      placeholder="URL da imagem"
                      value={novaImagem.url}
                      onChange={(e) => setNovaImagem({ ...novaImagem, url: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Título"
                      value={novaImagem.titulo}
                      onChange={(e) => setNovaImagem({ ...novaImagem, titulo: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                    />
                    <textarea
                      placeholder="Descrição (opcional)"
                      value={novaImagem.descricao}
                      onChange={(e) => setNovaImagem({ ...novaImagem, descricao: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                      rows={2}
                    />
                    <button
                      type="button"
                      onClick={handleAdicionarImagem}
                      className="w-full py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm transition"
                    >
                      Adicionar Imagem
                    </button>
                  </div>
                )}
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {aulaForm.conteudo.imagens.map((imagem, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                      <div className="flex-1">
                        <p className="text-white text-sm font-semibold">{imagem.titulo}</p>
                        <p className="text-xs text-gray-400">{imagem.url.substring(0, 50)}...</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoverImagem(idx)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <TbTrash className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Posições de Xadrez */}
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                    <TbChess className="w-5 h-5 text-yellow-500" />
                    Posições de Xadrez
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowPosicaoForm(!showPosicaoForm)}
                    className="text-sm text-yellow-500 hover:text-yellow-400"
                  >
                    {showPosicaoForm ? "Cancelar" : "+ Adicionar Posição"}
                  </button>
                </div>
                {showPosicaoForm && (
                  <div className="bg-white/5 rounded-lg p-3 mb-3 space-y-2">
                    <input
                      type="text"
                      placeholder="Título da posição"
                      value={novaPosicao.titulo}
                      onChange={(e) => setNovaPosicao({ ...novaPosicao, titulo: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                    />
                    <textarea
                      placeholder="Descrição"
                      value={novaPosicao.descricao}
                      onChange={(e) => setNovaPosicao({ ...novaPosicao, descricao: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                      rows={2}
                    />
                    <textarea
                      placeholder="FEN (Posição do tabuleiro)"
                      value={novaPosicao.fen}
                      onChange={(e) => setNovaPosicao({ ...novaPosicao, fen: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm font-mono"
                      rows={2}
                    />
                    <button
                      type="button"
                      onClick={handleAdicionarPosicao}
                      className="w-full py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm transition"
                    >
                      Adicionar Posição
                    </button>
                  </div>
                )}
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {aulaForm.conteudo.posicoesXadrez.map((posicao, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                      <div className="flex-1">
                        <p className="text-white text-sm font-semibold">{posicao.titulo}</p>
                        <p className="text-xs text-gray-400 font-mono">{posicao.fen.substring(0, 50)}...</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoverPosicao(idx)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <TbTrash className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exercícios */}
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                    <TbAward className="w-5 h-5 text-yellow-500" />
                    Exercícios
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowExercicioForm(!showExercicioForm)}
                    className="text-sm text-yellow-500 hover:text-yellow-400"
                  >
                    {showExercicioForm ? "Cancelar" : "+ Adicionar Exercício"}
                  </button>
                </div>
                {showExercicioForm && (
                  <div className="bg-white/5 rounded-lg p-3 mb-3 space-y-2">
                    <input
                      type="text"
                      placeholder="Título do exercício"
                      value={novoExercicio.titulo}
                      onChange={(e) => setNovoExercicio({ ...novoExercicio, titulo: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                    />
                    <textarea
                      placeholder="Descrição"
                      value={novoExercicio.descricao}
                      onChange={(e) => setNovoExercicio({ ...novoExercicio, descricao: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                      rows={2}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={novoExercicio.tipo}
                        onChange={(e) => setNovoExercicio({ ...novoExercicio, tipo: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                      >
                        <option value="mate_em_1">Mate em 1</option>
                        <option value="mate_em_2">Mate em 2</option>
                        <option value="mate_em_3">Mate em 3</option>
                        <option value="ganho_peca">Ganho de Peça</option>
                        <option value="defesa">Defesa</option>
                        <option value="tatica">Tática</option>
                        <option value="estrategia">Estratégia</option>
                      </select>
                      <select
                        value={novoExercicio.nivel}
                        onChange={(e) => setNovoExercicio({ ...novoExercicio, nivel: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                      >
                        <option value="facil">Fácil</option>
                        <option value="medio">Médio</option>
                        <option value="dificil">Difícil</option>
                        <option value="mestre">Mestre</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="Pontos"
                        value={novoExercicio.pontos}
                        onChange={(e) => setNovoExercicio({ ...novoExercicio, pontos: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                      />
                      <input
                        type="text"
                        placeholder="FEN Inicial"
                        value={novoExercicio.configuracaoTabuleiro.fenInicial}
                        onChange={(e) => setNovoExercicio({ 
                          ...novoExercicio, 
                          configuracaoTabuleiro: { ...novoExercicio.configuracaoTabuleiro, fenInicial: e.target.value } 
                        })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm font-mono"
                      />
                    </div>
                    
                    {/* Solução do Exercício */}
                    <div className="border-t border-white/10 pt-2 mt-2">
                      <p className="text-yellow-500 text-sm mb-2">Movimentos da Solução:</p>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="De (ex: e2)"
                          value={novoMovimentoSolucao.from}
                          onChange={(e) => setNovoMovimentoSolucao({ ...novoMovimentoSolucao, from: e.target.value })}
                          className="w-1/3 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Para (ex: e4)"
                          value={novoMovimentoSolucao.to}
                          onChange={(e) => setNovoMovimentoSolucao({ ...novoMovimentoSolucao, to: e.target.value })}
                          className="w-1/3 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Notação (ex: e4)"
                          value={novoMovimentoSolucao.notacao}
                          onChange={(e) => setNovoMovimentoSolucao({ ...novoMovimentoSolucao, notacao: e.target.value })}
                          className="w-1/3 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                        />
                        <button
                          type="button"
                          onClick={handleAdicionarMovimentoSolucao}
                          className="px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm"
                        >
                          +
                        </button>
                      </div>
                      <div className="space-y-1">
                        {(novoExercicio.solucao?.movimentos || novoExercicio.solucao?.movimentos || []).map((mov, idx) => (
                          <div key={idx} className="flex justify-between items-center p-1 bg-white/5 rounded">
                            <span className="text-gray-300 text-sm">{idx + 1}. {mov.notacao}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoverMovimentoSolucao(idx)}
                              className="text-red-400 hover:text-red-300 text-xs"
                            >
                              <TbTrash className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <textarea
                        placeholder="Explicação da solução"
                        value={novoExercicio.solucao?.explicacao || ""}
                        onChange={(e) => setNovoExercicio({ 
                          ...novoExercicio, 
                          solucao: { ...novoExercicio.solucao!, explicacao: e.target.value, movimentos: novoExercicio.solucao?.movimentos || [] } 
                        })}
                        className="w-full mt-2 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                        rows={2}
                      />
                    </div>
                    
                    <button
                      type="button"
                      onClick={handleAdicionarExercicio}
                      className="w-full py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm transition mt-2"
                    >
                      Adicionar Exercício
                    </button>
                  </div>
                )}
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {aulaForm.exercicios.map((exercicio, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                      <div className="flex-1">
                        <p className="text-white text-sm font-semibold">{exercicio.titulo}</p>
                        <p className="text-xs text-gray-400">{exercicio.tipo} • {exercicio.nivel} • {exercicio.pontos} pts</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoverExercicio(idx)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <TbTrash className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Materiais de Apoio */}
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                    <TbFileText className="w-5 h-5 text-yellow-500" />
                    Materiais de Apoio
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowMaterialForm(!showMaterialForm)}
                    className="text-sm text-yellow-500 hover:text-yellow-400"
                  >
                    {showMaterialForm ? "Cancelar" : "+ Adicionar Material"}
                  </button>
                </div>
                {showMaterialForm && (
                  <div className="bg-white/5 rounded-lg p-3 mb-3 space-y-2">
                    <input
                      type="text"
                      placeholder="URL do material"
                      value={novoMaterial.url}
                      onChange={(e) => setNovoMaterial({ ...novoMaterial, url: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Nome do material"
                      value={novoMaterial.nome}
                      onChange={(e) => setNovoMaterial({ ...novoMaterial, nome: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Tipo (PDF, DOC, etc)"
                      value={novoMaterial.tipo}
                      onChange={(e) => setNovoMaterial({ ...novoMaterial, tipo: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleAdicionarMaterial}
                      className="w-full py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm transition"
                    >
                      Adicionar Material
                    </button>
                  </div>
                )}
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {aulaForm.conteudo.materiais.map((material, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                      <div className="flex-1">
                        <p className="text-white text-sm font-semibold">{material.nome}</p>
                        <p className="text-xs text-gray-400">{material.tipo}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoverMaterial(idx)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <TbTrash className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-6 sticky bottom-0 bg-gray-800 pt-4">
                <button type="button" onClick={() => setShowAulaModal(false)} className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition">
                  {editingAula ? "Atualizar" : "Criar"} Aula
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Detalhes do Aluno */}
      {showAlunoModal && selectedAluno && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-3xl w-full mx-4 border border-yellow-500/30 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Detalhes do Aluno</h3>
              <button onClick={() => setShowAlunoModal(false)} className="text-gray-400 hover:text-white">
                <TbX className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                <div className="w-16 h-16 bg-yellow-600/20 rounded-full flex items-center justify-center">
                  <TbUser className="w-8 h-8 text-yellow-500" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-white">{selectedAluno.nomeCompleto}</h4>
                  <p className="text-gray-400">Matrícula: {selectedAluno.matricula}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white/5 rounded-lg">
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white">{selectedAluno.email}</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg">
                  <p className="text-gray-400 text-sm">Telefone</p>
                  <p className="text-white">{selectedAluno.telefone}</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg">
                  <p className="text-gray-400 text-sm">Nível de Xadrez</p>
                  <p className="text-white capitalize">{selectedAluno.nivelXadrez}</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg">
                  <p className="text-gray-400 text-sm">Rating</p>
                  <p className="text-white">{selectedAluno.rating}</p>
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-lg">
                <h4 className="text-lg font-semibold text-white mb-3">Últimas Presenças</h4>
                <div className="space-y-2">
                  {selectedAluno.presencas.slice(0, 5).map((presenca, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="text-gray-300">{new Date(presenca.data).toLocaleDateString()}</span>
                      <span className={presenca.presente ? "text-green-400" : "text-red-400"}>
                        {presenca.presente ? "Presente" : "Falta"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowAlunoModal(false);
                    setPresencaForm({
                      ...presencaForm,
                      alunoId: selectedAluno.membroId,
                      alunoNome: selectedAluno.nomeCompleto,
                    });
                    setShowPresencaModal(true);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                >
                  Registrar Presença
                </button>
                <button
                  onClick={() => {
                    setShowAlunoModal(false);
                    setAvaliacaoData({
                      alunoId: selectedAluno.membroId,
                      alunoNome: selectedAluno.nomeCompleto,
                      nota: 5,
                      comentario: "",
                    });
                    setShowAvaliacaoModal(true);
                  }}
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
                >
                  Avaliar Aluno
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Registro de Presença */}
      {showPresencaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4 border border-yellow-500/30">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Registrar Presença</h3>
              <button onClick={() => setShowPresencaModal(false)} className="text-gray-400 hover:text-white">
                <TbX className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleRegistrarPresenca} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2 text-sm">Aluno</label>
                <input
                  type="text"
                  value={presencaForm.alunoNome}
                  disabled
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2 text-sm">Curso/Aula</label>
                <input
                  type="text"
                  value={presencaForm.cursoNome}
                  onChange={(e) => setPresencaForm({ ...presencaForm, cursoNome: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  placeholder="Nome do curso ou aula"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2 text-sm">Duração (horas)</label>
                <input
                  type="number"
                  step="0.5"
                  value={presencaForm.duracaoHoras}
                  onChange={(e) => setPresencaForm({ ...presencaForm, duracaoHoras: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2 text-sm">Conteúdo Ministrado</label>
                <textarea
                  value={presencaForm.conteudo}
                  onChange={(e) => setPresencaForm({ ...presencaForm, conteudo: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  rows={3}
                  placeholder="Conteúdo da aula..."
                />
              </div>
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={presencaForm.presente}
                    onChange={(e) => setPresencaForm({ ...presencaForm, presente: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-300">Aluno presente</span>
                </label>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setShowPresencaModal(false)} className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition">
                  Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Avaliação */}
      {showAvaliacaoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4 border border-yellow-500/30">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Avaliar Aluno</h3>
              <button onClick={() => setShowAvaliacaoModal(false)} className="text-gray-400 hover:text-white">
                <TbX className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleRegistrarAvaliacao} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2 text-sm">Aluno</label>
                <input
                  type="text"
                  value={avaliacaoData.alunoNome}
                  disabled
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2 text-sm">Nota (1-5)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((nota) => (
                    <button
                      key={nota}
                      type="button"
                      onClick={() => setAvaliacaoData({ ...avaliacaoData, nota })}
                      className={`flex-1 py-2 rounded-lg transition ${
                        avaliacaoData.nota === nota
                          ? "bg-yellow-600 text-white"
                          : "bg-white/10 text-gray-400 hover:bg-white/20"
                      }`}
                    >
                      {nota} ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-gray-300 mb-2 text-sm">Comentário</label>
                <textarea
                  value={avaliacaoData.comentario}
                  onChange={(e) => setAvaliacaoData({ ...avaliacaoData, comentario: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  rows={4}
                  placeholder="Feedback sobre o aluno..."
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setShowAvaliacaoModal(false)} className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition">
                  Enviar Avaliação
                </button>
              </div>
            </form>
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

// Componente auxiliar para ícone InfoCircle
const TbInfoCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);