"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardAdmin from "./DashboardAdmin";
import DashboardAluno from "./DashboardAluno";
import DashboardFormador from "./DashboardFormador";
import DashboardFinanceiro from "./DashboardFinanceiro";

export default function Dashboard() {
  const router = useRouter();

  const [tipoMembro, setTipoMembro] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const membroId = localStorage.getItem("membroId");
    const tipo = localStorage.getItem("tipoMembro");

    console.log("🔍 Dashboard - membroId:", membroId);
    console.log("🔍 Dashboard - tipoMembro:", tipo);

    if (!membroId) {
      router.replace("/login");
      return;
    }

    // Atualização feita através de callback assíncrono
    queueMicrotask(() => {
      setTipoMembro(tipo);
      setLoading(false);
    });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent"></div>

          <p className="mt-4 text-gray-400">
            Carregando dashboard...
          </p>
        </div>
      </div>
    );
  }

  console.log(
    "✅ Dashboard - Renderizando para tipo:",
    tipoMembro
  );

  switch (tipoMembro) {
    case "administrador":
      return <DashboardAdmin />;

    case "formador":
      return <DashboardFormador />;

    case "financeiro":
      return <DashboardFinanceiro />;

    case "aluno":
    default:
      return <DashboardAluno />;
  }
}