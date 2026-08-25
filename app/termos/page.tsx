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
      content: "Ao aceder e utilizar o site do Real Chess Club ('nós', 'nosso' ou 'clube'), você concorda em cumprir estes Termos de Uso, todas as leis e regulamentos aplicáveis, e reconhece que é responsável por cumprir as leis locais. Se você não concordar com qualquer um destes termos, está proibido de usar ou aceder a este site. Os materiais contidos neste site estão protegidos pelas leis de direitos de autor e marcas registadas de Moçambique."
    },
    {
      id: "licenca",
      title: "2. Licença de Uso",
      content: "É concedida permissão para aceder e usar o site do Real Chess Club para fins pessoais e não comerciais. Esta é a concessão de uma licença, não uma transferência de título. Sob esta licença, você não pode: (a) modificar ou copiar os materiais; (b) usar os materiais para qualquer finalidade comercial; (c) tentar descompilar ou fazer engenharia reversa de qualquer software contido no site; (d) remover quaisquer direitos de autor ou outras notações de propriedade; (e) transferir os materiais para outra pessoa ou 'espelhar' os materiais em qualquer outro servidor. Esta licença será automaticamente rescindida se você violar qualquer uma destas restrições e poderá ser rescindida pelo Real Chess Club a qualquer momento."
    },
    {
      id: "membros",
      title: "3. Registo e Associação",
      content: "Para se tornar membro do Real Chess Club, você deve fornecer informações precisas, completas e actualizadas. Você é responsável por manter a confidencialidade da sua conta e palavra-passe, e por todas as actividades que ocorrem na sua conta. O clube reserva-se o direito de recusar, suspender ou cancelar qualquer associação a qualquer momento, por qualquer motivo, incluindo violação destes termos. Os membros concordam em: (a) notificar imediatamente o clube sobre qualquer uso não autorizado da sua conta; (b) garantir que saem da sua conta ao final de cada sessão; (c) não partilhar credenciais de acesso."
    },
    {
      id: "torneios",
      title: "4. Participação em Torneios",
      content: "A participação em torneios organizados pelo Real Chess Club está sujeita a regras específicas que serão comunicadas previamente. Os participantes devem: (a) cumprir o regulamento do torneio; (b) manter conduta desportiva adequada; (c) respeitar adversários, árbitros e organização; (d) estar presentes no local e horário determinados; (e) pagar as taxas de inscrição quando aplicável. O clube reserva-se o direito de desclassificar participantes que violem as regras ou tenham conduta inadequada. Os resultados oficiais serão divulgados após validação pela arbitragem."
    },
    {
      id: "conteudo",
      title: "5. Conteúdo do Utilizador",
      content: "Ao enviar conteúdo para o nosso site (comentários, mensagens no fórum, etc.), você concede ao Real Chess Club uma licença mundial, não exclusiva, livre de royalties para usar, reproduzir, modificar e publicar esse conteúdo. Você declara que possui os direitos necessários sobre o conteúdo enviado e que este não viola direitos de terceiros. O clube não endossa nenhum conteúdo de utilizador e reserva-se o direito de remover qualquer conteúdo considerado inadequado, ofensivo ou que viole estes termos, sem aviso prévio."
    },
    {
      id: "propriedade",
      title: "6. Propriedade Intelectual",
      content: "Todo o conteúdo do site, incluindo textos, gráficos, logótipos, ícones, imagens, clipes de áudio, descargas digitais, compilações de dados e software, é propriedade do Real Chess Club ou dos seus fornecedores de conteúdo e está protegido pelas leis de direitos de autor de Moçambique e tratados internacionais. A compilação de todo o conteúdo é propriedade exclusiva do Real Chess Club. As marcas e logótipos exibidos no site são marcas registadas do clube ou dos seus parceiros."
    },
    {
      id: "conduta",
      title: "7. Conduta do Utilizador",
      content: "Ao utilizar os nossos serviços, você concorda em não: (a) usar o site para qualquer propósito ilegal; (b) assediar, abusar ou difamar outros utilizadores; (c) publicar conteúdo ofensivo, discriminatório ou violento; (d) interferir na operação do site; (e) tentar aceder a áreas restritas não autorizadas; (f) usar bots, scripts ou outros métodos automatizados; (g) recolher informações de outros utilizadores sem consentimento; (h) violar quaisquer leis aplicáveis. As violações podem resultar em suspensão ou cancelamento da conta."
    },
    {
      id: "limitacao",
      title: "8. Limitação de Responsabilidade",
      content: "O Real Chess Club não será responsável por quaisquer danos (incluindo, sem limitação, danos por perda de dados ou lucro, ou devido a interrupção de negócios) decorrentes do uso ou da incapacidade de usar os materiais do site, mesmo que o Real Chess Club ou um representante autorizado tenha sido notificado oralmente ou por escrito da possibilidade de tais danos. Em nenhum caso a responsabilidade total do clube excederá o valor pago por você, se houver, pelo acesso aos serviços. Algumas jurisdições não permitem limitações de responsabilidade, pelo que esta limitação pode não se aplicar a você."
    },
    {
      id: "alteracoes",
      title: "9. Alterações nos Termos",
      content: "O Real Chess Club pode rever estes Termos de Uso a qualquer momento, sem aviso prévio. Ao utilizar este site, você concorda em ficar vinculado à versão actual destes Termos de Uso. Recomendamos que você reveja esta página periodicamente para se manter informado sobre quaisquer alterações. Alterações significativas serão comunicadas por email ou através de um aviso em destaque no nosso site. O uso continuado dos serviços após as alterações constitui aceitação dos novos termos."
    },
    {
      id: "lei-aplicavel",
      title: "10. Lei Aplicável",
      content: "Estes Termos de Uso são regidos e interpretados de acordo com as leis de Moçambique, sem considerar os seus conflitos de disposições legais. Você concorda que qualquer acção legal ou equitativa decorrente ou relacionada a estes Termos será arquivada exclusivamente nos tribunais localizados em Maputo, Moçambique, e você consente com a jurisdição pessoal de tais tribunais para tais acções. O Real Chess Club opera a partir de Moçambique e não faz representações de que o conteúdo do site é apropriado ou disponível para uso em outros locais."
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
          <div className="absolute top-20 right-20 text-7xl animate-float">♔</div>
          <div className="absolute bottom-20 left-20 text-7xl animate-float-delayed">♕</div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Cabeçalho */}
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
              Leia atentamente os termos e condições que regem o uso dos nossos serviços
            </p>
            <div className={`
              mt-4 inline-block px-4 py-2 bg-white/10 rounded-lg text-sm text-gray-400
              transition-all duration-700 delay-250
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              Última actualização: {lastUpdated}
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

          {/* Conteúdo dos Termos */}
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

          {/* Links Importantes */}
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

          {/* Declaração de Aceitação */}
          <div className={`
            mt-8 text-center transition-all duration-700 delay-1000
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <p className="text-xs text-gray-500 leading-relaxed">
              Ao utilizar os nossos serviços, você reconhece que leu, compreendeu e concorda com todos os termos e condições estabelecidos. 
              Estes Termos de Uso constituem um acordo legal entre você e o Real Chess Club.
            </p>
          </div>

          {/* Selo de Confiança */}
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