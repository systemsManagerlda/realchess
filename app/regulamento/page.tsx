// app/regulamento/page.tsx
"use client";

import { useState, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function Regulamento() {
  const [lastUpdated] = useState("15 de Janeiro, 2025");
  const pageRef = useRef<HTMLDivElement>(null);

  const isVisible = true;

  const sections = [
    {
      id: "disposicoes-preliminares",
      title: "CAPÍTULO I - DISPOSIÇÕES PRELIMINARES",
      subsections: [
        {
          title: "Art. 1º - Da Denominação e Sede",
          content: "O Real Chess Club, doravante denominado Clube, é uma associação civil sem fins lucrativos, com sede no Bairro das Mahotas, Maputo - Moçambique. O Clube tem como objetivo promover, desenvolver e difundir a prática do xadrez em todos os níveis sociais, formando atletas e cidadãos exemplares."
        },
        {
          title: "Art. 2º - Dos Objetivos",
          content: "São objetivos do Clube: I - Promover torneios, campeonatos e eventos relacionados ao xadrez; II - Oferecer treinamento e formação técnica para enxadristas de todos os níveis; III - Representar seus membros em competições oficiais; IV - Fomentar a integração social através do esporte; V - Manter intercâmbio com outras entidades nacionais e internacionais; VI - Incentivar a prática do xadrez em escolas e comunidades."
        }
      ]
    },
    {
      id: "membros",
      title: "CAPÍTULO II - DOS MEMBROS",
      subsections: [
        {
          title: "Art. 3º - Categorias de Membros",
          content: "O Clube possui as seguintes categorias de membros: I - Membros Fundadores: aqueles que participaram da fundação do Clube; II - Membros Efetivos: maiores de 18 anos que participam regularmente das atividades; III - Membros Juvenis: membros entre 12 e 17 anos; IV - Membros Infantis: membros até 11 anos; V - Membros Beneméritos: personalidades que prestaram relevantes serviços ao Clube; VI - Membros Honorários: personalidades que se destacaram no xadrez nacional ou internacional."
        },
        {
          title: "Art. 4º - Direitos dos Membros",
          content: "São direitos dos membros: I - Participar das atividades promovidas pelo Clube; II - Votar e ser votado para os cargos eletivos (membros efetivos); III - Utilizar as instalações do Clube conforme regulamento; IV - Participar de torneios e eventos exclusivos para membros; V - Receber descontos em cursos e materiais do Clube; VI - Representar o Clube em competições oficiais."
        },
        {
          title: "Art. 5º - Deveres dos Membros",
          content: "São deveres dos membros: I - Cumprir este Regulamento e as decisões da Diretoria; II - Pagar pontualmente as mensalidades e taxas estipuladas; III - Manter conduta ética e esportiva; IV - Zelar pelo patrimônio do Clube; V - Participar das assembleias gerais; VI - Respeitar os demais membros e a equipe do Clube."
        },
        {
          title: "Art. 6º - Da Admissão e Exclusão",
          content: "A admissão de novos membros será feita mediante solicitação formal e aprovação da Diretoria. Poderá ser excluído o membro que: I - Deixar de pagar as mensalidades por mais de 3 meses consecutivos; II - Praticar atos que desabonem a reputação do Clube; III - Descumprir reiteradamente este Regulamento; IV - Praticar qualquer forma de violência ou discriminação. A exclusão será decidida em processo administrativo que garanta ampla defesa ao associado."
        }
      ]
    },
    {
      id: "torneios",
      title: "CAPÍTULO III - DOS TORNEIOS E COMPETIÇÕES",
      subsections: [
        {
          title: "Art. 7º - Organização",
          content: "Os torneios e competições serão organizados pela Diretoria de Torneios, que estabelecerá: I - Calendário anual de eventos; II - Regulamento específico para cada competição; III - Sistema de disputa e critérios de desempate; IV - Premiações quando aplicável; V - Cronograma de inscrições e prazos."
        },
        {
          title: "Art. 8º - Participação",
          content: "Para participar dos torneios, o membro deverá: I - Estar em dia com suas obrigações junto ao Clube; II - Inscrever-se dentro do prazo estabelecido; III - Pagar a taxa de inscrição quando houver; IV - Comparecer ao local e horário determinados; V - Seguir o código de vestimenta apropriado para competições oficiais."
        },
        {
          title: "Art. 9º - Conduta e Ética",
          content: "Durante os torneios, é obrigatório: I - Respeitar os adversários e árbitros; II - Não utilizar qualquer tipo de assistência externa; III - Manter silêncio durante as partidas; IV - Registrar corretamente os lances quando exigido; V - Aceitar as decisões da arbitragem. Violações serão penalizadas conforme a gravidade."
        },
        {
          title: "Art. 10º - Classificação e Rating",
          content: "O Clube manterá ranking atualizado de seus membros baseado: I - Resultados em torneios internos; II - Rating FIDE oficial; III - Rating do Clube calculado pelo sistema ELO interno; IV - Desempenho em competições externas representando o Clube."
        }
      ]
    },
    {
      id: "treinamentos",
      title: "CAPÍTULO IV - DOS TREINAMENTOS E AULAS",
      subsections: [
        {
          title: "Art. 11º - Programa de Treinamento",
          content: "O Clube oferecerá programa de treinamento estruturado em níveis: I - Iniciante: fundamentos básicos e regras; II - Intermediário: táticas, estratégias e aberturas; III - Avançado: análise profunda, finais e preparação competitiva; IV - Elite: treinamento intensivo para competições de alto nível. Os níveis serão definidos pela comissão técnica conforme avaliação do jogador."
        },
        {
          title: "Art. 12º - Horários e Frequência",
          content: "Os horários das aulas e treinamentos serão divulgados mensalmente pela Diretoria. A frequência mínima para permanência nos grupos de treinamento é de 75% das aulas do período. Membros que não atingirem a frequência mínima poderão ser remanejados para grupos adequados à sua disponibilidade."
        },
        {
          title: "Art. 13º - Avaliações",
          content: "Serão realizadas avaliações periódicas para acompanhamento do progresso dos membros, incluindo: I - Partidas classificatórias; II - Testes teóricos; III - Análise de desempenho em torneios; IV - Relatórios individuais dos treinadores."
        }
      ]
    },
    {
      id: "estrutura",
      title: "CAPÍTULO V - DA ESTRUTURA ADMINISTRATIVA",
      subsections: [
        {
          title: "Art. 14º - Diretoria",
          content: "A Diretoria do Clube será composta por: I - Presidente; II - Vice-Presidente; III - Secretário Geral; IV - Tesoureiro; V - Diretor de Torneios; VI - Diretor de Treinamento; VII - Diretor de Comunicação; VIII - Conselho Fiscal. Os mandatos terão duração de 2 anos, permitida uma reeleição consecutiva."
        },
        {
          title: "Art. 15º - Assembleia Geral",
          content: "A Assembleia Geral, órgão máximo do Clube, reunir-se-á: I - Ordinariamente, uma vez por ano para aprovação de contas e eleições; II - Extraordinariamente, quando convocada pela Diretoria ou por 1/3 dos membros efetivos. As decisões serão tomadas por maioria simples dos presentes, exceto alterações estatutárias que exigem 2/3 dos membros efetivos."
        }
      ]
    },
    {
      id: "disciplina",
      title: "CAPÍTULO VI - DO CÓDIGO DE DISCIPLINA",
      subsections: [
        {
          title: "Art. 16º - Infrações Disciplinares",
          content: "Consideram-se infrações disciplinares: I - Desrespeito a membros, treinadores ou dirigentes; II - Conduta antidesportiva em competições; III - Danos ao patrimônio do Clube; IV - Divulgação de informações internas sem autorização; V - Uso indevido das dependências do Clube; VI - Prática de atos discriminatórios ou violentos."
        },
        {
          title: "Art. 17º - Penalidades",
          content: "As penalidades serão aplicadas conforme a gravidade da infração: I - Advertência verbal; II - Advertência por escrito; III - Suspensão de atividades por período determinado; IV - Multa; V - Suspensão do direito de participação em torneios; VI - Exclusão do quadro social. As penalidades serão aplicadas pela Diretoria após processo administrativo que garanta ampla defesa."
        }
      ]
    },
    {
      id: "financeiro",
      title: "CAPÍTULO VII - DAS FINANÇAS",
      subsections: [
        {
          title: "Art. 18º - Receitas",
          content: "Constituem receitas do Clube: I - Mensalidades e taxas associativas; II - Taxas de inscrição em torneios; III - Doações e patrocínios; IV - Receitas de eventos e atividades; V - Rendimentos de aplicações financeiras; VI - Recursos provenientes de convênios e parcerias."
        },
        {
          title: "Art. 19º - Gestão Financeira",
          content: "A gestão financeira do Clube será realizada com transparência, observando: I - Prestação de contas anual à Assembleia Geral; II - Demonstrações financeiras disponíveis para consulta dos membros; III - Controle rigoroso de receitas e despesas; IV - Aplicação dos recursos exclusivamente em atividades do Clube; V - Manutenção de reserva financeira para emergências."
        }
      ]
    },
    {
      id: "disposicoes-finais",
      title: "CAPÍTULO VIII - DISPOSIÇÕES FINAIS",
      subsections: [
        {
          title: "Art. 20º - Alterações",
          content: "Este Regulamento poderá ser alterado por decisão da Assembleia Geral, convocada especificamente para este fim, com aprovação de 2/3 dos membros efetivos presentes."
        },
        {
          title: "Art. 21º - Casos Omissos",
          content: "Os casos omissos serão resolvidos pela Diretoria, que poderá criar normas complementares para o bom funcionamento do Clube, as quais deverão ser submetidas à Assembleia Geral para ratificação."
        },
        {
          title: "Art. 22º - Vigência",
          content: "Este Regulamento entra em vigor na data de sua aprovação pela Assembleia Geral, revogadas as disposições em contrário."
        }
      ]
    }
  ];

  return (
    <>
      <Header />
      <main ref={pageRef} className="relative bg-linear-to-b from-gray-900 to-gray-950">
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
          <div className="absolute top-20 left-20 text-7xl animate-float">♔</div>
          <div className="absolute bottom-20 right-20 text-7xl animate-float-delayed">♕</div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className={`
              inline-block mb-6 transition-all duration-700
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-yellow-500/20 text-yellow-400 backdrop-blur-sm border border-yellow-500/30">
                <span className="mr-2">📜</span>
                Normas e Diretrizes
              </span>
            </div>
            <h1 className={`
              text-4xl md:text-5xl lg:text-6xl font-bold mb-6 transition-all duration-700 delay-100
              bg-linear-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              Regulamento Interno
            </h1>
            <div className={`
              w-24 h-1 bg-yellow-500 mx-auto mb-6 rounded-full transition-all duration-700 delay-150
              ${isVisible ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}
            `} />
            <p className={`
              text-gray-300 max-w-2xl mx-auto text-lg transition-all duration-700 delay-200
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              Conheça as normas que regem o funcionamento do Real Chess Club
            </p>
            <div className={`
              mt-4 inline-block px-4 py-2 bg-white/10 rounded-lg text-sm text-gray-400
              transition-all duration-700 delay-250
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              Última revisão: {lastUpdated}
            </div>
          </div>

          {/* Table of Contents */}
          <div className={`
            bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8
            transition-all duration-700 delay-300
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">📑</span>
              Índice
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {sections.map((section, index) => (
                <a
                  key={index}
                  href={`#${section.id}`}
                  className="text-sm text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  {section.title}
                </a>
              ))}
            </div>
          </div>

          {/* Regulamento Content */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <div
                key={section.id}
                id={section.id}
                className={`
                  bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20
                  transition-all duration-500 hover:border-yellow-500/30
                  ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}
                `}
                style={{ animationDelay: `${300 + index * 100}ms` }}
              >
                <h2 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-yellow-500 rounded-full"></span>
                  {section.title}
                </h2>
                <div className="space-y-4">
                  {section.subsections.map((subsection, idx) => (
                    <div key={idx} className="pl-4 border-l-2 border-yellow-500/30">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {subsection.title}
                      </h3>
                      <p className="text-gray-300 leading-relaxed text-sm">
                        {subsection.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Approval Information */}
          <div className={`
            mt-8 bg-yellow-500/10 rounded-2xl p-6 border border-yellow-500/30 text-center
            transition-all duration-700 delay-800
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <p className="text-gray-300 text-sm leading-relaxed">
              Este Regulamento Interno foi aprovado pela Assembleia Geral realizada em 15 de Janeiro de 2025, 
              com a presença de 2/3 dos membros efetivos do Real Chess Club.
            </p>
          </div>

          {/* Back to Top Button */}
          <div className={`
            mt-8 text-center transition-all duration-700 delay-900
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <a
              href="#"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              Voltar ao topo
            </a>
          </div>

          {/* Related Links */}
          <div className={`
            mt-12 pt-8 border-t border-white/20 text-center
            transition-all duration-700 delay-1000
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <p className="text-sm text-gray-500 mb-4">Documentos relacionados:</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/termos" className="text-sm text-gray-400 hover:text-yellow-400 transition-colors">
                Termos de Uso
              </Link>
              <span className="text-gray-600">•</span>
              <Link href="/privacidade" className="text-sm text-gray-400 hover:text-yellow-400 transition-colors">
                Política de Privacidade
              </Link>
              <span className="text-gray-600">•</span>
              <Link href="/conduta" className="text-sm text-gray-400 hover:text-yellow-400 transition-colors">
                Código de Conduta
              </Link>
            </div>
          </div>

          {/* Trust Badge */}
          <div className={`
            mt-8 text-center transition-all duration-700 delay-1100
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <p className="text-xs text-gray-500">
              🏆 Real Chess Club - Compromisso com a organização e transparência desde 2019
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}