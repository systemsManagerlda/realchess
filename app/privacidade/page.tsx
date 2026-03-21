// app/privacidade/page.tsx
"use client";

import { useState, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function Privacidade() {
  const [lastUpdated] = useState("15 de Janeiro, 2025");
  const pageRef = useRef<HTMLDivElement>(null);

  const isVisible = true;

  const sections = [
    {
      id: "introducao",
      title: "1. Introdução",
      content: "O Real Chess Club ('nós', 'nosso' ou 'clube') está comprometido em proteger sua privacidade. Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações pessoais quando você visita nosso site, se torna membro ou utiliza nossos serviços. Ao utilizar nossos serviços, você concorda com a coleta e uso de informações de acordo com esta política."
    },
    {
      id: "informacoes-coletadas",
      title: "2. Informações que Coletamos",
      content: "Coletamos informações que você nos fornece diretamente, como nome, endereço de email, telefone, data de nascimento, rating de xadrez e histórico de participação em torneios. Também coletamos automaticamente informações técnicas como endereço IP, tipo de navegador, páginas acessadas e tempo de visita quando você interage com nosso site. Para membros, podemos coletar informações adicionais como histórico de partidas, resultados em torneios e progresso nos treinamentos."
    },
    {
      id: "uso-informacoes",
      title: "3. Como Usamos Suas Informações",
      content: "Utilizamos suas informações para: (a) Gerenciar sua associação e participação em torneios; (b) Comunicar novidades, eventos e resultados; (c) Melhorar nossos serviços e experiência do usuário; (d) Analisar desempenho e classificação de membros; (e) Cumprir obrigações legais e regulatórias; (f) Enviar materiais promocionais com seu consentimento. Não utilizamos seus dados para finalidades não autorizadas além das descritas nesta política."
    },
    {
      id: "compartilhamento",
      title: "4. Compartilhamento de Informações",
      content: "Podemos compartilhar suas informações com: (a) A Federação Moçambicana de Xadrez (FMOX) para registro oficial de membros e torneios; (b) Organizadores de torneios para inscrições e resultados; (c) Parceiros de serviços que nos auxiliam na operação do clube; (d) Autoridades legais quando exigido por lei. Não vendemos, alugamos ou comercializamos suas informações pessoais para terceiros para fins de marketing sem seu consentimento explícito."
    },
    {
      id: "seguranca",
      title: "5. Segurança dos Dados",
      content: "Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição. Utilizamos criptografia SSL para transmissão de dados, firewalls, e controles de acesso rigorosos. Apesar de nossos esforços, nenhum método de transmissão pela internet ou armazenamento eletrônico é 100% seguro. Em caso de violação de dados, notificaremos os afetados conforme exigido por lei."
    },
    {
      id: "direitos-usuario",
      title: "6. Seus Direitos",
      content: "Você tem direito a: (a) Acessar seus dados pessoais; (b) Corrigir informações incompletas ou incorretas; (c) Solicitar a exclusão de seus dados; (d) Revogar consentimento para tratamento de dados; (e) Solicitar portabilidade dos dados; (f) Opor-se a tratamentos específicos. Para exercer seus direitos, entre em contato pelo email privacidade@realchess.co.mz. Responderemos às suas solicitações em até 30 dias."
    },
    {
      id: "cookies",
      title: "7. Cookies e Tecnologias Similares",
      content: "Utilizamos cookies para melhorar sua experiência: (a) Cookies essenciais: necessários para funcionamento do site; (b) Cookies de desempenho: analisam como você usa o site; (c) Cookies funcionais: lembram suas preferências; (d) Cookies de publicidade: para conteúdo relevante. Você pode controlar os cookies nas configurações do seu navegador. A desativação de cookies pode afetar a funcionalidade de algumas áreas do site."
    },
    {
      id: "dados-menores",
      title: "8. Dados de Menores",
      content: "Oferecemos programas para crianças e adolescentes. Para menores de 18 anos, exigimos o consentimento dos pais ou responsáveis legais para coleta e tratamento de dados. Os responsáveis têm acesso total às informações de seus dependentes e podem solicitar modificações ou exclusão a qualquer momento. Não coletamos intencionalmente dados de menores sem consentimento parental."
    },
    {
      id: "alteracoes",
      title: "9. Alterações nesta Política",
      content: "Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos sobre alterações significativas por email ou através de um aviso em nosso site. A versão atualizada entrará em vigor na data indicada como 'Última atualização'. Recomendamos revisar esta política regularmente para se manter informado sobre como protegemos suas informações."
    },
    {
      id: "contato",
      title: "10. Contato",
      content: "Se tiver dúvidas sobre esta Política de Privacidade ou sobre como tratamos seus dados, entre em contato conosco:",
      contact: {
        email: "privacidade@realchess.co.mz",
        phone: "+258 84 000 0000",
        address: "Bairro das Mahotas, Maputo - Moçambique",
        responsible: "Encarregado de Proteção de Dados: Dr. Carlos Mendes"
      }
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
                <span className="mr-2">🔒</span>
                Transparência e Segurança
              </span>
            </div>
            <h1 className={`
              text-4xl md:text-5xl lg:text-6xl font-bold mb-6 transition-all duration-700 delay-100
              bg-linear-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              Política de Privacidade
            </h1>
            <div className={`
              w-24 h-1 bg-yellow-500 mx-auto mb-6 rounded-full transition-all duration-700 delay-150
              ${isVisible ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}
            `} />
            <p className={`
              text-gray-300 max-w-2xl mx-auto text-lg transition-all duration-700 delay-200
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              Sua privacidade é importante para nós. Leia atentamente como protegemos seus dados
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

          {/* Privacy Policy Content */}
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
                <p className="text-gray-300 leading-relaxed mb-4">
                  {section.content}
                </p>
                
                {section.contact && (
                  <div className="mt-6 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/30">
                    <div className="space-y-2">
                      <p className="text-gray-300 text-sm">
                        <strong className="text-yellow-400">Email:</strong> {section.contact.email}
                      </p>
                      <p className="text-gray-300 text-sm">
                        <strong className="text-yellow-400">Telefone:</strong> {section.contact.phone}
                      </p>
                      <p className="text-gray-300 text-sm">
                        <strong className="text-yellow-400">Endereço:</strong> {section.contact.address}
                      </p>
                      <p className="text-gray-300 text-sm">
                        <strong className="text-yellow-400">Encarregado:</strong> {section.contact.responsible}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Consent Statement */}
          <div className={`
            mt-8 bg-yellow-500/10 rounded-2xl p-6 border border-yellow-500/30 text-center
            transition-all duration-700 delay-800
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <p className="text-gray-300 text-sm leading-relaxed">
              Ao utilizar nossos serviços, você concorda com os termos desta Política de Privacidade. 
              Se você não concordar com qualquer parte desta política, por favor, não utilize nossos serviços.
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
              <Link href="/regulamento" className="text-sm text-gray-400 hover:text-yellow-400 transition-colors">
                Regulamento do Clube
              </Link>
              <span className="text-gray-600">•</span>
              <Link href="/contato" className="text-sm text-gray-400 hover:text-yellow-400 transition-colors">
                Fale Conosco
              </Link>
            </div>
          </div>

          {/* Trust Badge */}
          <div className={`
            mt-8 text-center transition-all duration-700 delay-1100
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <p className="text-xs text-gray-500">
              🏆 Real Chess Club - Comprometidos com a proteção de seus dados desde 2019
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}