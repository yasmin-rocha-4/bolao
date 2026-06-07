import { apostaService } from "./aposta.service";
import { apostaRepository } from "./aposta.repo";

jest.mock("./aposta.repo", () => ({
  apostaRepository: {
    getAll: jest.fn(),
    getById: jest.fn(),
    getCampanhaOpcaoById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("apostaService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve criar aposta quando campanha e opção são válidas", async () => {
    const data = {
      usuario_id: 1,
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
    };

    (apostaRepository.getCampanhaOpcaoById as jest.Mock).mockResolvedValue(
      opcao,
    );
    (apostaRepository.create as jest.Mock).mockResolvedValue(apostaCriada);

    const resultado = await apostaService.create(data);

    expect(resultado).toEqual(apostaCriada);
    expect(apostaRepository.create).toHaveBeenCalledWith(data);
  });

  it("não deve criar aposta se opção estiver inativa", async () => {
    const data = {
      usuario_id: 1,
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

    await expect(apostaService.create(data)).rejects.toThrow(
      "Essa opção está inativa",
    );

    expect(apostaRepository.create).not.toHaveBeenCalled();
  });

  it("não deve criar aposta se campanha for privada", async () => {
    const data = {
      usuario_id: 1,
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

    await expect(apostaService.create(data)).rejects.toThrow(
      "Esta campanha é privada",
    );

    expect(apostaRepository.create).not.toHaveBeenCalled();
  });
  it("deve listar apostas", async () => {
    const apostas = [{ id: 1, status: "PENDENTE", meio_pagamento: "PIX" }];

    (apostaRepository.getAll as jest.Mock).mockResolvedValue(apostas);

    const resultado = await apostaService.getAll();

    expect(resultado).toEqual(apostas);
    expect(apostaRepository.getAll).toHaveBeenCalledTimes(1);
  });

  it("deve buscar aposta por ID existente", async () => {
    const aposta = {
      id: 1,
      status: "PENDENTE",
      campanhaOpcao: {
        campanha: {
          data_fim: new Date("2026-12-31"),
        },
      },
    };

    (apostaRepository.getById as jest.Mock).mockResolvedValue(aposta);

    const resultado = await apostaService.getById(1);

    expect(resultado).toEqual(aposta);
    expect(apostaRepository.getById).toHaveBeenCalledWith(1);
  });

  it("deve retornar erro ao buscar aposta inexistente", async () => {
    (apostaRepository.getById as jest.Mock).mockResolvedValue(null);

    await expect(apostaService.getById(99)).rejects.toThrow(
      "Aposta não encontrada",
    );
  });

  it("deve atualizar aposta existente", async () => {
    const apostaExistente = {
      id: 1,
      status: "PENDENTE",
      campanhaOpcao: {
        campanha: {
          data_fim: new Date("2026-12-31"),
        },
      },
    };

    const dados = { status: "CONFIRMADA" };
    const apostaAtualizada = { ...apostaExistente, ...dados };

    (apostaRepository.getById as jest.Mock).mockResolvedValue(apostaExistente);
    (apostaRepository.update as jest.Mock).mockResolvedValue(apostaAtualizada);

    const resultado = await apostaService.update(1, dados);

    expect(resultado).toEqual(apostaAtualizada);
    expect(apostaRepository.update).toHaveBeenCalledWith(1, dados);
  });

  it("não deve atualizar aposta inexistente", async () => {
    (apostaRepository.getById as jest.Mock).mockResolvedValue(null);

    await expect(
      apostaService.update(99, { status: "CONFIRMADA" }),
    ).rejects.toThrow("Aposta não encontrada");

    expect(apostaRepository.update).not.toHaveBeenCalled();
  });

  it("deve remover aposta existente", async () => {
    const aposta = {
      id: 1,
      status: "PENDENTE",
      campanhaOpcao: {
        campanha: {
          data_fim: new Date("2026-12-31"),
        },
      },
    };

    (apostaRepository.getById as jest.Mock).mockResolvedValue(aposta);
    (apostaRepository.delete as jest.Mock).mockResolvedValue(aposta);

    const resultado = await apostaService.delete(1);

    expect(resultado).toEqual(aposta);
    expect(apostaRepository.delete).toHaveBeenCalledWith(1);
  });

  it("não deve remover aposta inexistente", async () => {
    (apostaRepository.getById as jest.Mock).mockResolvedValue(null);

    await expect(apostaService.delete(99)).rejects.toThrow(
      "Aposta não encontrada",
    );

    expect(apostaRepository.delete).not.toHaveBeenCalled();
  });
});
