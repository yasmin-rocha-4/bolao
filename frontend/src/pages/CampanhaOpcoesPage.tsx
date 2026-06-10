import { useEffect, useState } from "react";

import { campanhaOpcaoService } from "../services/campanhaOpcao.service";
import { campanhaService } from "../services/campanha.service";

import type { CampanhaOpcao, CampanhaOpcaoForm } from "../types/campanhaOpcao";
import type { Campanha } from "../types/campanha";

const formInicial: CampanhaOpcaoForm = {
  campanha_id: 0,
  descricao: "",
  status: "ATIVA",
  eh_resultado_final: false,
};

export default function CampanhaOpcoesPage() {
  const [opcoes, setOpcoes] = useState<CampanhaOpcao[]>([]);
  const [campanhas, setCampanhas] = useState<Campanha[]>([]);
  const [form, setForm] = useState<CampanhaOpcaoForm>(formInicial);
  const [editandoId, setEditandoId] = useState<number | null>(null);

  async function carregarDados() {
    const [opcoesData, campanhasData] = await Promise.all([
      campanhaOpcaoService.getAll(),
      campanhaService.getAll(),
    ]);

    setOpcoes(opcoesData);
    setCampanhas(campanhasData);
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();

    if (editandoId) {
      await campanhaOpcaoService.update(editandoId, form);
    } else {
      await campanhaOpcaoService.create(form);
    }

    setForm(formInicial);
    setEditandoId(null);

    carregarDados();
  }

  function editar(opcao: CampanhaOpcao) {
    setEditandoId(opcao.id);

    setForm({
      campanha_id: opcao.campanha_id,
      descricao: opcao.descricao,
      status: opcao.status,
      eh_resultado_final: opcao.eh_resultado_final,
    });
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setForm(formInicial);
  }

async function remover(id: number) {
  try {
    await campanhaOpcaoService.delete(id);
    await carregarDados();
  } catch (error: any) {
    alert(
      error?.response?.data?.mensagem ||
        "Erro ao excluir opção da campanha",
    );
  }
}

  function nomeCampanha(id: number) {
    return (
      campanhas.find((campanha) => campanha.id === id)?.nome || `Campanha ${id}`
    );
  }

  useEffect(() => {
    carregarDados();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">
          Opções da Campanha
        </h2>

        <p className="mt-2 text-slate-600">
          Gerencie os resultados disponíveis para apostas.
        </p>
      </div>

      <form
        onSubmit={salvar}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Campo label="Campanha">
            <select
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={form.campanha_id}
              onChange={(e) =>
                setForm({
                  ...form,
                  campanha_id: Number(e.target.value),
                })
              }
            >
              <option value={0}>Selecione a campanha</option>

              {campanhas.map((campanha) => (
                <option key={campanha.id} value={campanha.id}>
                  {campanha.nome}
                </option>
              ))}
            </select>
          </Campo>

          <Campo label="Descrição">
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={form.descricao}
              onChange={(e) =>
                setForm({
                  ...form,
                  descricao: e.target.value,
                })
              }
            />
          </Campo>

          <Campo label="Status">
            <select
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value,
                })
              }
            >
              <option value="ATIVA">ATIVA</option>
              <option value="INATIVA">INATIVA</option>
            </select>
          </Campo>

          <div className="flex items-center gap-2 pt-8">
            <input
              type="checkbox"
              checked={form.eh_resultado_final}
              onChange={(e) =>
                setForm({
                  ...form,
                  eh_resultado_final: e.target.checked,
                })
              }
            />

            <span>Resultado Final</span>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            {editandoId ? "Salvar Alterações" : "Criar Opção"}
          </button>

          {editandoId && (
            <button
              type="button"
              onClick={cancelarEdicao}
              className="ml-2 rounded-lg border border-slate-300 px-4 py-2"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full">
          <thead className="bg-slate-100">
            <tr>
              <Th>ID</Th>
              <Th>Campanha</Th>
              <Th>Descrição</Th>
              <Th>Status</Th>
              <Th>Resultado Final</Th>
              <Th>Ações</Th>
            </tr>
          </thead>

          <tbody>
            {opcoes.map((opcao) => (
              <tr key={opcao.id} className="border-t border-slate-200">
                <Td>{opcao.id}</Td>

                <Td>{nomeCampanha(opcao.campanha_id)}</Td>

                <Td>{opcao.descricao}</Td>

                <Td>{opcao.status}</Td>

                <Td>{opcao.eh_resultado_final ? "Sim" : "Não"}</Td>

                <Td>
                  <button
                    onClick={() => editar(opcao)}
                    className="mr-2 rounded bg-amber-500 px-3 py-1 text-white"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => remover(opcao.id)}
                    className="rounded bg-red-600 px-3 py-1 text-white"
                  >
                    Excluir
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Campo({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>

      {children}
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
