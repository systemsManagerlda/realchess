// app/conduta/page.tsx
"use client";

import { useState, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function Conduta() {
  const [lastUpdated] = useState("15 de Janeiro, 2025");
  const pageRef = useRef<HTMLDivElement>(null);

  const isVisible = true;

  const sections = [
    {
      id: "principios-fundamentais",
      title: "CAPÍTULO I - PRINCÍPIOS FUNDAMENTAIS",
      subsections: [
        {
          title: "Art. 1º - Missão e Valores",
          content: "O Código de Conduta do Real Chess Club fundamenta-se nos valores do xadrez: respeito, disciplina, integridade e fair play. Este código estabelece as diretrizes éticas que devem nortear a conduta de todos os membros, colaboradores e visitantes, visando manter um ambiente harmonioso, respeitoso e propício ao desenvolvimento do esporte."
        },
        {
          title: "Art. 2º - Abrangência",
          content: "Este Código aplica-se a todos os membros do Clube, independentemente de categoria, bem como a treinadores, voluntários, visitantes e participantes de eventos promovidos pelo Real Chess Club, dentro ou fora das dependências do Clube, durante atividades oficiais ou eventos sociais relacionados."
        }
      ]
    },
    {
      id: "conduta-esportiva",
      title: "CAPÍTULO II - DA CONDUTA ESPORTIVA",
      subsections: [
        {
          title: "Art. 3º - Fair Play",
          content: "O fair play é o princípio fundamental do xadrez. Todo membro deve: I - Respeitar as regras do jogo e as decisões da arbitragem; II - Tratar adversários, árbitros e organizadores com cortesia e respeito; III - Jogar com honestidade, abstendo-se de qualquer forma de trapaça ou manipulação; IV - Apertar as mãos antes e após as partidas, demonstrando espírito esportivo; V - Aceitar vitórias e derrotas com dignidade e humildade."
        },
        {
          title: "Art. 4º - Conduta Durante as Partidas",
          content: "Durante as partidas, é obrigatório: I - Manter silêncio absoluto durante os lances; II - Não utilizar qualquer tipo de assistência externa (celulares, anotações, etc.); III - Registrar corretamente os lances quando exigido pelo regulamento; IV - Não abandonar a sala de jogo sem autorização do árbitro; V - Vestir-se adequadamente conforme o código de vestimenta estabelecido para competições oficiais."
        },
        {
          title: "Art. 5º - Conduta Antidesportiva",
          content: "São consideradas condutas antidesportivas: I - Ofensas verbais ou gestuais a adversários ou árbitros; II - Provocações ou comemorações exageradas; III - Atrasos injustificados nas partidas; IV - Abandono de partida sem justificativa; V - Manipulação de resultados; VI - Qualquer forma de assédio ou intimidação. Infrações serão penalizadas conforme a gravidade, podendo resultar em advertência, suspensão ou exclusão."
        }
      ]
    },
    {
      id: "conduta-social",
      title: "CAPÍTULO III - DA CONDUTA SOCIAL",
      subsections: [
        {
          title: "Art. 6º - Respeito e Inclusão",
          content: "O Real Chess Club é um espaço inclusivo e acolhedor. É vedada qualquer forma de: I - Discriminação por raça, cor, gênero, orientação sexual, religião, origem ou condição social; II - Assédio moral ou sexual; III - Bullying ou intimidação; IV - Comentários ou piadas de cunho ofensivo; V - Exclusão ou tratamento diferenciado sem justificativa técnica."
        },
        {
          title: "Art. 7º - Conduta nas Dependências",
          content: "Nas dependências do Clube, todos devem: I - Manter comportamento adequado e respeitoso; II - Zelar pela limpeza e conservação dos espaços; III - Utilizar os equipamentos corretamente; IV - Não fumar ou consumir bebidas alcoólicas em áreas não autorizadas; V - Não portar ou fazer uso de substâncias ilícitas; VI - Estacionar veículos nas áreas designadas."
        },
        {
          title: "Art. 8º - Comunicação e Redes Sociais",
          content: "Ao se comunicar em nome do Clube ou sobre suas atividades, os membros devem: I - Utilizar linguagem respeitosa e adequada; II - Não divulgar informações internas sem autorização; III - Não fazer declarações que possam prejudicar a imagem do Clube; IV - Evitar conflitos públicos nas redes sociais; V - Manter a confidencialidade de dados de outros membros."
        }
      ]
    },
    {
      id: "etica-profissional",
      title: "CAPÍTULO IV - DA ÉTICA PROFISSIONAL",
      subsections: [
        {
          title: "Art. 9º - Treinadores e Educadores",
          content: "Os treinadores e educadores devem: I - Tratar todos os membros com igualdade e respeito; II - Não estabelecer relacionamentos inadequados com alunos; III - Manter sigilo sobre informações pessoais dos membros; IV - Atualizar-se continuamente em conhecimentos técnicos e pedagógicos; V - Promover o desenvolvimento integral dos membros; VI - Servir como exemplos de conduta ética e esportiva."
        },
        {
          title: "Art. 10º - Dirigentes e Administradores",
          content: "Os dirigentes e administradores devem: I - Atuar com transparência e responsabilidade; II - Gerir os recursos do Clube com integridade; III - Evitar conflitos de interesse; IV - Tratar todos os membros com imparcialidade; V - Prestar contas regularmente; VI - Cumprir e fazer cumprir este Código de Conduta."
        },
        {
          title: "Art. 11º - Árbitros e Organizadores",
          content: "Os árbitros e organizadores devem: I - Atuar com imparcialidade e justiça; II - Conhecer profundamente as regras do xadrez; III - Tratar todos os participantes com respeito; IV - Tomar decisões fundamentadas e consistentes; V - Manter a ordem e a disciplina durante os eventos."
        }
      ]
    },
    {
      id: "responsabilidades",
      title: "CAPÍTULO V - DAS RESPONSABILIDADES",
      subsections: [
        {
          title: "Art. 12º - Dos Membros",
          content: "Todo membro do Real Chess Club tem a responsabilidade de: I - Conhecer e cumprir este Código de Conduta; II - Reportar violações à Diretoria; III - Cooperar em investigações internas; IV - Contribuir para um ambiente saudável e acolhedor; V - Representar o Clube com dignidade em eventos externos; VI - Pagar pontualmente suas obrigações financeiras."
        },
        {
          title: "Art. 13º - Do Clube",
          content: "O Real Chess Club compromete-se a: I - Divulgar este Código amplamente; II - Oferecer canais de denúncia seguros; III - Investigar com rigor e imparcialidade; IV - Aplicar penalidades proporcionais; V - Proteger denunciantes de boa-fé; VI - Promover educação continuada sobre ética e conduta."
        }
      ]
    },
    {
      id: "denuncias",
      title: "CAPÍTULO VI - DO SISTEMA DE DENÚNCIAS",
      subsections: [
        {
          title: "Art. 14º - Canais de Denúncia",
          content: "O Clube disponibiliza os seguintes canais para denúncias: I - E-mail: ouvidoria@realchess.co.mz; II - Telefone: +258 84 000 0000; III - Caixa de sugestões na sede; IV - Contato direto com a Diretoria. Todas as denúncias serão tratadas com sigilo e seriedade."
        },
        {
          title: "Art. 15º - Procedimento",
          content: "Ao receber uma denúncia, o Clube adotará os seguintes procedimentos: I - Registro formal da denúncia; II - Análise preliminar de admissibilidade; III - Investigação conduzida por comissão específica; IV - Oitiva do denunciado com garantia de ampla defesa; V - Deliberação com aplicação de penalidade se cabível; VI - Comunicação do resultado às partes envolvidas."
        },
        {
          title: "Art. 16º - Proteção ao Denunciante",
          content: "O Clube assegura proteção a denunciantes de boa-fé, garantindo: I - Anonimato se solicitado; II - Proibição de retaliação; III - Acompanhamento durante o processo; IV - Medidas para evitar exposição indevida. Denúncias comprovadamente falsas ou maliciosas serão tratadas como infração disciplinar."
        }
      ]
    },
    {
      id: "penalidades",
      title: "CAPÍTULO VII - DAS PENALIDADES",
      subsections: [
        {
          title: "Art. 17º - Graus de Infração",
          content: "As infrações são classificadas em: I - Leves: desrespeitos pontuais, pequenas negligências; II - Médias: condutas repetidas, desrespeitos significativos; III - Graves: violações de princípios fundamentais, discriminação, assédio, trapaça; IV - Gravíssimas: condutas criminosas, violência, corrupção, danos graves ao Clube."
        },
        {
          title: "Art. 18º - Penalidades Aplicáveis",
          content: "Conforme a gravidade da infração, poderão ser aplicadas: I - Advertência verbal; II - Advertência por escrito; III - Suspensão de atividades por período determinado; IV - Multa; V - Suspensão do direito de participação em torneios; VI - Suspensão do direito de usar as dependências; VII - Exclusão do quadro social; VIII - Proibição de frequentar o Clube."
        },
        {
          title: "Art. 19º - Reincidência",
          content: "A reincidência será considerada agravante na aplicação de penalidades. Em caso de reincidência em infração grave, o membro poderá ser excluído sumariamente do quadro social, mediante decisão da Diretoria após processo administrativo que garanta ampla defesa."
        }
      ]
    },
    {
      id: "disposicoes-finais",
      title: "CAPÍTULO VIII - DISPOSIÇÕES FINAIS",
      subsections: [
        {
          title: "Art. 20º - Alterações",
          content: "Este Código de Conduta poderá ser alterado por decisão da Assembleia Geral, convocada especificamente para este fim, com aprovação de 2/3 dos membros efetivos presentes. Alterações significativas serão comunicadas a todos os membros com antecedência mínima de 30 dias."
        },
        {
          title: "Art. 21º - Conhecimento e Aceitação",
          content: "Todo novo membro, ao ingressar no Clube, declara ter lido e aceitar integralmente este Código de Conduta. O desconhecimento das normas não exime o membro das responsabilidades e penalidades previstas."
        },
        {
          title: "Art. 22º - Vigência",
          content: "Este Código de Conduta entra em vigor na data de sua aprovação pela Assembleia Geral, revogadas as disposições em contrário. As normas aqui estabelecidas aplicam-se imediatamente a todos os membros e frequentadores do Real Chess Club."
        }
      ]
    }
  ];

  return (
    <>
      <Header />
      <main ref={pageRef} className="relative bg-linear-to-b from-gray-900 to-gray-950 mt-10">
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

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className={`
              inline-block mb-6 transition-all duration-700
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-yellow-500/20 text-yellow-400 backdrop-blur-sm border border-yellow-500/30">
                <span className="mr-2">⚖️</span>
                Ética e Respeito
              </span>
            </div>
            <h1 className={`
              text-4xl md:text-5xl lg:text-6xl font-bold mb-6 transition-all duration-700 delay-100
              bg-linear-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              Código de Conduta
            </h1>
            <div className={`
              w-24 h-1 bg-yellow-500 mx-auto mb-6 rounded-full transition-all duration-700 delay-150
              ${isVisible ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}
            `} />
            <p className={`
              text-gray-300 max-w-2xl mx-auto text-lg transition-all duration-700 delay-200
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              Princípios e diretrizes que norteiam nossa convivência e prática do xadrez
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

          {/* Conduta Content */}
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
                      <div className="text-gray-300 leading-relaxed text-sm whitespace-pre-line">
                        {subsection.content.split('\n').map((paragraph, i) => (
                          <p key={i} className="mb-2 last:mb-0">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Commitment Statement */}
          <div className={`
            mt-8 bg-yellow-500/10 rounded-2xl p-6 border border-yellow-500/30 text-center
            transition-all duration-700 delay-800
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="text-2xl">🤝</span>
              <h3 className="text-lg font-bold text-white">Nosso Compromisso</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Como membros do Real Chess Club, comprometemo-nos a zelar pela excelência ética, 
              promover um ambiente de respeito mútuo e honrar os valores do xadrez dentro e fora do tabuleiro.
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
              <Link href="/regulamento" className="text-sm text-gray-400 hover:text-yellow-400 transition-colors">
                Regulamento Interno
              </Link>
            </div>
          </div>

          {/* Trust Badge */}
          <div className={`
            mt-8 text-center transition-all duration-700 delay-1100
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <p className="text-xs text-gray-500">
              🏆 Real Chess Club - Onde a ética e o respeito são tão importantes quanto a vitória
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}