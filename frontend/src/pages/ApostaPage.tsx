import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { apostaService } from "../services/aposta.service";

import type { Aposta } from "../types/aposta";

export default function ApostasPage() {
  const [apostas, setApostas] = useState<Aposta[]>([]);

  async function carregarApostas() {
    try {
      const apostasData = await apostaService.getAll();
      setApostas(apostasData);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Erro ao carregar apostas.",
      );
    }
  }

  useEffect(() => {
    carregarApostas();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Minhas Apostas</h2>

        <p className="mt-2 text-slate-600">
          Consulte e acompanhe suas apostas cadastradas.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full">
          <thead className="bg-slate-100">
            <tr>
              <Th>ID</Th>
              <Th>Usuário</Th>
              <Th>Campanha</Th>
              <Th>Opção</Th>
              <Th>Pagamento</Th>
              <Th>Status</Th>
              <Th>Comprovante</Th>
            </tr>
          </thead>

          <tbody>
            {apostas.map((aposta) => (
              <tr key={aposta.id} className="border-t border-slate-200">
                <Td>{aposta.id}</Td>

                <Td>{aposta.usuario?.nome || "Você"}</Td>

                <Td>{aposta.campanhaOpcao?.campanha?.nome || "-"}</Td>

                <Td>{aposta.campanhaOpcao?.descricao || "-"}</Td>

                <Td>{aposta.meio_pagamento}</Td>

                <Td>{aposta.status}</Td>

                <Td>{aposta.comprovante || "-"}</Td>
              </tr>
            ))}

            {apostas.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-6 text-center text-sm text-slate-500"
                >
                  Nenhuma aposta cadastrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3 text-sm text-slate-700">{children}</td>;
}
