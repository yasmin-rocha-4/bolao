import { Link, useNavigate } from "react-router-dom";
import { getUsuarioLogado, isAdmin, logout } from "../utils/auth";

const linkClass =
  "rounded-full px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 transition";

export default function Navbar() {
  const navigate = useNavigate();
  const usuario = getUsuarioLogado();
  const admin = isAdmin();

  function sair() {
    logout();
    navigate("/login");
  }

  return (
    <header className="bg-gradient-to-r from-green-700 via-yellow-500 to-blue-700 shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Bolão Brasil
          </h1>
          <p className="text-sm font-medium text-white/90">
            {usuario?.nome} • {usuario?.tipo_usuario}
          </p>
        </div>

        <nav className="flex items-center gap-2">
          <Link to="/" className={linkClass}>Início</Link>

          {admin && (
            <>
              
              <Link to="/campanhas" className={linkClass}>Campanhas</Link>
              <Link to="/opcoes" className={linkClass}>Opções</Link>
            </>
          )}
        <Link to="/usuarios" className={linkClass}>Vencedores</Link>
          <Link to="/apostas" className={linkClass}>
            {admin ? "Apostas" : "Minhas Apostas"}
          </Link>

          <button
            onClick={sair}
            className="rounded-full bg-white px-4 py-2 text-sm font-bold text-green-700 hover:bg-slate-100"
          >
            Sair
          </button>
        </nav>
      </div>
    </header>
  );
}