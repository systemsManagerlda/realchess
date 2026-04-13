// app/dashboard/page.tsx (Componente principal que redireciona baseado no tipo)
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardAdmin from "./DashboardAdmin";
import DashboardAluno from "./DashboardAluno";
import DashboardFormador from "./DashboardFormador";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [tipoMembro, setTipoMembro] = useState<string | null>(null);

  useEffect(() => {
    const membroId = localStorage.getItem("membroId");
    const tipo = localStorage.getItem("tipoMembro");

    if (!membroId) {
      router.push("/login");
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTipoMembro(tipo);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-400">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (tipoMembro === "formador") {
    return <DashboardFormador />;
  } else if (tipoMembro === "administrador") {
    return <DashboardAdmin />;
  }

  return <DashboardAluno />;
}