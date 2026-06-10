import { apostaService } from "./aposta.service";
import { apostaRepository } from "./aposta.repo";

jest.mock("./aposta.repo", () => ({
  apostaRepository: {
    getAllByUsuario: jest.fn(),
    getAllByAdmin: jest.fn(),
    getById: jest.fn(),
    getCampanhaOpcaoById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

const cliente = {
  id: 1,
  email: "cliente@email.com",
  tipo_usuario: "cliente",
};

const admin = {
  id: 2,
  email: "admin@email.com",
  tipo_usuario: "administrador",
};

describe("apostaService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve criar aposta usando o usuário logado", async () => {
    const data = {
      campanha_opcao_id: 1,
      meio_pagamento: "PIX",
      status: "PENDENTE",
      comprovante: "pix.png",
    };

    const opcao = {
      id: 1,
      status: "ATIVA",
      campanha: {
        is_publica: true,
        data_inicio: new Date("2026-01-01"),
        data_fim: new Date("2026-12-31"),
      },
    };

    const apostaCriada = {
      id: 1,
      ...data,
      usuario_id: cliente.id,
    };

    (apostaRepository.getCampanhaOpcaoById as jest.Mock).mockResolvedValue(
      opcao,
    );
    (apostaRepository.create as jest.Mock).mockResolvedValue(apostaCriada);

    const resultado = await apostaService.create(data, cliente);

    expect(resultado).toEqual(apostaCriada);
    expect(apostaRepository.create).toHaveBeenCalledWith({
      ...data,
      usuario_id: cliente.id,
    });
  });

  it("não deve criar aposta se opção estiver inativa", async () => {
    const data = {
      campanha_opcao_id: 1,
      meio_pagamento: "PIX",
      status: "PENDENTE",
    };

    const opcao = {
      id: 1,
      status: "INATIVA",
      campanha: {
        is_publica: true,
        data_inicio: new Date("2026-01-01"),
        data_fim: new Date("2026-12-31"),
      },
    };

    (apostaRepository.getCampanhaOpcaoById as jest.Mock).mockResolvedValue(
      opcao,
    );

    await expect(apostaService.create(data, cliente)).rejects.toThrow(
      "Essa opção está inativa",
    );

    expect(apostaRepository.create).not.toHaveBeenCalled();
  });

  it("não deve criar aposta se campanha for privada", async () => {
    const data = {
      campanha_opcao_id: 1,
      meio_pagamento: "PIX",
      status: "PENDENTE",
    };

    const opcao = {
      id: 1,
      status: "ATIVA",
      campanha: {
        is_publica: false,
        data_inicio: new Date("2026-01-01"),
        data_fim: new Date("2026-12-31"),
      },
    };

    (apostaRepository.getCampanhaOpcaoById as jest.Mock).mockResolvedValue(
      opcao,
    );

    await expect(apostaService.create(data, cliente)).rejects.toThrow(
      "Esta campanha é privada",
    );

    expect(apostaRepository.create).not.toHaveBeenCalled();
  });

  it("deve listar apostas do cliente logado", async () => {
    const apostas = [{ id: 1, usuario_id: cliente.id, status: "PENDENTE" }];

    (apostaRepository.getAllByUsuario as jest.Mock).mockResolvedValue(apostas);

    const resultado = await apostaService.getAll(cliente);

    expect(resultado).toEqual(apostas);
    expect(apostaRepository.getAllByUsuario).toHaveBeenCalledWith(cliente.id);
    expect(apostaRepository.getAllByAdmin).not.toHaveBeenCalled();
  });

  it("deve listar apostas das campanhas do administrador", async () => {
    const apostas = [{ id: 1, status: "PENDENTE" }];

    (apostaRepository.getAllByAdmin as jest.Mock).mockResolvedValue(apostas);

    const resultado = await apostaService.getAll(admin);

    expect(resultado).toEqual(apostas);
    expect(apostaRepository.getAllByAdmin).toHaveBeenCalledWith(admin.id);
    expect(apostaRepository.getAllByUsuario).not.toHaveBeenCalled();
  });

  it("deve buscar aposta própria do cliente", async () => {
    const aposta = {
      id: 1,
      usuario_id: cliente.id,
      status: "PENDENTE",
      campanhaOpcao: {
        campanha: {
          criador_id: admin.id,
          data_fim: new Date("2026-12-31"),
        },
      },
    };

    (apostaRepository.getById as jest.Mock).mockResolvedValue(aposta);

    const resultado = await apostaService.getById(1, cliente);

    expect(resultado).toEqual(aposta);
    expect(apostaRepository.getById).toHaveBeenCalledWith(1);
  });

  it("não deve permitir cliente acessar aposta de outro usuário", async () => {
    const aposta = {
      id: 1,
      usuario_id: 999,
      status: "PENDENTE",
      campanhaOpcao: {
        campanha: {
          criador_id: admin.id,
        },
      },
    };

    (apostaRepository.getById as jest.Mock).mockResolvedValue(aposta);

    await expect(apostaService.getById(1, cliente)).rejects.toThrow(
      "Você não tem permissão para acessar esta aposta",
    );
  });

  it("deve permitir administrador acessar aposta da própria campanha", async () => {
    const aposta = {
      id: 1,
      usuario_id: cliente.id,
      status: "PENDENTE",
      campanhaOpcao: {
        campanha: {
          criador_id: admin.id,
        },
      },
    };

    (apostaRepository.getById as jest.Mock).mockResolvedValue(aposta);

    const resultado = await apostaService.getById(1, admin);

    expect(resultado).toEqual(aposta);
  });

  it("não deve permitir administrador acessar aposta de outra campanha", async () => {
    const aposta = {
      id: 1,
      usuario_id: cliente.id,
      status: "PENDENTE",
      campanhaOpcao: {
        campanha: {
          criador_id: 999,
        },
      },
    };

    (apostaRepository.getById as jest.Mock).mockResolvedValue(aposta);

    await expect(apostaService.getById(1, admin)).rejects.toThrow(
      "Você não tem permissão para acessar esta aposta",
    );
  });

  it("deve retornar erro ao buscar aposta inexistente", async () => {
    (apostaRepository.getById as jest.Mock).mockResolvedValue(null);

    await expect(apostaService.getById(99, cliente)).rejects.toThrow(
      "Aposta não encontrada",
    );
  });

  it("deve atualizar aposta própria do cliente", async () => {
    const apostaExistente = {
      id: 1,
      usuario_id: cliente.id,
      status: "PENDENTE",
      campanhaOpcao: {
        campanha: {
          criador_id: admin.id,
        },
      },
    };

    const dados = { status: "CONFIRMADA" };
    const apostaAtualizada = { ...apostaExistente, ...dados };

    (apostaRepository.getById as jest.Mock).mockResolvedValue(apostaExistente);
    (apostaRepository.update as jest.Mock).mockResolvedValue(apostaAtualizada);

    const resultado = await apostaService.update(1, dados, cliente);

    expect(resultado).toEqual(apostaAtualizada);
    expect(apostaRepository.update).toHaveBeenCalledWith(1, dados);
  });

  it("não deve atualizar aposta inexistente", async () => {
    (apostaRepository.getById as jest.Mock).mockResolvedValue(null);

    await expect(
      apostaService.update(99, { status: "CONFIRMADA" }, cliente),
    ).rejects.toThrow("Aposta não encontrada");

    expect(apostaRepository.update).not.toHaveBeenCalled();
  });

  it("deve remover aposta própria do cliente", async () => {
    const aposta = {
      id: 1,
      usuario_id: cliente.id,
      status: "PENDENTE",
      campanhaOpcao: {
        campanha: {
          criador_id: admin.id,
        },
      },
    };

    (apostaRepository.getById as jest.Mock).mockResolvedValue(aposta);
    (apostaRepository.delete as jest.Mock).mockResolvedValue(aposta);

    const resultado = await apostaService.delete(1, cliente);

    expect(resultado).toEqual(aposta);
    expect(apostaRepository.delete).toHaveBeenCalledWith(1);
  });

  it("não deve remover aposta inexistente", async () => {
    (apostaRepository.getById as jest.Mock).mockResolvedValue(null);

    await expect(apostaService.delete(99, cliente)).rejects.toThrow(
      "Aposta não encontrada",
    );

    expect(apostaRepository.delete).not.toHaveBeenCalled();
  });
});