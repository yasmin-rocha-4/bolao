import type { Request, Response } from "express";
import { authService } from "./auth.service.js";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body;

    const resultado = await authService.login(email, senha);

    return res.status(200).json({
      success: true,
      message: "Login realizado com sucesso.",
      data: resultado,
    });
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};
