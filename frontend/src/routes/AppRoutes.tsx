import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";

import CampanhasPage from "../pages/CampanhasPage";
import UsuariosPage from "../pages/UsuariosPage";
import CampanhaOpcoesPage from "../pages/CampanhaOpcoesPage";
import ApostasPage from "../pages/ApostaPage";
import HomePage from "../pages/HomePage";
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/campanhas" element={<CampanhasPage />} />
          <Route path="/usuarios" element={<UsuariosPage />} />
          <Route path="/opcoes" element={<CampanhaOpcoesPage />} />
          <Route path="/apostas" element={<ApostasPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
