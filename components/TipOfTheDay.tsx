// components/TipOfTheDay.tsx
"use client";

import { useState, useEffect } from "react";

interface Tip {
  id: number;
  text: string;
  author: string;
  category: string;
}

const TIPS: Tip[] = [
  {
    id: 1,
    text: "Controle o centro do tabuleiro nas primeiras jogadas. Isso dá mais mobilidade às suas peças.",
    author: "GM Garry Kasparov",
    category: "Estratégia"
  },
  {
    id: 2,
    text: "Desenvolva suas peças rapidamente. Não mova a mesma peça duas vezes na abertura sem necessidade.",
    author: "GM José Raúl Capablanca",
    category: "Abertura"
  },
  {
    id: 3,
    text: "Proteja seu rei. O roque deve ser feito o mais cedo possível para garantir a segurança do monarca.",
    author: "GM Anatoly Karpov",
    category: "Segurança"
  },
  {
    id: 4,
    text: "Pense antes de capturar. Nem sempre a melhor jogada é capturar uma peça. Avalie as consequências.",
    author: "GM Magnus Carlsen",
    category: "Táctica"
  },
  {
    id: 5,
    text: "Controle as colunas abertas. Elas são autopistas para suas torres chegarem ao ataque.",
    author: "GM Bobby Fischer",
    category: "Estratégia"
  },
  {
    id: 6,
    text: "Não se apresse para atacar. Prepare o ataque com paciência e só avance quando tiver superioridade.",
    author: "GM Mikhail Tal",
    category: "Ataque"
  },
  {
    id: 7,
    text: "Estude finais. Muitos jogadores negligenciam esta fase e perdem posições ganhadoras.",
    author: "GM Viswanathan Anand",
    category: "Finais"
  },
  {
    id: 8,
    text: "Avalie a posição antes de cada lance. Pergunte-se: 'O que meu oponente quer?'",
    author: "GM Yasser Seirawan",
    category: "Avaliação"
  },
  {
    id: 9,
    text: "Não tema trocar peças quando estiver com vantagem material. Simplifique a posição.",
    author: "GM Wilhelm Steinitz",
    category: "Estratégia"
  },
  {
    id: 10,
    text: "Peões não podem recuar. Avance com eles de forma planejada e cuidadosa.",
    author: "GM Alexander Alekhine",
    category: "Peões"
  },
  {
    id: 11,
    text: "A qualidade do seu adversário é a pressão que você exerce. Jogue sempre com intensidade.",
    author: "GM Tigran Petrosian",
    category: "Mental"
  },
  {
    id: 12,
    text: "Aprenda com cada derrota. Analise suas partidas perdidas mais do que as ganhas.",
    author: "GM Emanuel Lasker",
    category: "Aprendizado"
  },
  {
    id: 13,
    text: "O bispo é mais poderoso em posições abertas. O cavalo em posições fechadas. Use-os adequadamente.",
    author: "GM Richard Réti",
    category: "Peças"
  },
  {
    id: 14,
    text: "Crie ameaças constantes. Isso força seu oponente a gastar tempo se defendendo.",
    author: "GM Viktor Korchnoi",
    category: "Ataque"
  },
  {
    id: 15,
    text: "Coordenar peças é fundamental. Peças que se defendem mutuamente são mais poderosas.",
    author: "GM Siegbert Tarrasch",
    category: "Coordenação"
  },
  {
    id: 16,
    text: "Não jogue apenas com as peças, jogue com o relógio também. Gerencie bem seu tempo.",
    author: "GM Hikaru Nakamura",
    category: "Gestão de Tempo"
  },
  {
    id: 17,
    text: "A melhor defesa é o ataque. Contra-ataque quando seu oponente estiver atacando.",
    author: "GM Mikhail Chigorin",
    category: "Defesa"
  },
  {
    id: 18,
    text: "Estude as aberturas que combinam com seu estilo de jogo. Não copie apenas o que os campeões jogam.",
    author: "GM Fabiano Caruana",
    category: "Abertura"
  },
  {
    id: 19,
    text: "Posicione suas torres em colunas abertas e semi-abertas. Elas dominam o tabuleiro a partir daí.",
    author: "GM Bent Larsen",
    category: "Torres"
  },
  {
    id: 20,
    text: "Mantenha a calma em posições complicadas. Jogadores nervosos cometem mais erros.",
    author: "GM Levon Aronian",
    category: "Mental"
  },
  {
    id: 21,
    text: "A estrutura de peões determina o plano de jogo. Estude estruturas típicas.",
    author: "GM Artur Yusupov",
    category: "Estrutura"
  },
  {
    id: 22,
    text: "Aprenda a identificar e criar 'pontos fracos' na posição do adversário.",
    author: "GM Vasili Smyslov",
    category: "Estratégia"
  },
  {
    id: 23,
    text: "A rainha é poderosa mas vulnerável. Não a exponha a ataques prematuros.",
    author: "GM Paul Morphy",
    category: "Rainha"
  },
  {
    id: 24,
    text: "O xadrez é 99% tática. Treine táticas diariamente com problemas e exercícios.",
    author: "GM Alexander Kotov",
    category: "Táctica"
  },
  {
    id: 25,
    text: "Confie na sua intuição, mas sempre verifique com cálculo antes de jogar.",
    author: "GM Judit Polgar",
    category: "Intuição"
  },
  {
    id: 26,
    text: "Sacrifícios devem ter compensação. Sacrifique apenas quando tiver algo mais em troca.",
    author: "GM Mikhail Botvinnik",
    category: "Sacrifício"
  },
  {
    id: 27,
    text: "O fator humano é importante. Se você se sente desconfortável numa posição, seu oponente também pode estar.",
    author: "GM Samuel Reshevsky",
    category: "Psicologia"
  },
  {
    id: 28,
    text: "Use toda a profundidade do tabuleiro. Jogue tanto no rei adversário quanto nas peças.",
    author: "GM Svetozar Gligorić",
    category: "Visão"
  },
  {
    id: 29,
    text: "A paciência é uma virtude no xadrez. Não force a sorte; espere pela oportunidade certa.",
    author: "GM Tigran Petrosian",
    category: "Mental"
  },
  {
    id: 30,
    text: "Aprenda a defender posições inferiores. Muitos jogos são virados com defesa tenaz.",
    author: "GM Victor Korchnoi",
    category: "Defesa"
  },
  {
    id: 31,
    text: "O xadrez é uma arte, uma ciência e um esporte. Aproveite todos os aspectos para melhorar.",
    author: "GM Mikhail Tal",
    category: "Filosofia"
  }
];

export default function TipOfTheDay() {
  const [currentTip, setCurrentTip] = useState<Tip>(TIPS[0]);

  useEffect(() => {
    const updateTip = () => {
      const today = new Date();
      const dayOfMonth = today.getDate();
      const tipIndex = (dayOfMonth - 1) % TIPS.length;
      setCurrentTip(TIPS[tipIndex]);
    };

    updateTip();

    // Update tip at midnight
    const now = new Date();
    const night = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0, 0, 0
    );
    const msToMidnight = night.getTime() - now.getTime();

    const timeout = setTimeout(() => {
      updateTip();
      // Then update every 24 hours
      setInterval(updateTip, 86400000);
    }, msToMidnight);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl p-4 sm:p-8 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30">
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-transparent" />
      <div className="relative flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
        <div className="flex-shrink-0">
          <div className="text-4xl sm:text-5xl">💡</div>
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Dica do Dia</h2>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/10 rounded-full text-yellow-400 text-xs">
                <span>📚</span>
                <span>{currentTip.category}</span>
              </span>
              <span className="text-gray-500 text-xs">
                #{currentTip.id}/31
              </span>
            </div>
          </div>
          <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed">
            &quot;{currentTip.text}&quot;
          </p>
          <p className="text-yellow-500 text-xs sm:text-sm mt-3 sm:mt-4">
            - {currentTip.author}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 text-gray-500 text-xs">
              <span>🔄</span>
              <span>Dica atualizada diariamente</span>
            </div>
            <div className="flex items-center gap-1">
              {TIPS.map((_, index) => (
                <div
                  key={index}
                  className={`
                    w-1.5 h-1.5 rounded-full transition-colors
                    ${index === currentTip.id - 1 ? 'bg-yellow-500' : 'bg-gray-600'}
                  `}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}