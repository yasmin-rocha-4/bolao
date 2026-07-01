import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { campanhaService } from "../services/campanha.service";
import type { Campanha, CampanhaForm } from "../types/campanha";

const formInicial: CampanhaForm = {
  nome: "",
  data_inicio: "",
  data_fim: "",
  tx_operacional: 0,
  valor_bolao: 0,
  is_publica: true,
  codigo_campanha: "",
  status: "ATIVA",
};

function formatarParaInputDate(data: string) {
  return data.slice(0, 10);
}

export default function CampanhasPage() {
  const [campanhas, setCampanhas] = useState<Campanha[]>([]);
  const [form, setForm] = useState<CampanhaForm>(formInicial);
  const [campanhaEditandoId, setCampanhaEditandoId] = useState<number | null>(
    null,
  );

  async function carregarCampanhas() {
    try {
      const data = await campanhaService.getAll();
      setCampanhas(data);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Erro ao carregar campanhas.",
      );
    }
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();

    try {
      const dadosParaApi = {
        ...form,
        data_inicio: `${form.data_inicio}T00:00:00.000Z`,
        data_fim: `${form.data_fim}T23:59:59.000Z`,
      };

      if (campanhaEditandoId) {
        await campanhaService.update(campanhaEditandoId, dadosParaApi);
        toast.success("Campanha atualizada com sucesso!");
      } else {
        await campanhaService.create(dadosParaApi);
        toast.success("Campanha criada com sucesso!");
      }

      setForm(formInicial);
      setCampanhaEditandoId(null);
      await carregarCampanhas();
    } catch (error: any) {
      const primeiroErro = error?.response?.data?.errors?.[0]?.mensagem;

      toast.error(
        primeiroErro ||
          error?.response?.data?.message ||
          "Erro ao salvar campanha.",
      );
    }
  }

  function editar(campanha: Campanha) {
    setCampanhaEditandoId(campanha.id);

    setForm({
      nome: campanha.nome,
      data_inicio: formatarParaInputDate(campanha.data_inicio),
      data_fim: formatarParaInputDate(campanha.data_fim),
      tx_operacional: Number(campanha.tx_operacional),
      valor_bolao: Number(campanha.valor_bolao),
      is_publica: campanha.is_publica,
      codigo_campanha: campanha.codigo_campanha,
      status: campanha.status,
    });
  }

  function cancelarEdicao() {
    setCampanhaEditandoId(null);
    setForm(formInicial);
  }

  async function remover(id: number) {
    const confirmar = confirm("Deseja realmente excluir esta campanha?");

    if (!confirmar) return;

    try {
      await campanhaService.delete(id);
      toast.success("Campanha removida com sucesso!");
      await carregarCampanhas();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Erro ao excluir campanha.",
      );
    }
  }

  useEffect(() => {
    carregarCampanhas();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Campanhas</h2>

        <p className="mt-2 text-slate-600">Gerencie as campanhas do bolão.</p>
      </div>

      <form
        onSubmit={salvar}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Nome</label>

            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Código da Campanha
            </label>

            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={form.codigo_campanha}
              onChange={(e) =>
                setForm({
                  ...form,
                  codigo_campanha: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Data Início
            </label>

            <input
              type="date"
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={form.data_inicio}
              onChange={(e) =>
                setForm({
                  ...form,
                  data_inicio: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Data Fim</label>

            <input
              type="date"
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={form.data_fim}
              onChange={(e) =>
                setForm({
                  ...form,
                  data_fim: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Valor do Bolão
            </label>

            <input
              type="number"
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={form.valor_bolao}
              onChange={(e) =>
                setForm({
                  ...form,
                  valor_bolao: Number(e.target.value),
                })
              }
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Taxa Operacional
            </label>

            <input
              type="number"
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={form.tx_operacional}
              onChange={(e) =>
                setForm({
                  ...form,
                  tx_operacional: Number(e.target.value),
                })
              }
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Status</label>

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
              <option value="ENCERRADA">ENCERRADA</option>
            </select>
          </div>

          <div className="flex items-center gap-2 pt-8">
            <input
              type="checkbox"
              checked={form.is_publica}
              onChange={(e) =>
                setForm({
                  ...form,
                  is_publica: e.target.checked,
                })
              }
            />

            <span>Campanha Pública</span>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            {campanhaEditandoId ? "Salvar Alterações" : "Criar Campanha"}
          </button>

          {campanhaEditandoId && (
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
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Nome</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Valor</th>
              <th className="px-4 py-3 text-left">Taxa</th>
              <th className="px-4 py-3 text-left">Pública</th>
              <th className="px-4 py-3 text-left">Ações</th>
            </tr>
          </thead>

          <tbody>
            {campanhas.map((campanha) => (
              <tr key={campanha.id} className="border-t border-slate-200">
                <td className="px-4 py-3">{campanha.id}</td>
                <td className="px-4 py-3">{campanha.nome}</td>
                <td className="px-4 py-3">{campanha.status}</td>
                <td className="px-4 py-3">R$ {campanha.valor_bolao}</td>
                <td className="px-4 py-3">R$ {campanha.tx_operacional}</td>
                <td className="px-4 py-3">
                  {campanha.is_publica ? "Sim" : "Não"}
                </td>

                <td className="px-4 py-3">
                  <button
                    onClick={() => editar(campanha)}
                    className="mr-2 rounded bg-amber-500 px-3 py-1 text-white"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => remover(campanha.id)}
                    className="rounded bg-red-600 px-3 py-1 text-white"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}

            {campanhas.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-6 text-center text-sm text-slate-500"
                >
                  Nenhuma campanha cadastrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
