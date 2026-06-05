import prisma from "../../prisma/prismaClient";

export const usuarioRepository = {
  getAll: () => {
    return prisma.usuario.findMany();
  },

  getById: (id: number) => {
    return prisma.usuario.findUnique({
      where: { id },
    });
  },

  getByEmail: (email: string) => {
    return prisma.usuario.findUnique({
      where: { email },
    });
  },

  create: (data: any) => {
    return prisma.usuario.create({ data });
  },

  update: (id: number, data: any) => {
    return prisma.usuario.update({
      where: { id },
      data,
    });
  },

  delete: (id: number) => {
    return prisma.usuario.delete({
      where: { id },
    });
  },
};
