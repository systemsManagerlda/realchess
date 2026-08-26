/* eslint-disable @typescript-eslint/no-explicit-any */
// app/dashboard/DashboardFinanceiro.tsx
"use client";

import autoTable from 'jspdf-autotable';
import { useState, useEffect, useRef } from "react";
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
  TbWallet,
  TbUsers,
  TbReport,
  TbPrinter,
  TbFileExport,
  TbSearch,
  TbFilter,
  TbChartBar,
  TbChartPie,
  TbChartLine
} from "react-icons/tb";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const BASE_URL = "https://desktop-api-4f850b3f9733.herokuapp.com";

interface Pagamento {
  membroId: string;
  nomeCompleto: string;
  matricula: string;
  tipoMembro: string;
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

interface Membro {
  membroId: string;
  nomeCompleto: string;
  matricula: string;
  tipoMembro: string;
  contato: {
    email: string;
    telefone: string;
  };
  cotas: {
    statusPagamento: string;
    valorTotalDevido: number;
    ultimoPagamento?: string;
    proximoVencimento?: string;
  };
  ativo: boolean;
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
  totalMembros: number;
  membrosEmDia: number;
  membrosInadimplentes: number;
  taxaAdimplencia: number;
}

interface RelatorioPeriodico {
  periodo: string;
  totalMembros: number;
  valorEsperado: number;
  valorArrecadado: number;
  valorNaoArrecadado: number;
  totalPagamentos: number;
  totalConfirmados: number;
  inadimplentes: number;
  taxaAdimplencia: number;
  membrosNaoPagaramMesAnterior: number;
  inadimplentesMesAnterior: Array<{
    nomeCompleto: string;
    matricula: string;
    contato: { email: string };
    cotas: { valorMensal: number };
  }>;
  mediaPorMembro: number;
  evolucaoMensal: Array<{
    mes: string;
    ano: string;
    total: number;
    quantidade: number;
  }>;
}

export default function DashboardFinanceiro() {
  const router = useRouter();
  const [pagamentosPendentes, setPagamentosPendentes] = useState<Pagamento[]>([]);
  const [pagamentosConfirmados, setPagamentosConfirmados] = useState<Pagamento[]>([]);
  const [pagamentosCancelados, setPagamentosCancelados] = useState<Pagamento[]>([]);
  const [membros, setMembros] = useState<Membro[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmando, setConfirmando] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: string; message: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPagamento, setSelectedPagamento] = useState<Pagamento | null>(null);
  const [showDetalhesModal, setShowDetalhesModal] = useState(false);
  const [activeTab, setActiveTab] = useState("pendentes");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [filterTipoMembro, setFilterTipoMembro] = useState("todos");
  const [relatorioPeriodo, setRelatorioPeriodo] = useState({ mes: new Date().getMonth() + 1, ano: new Date().getFullYear() });
  const [relatorioData, setRelatorioData] = useState<RelatorioPeriodico | null>(null);
  const [showRelatorioModal, setShowRelatorioModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const relatorioRef = useRef<HTMLDivElement>(null);
  const [resumo, setResumo] = useState<ResumoFinanceiro>({
  totalPendentes: 0,
  valorPendente: 0,
  totalConfirmados: 0,
  valorConfirmado: 0,
  totalCancelados: 0,
  valorCancelado: 0,
  totalGeral: 0,
  valorGeral: 0,
  totalMembros: 0,
  membrosEmDia: 0,
  membrosInadimplentes: 0,
  taxaAdimplencia: 0
});

 useEffect(() => {
  const checkAuth = async () => {
    const membroId = localStorage.getItem("membroId");
    const tipoMembro = localStorage.getItem("tipoMembro");

    if (!membroId || (tipoMembro !== "administrador" && tipoMembro !== "financeiro")) {
      router.push("/login");
      return;
    }

    await Promise.all([
      fetchTodosPagamentos(),
      fetchTodosMembros()
    ]);
    setLoading(false); // <--- ADICIONE ESTA LINHA
  };

  checkAuth();
}, [router]);

  const fetchTodosPagamentos = async () => {
    try {
      const response = await fetch(`${BASE_URL}/getTodosPagamentos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const result = await response.json();

      if (result.returnCode === 200) {
        const todosPagamentos = result.data;
        
        const pendentes = todosPagamentos.filter((p: Pagamento) => p.pagamento.status === "aguardando_confirmacao");
        const confirmados = todosPagamentos.filter((p: Pagamento) => p.pagamento.status === "confirmado");
        const cancelados = todosPagamentos.filter((p: Pagamento) => p.pagamento.status === "cancelado");
        
        setPagamentosPendentes(pendentes);
        setPagamentosConfirmados(confirmados);
        setPagamentosCancelados(cancelados);
        
        calcularResumo(pendentes, confirmados, cancelados);
      } else {
        showNotification("error", result.returnMsg || "Erro ao carregar pagamentos");
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      showNotification("error", "Erro de conexão com o servidor");
    }
  };

  const fetchTodosMembros = async () => {
  try {
    const response = await fetch(`${BASE_URL}/getMembroList`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ curPage: 1, pageSize: 1000 }),
    });

    const result = await response.json();

    if (result.returnCode === 200) {
      setMembros(result.data.list);
      
      const membrosAtivos = result.data.list.filter((m: Membro) => m.ativo);
      const emDia = membrosAtivos.filter((m: Membro) => m.cotas.statusPagamento === "em_dia");
      const inadimplentes = membrosAtivos.filter((m: Membro) => m.cotas.statusPagamento === "atrasado");
      
      setResumo(prev => ({  // <--- VERIFIQUE SE ESTÁ CORRETO
        ...prev,
        totalMembros: membrosAtivos.length,
        membrosEmDia: emDia.length,
        membrosInadimplentes: inadimplentes.length,
        taxaAdimplencia: membrosAtivos.length > 0 ? (emDia.length / membrosAtivos.length) * 100 : 0
      }));
    }
  } catch (error) {
    console.error("Error fetching members:", error);
    showNotification("error", "Erro ao carregar membros");
  }
};

  const calcularResumo = (pendentes: Pagamento[], confirmados: Pagamento[], cancelados: Pagamento[]) => {
  const totalPendentes = pendentes.length;
  const valorPendente = pendentes.reduce((acc, p) => acc + p.pagamento.valor, 0);
  const totalConfirmados = confirmados.length;
  const valorConfirmado = confirmados.reduce((acc, p) => acc + p.pagamento.valor, 0);
  const totalCancelados = cancelados.length;
  const valorCancelado = cancelados.reduce((acc, p) => acc + p.pagamento.valor, 0);
  
  setResumo(prev => ({  // <--- VERIFIQUE SE ESTÁ CORRETO
    ...prev,
    totalPendentes,
    valorPendente,
    totalConfirmados,
    valorConfirmado,
    totalCancelados,
    valorCancelado,
    totalGeral: totalPendentes + totalConfirmados + totalCancelados,
    valorGeral: valorPendente + valorConfirmado + valorCancelado
  }));
};

  const fetchRelatorioPeriodico = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch(`${BASE_URL}/getRelatorioFinanceiro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mes: relatorioPeriodo.mes,
          ano: relatorioPeriodo.ano
        }),
      });

      const result = await response.json();

      if (result.returnCode === 200) {
        setRelatorioData(result.data);
        setShowRelatorioModal(true);
        showNotification("success", "✅ Relatório gerado com sucesso!");
      } else {
        showNotification("error", result.returnMsg || "Erro ao gerar relatório");
      }
    } catch (error) {
      console.error("Error fetching report:", error);
      showNotification("error", "Erro de conexão com o servidor");
    } finally {
      setIsGenerating(false);
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
        await Promise.all([fetchTodosPagamentos(), fetchTodosMembros()]);
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
        await Promise.all([fetchTodosPagamentos(), fetchTodosMembros()]);
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

  const getTipoMembroBadge = (tipo: string) => {
    switch (tipo) {
      case "aluno":
        return { text: "🎓 Aluno", color: "bg-blue-500/20 text-blue-400" };
      case "formador":
        return { text: "👨‍🏫 Formador", color: "bg-purple-500/20 text-purple-400" };
      case "administrador":
        return { text: "👑 Admin", color: "bg-red-500/20 text-red-400" };
      case "financeiro":
        return { text: "💰 Financeiro", color: "bg-green-500/20 text-green-400" };
      default:
        return { text: tipo, color: "bg-gray-500/20 text-gray-400" };
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

 const exportarRelatorioPDF = async () => {
  if (!relatorioData) {
    showNotification("error", "Nenhum dado para exportar.");
    return;
  }
  
  setIsExporting(true);
  try {
    const doc = new jsPDF('p', 'mm', 'a4');
    
    // ===== LOGO =====
    // Carregar a imagem do logo (base64 ou URL)
    // Você pode colocar a imagem na pasta public e carregar
    const logoUrl = '/images/realchesslogo.png'; // Ajuste o caminho
    try {
      const img = await fetch(logoUrl).then(res => res.blob());
      const reader = new FileReader();
      reader.readAsDataURL(img);
      await new Promise(resolve => reader.onload = resolve);
      const imgData = reader.result as string;
      doc.addImage(imgData, 'PNG', 14, 10, 25, 25);
    } catch (error) {
      console.warn("Logo não encontrado, continuando sem logo:", error);
    }
    
    // ===== TÍTULO =====
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0); // Preto
    doc.text('Real Chess Mahotas', 44, 22);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Preto
    doc.text(`Relatório Financeiro - ${relatorioData.periodo}`, 44, 30);
    
    // Linha separadora
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(14, 35, 196, 35);
    
    // ===== RESULTADOS =====
    let yPos = 45;
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0); // Preto
    
    // Total de Membros
    doc.text(`Total de Membros:`, 14, yPos);
    doc.text(`${relatorioData.totalMembros || 0}`, 80, yPos);
    
    yPos += 8;
    doc.text(`Valor Esperado:`, 14, yPos);
    doc.text(`${formatCurrency(relatorioData.valorEsperado || 0)}`, 80, yPos);
    
    yPos += 8;
    doc.text(`Valor Arrecadado:`, 14, yPos);
    doc.text(`${formatCurrency(relatorioData.valorArrecadado || 0)}`, 80, yPos);
    
    yPos += 8;
    doc.text(`Valor Não Arrecadado:`, 14, yPos);
    const valorNaoArrecadado = relatorioData.valorNaoArrecadado || 0;
    doc.text(`${formatCurrency(valorNaoArrecadado)}`, 80, yPos);
    
    yPos += 8;
    doc.text(`Taxa de Adimplência:`, 14, yPos);
    doc.text(`${(relatorioData.taxaAdimplencia || 0).toFixed(1)}%`, 80, yPos);
    
    yPos += 8;
    doc.text(`Inadimplentes:`, 14, yPos);
    doc.text(`${relatorioData.inadimplentes || 0}`, 80, yPos);
    
    yPos += 8;
    doc.text(`Média por Membro:`, 14, yPos);
    doc.text(`${formatCurrency(relatorioData.mediaPorMembro || 0)}`, 80, yPos);
    
    // ===== TABELA DE INADIMPLENTES =====
    if (relatorioData.inadimplentesMesAnterior && relatorioData.inadimplentesMesAnterior.length > 0) {
      yPos += 12;
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('Membros Inadimplentes:', 14, yPos);
      
      const tableData = relatorioData.inadimplentesMesAnterior.map(m => [
        m.nomeCompleto || 'Não informado',
        m.matricula || 'N/A',
        `${m.cotas?.valorMensal || 0} MZN`
      ]);
      
      autoTable(doc, {
        startY: yPos + 5,
        head: [['Nome', 'Matrícula', 'Valor']],
        body: tableData.slice(0, 20),
        theme: 'striped',
        styles: { 
          fontSize: 8, 
          textColor: [0, 0, 0],
          fillColor: [245, 245, 245],
          lineColor: [200, 200, 200],
          lineWidth: 0.1
        },
        headStyles: { 
          fillColor: [200, 200, 200],
          textColor: [0, 0, 0],
          fontStyle: 'bold',
          fontSize: 9
        },
        alternateRowStyles: { 
          fillColor: [235, 235, 235]
        },
        tableWidth: 'auto',
        margin: { left: 14, right: 14 },
        columnStyles: {
          0: { cellWidth: 'auto' },
          1: { cellWidth: 30 },
          2: { cellWidth: 35 }
        }
      });
    }
    
    // ===== EVOLUÇÃO MENSAL =====
    if (relatorioData.evolucaoMensal && relatorioData.evolucaoMensal.length > 0) {
      const finalY = (doc as any).lastAutoTable?.finalY || yPos + 20;
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('Evolução Mensal do Ano:', 14, finalY + 10);
      
      const evolucaoData = relatorioData.evolucaoMensal.map(item => [
        `${item.mes}/${item.ano}`,
        `${item.quantidade || 0}`,
        `${formatCurrency(item.total || 0)}`
      ]);
      
      autoTable(doc, {
        startY: finalY + 15,
        head: [['Mês', 'Pagamentos', 'Valor']],
        body: evolucaoData,
        theme: 'striped',
        styles: { 
          fontSize: 8, 
          textColor: [0, 0, 0],
          fillColor: [245, 245, 245],
          lineColor: [200, 200, 200],
          lineWidth: 0.1
        },
        headStyles: { 
          fillColor: [200, 200, 200],
          textColor: [0, 0, 0],
          fontStyle: 'bold',
          fontSize: 9
        },
        alternateRowStyles: { 
          fillColor: [235, 235, 235]
        },
        tableWidth: 'auto',
        margin: { left: 14, right: 14 },
      });
    }
    
    // ===== RODAPÉ =====
    const pageCount = doc.internal.pages.length;
    for (let i = 1; i < pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Gerado em: ${new Date().toLocaleString('pt-MZ')}`, 14, doc.internal.pageSize.getHeight() - 10);
      doc.text(`Página ${i} de ${pageCount - 1}`, doc.internal.pageSize.getWidth() - 30, doc.internal.pageSize.getHeight() - 10);
    }
    
    // ===== SALVAR =====
    doc.save(`relatorio_financeiro_${relatorioData.periodo}.pdf`);
    showNotification("success", "📄 Relatório PDF exportado com sucesso!");
  } catch (error) {
    console.error("Error exporting PDF:", error);
    showNotification("error", "Erro ao exportar PDF. Tente novamente.");
  } finally {
    setIsExporting(false);
  }
};

  const exportarRelatorioCSV = () => {
    if (!relatorioData) return;
    
    const headers = [
      'Período',
      'Total Membros',
      'Valor Esperado',
      'Valor Arrecadado',
      'Valor Não Arrecadado',
      'Pagamentos',
      'Inadimplentes',
      'Taxa Adimplência',
      'Média por Membro',
      'Membros que não pagaram no mês anterior'
    ];
    
    const data = [
      relatorioData.periodo,
      relatorioData.totalMembros,
      relatorioData.valorEsperado,
      relatorioData.valorArrecadado,
      relatorioData.valorNaoArrecadado,
      relatorioData.totalConfirmados,
      relatorioData.inadimplentes,
      relatorioData.taxaAdimplencia.toFixed(1) + '%',
      relatorioData.mediaPorMembro.toFixed(2),
      relatorioData.membrosNaoPagaramMesAnterior
    ];
    
    const csvContent = headers.join(',') + '\n' + data.join(',');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_financeiro_${relatorioData.periodo}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    showNotification("success", "📊 Relatório CSV exportado com sucesso!");
  };

  const renderPagamentosList = (pagamentos: Pagamento[], title: string) => {
    const filtered = pagamentos.filter(item => {
      if (filterTipoMembro !== "todos" && item.tipoMembro !== filterTipoMembro) return false;
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return item.nomeCompleto.toLowerCase().includes(search) ||
               item.matricula.toLowerCase().includes(search);
      }
      return true;
    });

    if (filtered.length === 0) {
      return (
        <div className="bg-white/5 rounded-xl p-8 text-center border border-white/10">
          <p className="text-gray-400">Nenhum pagamento {title.toLowerCase()} encontrado</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {filtered.map((item) => {
          const statusInfo = getStatusBadge(item.pagamento.status);
          const tipoInfo = getTipoMembroBadge(item.tipoMembro);
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
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className="text-lg font-semibold text-white truncate">{item.nomeCompleto}</h3>
                    <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full text-xs whitespace-nowrap">
                      {item.matricula}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs whitespace-nowrap ${tipoInfo.color}`}>
                      {tipoInfo.text}
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

  const renderMembrosList = () => {
    const filtered = membros.filter(m => {
      if (filterTipoMembro !== "todos" && m.tipoMembro !== filterTipoMembro) return false;
      if (filterStatus !== "todos" && m.cotas.statusPagamento !== filterStatus) return false;
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return m.nomeCompleto.toLowerCase().includes(search) ||
               m.matricula.toLowerCase().includes(search);
      }
      return true;
    });

    if (filtered.length === 0) {
      return (
        <div className="bg-white/5 rounded-xl p-8 text-center border border-white/10">
          <p className="text-gray-400">Nenhum membro encontrado</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="text-left p-3 text-gray-400 text-sm">Matrícula</th>
              <th className="text-left p-3 text-gray-400 text-sm">Nome</th>
              <th className="text-left p-3 text-gray-400 text-sm">Tipo</th>
              <th className="text-left p-3 text-gray-400 text-sm">Status Cota</th>
              <th className="text-left p-3 text-gray-400 text-sm">Valor Devido</th>
              <th className="text-left p-3 text-gray-400 text-sm">Último Pagamento</th>
              <th className="text-left p-3 text-gray-400 text-sm">Vencimento</th>
              <th className="text-left p-3 text-gray-400 text-sm">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((membro) => {
              const tipoInfo = getTipoMembroBadge(membro.tipoMembro);
              const statusInfo = getStatusBadge(membro.cotas.statusPagamento);
              return (
                <tr key={membro.membroId} className="border-b border-white/10 hover:bg-white/5 transition">
                  <td className="p-3 text-white text-sm">{membro.matricula}</td>
                  <td className="p-3 text-white text-sm">{membro.nomeCompleto}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${tipoInfo.color}`}>
                      {tipoInfo.text}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${statusInfo.color}`}>
                      {statusInfo.text}
                    </span>
                  </td>
                  <td className="p-3 text-yellow-400 font-semibold">
                    {membro.cotas.valorTotalDevido || 0} MZN
                  </td>
                  <td className="p-3 text-gray-300 text-sm">
                    {membro.cotas.ultimoPagamento ? new Date(membro.cotas.ultimoPagamento).toLocaleDateString() : '-'}
                  </td>
                  <td className="p-3 text-gray-300 text-sm">
                    {membro.cotas.proximoVencimento ? new Date(membro.cotas.proximoVencimento).toLocaleDateString() : '-'}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          showNotification("info", `Detalhes de ${membro.nomeCompleto}`);
                        }}
                        className="p-1 text-gray-400 hover:text-gray-300 transition"
                        title="Ver Detalhes"
                      >
                        <TbEye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
            <p className="mt-4 text-gray-400">Carregando dados financeiros...</p>
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
                : notification.type === "info"
                ? "bg-blue-500/90"
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
                    onClick={() => { setActiveTab("pendentes"); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      activeTab === "pendentes" ? "bg-yellow-600/20 text-yellow-400" : "text-gray-300 hover:bg-white/10"
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
                    onClick={() => { setActiveTab("confirmados"); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      activeTab === "confirmados" ? "bg-green-600/20 text-green-400" : "text-gray-300 hover:bg-white/10"
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
                    onClick={() => { setActiveTab("cancelados"); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      activeTab === "cancelados" ? "bg-red-600/20 text-red-400" : "text-gray-300 hover:bg-white/10"
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
                    onClick={() => { setActiveTab("membros"); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      activeTab === "membros" ? "bg-blue-600/20 text-blue-400" : "text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    <TbUsers className="w-5 h-5" />
                    <span>Membros</span>
                    <span className="ml-auto bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full text-xs">
                      {resumo.totalMembros}
                    </span>
                  </button>
                  <button
                    onClick={() => { setActiveTab("resumo"); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      activeTab === "resumo" ? "bg-purple-600/20 text-purple-400" : "text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    <TbWallet className="w-5 h-5" />
                    <span>Resumo</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab("relatorios"); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      activeTab === "relatorios" ? "bg-orange-600/20 text-orange-400" : "text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    <TbReport className="w-5 h-5" />
                    <span>Relatórios</span>
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
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white">Gestão Financeira</h1>
                  <p className="text-sm text-gray-400 mt-1">
                    {activeTab === "pendentes" && "Pagamentos aguardando confirmação"}
                    {activeTab === "confirmados" && "Pagamentos já confirmados"}
                    {activeTab === "cancelados" && "Pagamentos cancelados"}
                    {activeTab === "membros" && "Todos os membros do clube"}
                    {activeTab === "resumo" && "Resumo financeiro do clube"}
                    {activeTab === "relatorios" && "Relatórios financeiros periódicos"}
                  </p>
                </div>
                <button
                  onClick={() => Promise.all([fetchTodosPagamentos(), fetchTodosMembros()])}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
                >
                  <TbRefresh className="w-4 h-4" />
                  <span className="text-sm">Atualizar</span>
                </button>
              </div>

              {/* Filtros */}
              {(activeTab === "pendentes" || activeTab === "confirmados" || activeTab === "cancelados") && (
                <div className="flex flex-wrap gap-3 mb-4">
                  <div className="relative flex-1 min-w-[200px]">
                    <TbSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Buscar por nome ou matrícula..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 text-sm"
                    />
                  </div>
                  <select
                    value={filterTipoMembro}
                    onChange={(e) => setFilterTipoMembro(e.target.value)}
                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500 text-sm"
                  >
                    <option value="todos" className="text-black">Todos os tipos</option>
                    <option value="aluno" className="text-black">🎓 Alunos</option>
                    <option value="formador" className="text-black">👨‍🏫 Formadores</option>
                    <option value="administrador" className="text-black">👑 Administradores</option>
                    <option value="financeiro" className="text-black">💰 Financeiros</option>
                  </select>
                </div>
              )}

              {activeTab === "membros" && (
                <div className="flex flex-wrap gap-3 mb-4">
                  <div className="relative flex-1 min-w-[200px]">
                    <TbSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Buscar membro..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 text-sm"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500 text-sm"
                  >
                    <option value="todos" className="text-black">Todos os status</option>
                    <option value="em_dia" className="text-black">✅ Em dia</option>
                    <option value="pendente" className="text-black">⚠️ Pendente</option>
                    <option value="atrasado" className="text-black">❌ Atrasado</option>
                  </select>
                  <select
                    value={filterTipoMembro}
                    onChange={(e) => setFilterTipoMembro(e.target.value)}
                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500 text-sm"
                  >
                    <option value="todos" className="text-black">Todos os tipos</option>
                    <option value="aluno" className="text-black">🎓 Alunos</option>
                    <option value="formador" className="text-black">👨‍🏫 Formadores</option>
                    <option value="administrador" className="text-black">👑 Administradores</option>
                    <option value="financeiro" className="text-black">💰 Financeiros</option>
                  </select>
                </div>
              )}

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

              {/* Conteúdo das abas */}
              {activeTab === "pendentes" && renderPagamentosList(pagamentosPendentes, "Pendentes")}
              {activeTab === "confirmados" && renderPagamentosList(pagamentosConfirmados, "Confirmados")}
              {activeTab === "cancelados" && renderPagamentosList(pagamentosCancelados, "Cancelados")}
              {activeTab === "membros" && renderMembrosList()}

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

                  {/* Status dos Membros */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-500/10 rounded-xl p-6 border border-blue-500/30">
                      <div className="flex items-center gap-3 mb-2">
                        <TbUsers className="w-6 h-6 text-blue-400" />
                        <h3 className="text-lg font-semibold text-white">Status dos Membros</h3>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total de Membros</span>
                          <span className="text-white font-semibold">{resumo.totalMembros}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">✅ Em dia</span>
                          <span className="text-green-400 font-semibold">{resumo.membrosEmDia}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">❌ Inadimplentes</span>
                          <span className="text-red-400 font-semibold">{resumo.membrosInadimplentes}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Taxa de Adimplência</span>
                          <span className="text-yellow-400 font-semibold">{resumo.taxaAdimplencia.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-500/10 rounded-xl p-6 border border-purple-500/30">
                      <div className="flex items-center gap-3 mb-2">
                        <TbChartBar className="w-6 h-6 text-purple-400" />
                        <h3 className="text-lg font-semibold text-white">Resumo Financeiro</h3>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total Arrecadado</span>
                          <span className="text-yellow-400 font-semibold">{formatCurrency(resumo.valorConfirmado)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total em Atraso</span>
                          <span className="text-red-400 font-semibold">{formatCurrency(resumo.valorPendente + resumo.valorCancelado)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Valor Médio por Pagamento</span>
                          <span className="text-white font-semibold">
                            {resumo.totalConfirmados > 0 ? formatCurrency(resumo.valorConfirmado / resumo.totalConfirmados) : formatCurrency(0)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total de Transações</span>
                          <span className="text-white font-semibold">{resumo.totalGeral}</span>
                        </div>
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

              {/* Relatórios */}
              {activeTab === "relatorios" && (
                <div className="space-y-6">
                  <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <TbReport className="w-6 h-6 text-orange-400" />
                      Gerar Relatório Financeiro
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Selecione o período para gerar um relatório financeiro completo em PDF ou CSV.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <div>
                        <label className="block text-gray-300 text-sm mb-1">Mês</label>
                        <select
                          value={relatorioPeriodo.mes}
                          onChange={(e) => setRelatorioPeriodo(prev => ({ ...prev, mes: parseInt(e.target.value) }))}
                          className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                        >
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(mes => (
                            <option key={mes} value={mes} className="text-black">
                              {new Date(2000, mes - 1, 1).toLocaleString('pt-MZ', { month: 'long' })}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm mb-1">Ano</label>
                        <select
                          value={relatorioPeriodo.ano}
                          onChange={(e) => setRelatorioPeriodo(prev => ({ ...prev, ano: parseInt(e.target.value) }))}
                          className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                        >
                          {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(ano => (
                            <option key={ano} value={ano} className="text-black">{ano}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-end gap-2">
                        <button
                          onClick={fetchRelatorioPeriodico}
                          disabled={isGenerating}
                          className="px-6 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg text-white font-semibold transition flex items-center gap-2 disabled:opacity-50"
                        >
                          {isGenerating ? (
                            <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                          ) : (
                            <TbReport className="w-4 h-4" />
                          )}
                          {isGenerating ? "Gerando..." : "Gerar Relatório"}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <TbFileText className="w-6 h-6 text-yellow-400" />
                      Tipos de Relatórios
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-yellow-500/30 transition">
                        <div className="flex items-center gap-3 mb-2">
                          <TbFileExport className="w-5 h-5 text-blue-400" />
                          <h4 className="text-white font-semibold">Relatório em PDF</h4>
                        </div>
                        <p className="text-gray-400 text-sm mb-3">Relatório formatado para impressão e apresentação.</p>
                        <button 
                          onClick={() => {
                            if (relatorioData) {
                              setShowRelatorioModal(true);
                            } else {
                              showNotification("info", "Gere primeiro o relatório clicando em 'Gerar Relatório'");
                            }
                          }}
                          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm transition flex items-center justify-center gap-2"
                        >
                          <TbDownload className="w-4 h-4" />
                          Gerar PDF
                        </button>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-yellow-500/30 transition">
                        <div className="flex items-center gap-3 mb-2">
                          <TbFileText className="w-5 h-5 text-green-400" />
                          <h4 className="text-white font-semibold">Relatório em CSV</h4>
                        </div>
                        <p className="text-gray-400 text-sm mb-3">Dados em formato de planilha para análise.</p>
                        <button 
                          onClick={() => {
                            if (relatorioData) {
                              exportarRelatorioCSV();
                            } else {
                              showNotification("info", "Gere primeiro o relatório clicando em 'Gerar Relatório'");
                            }
                          }}
                          className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white text-sm transition flex items-center justify-center gap-2"
                        >
                          <TbDownload className="w-4 h-4" />
                          Exportar CSV
                        </button>
                      </div>
                    </div>
                  </div>
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
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-gray-400">Status</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(selectedPagamento.pagamento.status).color}`}>
                  {getStatusBadge(selectedPagamento.pagamento.status).text}
                </span>
              </div>

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
                </div>
              </div>

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

      {/* Modal de Relatório com PDF */}
      {showRelatorioModal && relatorioData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-yellow-500/30">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <TbReport className="w-6 h-6 text-orange-400" />
                Relatório Financeiro - {relatorioData.periodo}
              </h3>
              <button
                onClick={() => setShowRelatorioModal(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <TbX className="w-6 h-6" />
              </button>
            </div>

            {/* Conteúdo do Relatório para PDF */}
            <div ref={relatorioRef} className="bg-gray-900 rounded-lg p-6" style={{ minWidth: '100%' }}>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white">Real Chess Mahotas</h2>
                <p className="text-gray-400">Relatório Financeiro - {relatorioData.periodo}</p>
                <div className="w-24 h-1 bg-yellow-500 mx-auto mt-2 rounded-full" />
              </div>

              <div className="space-y-6">
                {/* Resumo Principal */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
                    <p className="text-gray-400 text-sm">Total de Membros</p>
                    <p className="text-2xl font-bold text-white">{relatorioData.totalMembros}</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
                    <p className="text-gray-400 text-sm">Valor Esperado</p>
                    <p className="text-2xl font-bold text-blue-400">{formatCurrency(relatorioData.valorEsperado)}</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
                    <p className="text-gray-400 text-sm">Valor Arrecadado</p>
                    <p className="text-2xl font-bold text-green-400">{formatCurrency(relatorioData.valorArrecadado)}</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
                    <p className="text-gray-400 text-sm">Valor Não Arrecadado</p>
                    <p className={`text-2xl font-bold ${relatorioData.valorNaoArrecadado > 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {formatCurrency(relatorioData.valorNaoArrecadado)}
                    </p>
                  </div>
                </div>

                {/* Métricas de Adimplência */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
                    <p className="text-gray-400 text-sm">Taxa de Adimplência</p>
                    <p className="text-2xl font-bold text-yellow-400">{relatorioData.taxaAdimplencia.toFixed(1)}%</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
                    <p className="text-gray-400 text-sm">Média por Membro</p>
                    <p className="text-2xl font-bold text-green-400">{formatCurrency(relatorioData.mediaPorMembro)}</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
                    <p className="text-gray-400 text-sm">Pagamentos Confirmados</p>
                    <p className="text-2xl font-bold text-white">{relatorioData.totalConfirmados}</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
                    <p className="text-gray-400 text-sm">Inadimplentes</p>
                    <p className="text-2xl font-bold text-red-400">{relatorioData.inadimplentes}</p>
                  </div>
                </div>

                {/* Membros que não pagaram no mês anterior */}
                {relatorioData.inadimplentesMesAnterior && relatorioData.inadimplentesMesAnterior.length > 0 && (
                  <div className="bg-red-900/20 rounded-lg p-4 border border-red-500/30">
                    <h4 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
                      <TbClock className="w-4 h-4" />
                      Membros que NÃO Pagaram no Mês Anterior ({relatorioData.membrosNaoPagaramMesAnterior})
                    </h4>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {relatorioData.inadimplentesMesAnterior.slice(0, 10).map((membro, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-gray-800 rounded">
                          <div>
                            <p className="text-white text-sm">{membro.nomeCompleto}</p>
                            <p className="text-xs text-gray-400">{membro.matricula}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-red-400 text-sm">{membro.cotas.valorMensal} MZN</p>
                          </div>
                        </div>
                      ))}
                      {relatorioData.inadimplentesMesAnterior.length > 10 && (
                        <p className="text-xs text-gray-500 text-center mt-2">
                          + {relatorioData.inadimplentesMesAnterior.length - 10} outros membros
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Evolução Mensal */}
                {relatorioData.evolucaoMensal && relatorioData.evolucaoMensal.length > 0 && (
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-sm font-semibold text-gray-400 mb-3">Evolução Mensal do Ano</h4>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                      {relatorioData.evolucaoMensal.map((item, idx) => (
                        <div key={idx} className="bg-gray-700 rounded p-2 text-center">
                          <p className="text-xs text-gray-400">{item.mes}/{item.ano}</p>
                          <p className="text-sm font-semibold text-yellow-400">{formatCurrency(item.total)}</p>
                          <p className="text-xs text-gray-500">{item.quantidade} pag</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rodapé do Relatório */}
                <div className="text-center pt-4 border-t border-gray-700">
                  <p className="text-xs text-gray-500">
                    Gerado em {new Date().toLocaleString('pt-MZ')}
                  </p>
                  <p className="text-xs text-gray-500">
                    Real Chess Mahotas - {new Date().getFullYear()}
                  </p>
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex flex-wrap gap-3 mt-6">
              <button
                onClick={() => setShowRelatorioModal(false)}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition"
              >
                Fechar
              </button>
              <button
                onClick={exportarRelatorioPDF}
                disabled={isExporting}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isExporting ? (
                  <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                ) : (
                  <TbFileExport className="w-4 h-4" />
                )}
                {isExporting ? "Exportando..." : "Exportar PDF"}
              </button>
              <button
                onClick={exportarRelatorioCSV}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white transition flex items-center justify-center gap-2"
              >
                <TbFileText className="w-4 h-4" />
                Exportar CSV
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition flex items-center justify-center gap-2"
              >
                <TbPrinter className="w-4 h-4" />
                Imprimir
              </button>
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
          .max-h-\[90vh\] {
            max-height: none !important;
          }
        }
      `}</style>
    </>
  );
}