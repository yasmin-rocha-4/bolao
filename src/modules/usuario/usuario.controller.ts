import type { Request, Response } from "express";
import prisma from "../../prisma/prismaClient";
import { createUsuarioSchema } from "./usuario.schema";

// LISTAR TODOS
export const getAll = async (req: Request, res: Response) => {
  const usuarios = await prisma.usuario.findMany();
  res.json(usuarios);
};

// BUSCAR POR ID
export const getById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const usuario = await prisma.usuario.findUnique({
    where: { id },
  });

  if (!usuario) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }

  res.json(usuario);
};

// CRIAR USUÁRIO
export const create = async (req: Request, res: Response) => {

  console.log("🚨 ENTROU NO CREATE");

  const validation = createUsuarioSchema.safeParse(req.body);

  console.log("VALIDAÇÃO:", validation);

  if (!validation.success) {
    console.log("❌ BLOQUEOU NO ZOD");

    return res.status(400).json({
      mensagem: "Dados inválidos",
      erros: validation.error.format()
    });
  }

  console.log("✅ PASSOU NO ZOD");

  const usuario = await prisma.usuario.create({
    data: validation.data
  });

  return res.status(201).json(usuario);
};
// ATUALIZAR USUÁRIO

export const update = async (req: Request, res: Response): Promise<Response> => {
    

    const { id } = req.params;

    const updatedUsuario = await prisma.usuario.update({
        where: { id: Number(id) },
        data: req.body
    });
    // Lógica para atualizar um usuário
    return res.status(200).json({ obj: updatedUsuario, message: "Usuário atualizado com sucesso" });
};

// DELETAR USUÁRIO
export const remove = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    await prisma.usuario.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }
};