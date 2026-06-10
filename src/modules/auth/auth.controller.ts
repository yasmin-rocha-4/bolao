import type { Request, Response } from "express";
import { loginSchema } from "./auth.schema";
import { authService } from "./auth.service";

export const login = async (req: Request, res: Response) => {
  const validation = loginSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      mensagem: "Dados inválidos",
      erros: validation.error.format(),
    });
  }

  try {
    const { email, senha } = validation.data;

    const resultado = await authService.login(email, senha);

    return res.status(200).json(resultado);
  } catch (error: any) {
    return res.status(401).json({
      mensagem: error.message,
    });
  }
};