import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "../components/Layout";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

import LoginPage from "../pages/LoginPage";
import CadastroPage from "../pages/CadastroPage";
import HomePage from "../pages/HomePage";
import CampanhasPage from "../pages/CampanhasPage";
import UsuariosPage from "../pages/UsuariosPage";
import CampanhaOpcoesPage from "../pages/CampanhaOpcoesPage";
import ApostasPage from "../pages/ApostaPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<CadastroPage />} />

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<HomePage />} />

          <Route
            path="/usuarios"
            element={
                <UsuariosPage />
            }
          />

          <Route
            path="/campanhas"
            element={
              <AdminRoute>
                <CampanhasPage />
              </AdminRoute>
            }
          />

          <Route
            path="/opcoes"
            element={
              <AdminRoute>
                <CampanhaOpcoesPage />
              </AdminRoute>
            }
          />

          <Route path="/apostas" element={<ApostasPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}