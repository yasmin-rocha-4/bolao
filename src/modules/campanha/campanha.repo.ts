import prisma from "../../prisma/prismaClient";

export const campanhaRepository = {
  getAll: () => {
    return prisma.campanha.findMany({
      include: {
        opcoes: true,
      },
    });
  },

  getById: (id: number) => {
    return prisma.campanha.findUnique({
      where: { id },
      include: {
        opcoes: true,
      },
    });
  },

  create: (data: any) => {
    return prisma.campanha.create({ data });
  },

  update: (id: number, data: any) => {
    return prisma.campanha.update({
      where: { id },
      data,
    });
  },

  delete: (id: number) => {
    return prisma.campanha.delete({
      where: { id },
    });
  },
};
