// app/recursos/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Message {
  id: number;
  user: string;
  text: string;
  timestamp: Date;
  isAdmin?: boolean;
}

interface DownloadFile {
  name: string;
  size: string;
  type: string;
  category: string;
  icon?: string;
}

interface Product {
  name: string;
  price: string;
  description: string;
  category: string;
  inStock: boolean;
}

export default function Recursos() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 1, 
      user: "Admin", 
      text: "Bem-vindo ao fórum do Real Chess Club! Fique à vontade para discutir sobre xadrez, tirar dúvidas e compartilhar conhecimento.", 
      timestamp: new Date(),
      isAdmin: true 
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState("forum");
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  const isVisible = true;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          user: "Você",
          text: newMessage,
          timestamp: new Date(),
          isAdmin: false
        }
      ]);
      setNewMessage("");
    }
  };

  const downloads: DownloadFile[] = [
    { name: "Regulamento do Clube", size: "1.2 MB", type: "PDF", category: "Documentos", icon: "📄" },
    { name: "Ficha de Inscrição", size: "0.5 MB", type: "DOC", category: "Formulários", icon: "📝" },
    { name: "Tabela de Ratings FIDE", size: "0.8 MB", type: "PDF", category: "Documentos", icon: "📊" },
    { name: "Calendário de Torneios 2025", size: "0.3 MB", type: "XLSX", category: "Calendários", icon: "📅" },
    { name: "Guia de Aberturas", size: "2.1 MB", type: "PDF", category: "Materiais de Estudo", icon: "📚" },
    { name: "Lista de Exercícios", size: "1.5 MB", type: "PDF", category: "Materiais de Estudo", icon: "✏️" },
  ];

  const products: Product[] = [
    { name: "Tabuleiro Profissional", price: "2.500 MT", description: "Tabuleiro de madeira 50x50cm com acabamento premium", category: "Equipamentos", inStock: true },
    { name: "Peças de Torneio", price: "3.500 MT", description: "Peças de madeira estilo Staunton, peso regulamentar", category: "Equipamentos", inStock: true },
    { name: "Livro: Estratégias Avançadas", price: "1.200 MT", description: "Por GM Garry Kasparov - 300 páginas", category: "Livros", inStock: true },
    { name: "Relógio Digital", price: "4.500 MT", description: "Relógio de xadrez profissional com funções avançadas", category: "Equipamentos", inStock: true },
    { name: "Kit Iniciante", price: "5.000 MT", description: "Tabuleiro + Peças + Livro básico", category: "Kits", inStock: true },
    { name: "Curso Online", price: "2.000 MT", description: "Acesso a 20 videoaulas com Mestres FIDE", category: "Cursos", inStock: true },
  ];

  const filteredProducts = selectedCategory === "todos" 
    ? products 
    : products.filter(p => p.category.toLowerCase() === selectedCategory);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-MZ', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Hoje";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Ontem";
    } else {
      return date.toLocaleDateString('pt-MZ', { day: 'numeric', month: 'short' });
    }
  };

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

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className={`
              inline-block mb-6 transition-all duration-700
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-yellow-500/20 text-yellow-400 backdrop-blur-sm border border-yellow-500/30">
                <span className="mr-2">📚</span>
                Conteúdo Exclusivo
              </span>
            </div>
            <h1 className={`
              text-4xl md:text-5xl lg:text-6xl font-bold mb-6 transition-all duration-700 delay-100
              bg-linear-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              Recursos Extras
            </h1>
            <div className={`
              w-24 h-1 bg-yellow-500 mx-auto mb-6 rounded-full transition-all duration-700 delay-150
              ${isVisible ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}
            `} />
            <p className={`
              text-gray-300 max-w-2xl mx-auto text-lg transition-all duration-700 delay-200
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              Downloads, fórum de discussão e loja oficial - tudo o que você precisa para evoluir no xadrez
            </p>
          </div>

          {/* Tabs Navigation */}
          <div className={`
            flex flex-wrap gap-2 mb-8 border-b border-white/20 pb-4
            transition-all duration-700 delay-300
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <button
              onClick={() => setActiveTab("forum")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === "forum"
                  ? 'bg-yellow-600 text-white'
                  : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              💬 Fórum
            </button>
            <button
              onClick={() => setActiveTab("downloads")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === "downloads"
                  ? 'bg-yellow-600 text-white'
                  : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              📥 Downloads
            </button>
            <button
              onClick={() => setActiveTab("loja")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === "loja"
                  ? 'bg-yellow-600 text-white'
                  : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              🛒 Loja do Clube
            </button>
          </div>

          {/* Forum Tab */}
          {activeTab === "forum" && (
            <div className={`
              bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20
              transition-all duration-700 delay-400
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              <div className="p-6 border-b border-white/20">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span className="text-3xl">💬</span>
                  Fórum de Discussão
                </h2>
                <p className="text-gray-400 text-sm mt-1">Troque ideias, tire dúvidas e compartilhe conhecimento</p>
              </div>
              
              <div className="bg-black/20 p-6 h-96 overflow-y-auto">
                {messages.map((msg) => (
                  <div key={msg.id} className={`mb-4 flex ${msg.isAdmin ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[80%] ${msg.isAdmin ? 'bg-yellow-600/20' : 'bg-blue-600/20'} rounded-2xl p-3`}>
                      <div className="flex items-center gap-2 mb-1">
                        <strong className={`text-sm ${msg.isAdmin ? 'text-yellow-400' : 'text-blue-400'}`}>
                          {msg.user}
                        </strong>
                        <span className="text-xs text-gray-500">
                          {formatDate(msg.timestamp)} às {formatTime(msg.timestamp)}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm">{msg.text}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              <form onSubmit={handleSendMessage} className="p-6 border-t border-white/20">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors"
                  />
                  <button 
                    type="submit" 
                    className="bg-linear-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300"
                  >
                    Enviar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Downloads Tab */}
          {activeTab === "downloads" && (
            <div className={`
              bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20
              transition-all duration-700 delay-400
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              <div className="p-6 border-b border-white/20">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span className="text-3xl">📥</span>
                  Downloads
                </h2>
                <p className="text-gray-400 text-sm mt-1">Materiais exclusivos para membros</p>
              </div>
              
              <div className="divide-y divide-white/10">
                {downloads.map((file, index) => (
                  <div key={index} className="p-6 hover:bg-white/5 transition-colors">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{file.icon}</div>
                        <div>
                          <p className="font-semibold text-white">{file.name}</p>
                          <div className="flex gap-3 mt-1">
                            <span className="text-xs text-gray-500">{file.size}</span>
                            <span className="text-xs px-2 py-0.5 bg-white/10 rounded-full text-yellow-400">{file.type}</span>
                            <span className="text-xs text-gray-500">{file.category}</span>
                          </div>
                        </div>
                      </div>
                      <button className="bg-linear-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                        Baixar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Loja Tab */}
          {activeTab === "loja" && (
            <div className={`
              transition-all duration-700 delay-400
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => setSelectedCategory("todos")}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    selectedCategory === "todos"
                      ? 'bg-yellow-600 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setSelectedCategory("equipamentos")}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    selectedCategory === "equipamentos"
                      ? 'bg-yellow-600 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  Equipamentos
                </button>
                <button
                  onClick={() => setSelectedCategory("livros")}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    selectedCategory === "livros"
                      ? 'bg-yellow-600 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  Livros
                </button>
                <button
                  onClick={() => setSelectedCategory("kits")}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    selectedCategory === "kits"
                      ? 'bg-yellow-600 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  Kits
                </button>
                <button
                  onClick={() => setSelectedCategory("cursos")}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    selectedCategory === "cursos"
                      ? 'bg-yellow-600 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  Cursos
                </button>
              </div>

              {/* Products Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <div
                    key={index}
                    className="group bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:border-yellow-500/50 transition-all duration-500 hover:-translate-y-1"
                  >
                    <div className="h-48 bg-linear-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
                      <span className="text-6xl">♟️</span>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">
                          {product.name}
                        </h3>
                        {product.inStock && (
                          <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                            Em estoque
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm mb-3">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-yellow-500">{product.price}</span>
                        <button className="bg-linear-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                          Comprar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}