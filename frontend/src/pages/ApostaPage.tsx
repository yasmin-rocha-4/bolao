import { useEffect, useState } from "react";

import { apostaService } from "../services/aposta.service";
import { usuarioService } from "../services/usuario.service";
import { campanhaOpcaoService } from "../services/campanhaOpcao.service";

import type { Aposta, ApostaForm } from "../types/aposta";
import type { Usuario } from "../types/usuario";
import type { CampanhaOpcao } from "../types/campanhaOpcao";

const formInicial: ApostaForm = {
  usuario_id: 0,
  campanha_opcao_id: 0,
  meio_pagamento: "PIX",
  status: "PENDENTE",
  comprovante: "",
};

export default function ApostasPage() {
  const [apostas, setApostas] = useState<Aposta[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [opcoes, setOpcoes] = useState<CampanhaOpcao[]>([]);
  const [form, setForm] = useState<ApostaForm>(formInicial);
  const [editandoId, setEditandoId] = useState<number | null>(null);

  async function carregarDados() {
    const [apostasData, usuariosData, opcoesData] = await Promise.all([
      apostaService.getAll(),
      usuarioService.getAll(),
      campanhaOpcaoService.getAll(),
    ]);

    setApostas(apostasData);
    setUsuarios(usuariosData);
    setOpcoes(opcoesData);
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();

    try {
      if (editandoId) {
        await apostaService.update(editandoId, {
          status: form.status,
          meio_pagamento: form.meio_pagamento,
          comprovante: form.comprovante,
        });
      } else {
        await apostaService.create(form);
      }

      setForm(formInicial);
      setEditandoId(null);
      await carregarDados();
    } catch (error: any) {
      alert(error?.response?.data?.mensagem || "Erro ao salvar aposta");
    }
  }

  function editar(aposta: Aposta) {
    setEditandoId(aposta.id);

    setForm({
      usuario_id: aposta.usuario_id,
      campanha_opcao_id: aposta.campanha_opcao_id,
      meio_pagamento: aposta.meio_pagamento,
      status: aposta.status,
      comprovante: aposta.comprovante ?? "",
    });
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setForm(formInicial);
  }

  async function remover(id: number) {
    await apostaService.delete(id);
    await carregarDados();
  }

  function nomeUsuario(id: number) {
    return usuarios.find((u) => u.id === id)?.nome || `Usuário ${id}`;
  }

  function descricaoOpcao(id: number) {
    return opcoes.find((o) => o.id === id)?.descricao || `Opção ${id}`;
  }

  useEffect(() => {
    carregarDados();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Apostas</h2>

        <p className="mt-2 text-slate-600">
          Gerencie as apostas feitas pelos participantes.
        </p>
      </div>

      <form
        onSubmit={salvar}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Campo label="Usuário">
            <select
              className="w-full rounded-lg border border-slate-300 px-3 py-2 disabled:bg-slate-100"
              value={form.usuario_id}
              disabled={!!editandoId}
              onChange={(e) =>
                setForm({ ...form, usuario_id: Number(e.target.value) })
              }
            >
              <option value={0}>Selecione o usuário</option>

              {usuarios.map((usuario) => (
                <option key={usuario.id} value={usuario.id}>
                  {usuario.nome} - {usuario.email}
                </option>
              ))}
            </select>
          </Campo>

          <Campo label="Opção da Campanha">
            <select
              className="w-full rounded-lg border border-slate-300 px-3 py-2 disabled:bg-slate-100"
              value={form.campanha_opcao_id}
              disabled={!!editandoId}
              onChange={(e) =>
                setForm({
                  ...form,
                  campanha_opcao_id: Number(e.target.value),
                })
              }
            >
              <option value={0}>Selecione a opção</option>

              {opcoes.map((opcao) => (
                <option key={opcao.id} value={opcao.id}>
                  {opcao.descricao}
                </option>
              ))}
            </select>
          </Campo>

          <Campo label="Meio de Pagamento">
            <select
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={form.meio_pagamento}
              onChange={(e) =>
                setForm({ ...form, meio_pagamento: e.target.value })
              }
            >
              <option value="PIX">PIX</option>
              <option value="CARTAO_CREDITO">Cartão de Crédito</option>
              <option value="CARTAO_DEBITO">Cartão de Débito</option>
              <option value="BOLETO">Boleto</option>
            </select>
          </Campo>

          <Campo label="Status">
            <select
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="PENDENTE">PENDENTE</option>
              <option value="CONFIRMADA">CONFIRMADA</option>
              <option value="CANCELADA">CANCELADA</option>
            </select>
          </Campo>

          <Campo label="Comprovante">
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={form.comprovante}
              onChange={(e) =>
                setForm({ ...form, comprovante: e.target.value })
              }
              placeholder="Ex: comprovante-pix.png"
            />
          </Campo>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            {editandoId ? "Salvar Alterações" : "Criar Aposta"}
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
              <Th>Usuário</Th>
              <Th>Opção</Th>
              <Th>Pagamento</Th>
              <Th>Status</Th>
              <Th>Comprovante</Th>
              <Th>Ações</Th>
            </tr>
          </thead>

          <tbody>
            {apostas.map((aposta) => (
              <tr key={aposta.id} className="border-t border-slate-200">
                <Td>{aposta.id}</Td>

                <Td>
                  {aposta.usuario?.nome || nomeUsuario(aposta.usuario_id)}
                </Td>

                <Td>
                  {aposta.campanhaOpcao?.descricao ||
                    descricaoOpcao(aposta.campanha_opcao_id)}
                </Td>

                <Td>{aposta.meio_pagamento}</Td>

                <Td>{aposta.status}</Td>

                <Td>{aposta.comprovante || "-"}</Td>

                <Td>
                  <button
                    onClick={() => editar(aposta)}
                    className="mr-2 rounded bg-amber-500 px-3 py-1 text-white"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => remover(aposta.id)}
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
