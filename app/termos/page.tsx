// app/termos/page.tsx
"use client";

import { useState, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function Termos() {
  const [lastUpdated] = useState("15 de Janeiro, 2025");
  const pageRef = useRef<HTMLDivElement>(null);

  const isVisible = true;

  const sections = [
    {
      id: "aceitacao",
      title: "1. Aceitação dos Termos",
      content: "Ao acessar e utilizar o site do Real Chess Club ('nós', 'nosso' ou 'clube'), você concorda em cumprir estes Termos de Uso, todas as leis e regulamentos aplicáveis, e reconhece que é responsável por cumprir as leis locais. Se você não concordar com qualquer um desses termos, está proibido de usar ou acessar este site. Os materiais contidos neste site são protegidos pelas leis de direitos autorais e marcas registradas de Moçambique."
    },
    {
      id: "licenca",
      title: "2. Licença de Uso",
      content: "É concedida permissão para acessar e usar o site do Real Chess Club para fins pessoais e não comerciais. Esta é a concessão de uma licença, não uma transferência de título. Sob esta licença, você não pode: (a) modificar ou copiar os materiais; (b) usar os materiais para qualquer finalidade comercial; (c) tentar descompilar ou fazer engenharia reversa de qualquer software contido no site; (d) remover quaisquer direitos autorais ou outras notações de propriedade; (e) transferir os materiais para outra pessoa ou 'espelhar' os materiais em qualquer outro servidor. Esta licença será automaticamente rescindida se você violar qualquer uma dessas restrições e poderá ser rescindida pelo Real Chess Club a qualquer momento."
    },
    {
      id: "membros",
      title: "3. Registro e Associação",
      content: "Para se tornar membro do Real Chess Club, você deve fornecer informações precisas, completas e atualizadas. Você é responsável por manter a confidencialidade de sua conta e senha, e por todas as atividades que ocorrem em sua conta. O clube reserva-se o direito de recusar, suspender ou cancelar qualquer associação a qualquer momento, por qualquer motivo, incluindo violação destes termos. Os membros concordam em: (a) notificar imediatamente o clube sobre qualquer uso não autorizado de sua conta; (b) garantir que saem de sua conta ao final de cada sessão; (c) não compartilhar credenciais de acesso."
    },
    {
      id: "torneios",
      title: "4. Participação em Torneios",
      content: "A participação em torneios organizados pelo Real Chess Club está sujeita a regras específicas que serão comunicadas previamente. Os participantes devem: (a) cumprir o regulamento do torneio; (b) manter conduta esportiva adequada; (c) respeitar adversários, árbitros e organização; (d) estar presentes no local e horário determinados; (e) pagar as taxas de inscrição quando aplicável. O clube reserva-se o direito de desclassificar participantes que violem as regras ou tenham conduta inadequada. Resultados oficiais serão divulgados após validação pela arbitragem."
    },
    {
      id: "conteudo",
      title: "5. Conteúdo do Usuário",
      content: "Ao enviar conteúdo para nosso site (comentários, mensagens no fórum, etc.), você concede ao Real Chess Club uma licença mundial, não exclusiva, livre de royalties para usar, reproduzir, modificar e publicar esse conteúdo. Você declara que possui os direitos necessários sobre o conteúdo enviado e que este não viola direitos de terceiros. O clube não endossa nenhum conteúdo de usuário e reserva-se o direito de remover qualquer conteúdo considerado inadequado, ofensivo ou que viole estes termos, sem aviso prévio."
    },
    {
      id: "propriedade",
      title: "6. Propriedade Intelectual",
      content: "Todo o conteúdo do site, incluindo textos, gráficos, logos, ícones, imagens, clipes de áudio, downloads digitais, compilações de dados e software, é propriedade do Real Chess Club ou de seus fornecedores de conteúdo e está protegido pelas leis de direitos autorais de Moçambique e tratados internacionais. A compilação de todo o conteúdo é propriedade exclusiva do Real Chess Club. As marcas e logos exibidos no site são marcas registradas do clube ou de seus parceiros."
    },
    {
      id: "conduta",
      title: "7. Conduta do Usuário",
      content: "Ao utilizar nossos serviços, você concorda em não: (a) usar o site para qualquer propósito ilegal; (b) assediar, abusar ou difamar outros usuários; (c) publicar conteúdo ofensivo, discriminatório ou violento; (d) interferir na operação do site; (e) tentar acessar áreas restritas não autorizadas; (f) usar bots, scripts ou outros métodos automatizados; (g) coletar informações de outros usuários sem consentimento; (h) violar quaisquer leis aplicáveis. Violações podem resultar em suspensão ou cancelamento da conta."
    },
    {
      id: "limitacao",
      title: "8. Limitação de Responsabilidade",
      content: "O Real Chess Club não será responsável por quaisquer danos (incluindo, sem limitação, danos por perda de dados ou lucro, ou devido a interrupção de negócios) decorrentes do uso ou da incapacidade de usar os materiais do site, mesmo que o Real Chess Club ou um representante autorizado tenha sido notificado oralmente ou por escrito da possibilidade de tais danos. Em nenhum caso a responsabilidade total do clube excederá o valor pago por você, se houver, pelo acesso aos serviços. Algumas jurisdições não permitem limitações de responsabilidade, então esta limitação pode não se aplicar a você."
    },
    {
      id: "alteracoes",
      title: "9. Alterações nos Termos",
      content: "O Real Chess Club pode revisar estes Termos de Uso a qualquer momento, sem aviso prévio. Ao utilizar este site, você concorda em ficar vinculado à versão atual destes Termos de Uso. Recomendamos que você revise esta página periodicamente para se manter informado sobre quaisquer alterações. Alterações significativas serão comunicadas por email ou através de um aviso em destaque em nosso site. O uso continuado dos serviços após as alterações constitui aceitação dos novos termos."
    },
    {
      id: "lei-aplicavel",
      title: "10. Lei Aplicável",
      content: "Estes Termos de Uso são regidos e interpretados de acordo com as leis de Moçambique, sem considerar seus conflitos de disposições legais. Você concorda que qualquer ação legal ou equitativa decorrente ou relacionada a estes Termos será arquivada exclusivamente nos tribunais localizados em Maputo, Moçambique, e você consente com a jurisdição pessoal de tais tribunais para tais ações. O Real Chess Club opera a partir de Moçambique e não faz representações de que o conteúdo do site é apropriado ou disponível para uso em outros locais."
    }
  ];

  const importantLinks = [
    { name: "Política de Privacidade", href: "/privacidade", icon: "🔒" },
    { name: "Regulamento do Clube", href: "/regulamento", icon: "📜" },
    { name: "Código de Conduta", href: "/conduta", icon: "⚖️" },
    { name: "Fale Conosco", href: "/contato", icon: "📞" },
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
                Termos e Condições
              </span>
            </div>
            <h1 className={`
              text-4xl md:text-5xl lg:text-6xl font-bold mb-6 transition-all duration-700 delay-100
              bg-linear-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              Termos de Uso
            </h1>
            <div className={`
              w-24 h-1 bg-yellow-500 mx-auto mb-6 rounded-full transition-all duration-700 delay-150
              ${isVisible ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}
            `} />
            <p className={`
              text-gray-300 max-w-2xl mx-auto text-lg transition-all duration-700 delay-200
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              Leia atentamente os termos e condições que regem o uso de nossos serviços
            </p>
            <div className={`
              mt-4 inline-block px-4 py-2 bg-white/10 rounded-lg text-sm text-gray-400
              transition-all duration-700 delay-250
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              Última atualização: {lastUpdated}
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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
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

          {/* Terms Content */}
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
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-yellow-500 rounded-full"></span>
                  {section.title}
                </h2>
                <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {section.content.split('\n').map((paragraph, i) => (
                    <p key={i} className="mb-3 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Important Links */}
          <div className={`
            mt-8 bg-yellow-500/10 rounded-2xl p-6 border border-yellow-500/30
            transition-all duration-700 delay-800
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <h2 className="text-lg font-bold text-white mb-4 text-center">Documentos Importantes</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {importantLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="group flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300"
                >
                  <span className="text-2xl">{link.icon}</span>
                  <span className="text-xs text-gray-400 group-hover:text-yellow-400 text-center transition-colors">
                    {link.name}
                  </span>
                </Link>
              ))}
            </div>
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

          {/* Acceptance Statement */}
          <div className={`
            mt-8 text-center transition-all duration-700 delay-1000
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <p className="text-xs text-gray-500 leading-relaxed">
              Ao utilizar nossos serviços, você reconhece que leu, entendeu e concorda com todos os termos e condições estabelecidos. 
              Estes Termos de Uso constituem um acordo legal entre você e o Real Chess Club.
            </p>
          </div>

          {/* Trust Badge */}
          <div className={`
            mt-8 text-center transition-all duration-700 delay-1100
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <p className="text-xs text-gray-500">
              🏆 Real Chess Club - Compromisso com a transparência e o respeito aos nossos membros
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}