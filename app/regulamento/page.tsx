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
          content: "O Real Chess Club, doravante denominado Clube, é uma associação civil sem fins lucrativos, com sede no Bairro das Mahotas, Maputo - Moçambique. O Clube tem como objectivo promover, desenvolver e difundir a prática do xadrez em todos os níveis sociais, formando atletas e cidadãos exemplares. A sua duração é por tempo indeterminado."
        },
        {
          title: "Art. 2º - Dos Objectivos",
          content: "São objectivos do Clube: I - Promover torneios, campeonatos e eventos relacionados ao xadrez; II - Oferecer treinamento e formação técnica para enxadristas de todos os níveis; III - Representar os seus membros em competições oficiais; IV - Fomentar a integração social através do desporto; V - Manter intercâmbio com outras entidades nacionais e internacionais; VI - Incentivar a prática do xadrez em escolas e comunidades; VII - Colaborar com a Federação Moçambicana de Xadrez no desenvolvimento do desporto no país."
        },
        {
          title: "Art. 3º - Símbolos e Identidade",
          content: "O Clube possui como símbolos: I - Brasão oficial, com as cores amarela, preta e branca; II - Bandeira do Clube; III - Hino do Clube; IV - Lema: 'Onde os campeões são feitos'. Os símbolos são de uso exclusivo do Clube e não podem ser utilizados sem autorização expressa da Diretoria."
        }
      ]
    },
    {
      id: "membros",
      title: "CAPÍTULO II - DOS MEMBROS",
      subsections: [
        {
          title: "Art. 4º - Categorias de Membros",
          content: "O Clube possui as seguintes categorias de membros: I - Membros Fundadores: aqueles que participaram da fundação do Clube, com direitos vitalícios e honrarias especiais; II - Membros Efectivos: maiores de 18 anos que participam regularmente das actividades, com direito a voto e elegibilidade; III - Membros Juvenis: membros entre 12 e 17 anos, com direitos limitados de participação; IV - Membros Infantis: membros até 11 anos, acompanhados por responsável; V - Membros Beneméritos: personalidades que prestaram relevantes serviços ao Clube, com honrarias vitalícias; VI - Membros Honorários: personalidades que se destacaram no xadrez nacional ou internacional; VII - Membros Temporários: participantes de eventos específicos ou cursos de curta duração."
        },
        {
          title: "Art. 5º - Direitos dos Membros",
          content: "São direitos dos membros efectivos: I - Participar das actividades promovidas pelo Clube; II - Votar e ser votado para os cargos electivos da Diretoria; III - Utilizar as instalações do Clube conforme regulamento interno; IV - Participar de torneios e eventos exclusivos para membros; V - Receber descontos em cursos, materiais e produtos do Clube; VI - Representar o Clube em competições oficiais; VII - Acessar conteúdos exclusivos e materiais de treinamento; VIII - Participar das Assembleias Gerais com direito a voz e voto; IX - Propor iniciativas e projectos para o Clube."
        },
        {
          title: "Art. 6º - Deveres dos Membros",
          content: "São deveres de todos os membros: I - Cumprir este Regulamento, o Código de Conduta e as decisões da Diretoria; II - Pagar pontualmente as mensalidades e taxas estipuladas; III - Manter conduta ética, desportiva e respeitosa; IV - Zelar pelo patrimônio e pelas instalações do Clube; V - Participar das Assembleias Gerais sempre que possível; VI - Respeitar os demais membros, treinadores e equipe do Clube; VII - Comunicar à Diretoria qualquer irregularidade ou situação que necessite de atenção; VIII - Representar o Clube com dignidade em eventos externos; IX - Manter actualizados os dados cadastrais."
        },
        {
          title: "Art. 7º - Da Admissão",
          content: "A admissão de novos membros será feita mediante: I - Solicitação formal preenchendo o formulário de inscrição; II - Apresentação de documentos de identificação; III - Pagamento da taxa de inscrição e primeira mensalidade; IV - Aceitação expressa deste Regulamento e do Código de Conduta; V - Aprovação da Diretoria. A Diretoria poderá recusar a admissão de candidatos sem justificativa, desde que não haja discriminação."
        },
        {
          title: "Art. 8º - Da Exclusão",
          content: "Poderá ser excluído do quadro social o membro que: I - Deixar de pagar as mensalidades por mais de 3 (três) meses consecutivos, após notificação formal; II - Praticar actos que desabonem a reputação do Clube; III - Descumprir reiteradamente este Regulamento ou o Código de Conduta; IV - Praticar qualquer forma de violência, discriminação ou assédio; V - Causar danos voluntários ao patrimônio do Clube; VI - Utilizar o nome do Clube para fins não autorizados. A exclusão será decidida em processo administrativo que garanta ampla defesa ao associado."
        }
      ]
    },
    {
      id: "torneios",
      title: "CAPÍTULO III - DOS TORNEIOS E COMPETIÇÕES",
      subsections: [
        {
          title: "Art. 9º - Organização",
          content: "Os torneios e competições serão organizados pela Diretoria de Torneios, que estabelecerá: I - Calendário anual de eventos, com antecedência mínima de 60 dias; II - Regulamento específico para cada competição, publicado com 30 dias de antecedência; III - Sistema de disputa e critérios de desempate conforme as regras da FIDE; IV - Premiações em dinheiro, troféus e medalhas quando aplicável; V - Cronograma de inscrições e prazos; VI - Equipe de arbitragem qualificada e credenciada pela FMOX."
        },
        {
          title: "Art. 10º - Participação",
          content: "Para participar dos torneios, o membro deverá: I - Estar em dia com as suas obrigações junto ao Clube; II - Inscrever-se dentro do prazo estabelecido e pagar a taxa de inscrição quando houver; III - Comparecer ao local e horário determinados; IV - Seguir o código de vestimenta apropriado para competições oficiais; V - Apresentar documento de identificação no acto da inscrição; VI - Ter classificação compatível com a categoria do torneio quando exigido."
        },
        {
          title: "Art. 11º - Conduta e Ética",
          content: "Durante os torneios, é obrigatório: I - Respeitar os adversários, árbitros e organizadores; II - Não utilizar qualquer tipo de assistência externa (celulares, anotações, etc.); III - Manter silêncio absoluto durante as partidas; IV - Registrar correctamente os lances quando exigido pelo regulamento; V - Aceitar as decisões da arbitragem, com direito a recurso dentro do prazo estabelecido; VI - Não abandonar a sala de jogo sem autorização do árbitro; VII - Apertar as mãos antes e após as partidas, demonstrando espírito desportivo."
        },
        {
          title: "Art. 12º - Classificação e Rating",
          content: "O Clube manterá ranking actualizado dos seus membros baseado em: I - Resultados em torneios internos e externos; II - Rating FIDE oficial, quando disponível; III - Rating do Clube calculado pelo sistema ELO interno; IV - Desempenho em competições externas representando o Clube; V - Evolução técnica avaliada pelos treinadores. O ranking será publicado mensalmente e servirá para definição de participantes em torneios com vagas limitadas."
        },
        {
          title: "Art. 13º - Torneios Internacionais",
          content: "Para participação em torneios internacionais: I - O membro deve ter rating FIDE mínimo exigido; II - Deve comunicar à Diretoria com antecedência de 60 dias; III - O Clube poderá apoiar financeiramente membros selecionados; IV - O membro deve representar o Clube com dignidade; V - Os resultados serão incorporados ao ranking do Clube."
        }
      ]
    },
    {
      id: "treinamentos",
      title: "CAPÍTULO IV - DOS TREINAMENTOS E AULAS",
      subsections: [
        {
          title: "Art. 14º - Programa de Treinamento",
          content: "O Clube oferecerá programa de treinamento estruturado em níveis: I - Iniciante (Nível 1): fundamentos básicos, regras, movimentos das peças, conceitos de xeque e xeque-mate; II - Intermediário (Nível 2): tácticas básicas, estratégias iniciais, aberturas elementares, finais simples; III - Avançado (Nível 3): análise profunda, estudo de aberturas, finais complexos, preparação competitiva; IV - Elite (Nível 4): treinamento intensivo para competições de alto nível, análise de partidas de GM, preparação psicológica. Os níveis serão definidos pela comissão técnica conforme avaliação do jogador."
        },
        {
          title: "Art. 15º - Horários e Frequência",
          content: "Os horários das aulas e treinamentos serão divulgados mensalmente pela Diretoria, com no mínimo 15 dias de antecedência. A frequência mínima para permanência nos grupos de treinamento é de 75% das aulas do período. Membros que não atingirem a frequência mínima poderão ser remanejados para grupos adequados à sua disponibilidade. Aulas perdidas por motivo de força maior serão justificadas mediante apresentação de comprovante."
        },
        {
          title: "Art. 16º - Avaliações",
          content: "Serão realizadas avaliações periódicas para acompanhamento do progresso dos membros, incluindo: I - Partidas classificatórias a cada 2 meses; II - Testes teóricos sobre regras e conceitos; III - Análise de desempenho em torneios; IV - Relatórios individuais dos treinadores a cada semestre; V - Autoavaliação dos membros; VI - Avaliação de aspectos comportamentais e de espírito desportivo."
        },
        {
          title: "Art. 17º - Treinadores e Educadores",
          content: "Os treinadores e educadores do Clube devem: I - Ser credenciados pela FMOX ou ter comprovada experiência no ensino do xadrez; II - Manter actualização contínua em conhecimentos técnicos e pedagógicos; III - Tratar todos os membros com igualdade e respeito; IV - Manter sigilo sobre informações pessoais dos membros; V - Servir como exemplos de conduta ética e desportiva; VI - Participar de reuniões pedagógicas periódicas; VII - Elaborar planos de ensino adequados a cada nível."
        }
      ]
    },
    {
      id: "estrutura",
      title: "CAPÍTULO V - DA ESTRUTURA ADMINISTRATIVA",
      subsections: [
        {
          title: "Art. 18º - Diretoria",
          content: "A Diretoria do Clube será composta por: I - Presidente; II - Vice-Presidente; III - Secretário-Geral; IV - Tesoureiro; V - Diretor de Torneios; VI - Diretor de Treinamento; VII - Diretor de Comunicação e Marketing; VIII - Diretor Social e Eventos; IX - Conselho Fiscal com 3 membros efectivos. Os mandatos terão duração de 2 (dois) anos, permitida uma reeleição consecutiva. As eleições serão realizadas em Assembleia Geral ordinária."
        },
        {
          title: "Art. 19º - Atribuições da Diretoria",
          content: "Compete à Diretoria: I - Administrar o Clube conforme este Regulamento; II - Convocar e presidir as Assembleias Gerais; III - Elaborar o plano de actividades e orçamento anual; IV - Gerir o patrimônio e as finanças do Clube; V - Deliberar sobre admissão e exclusão de membros; VI - Propor alterações neste Regulamento; VII - Representar o Clube perante terceiros; VIII - Prestar contas à Assembleia Geral."
        },
        {
          title: "Art. 20º - Assembleia Geral",
          content: "A Assembleia Geral, órgão máximo do Clube, reunir-se-á: I - Ordinariamente, uma vez por ano no primeiro trimestre para aprovação de contas, eleições e deliberações gerais; II - Extraordinariamente, quando convocada pela Diretoria por iniciativa própria ou por solicitação de 1/3 dos membros efectivos. As decisões serão tomadas por maioria simples dos presentes, exceto alterações estatutárias e exclusão de membros que exigem 2/3 dos membros efectivos. O quórum mínimo para deliberação é de 1/3 dos membros efectivos."
        }
      ]
    },
    {
      id: "disciplina",
      title: "CAPÍTULO VI - DO CÓDIGO DE DISCIPLINA",
      subsections: [
        {
          title: "Art. 21º - Infrações Disciplinares",
          content: "Consideram-se infrações disciplinares: I - Desrespeito a membros, treinadores, dirigentes ou visitantes; II - Conduta antidesportiva em competições; III - Danos ao patrimônio do Clube, dolosos ou culposos; IV - Divulgação de informações internas sem autorização da Diretoria; V - Uso indevido das dependências do Clube; VI - Prática de actos discriminatórios, violentos ou de assédio; VII - Ausência injustificada em compromissos assumidos com o Clube; VIII - Utilização do nome do Clube para fins pessoais não autorizados."
        },
        {
          title: "Art. 22º - Penalidades",
          content: "As penalidades serão aplicadas conforme a gravidade da infracção e a reincidência: I - Advertência verbal (infrações leves); II - Advertência por escrito, com registro em ata (infrações leves reincidentes); III - Suspensão de actividades por 15 a 90 dias (infrações médias); IV - Multa de 1 a 5 mensalidades (conforme gravidade); V - Suspensão do direito de participação em torneios por 1 a 6 meses; VI - Exclusão do quadro social (infrações graves ou reincidência). As penalidades serão aplicadas pela Diretoria após processo administrativo que garanta ampla defesa."
        },
        {
          title: "Art. 23º - Processo Disciplinar",
          content: "O processo disciplinar seguirá os seguintes passos: I - Recebimento e registo da denúncia formal; II - Notificação do denunciado com prazo de 10 dias para defesa; III - Instrução processual com coleta de provas; IV - Deliberação da Diretoria em até 30 dias; V - Comunicação da decisão ao denunciado; VI - Possibilidade de recurso à Assembleia Geral em até 15 dias. O processo é sigiloso até a decisão final."
        }
      ]
    },
    {
      id: "financeiro",
      title: "CAPÍTULO VII - DAS FINANÇAS E PATRIMÔNIO",
      subsections: [
        {
          title: "Art. 24º - Receitas",
          content: "Constituem receitas do Clube: I - Mensalidades e taxas associativas; II - Taxas de inscrição em torneios e eventos; III - Doações, patrocínios e contribuições voluntárias; IV - Receitas de eventos, cursos e actividades; V - Rendimentos de aplicações financeiras do Clube; VI - Recursos provenientes de convênios, editais e parcerias; VII - Vendas de materiais e produtos do Clube; VIII - Aluguéis de espaço quando aplicável."
        },
        {
          title: "Art. 25º - Gestão Financeira",
          content: "A gestão financeira do Clube será realizada com transparência e responsabilidade: I - Prestação de contas anual à Assembleia Geral, com relatório detalhado; II - Demonstrações financeiras disponíveis para consulta dos membros; III - Controle rigoroso de receitas e despesas, com registro contábil; IV - Aplicação dos recursos exclusivamente em actividades do Clube; V - Manutenção de reserva financeira para emergências (equivalente a 3 meses de despesas); VI - Auditoria externa anual quando o orçamento ultrapassar 1.000.000 MT."
        },
        {
          title: "Art. 26º - Patrimônio",
          content: "O patrimônio do Clube é constituído por: I - Bens móveis e imóveis adquiridos; II - Equipamentos e materiais esportivos; III - Recursos financeiros em conta; IV - Direitos e créditos do Clube. O patrimônio do Clube é inalienável e não pode ser utilizado para fins particulares. Em caso de extinção do Clube, o patrimônio será destinado a instituição de caráter beneficente ou esportivo, conforme deliberação da Assembleia Geral."
        }
      ]
    },
    {
      id: "comunicacao",
      title: "CAPÍTULO VIII - DA COMUNICAÇÃO E RELAÇÕES PÚBLICAS",
      subsections: [
        {
          title: "Art. 27º - Comunicação Oficial",
          content: "A comunicação oficial do Clube será feita por: I - Site oficial do Clube; II - Página oficial nas redes sociais; III - Grupos de comunicação oficial (WhatsApp, Telegram); IV - Boletim informativo mensal; V - Quadro de avisos na sede. Apenas a Diretoria e o Departamento de Comunicação estão autorizados a fazer comunicações oficiais em nome do Clube."
        },
        {
          title: "Art. 28º - Uso da Marca",
          content: "O uso da marca, logotipo e símbolos do Clube por membros ou terceiros requer autorização expressa da Diretoria. Membros podem utilizar a marca do Clube em: I - Uniformes oficiais; II - Materiais de treinamento; III - Comunicação de participação em eventos, desde que em caráter representativo. É proibido o uso comercial da marca sem autorização."
        },
        {
          title: "Art. 29º - Relações com a Imprensa",
          content: "A Diretoria designará um porta-voz oficial para: I - Conceder entrevistas; II - Divulgar resultados oficiais; III - Comunicar eventos do Clube; IV - Esclarecer posicionamentos do Clube. Membros não autorizados não devem falar em nome do Clube perante a imprensa."
        }
      ]
    },
    {
      id: "disposicoes-finais",
      title: "CAPÍTULO IX - DISPOSIÇÕES FINAIS",
      subsections: [
        {
          title: "Art. 30º - Alterações",
          content: "Este Regulamento poderá ser alterado por decisão da Assembleia Geral, convocada especificamente para este fim, com aprovação de 2/3 dos membros efectivos presentes. As propostas de alteração devem ser apresentadas à Diretoria com antecedência mínima de 30 dias da Assembleia."
        },
        {
          title: "Art. 31º - Casos Omissos",
          content: "Os casos omissos serão resolvidos pela Diretoria, que poderá criar normas complementares para o bom funcionamento do Clube, as quais deverão ser submetidas à Assembleia Geral para ratificação na primeira oportunidade."
        },
        {
          title: "Art. 32º - Cláusula de Transição",
          content: "Os membros existentes na data de entrada em vigor deste Regulamento terão um prazo de 90 dias para se adaptarem às novas disposições, especialmente quanto às categorias de membros e obrigações financeiras."
        },
        {
          title: "Art. 33º - Vigência",
          content: "Este Regulamento entra em vigor na data de sua aprovação pela Assembleia Geral, revogadas as disposições em contrário. As normas aqui estabelecidas aplicam-se imediatamente a todos os membros e frequentadores do Real Chess Club."
        }
      ]
    }
  ];

  return (
    <>
      <Header />
      <main ref={pageRef} className="relative bg-linear-to-b from-gray-900 to-gray-950 mt-10">
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
          <div className="absolute top-20 left-20 text-7xl animate-float">♔</div>
          <div className="absolute bottom-20 right-20 text-7xl animate-float-delayed">♕</div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Cabeçalho */}
          <div className="text-center mb-12">
            <div className={`
              inline-block mb-6 transition-all duration-700
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-yellow-500/20 text-yellow-400 backdrop-blur-sm border border-yellow-500/30">
                <span className="mr-2">📜</span>
                Normas e Directrizes
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

          {/* Índice */}
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

          {/* Conteúdo do Regulamento */}
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

          {/* Informações de Aprovação */}
          <div className={`
            mt-8 bg-yellow-500/10 rounded-2xl p-6 border border-yellow-500/30 text-center
            transition-all duration-700 delay-800
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <p className="text-gray-300 text-sm leading-relaxed">
              Este Regulamento Interno foi aprovado pela Assembleia Geral realizada em 15 de Janeiro de 2025, 
              com a presença de 2/3 dos membros efectivos do Real Chess Club. O documento está disponível 
              para consulta na sede do Clube e em formato digital no site oficial.
            </p>
          </div>

          {/* Botão Voltar ao Topo */}
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

          {/* Links Relacionados */}
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

          {/* Selo de Confiança */}
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