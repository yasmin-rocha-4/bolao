import { Request, Response, NextFunction } from "express";
import { z } from "zod";

type RequestSegment = "body" | "params" | "query";

export const validate =
  <T extends z.ZodTypeAny>(schema: T, segment: RequestSegment = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[segment]);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Erro de validação.",
        errors: result.error.issues.map((issue) => ({
          campo: issue.path.join("."),
          mensagem: issue.message,
        })),
      });
    }

    req[segment] = result.data;

    next();
  };
