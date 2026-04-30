import { Request, Response, NextFunction } from "express";
import * as z from "zod";

export const validate =
  <T extends z.ZodType>(schema: T) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Erro de validação",
          details: error.issues.map(issue => ({
            campo: issue.path.join("."),
            mensagem: issue.message
          }))
        });
      }

      return res.status(500).json({
        error: "Erro interno",
      });
    }
  };

