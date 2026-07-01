import type { Response, NextFunction } from "express";
import type { AuthRequest } from "./auth.middleware";

export function adminMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  if (!req.usuario) {
    return res.status(401).json({
      mensagem: "Usuário não autenticado.",
    });
  }

  if (req.usuario.tipo_usuario !== "administrador") {
    return res.status(403).json({
      mensagem: "Apenas administradores podem realizar esta operação.",
    });
  }

  next();
}
