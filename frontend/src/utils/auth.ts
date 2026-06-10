export type UsuarioLogado = {
  id: number;
  nome: string;
  email: string;
  tipo_usuario: "cliente" | "administrador";
};

export function getUsuarioLogado(): UsuarioLogado | null {
  const usuario = localStorage.getItem("usuario");

  if (!usuario) return null;

  return JSON.parse(usuario);
}

export function isAdmin() {
  return getUsuarioLogado()?.tipo_usuario === "administrador";
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
}