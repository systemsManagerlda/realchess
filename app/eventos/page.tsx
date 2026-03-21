// app/eventos/page.tsx
"use client";

import { useState, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  status: "upcoming" | "past";
  results?: string;
  registrationDeadline?: string;
  prize?: string;
  format?: string;
}

export default function Eventos() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", rating: "" });
  const pageRef = useRef<HTMLDivElement>(null);

  const isVisible = true;

  const events: Event[] = [
    {
      id: 1,
      name: "Torneio Rápido de Verão",
      date: "2025-02-15",
      location: "Sede do Real Chess Club - Mahotas, Maputo",
      status: "upcoming",
      registrationDeadline: "2025-02-10",
      prize: "75.000 MT",
      format: "Rápido (15+5)",
    },
    {
      id: 2,
      name: "Campeonato Nacional Absoluto",
      date: "2025-03-20",
      location: "Centro de Conferências Joaquim Chissano - Maputo",
      status: "upcoming",
      registrationDeadline: "2025-03-15",
      prize: "150.000 MT",
      format: "Clássico (90+30)",
    },
    {
      id: 3,
      name: "Circuito Mahotas de Xadrez",
      date: "2025-04-05",
      location: "Bairro das Mahotas, Maputo",
      status: "upcoming",
      registrationDeadline: "2025-04-01",
      prize: "50.000 MT",
      format: "Rápido (10+3)",
    },
    {
      id: 4,
      name: "Torneio de Natal 2024",
      date: "2024-12-20",
      location: "Sede do Real Chess Club - Mahotas, Maputo",
      status: "past",
      results: "1º Lugar: João Silva (7.5 pts) | 2º Lugar: Maria Santos (7.0 pts) | 3º Lugar: Carlos Mendes (6.5 pts)",
      prize: "50.000 MT",
    },
  ];

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    alert("✅ Inscrição realizada com sucesso! Em breve você receberá mais informações por email.");
    setSelectedEvent(null);
    setFormData({ name: "", email: "", rating: "" });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-MZ', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
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

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className={`
              inline-block mb-6 transition-all duration-700
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-yellow-500/20 text-yellow-400 backdrop-blur-sm border border-yellow-500/30">
                <span className="mr-2">🏆</span>
                Calendário Oficial
              </span>
            </div>
            <h1 className={`
              text-4xl md:text-5xl lg:text-6xl font-bold mb-6 transition-all duration-700 delay-100
              bg-linear-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              Eventos e Torneios
            </h1>
            <div className={`
              w-24 h-1 bg-yellow-500 mx-auto mb-6 rounded-full transition-all duration-700 delay-150
              ${isVisible ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}
            `} />
            <p className={`
              text-gray-300 max-w-2xl mx-auto text-lg transition-all duration-700 delay-200
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              Participe dos melhores torneios de xadrez de Moçambique. 
              Confira nossa agenda e inscreva-se para competir e evoluir!
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Events List */}
            <div className="lg:col-span-2 space-y-8">
              {/* Upcoming Events */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 bg-yellow-500 rounded-full"></span>
                  Próximos Eventos
                </h2>
                <div className="space-y-4">
                  {events.filter(e => e.status === "upcoming").map((event, index) => (
                    <div
                      key={event.id}
                      className={`
                        group relative bg-white/10 backdrop-blur-sm rounded-2xl p-6
                        border border-white/20 hover:border-yellow-500/50
                        transition-all duration-500 hover:-translate-y-1
                        ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}
                      `}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Prize Badge */}
                      {event.prize && (
                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                            🏆 {event.prize}
                          </span>
                        </div>
                      )}

                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">
                        {event.name}
                      </h3>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-gray-300 text-sm">
                          <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300 text-sm">
                          <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{event.location}</span>
                        </div>
                        {event.format && (
                          <div className="flex items-center gap-2 text-gray-300 text-sm">
                            <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{event.format}</span>
                          </div>
                        )}
                        {event.registrationDeadline && (
                          <div className="flex items-center gap-2 text-orange-400 text-xs font-medium mt-2">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Inscrições até {formatDate(event.registrationDeadline)}</span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => setSelectedEvent(event)}
                        className="bg-linear-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                      >
                        Inscrever-se
                      </button>

                      {/* Animated Border */}
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-yellow-500 via-yellow-600 to-yellow-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Past Events */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 bg-yellow-500 rounded-full"></span>
                  Eventos Passados
                </h2>
                <div className="space-y-4">
                  {events.filter(e => e.status === "past").map((event) => (
                    <div
                      key={event.id}
                      className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                    >
                      <h3 className="text-xl font-bold text-white mb-3">{event.name}</h3>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{event.location}</span>
                        </div>
                        {event.results && (
                          <div className="flex items-start gap-2 text-gray-300 text-sm mt-2 p-3 bg-white/5 rounded-lg">
                            <span className="text-yellow-500">🏆</span>
                            <span>{event.results}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar - Calendar */}
            <div className={`
              lg:col-span-1 transition-all duration-700 delay-300
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              <div className="sticky top-24 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="text-2xl">📅</span>
                  Calendário de Eventos
                </h2>
                <div className="space-y-4">
                  {events.map(event => (
                    <div key={event.id} className="border-l-2 border-yellow-500 pl-4 hover:translate-x-1 transition-transform">
                      <p className="font-semibold text-white">{event.name}</p>
                      <p className="text-sm text-gray-400">{formatDate(event.date)}</p>
                      <p className="text-xs text-yellow-500 mt-1">{event.status === "upcoming" ? "📢 Em breve" : "✅ Realizado"}</p>
                    </div>
                  ))}
                </div>

                {/* Info Box */}
                <div className="mt-8 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/30">
                  <p className="text-yellow-400 text-sm font-semibold mb-2">ℹ️ Informações</p>
                  <p className="text-gray-300 text-xs">
                    Torneios sujeitos a alterações. Consulte o regulamento completo no ato da inscrição.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-linear-to-b from-gray-900 to-gray-950 rounded-2xl p-8 max-w-md w-full border border-white/20 shadow-2xl animate-fade-in-up">
              <h2 className="text-2xl font-bold text-white mb-2">Inscrição</h2>
              <p className="text-yellow-400 mb-6">{selectedEvent.name}</p>
              
              <form onSubmit={handleRegister}>
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2 text-sm">Nome Completo *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2 text-sm">Email *</label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-300 mb-2 text-sm">Rating FIDE (opcional)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors"
                    value={formData.rating}
                    onChange={e => setFormData({ ...formData, rating: e.target.value })}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-linear-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300"
                  >
                    Confirmar
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedEvent(null)}
                    className="px-6 py-2 bg-white/10 hover:bg-white/20 text-gray-300 rounded-lg font-semibold transition-all duration-300"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}