import type { Request, Response } from "express";
import prisma from "../../prisma/prismaClient.js";

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
  const {
    nome,
    cpf,
    email,
    telefone,
    tipo_usuario,
    senha,
    status,
  } = req.body;

  const novoUsuario = await prisma.usuario.create({
    data: {
      nome,
      cpf,
      email,
      telefone,
      tipo_usuario,
      senha,
      status,
    },
  });

  res.status(201).json(novoUsuario);
};

// ATUALIZAR USUÁRIO
export const update = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const atualizado = await prisma.usuario.update({
      where: { id },
      data: req.body,
    });

    res.json(atualizado);
  } catch (error) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }
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