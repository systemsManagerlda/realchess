// app/contato/page.tsx
"use client";

import { useState, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaYoutube } from "react-icons/fa";
import { SiLichess, SiChessdotcom } from "react-icons/si";

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function Contato() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const pageRef = useRef<HTMLDivElement>(null);

  const isVisible = true;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      alert("✅ Mensagem enviada com sucesso! Entraremos em contato em breve.");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: "📍",
      title: "Endereço",
      details: ["Bairro das Mahotas", "Maputo - Moçambique"],
      action: "Ver no mapa",
      link: "#"
    },
    {
      icon: "📞",
      title: "Telefone",
      details: ["+258 84 000 0000", "+258 82 000 0000"],
      action: "Ligar agora",
      link: "tel:+258840000000"
    },
    {
      icon: "✉️",
      title: "Email",
      details: ["contato@realchess.co.mz", "geral@realchess.co.mz"],
      action: "Enviar email",
      link: "mailto:contato@realchess.co.mz"
    },
    {
      icon: "⏰",
      title: "Horário de Funcionamento",
      details: ["Segunda a Sexta: 09h - 20h", "Sábado: 09h - 18h", "Domingo: 09h - 13h"],
      action: null,
      link: null
    },
  ];

  const socialLinks = [
  { name: "Facebook", icon: <FaFacebookF />, url: "https://facebook.com", color: "hover:bg-[#1877f2]" },
  { name: "Instagram", icon: <FaInstagram />, url: "https://instagram.com", color: "hover:bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045]" },
  { name: "WhatsApp", icon: <FaWhatsapp />, url: "https://wa.me/258840000000", color: "hover:bg-[#25d366]" },
  { name: "Lichess", icon: <SiLichess />, url: "https://lichess.org", color: "hover:bg-[#23ac5e]" },
  { name: "Chess.com", icon: <SiChessdotcom />, url: "https://chess.com", color: "hover:bg-[#81b64c]" },
  { name: "YouTube", icon: <FaYoutube />, url: "https://youtube.com", color: "hover:bg-[#ff0000]" },
];
  const faqs = [
    {
      question: "Como posso me tornar membro do clube?",
      answer: "Para se tornar membro, basta preencher o formulário de inscrição na área de membros ou visitar nossa sede no Bairro das Mahotas. Oferecemos diferentes planos de associação com benefícios exclusivos."
    },
    {
      question: "Preciso ter um rating para participar dos torneios?",
      answer: "Não! Nossos torneios são abertos para todos os níveis. Temos categorias específicas para iniciantes, intermediários e avançados, além de torneios abertos para todos os participantes."
    },
    {
      question: "O clube oferece aulas para iniciantes?",
      answer: "Sim! Temos um programa completo de formação para iniciantes, com aulas teóricas e práticas ministradas por nossos treinadores experientes. As aulas acontecem às terças e quintas-feiras."
    },
    {
      question: "Como funciona a mensalidade?",
      answer: "A mensalidade é de 500 MT para membros regulares, com desconto para estudantes e famílias. O pagamento pode ser feito na sede ou via transferência bancária. Consulte nossos planos anuais com desconto especial."
    },
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
          <div className="absolute top-1/3 left-1/3 text-5xl animate-float-slow">♗</div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className={`
              inline-block mb-6 transition-all duration-700
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-yellow-500/20 text-yellow-400 backdrop-blur-sm border border-yellow-500/30">
                <span className="mr-2">📞</span>
                Fale Conosco
              </span>
            </div>
            <h1 className={`
              text-4xl md:text-5xl lg:text-6xl font-bold mb-6 transition-all duration-700 delay-100
              bg-linear-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              Entre em Contato
            </h1>
            <div className={`
              w-24 h-1 bg-yellow-500 mx-auto mb-6 rounded-full transition-all duration-700 delay-150
              ${isVisible ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}
            `} />
            <p className={`
              text-gray-300 max-w-2xl mx-auto text-lg transition-all duration-700 delay-200
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              Estamos aqui para responder suas dúvidas, receber sugestões e ajudar você 
              a fazer parte da nossa comunidade de xadrez
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Contact Form */}
            <div className={`
              bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20
              transition-all duration-700 delay-300
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-yellow-500 rounded-full"></span>
                Envie uma Mensagem
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-gray-300 mb-2 text-sm">Nome Completo *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors"
                    placeholder="Seu nome completo"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2 text-sm">Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors"
                    placeholder="seu@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2 text-sm">Assunto *</label>
                  <select
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors"
                  >
                    <option value="">Selecione um assunto</option>
                    <option value="membro">Quero me tornar membro</option>
                    <option value="torneio">Informações sobre torneios</option>
                    <option value="aulas">Aulas e treinamentos</option>
                    <option value="parceria">Parcerias e patrocínios</option>
                    <option value="outros">Outros assuntos</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2 text-sm">Mensagem *</label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors resize-none"
                    placeholder="Digite sua mensagem aqui..."
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-linear-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className={`
                    bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20
                    transition-all duration-500 hover:border-yellow-500/50 hover:-translate-y-1
                    ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}
                  `}
                  style={{ animationDelay: `${300 + index * 100}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{info.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-2">{info.title}</h3>
                      {info.details.map((detail, i) => (
                        <p key={i} className="text-gray-300 text-sm">{detail}</p>
                      ))}
                      {info.action && info.link && (
                        <a
                          href={info.link}
                          className="inline-flex items-center gap-1 text-yellow-500 hover:text-yellow-400 text-sm mt-3 font-semibold transition-colors"
                        >
                          {info.action}
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Map Section */}
          <div className={`
            mb-16 transition-all duration-700 delay-500
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20">
              <div className="p-6 border-b border-white/20">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span className="text-3xl">🗺️</span>
                  Nossa Localização
                </h2>
                <p className="text-gray-400 text-sm mt-1">Bairro das Mahotas, Maputo - Moçambique</p>
              </div>
              <div className="h-96 bg-gray-800 relative">
                {/* Embed Google Maps */}
                <iframe
                  title="Real Chess Club Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14373.895023527562!2d32.5611912!3d-25.9695285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1ee5929c1bd0e695%3A0x9a4d8a5a5a5a5a5a!2sMahotas%2C%20Maputo%2C%20Mo%C3%A7ambique!5e0!3m2!1spt!2s!4v1700000000000!5m2!1spt!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                />
                <div className="absolute inset-0 bg-black/20 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className={`
            mb-12 transition-all duration-700 delay-600
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Perguntas Frequentes</h2>
              <p className="text-gray-400">Tire suas dúvidas sobre o clube</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-yellow-500/50 transition-all duration-300"
                >
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                    {faq.question}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className={`
            text-center transition-all duration-700 delay-700
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <h2 className="text-xl font-bold text-white mb-6">Siga-nos nas Redes Sociais</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {socialLinks.map((link, idx) => (
                <a 
                    key={idx} 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`w-10 h-10 flex items-center justify-center rounded-full text-white transition-colors ${link.color}`}
                >
                    {link.icon}
                </a>
                ))}
            </div>
          </div>

          {/* Trust Badge */}
          <div className={`
            mt-12 text-center transition-all duration-700 delay-800
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <p className="text-xs text-gray-500">
              🏆 Clube oficialmente filiado à Federação Moçambicana de Xadrez
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}