import { useEffect, useState } from "react";
import { usuarioService } from "../services/usuario.service";
import type { Usuario } from "../types/usuario";

type UsuarioForm = Omit<Usuario, "id">;

const formInicial: UsuarioForm = {
  nome: "",
  cpf: "",
  email: "",
  telefone: "",
  tipo_usuario: "cliente",
  senha: "",
  status: "ativo",
};

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [form, setForm] = useState<UsuarioForm>(formInicial);
  const [editandoId, setEditandoId] = useState<number | null>(null);

  async function carregarUsuarios() {
    const data = await usuarioService.getAll();
    setUsuarios(data);
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();

    try {
      if (editandoId) {
        await usuarioService.update(editandoId, form);
      } else {
        await usuarioService.create(form);
      }

      setForm(formInicial);
      setEditandoId(null);
      await carregarUsuarios();
    } catch (error: any) {
      alert(error?.response?.data?.mensagem || "Erro ao salvar usuário");
    }
  }

  function editar(usuario: Usuario) {
    setEditandoId(usuario.id);

    setForm({
      nome: usuario.nome,
      cpf: usuario.cpf,
      email: usuario.email,
      telefone: usuario.telefone ?? "",
      tipo_usuario: usuario.tipo_usuario,
      senha: usuario.senha,
      status: usuario.status,
    });
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setForm(formInicial);
  }

  async function remover(id: number) {
    await usuarioService.delete(id);
    await carregarUsuarios();
  }

  useEffect(() => {
    carregarUsuarios();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Usuários</h2>
        <p className="mt-2 text-slate-600">
          Gerencie os participantes cadastrados no bolão.
        </p>
      </div>

      <form
        onSubmit={salvar}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Campo label="Nome">
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
            />
          </Campo>

          <Campo label="CPF">
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2 disabled:bg-slate-100"
              value={form.cpf}
              disabled={!!editandoId}
              onChange={(e) => setForm({ ...form, cpf: e.target.value })}
            />
          </Campo>

          <Campo label="Email">
            <input
              type="email"
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Campo>

          <Campo label="Telefone">
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={form.telefone}
              onChange={(e) => setForm({ ...form, telefone: e.target.value })}
            />
          </Campo>

          <Campo label="Senha">
            <input
              type="password"
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={form.senha}
              onChange={(e) => setForm({ ...form, senha: e.target.value })}
            />
          </Campo>

          {editandoId && (
            <Campo label="Status">
              <select
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </Campo>
          )}
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            {editandoId ? "Salvar Alterações" : "Criar Usuário"}
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
              <Th>Nome</Th>
              <Th>Email</Th>
              <Th>CPF</Th>
              <Th>Tipo</Th>
              <Th>Status</Th>
              <Th>Ações</Th>
            </tr>
          </thead>

          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id} className="border-t border-slate-200">
                <Td>{usuario.id}</Td>
                <Td>{usuario.nome}</Td>
                <Td>{usuario.email}</Td>
                <Td>{usuario.cpf}</Td>
                <Td>{usuario.tipo_usuario}</Td>
                <Td>{usuario.status}</Td>
                <Td>
                  <button
                    onClick={() => editar(usuario)}
                    className="mr-2 rounded bg-amber-500 px-3 py-1 text-white"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => remover(usuario.id)}
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
