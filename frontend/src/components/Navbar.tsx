import { Link } from "react-router-dom";

const linkClass =
  "rounded-lg px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition";

export default function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-slate-900 shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-xl font-bold text-white">Bolão da Copa</h1>
          <p className="text-sm text-slate-300">Painel administrativo</p>
        </div>

        <nav className="flex gap-2">
          <Link to="/" className={linkClass}>
            Dashboard
          </Link>

          <Link to="/usuarios" className={linkClass}>
            Usuários
          </Link>

          <Link to="/campanhas" className={linkClass}>
            Campanhas
          </Link>

          <Link to="/opcoes" className={linkClass}>
            Opções
          </Link>

          <Link to="/apostas" className={linkClass}>
            Apostas
          </Link>
        </nav>
      </div>
    </header>
  );
}
