import { apostaService } from "./aposta.service";
import { apostaRepository } from "./aposta.repo";

jest.mock("./aposta.repo", () => ({
  apostaRepository: {
    getById: jest.fn(),
    getCampanhaOpcaoById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
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
});
