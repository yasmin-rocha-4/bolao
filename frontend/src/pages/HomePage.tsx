import { useEffect, useState } from "react";

import { usuarioService } from "../services/usuario.service";
import { campanhaService } from "../services/campanha.service";
import { campanhaOpcaoService } from "../services/campanhaOpcao.service";
import { apostaService } from "../services/aposta.service";

export default function HomePage() {
  const [usuarios, setUsuarios] = useState(0);
  const [campanhas, setCampanhas] = useState(0);
  const [opcoes, setOpcoes] = useState(0);
  const [apostas, setApostas] = useState(0);

  async function carregarDashboard() {
    const [usuariosData, campanhasData, opcoesData, apostasData] =
      await Promise.all([
        usuarioService.getAll(),
        campanhaService.getAll(),
        campanhaOpcaoService.getAll(),
        apostaService.getAll(),
      ]);

    setUsuarios(usuariosData.length);
    setCampanhas(campanhasData.length);
    setOpcoes(opcoesData.length);
    setApostas(apostasData.length);
  }

  useEffect(() => {
    carregarDashboard();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Dashboard</h2>
        <p className="mt-2 text-slate-600">
          Visão geral do sistema de bolão da Copa.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <DashboardCard titulo="Usuários" valor={usuarios} />
        <DashboardCard titulo="Campanhas" valor={campanhas} />
        <DashboardCard titulo="Opções" valor={opcoes} />
        <DashboardCard titulo="Apostas" valor={apostas} />
      </div>
    </div>
  );
}

function DashboardCard({ titulo, valor }: { titulo: string; valor: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{titulo}</p>
      <strong className="mt-3 block text-4xl font-bold text-slate-900">
        {valor}
      </strong>
    </div>
  );
}
