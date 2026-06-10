import { campanhaOpcoesService } from "./campanha.opcoes.service";
import { campanhaOpcoesRepository } from "./campanha.opcoes.repo";
import { campanhaRepository } from "../campanha/campanha.repo";

jest.mock("./campanha.opcoes.repo", () => ({
  campanhaOpcoesRepository: {
    getAllByAdmin: jest.fn(),
    getAllPublicas: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock("../campanha/campanha.repo", () => ({
  campanhaRepository: {
    getById: jest.fn(),
  },
}));

const admin = {
  id: 1,
  email: "admin@email.com",
  tipo_usuario: "administrador",
};

const outroAdmin = {
  id: 2,
  email: "outroadmin@email.com",
  tipo_usuario: "administrador",
};

const cliente = {
  id: 3,
  email: "cliente@email.com",
  tipo_usuario: "cliente",
};

describe("campanhaOpcoesService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve listar opções das campanhas do administrador", async () => {
    const opcoes = [
      {
        id: 1,
        descricao: "Brasil campeão",
        status: "ATIVA",
        campanha: {
          id: 1,
          criador_id: admin.id,
        },
      },
    ];

    (campanhaOpcoesRepository.getAllByAdmin as jest.Mock).mockResolvedValue(
      opcoes,
    );

    const resultado = await campanhaOpcoesService.getAll(admin);

    expect(resultado).toEqual(opcoes);
    expect(campanhaOpcoesRepository.getAllByAdmin).toHaveBeenCalledWith(
      admin.id,
    );
    expect(campanhaOpcoesRepository.getAllPublicas).not.toHaveBeenCalled();
  });

  it("deve listar opções públicas para cliente", async () => {
    const opcoes = [
      {
        id: 1,
        descricao: "Brasil campeão",
        status: "ATIVA",
      },
    ];

    (campanhaOpcoesRepository.getAllPublicas as jest.Mock).mockResolvedValue(
      opcoes,
    );

    const resultado = await campanhaOpcoesService.getAll(cliente);

    expect(resultado).toEqual(opcoes);
    expect(campanhaOpcoesRepository.getAllPublicas).toHaveBeenCalledTimes(1);
    expect(campanhaOpcoesRepository.getAllByAdmin).not.toHaveBeenCalled();
  });

  it("deve buscar opção por ID existente do próprio administrador", async () => {
    const opcao = {
      id: 1,
      descricao: "Brasil campeão",
      status: "ATIVA",
      campanha: {
        id: 1,
        criador_id: admin.id,
        is_publica: true,
        status: "ATIVA",
      },
    };

    (campanhaOpcoesRepository.getById as jest.Mock).mockResolvedValue(opcao);

    const resultado = await campanhaOpcoesService.getById(1, admin);

    expect(resultado).toEqual(opcao);
    expect(campanhaOpcoesRepository.getById).toHaveBeenCalledWith(1);
  });

  it("não deve permitir administrador acessar opção de outro administrador", async () => {
    const opcao = {
      id: 1,
      descricao: "Argentina campeã",
      status: "ATIVA",
      campanha: {
        id: 1,
        criador_id: outroAdmin.id,
        is_publica: true,
        status: "ATIVA",
      },
    };

    (campanhaOpcoesRepository.getById as jest.Mock).mockResolvedValue(opcao);

    await expect(campanhaOpcoesService.getById(1, admin)).rejects.toThrow(
      "Você não tem permissão para acessar esta opção",
    );
  });

  it("deve permitir cliente acessar opção ativa de campanha pública ativa", async () => {
    const opcao = {
      id: 1,
      descricao: "Brasil campeão",
      status: "ATIVA",
      campanha: {
        id: 1,
        criador_id: admin.id,
        is_publica: true,
        status: "ATIVA",
      },
    };

    (campanhaOpcoesRepository.getById as jest.Mock).mockResolvedValue(opcao);

    const resultado = await campanhaOpcoesService.getById(1, cliente);

    expect(resultado).toEqual(opcao);
  });

  it("não deve permitir cliente acessar opção indisponível", async () => {
    const opcao = {
      id: 1,
      descricao: "Brasil campeão",
      status: "INATIVA",
      campanha: {
        id: 1,
        criador_id: admin.id,
        is_publica: true,
        status: "ATIVA",
      },
    };

    (campanhaOpcoesRepository.getById as jest.Mock).mockResolvedValue(opcao);

    await expect(campanhaOpcoesService.getById(1, cliente)).rejects.toThrow(
      "Opção não disponível",
    );
  });

  it("deve retornar erro ao buscar opção inexistente", async () => {
    (campanhaOpcoesRepository.getById as jest.Mock).mockResolvedValue(null);

    await expect(campanhaOpcoesService.getById(99, admin)).rejects.toThrow(
      "Opção da campanha não encontrada",
    );
  });

  it("deve criar opção em campanha do próprio administrador", async () => {
    const campanha = {
      id: 1,
      nome: "Bolão Copa",
      criador_id: admin.id,
    };

    const data = {
      campanha_id: 1,
      descricao: "Brasil campeão",
      status: "ATIVA",
      eh_resultado_final: false,
    };

    const opcaoCriada = { id: 1, ...data };

    (campanhaRepository.getById as jest.Mock).mockResolvedValue(campanha);
    (campanhaOpcoesRepository.create as jest.Mock).mockResolvedValue(
      opcaoCriada,
    );

    const resultado = await campanhaOpcoesService.create(data, admin);

    expect(resultado).toEqual(opcaoCriada);
    expect(campanhaRepository.getById).toHaveBeenCalledWith(1);
    expect(campanhaOpcoesRepository.create).toHaveBeenCalledWith(data);
  });

  it("não deve permitir cliente criar opção", async () => {
    const data = {
      campanha_id: 1,
      descricao: "Brasil campeão",
      status: "ATIVA",
      eh_resultado_final: false,
    };

    await expect(campanhaOpcoesService.create(data, cliente)).rejects.toThrow(
      "Apenas administradores podem criar opções",
    );

    expect(campanhaOpcoesRepository.create).not.toHaveBeenCalled();
  });

  it("não deve criar opção quando campanha não existe", async () => {
    const data = {
      campanha_id: 999,
      descricao: "Argentina campeã",
      status: "ATIVA",
      eh_resultado_final: false,
    };

    (campanhaRepository.getById as jest.Mock).mockResolvedValue(null);

    await expect(campanhaOpcoesService.create(data, admin)).rejects.toThrow(
      "Campanha não encontrada",
    );

    expect(campanhaOpcoesRepository.create).not.toHaveBeenCalled();
  });

  it("não deve criar opção em campanha de outro administrador", async () => {
    const campanha = {
      id: 1,
      nome: "Bolão Copa",
      criador_id: outroAdmin.id,
    };

    const data = {
      campanha_id: 1,
      descricao: "Brasil campeão",
      status: "ATIVA",
      eh_resultado_final: false,
    };

    (campanhaRepository.getById as jest.Mock).mockResolvedValue(campanha);

    await expect(campanhaOpcoesService.create(data, admin)).rejects.toThrow(
      "Você não tem permissão para criar opção nesta campanha",
    );

    expect(campanhaOpcoesRepository.create).not.toHaveBeenCalled();
  });

  it("deve atualizar opção existente do próprio administrador", async () => {
    const opcao = {
      id: 1,
      descricao: "Brasil campeão",
      status: "ATIVA",
      campanha: {
        id: 1,
        criador_id: admin.id,
      },
    };

    const dados = { descricao: "Brasil Hexacampeão" };
    const opcaoAtualizada = { ...opcao, ...dados };

    (campanhaOpcoesRepository.getById as jest.Mock).mockResolvedValue(opcao);
    (campanhaOpcoesRepository.update as jest.Mock).mockResolvedValue(
      opcaoAtualizada,
    );

    const resultado = await campanhaOpcoesService.update(1, dados, admin);

    expect(resultado).toEqual(opcaoAtualizada);
    expect(campanhaOpcoesRepository.update).toHaveBeenCalledWith(1, dados);
  });

  it("não deve atualizar opção inexistente", async () => {
    (campanhaOpcoesRepository.getById as jest.Mock).mockResolvedValue(null);

    await expect(
      campanhaOpcoesService.update(99, { status: "INATIVA" }, admin),
    ).rejects.toThrow("Opção da campanha não encontrada");

    expect(campanhaOpcoesRepository.update).not.toHaveBeenCalled();
  });

  it("não deve atualizar opção de outro administrador", async () => {
    const opcao = {
      id: 1,
      descricao: "Brasil campeão",
      status: "ATIVA",
      campanha: {
        id: 1,
        criador_id: outroAdmin.id,
      },
    };

    (campanhaOpcoesRepository.getById as jest.Mock).mockResolvedValue(opcao);

    await expect(
      campanhaOpcoesService.update(1, { status: "INATIVA" }, admin),
    ).rejects.toThrow("Você não tem permissão para alterar esta opção");

    expect(campanhaOpcoesRepository.update).not.toHaveBeenCalled();
  });

  it("deve remover opção existente do próprio administrador", async () => {
    const opcao = {
      id: 1,
      descricao: "Brasil campeão",
      campanha: {
        id: 1,
        criador_id: admin.id,
      },
    };

    (campanhaOpcoesRepository.getById as jest.Mock).mockResolvedValue(opcao);
    (campanhaOpcoesRepository.delete as jest.Mock).mockResolvedValue(opcao);

    const resultado = await campanhaOpcoesService.delete(1, admin);

    expect(resultado).toEqual(opcao);
    expect(campanhaOpcoesRepository.delete).toHaveBeenCalledWith(1);
  });

  it("não deve remover opção inexistente", async () => {
    (campanhaOpcoesRepository.getById as jest.Mock).mockResolvedValue(null);

    await expect(campanhaOpcoesService.delete(99, admin)).rejects.toThrow(
      "Opção da campanha não encontrada",
    );

    expect(campanhaOpcoesRepository.delete).not.toHaveBeenCalled();
  });

  it("não deve remover opção de outro administrador", async () => {
    const opcao = {
      id: 1,
      descricao: "Brasil campeão",
      campanha: {
        id: 1,
        criador_id: outroAdmin.id,
      },
    };

    (campanhaOpcoesRepository.getById as jest.Mock).mockResolvedValue(opcao);

    await expect(campanhaOpcoesService.delete(1, admin)).rejects.toThrow(
      "Você não tem permissão para excluir esta opção",
    );

    expect(campanhaOpcoesRepository.delete).not.toHaveBeenCalled();
  });
});