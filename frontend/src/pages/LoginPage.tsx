import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { authService } from "../services/auth.service";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function entrar(e: React.FormEvent) {
    e.preventDefault();

    try {
      const response = await authService.login({ email, senha });

      const resultado = response.data ?? response;

      localStorage.setItem("token", resultado.token);
      localStorage.setItem("usuario", JSON.stringify(resultado.usuario));

      toast.success("Login realizado com sucesso!");
      navigate("/");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "E-mail ou senha inválidos.",
      );
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-700 via-yellow-400 to-blue-700 px-4">
      <form
        onSubmit={entrar}
        className="w-full max-w-md rounded-3xl border border-white/40 bg-white/95 p-8 shadow-2xl"
      >
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-black text-green-700">Bolão Brasil</h1>
          <p className="mt-2 text-sm font-medium text-slate-600">
            Entre e dê seu palpite no clima da Copa 🇧🇷
          </p>
        </div>

        <div className="mb-4">
          <label className="text-sm font-semibold text-slate-700">Email</label>
          <input
            type="email"
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-green-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="text-sm font-semibold text-slate-700">Senha</label>
          <input
            type="password"
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-green-600"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-green-700 p-3 font-bold text-white hover:bg-green-800"
        >
          Entrar
        </button>

        <p className="mt-5 text-center text-sm text-slate-600">
          Ainda não tem conta?{" "}
          <Link to="/cadastro" className="font-bold text-blue-700">
            Cadastre-se
          </Link>
        </p>
      </form>
    </div>
  );
}
