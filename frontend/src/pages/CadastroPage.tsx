import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { usuarioService } from "../services/usuario.service";

const formInicial = {
  nome: "",
  cpf: "",
  email: "",
  telefone: "",
  senha: "",
  tipo_usuario: "cliente",
};

export default function CadastroPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(formInicial);

  async function cadastrar(e: React.FormEvent) {
    e.preventDefault();

    try {
      await usuarioService.create({
        nome: form.nome,
        cpf: form.cpf,
        email: form.email,
        telefone: form.telefone,
        senha: form.senha,
        tipo_usuario: form.tipo_usuario,
      });

      alert("Cadastro realizado com sucesso!");
      navigate("/login");
    } catch (error: any) {
      alert(error?.response?.data?.mensagem || "Erro ao cadastrar usuário");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-700 via-yellow-400 to-blue-700 px-4 py-8">
      <form
        onSubmit={cadastrar}
        className="w-full max-w-md rounded-3xl border border-white/40 bg-white/95 p-8 shadow-2xl"
      >
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-black text-green-700">Cadastro</h1>
          <p className="mt-2 text-sm font-medium text-slate-600">
            Crie sua conta e participe do bolão 🇧🇷
          </p>
        </div>

        {[
          ["nome", "Nome"],
          ["cpf", "CPF"],
          ["email", "Email"],
          ["telefone", "Telefone"],
          ["senha", "Senha"],
        ].map(([campo, label]) => (
          <div className="mb-4" key={campo}>
            <label className="text-sm font-semibold text-slate-700">
              {label}
            </label>

            <input
              type={
                campo === "senha"
                  ? "password"
                  : campo === "email"
                    ? "email"
                    : "text"
              }
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-green-600"
              value={(form as any)[campo]}
              onChange={(e) =>
                setForm({
                  ...form,
                  [campo]: e.target.value,
                })
              }
            />
          </div>
        ))}

        <div className="mb-6">
          <label className="text-sm font-semibold text-slate-700">
            Tipo de usuário
          </label>

          <select
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-green-600"
            value={form.tipo_usuario}
            onChange={(e) =>
              setForm({
                ...form,
                tipo_usuario: e.target.value,
              })
            }
          >
            <option value="cliente">Usuário comum</option>
            <option value="administrador">Administrador</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-green-700 p-3 font-bold text-white hover:bg-green-800"
        >
          Cadastrar
        </button>

        <p className="mt-5 text-center text-sm text-slate-600">
          Já tem conta?{" "}
          <Link to="/login" className="font-bold text-blue-700">
            Entrar
          </Link>
        </p>
      </form>
    </div>
  );
}