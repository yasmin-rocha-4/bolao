import { campanhaService } from "./campanha.service";
import { campanhaRepository } from "./campanha.repo";

jest.mock("./campanha.repo", () => ({
  campanhaRepository: {
    getAllByCriador: jest.fn(),
    getAllPublicas: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

const admin = {
  id: 1,
  email: "admin@email.com",
  tipo_usuario: "administrador",
};

const cliente = {
  id: 2,
  email: "cliente@email.com",
  tipo_usuario: "cliente",
};

describe("campanhaService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve listar campanhas criadas pelo administrador", async () => {
    const campanhas = [
      {
        id: 1,
        nome: "Bolão Copa",
        criador_id: admin.id,
        status: "ATIVA",
        is_publica: true,
      },
    ];

    (campanhaRepository.getAllByCriador as jest.Mock).mockResolvedValue(
      campanhas,
    );

    const resultado = await campanhaService.getAll(admin);

    expect(resultado).toEqual(campanhas);
    expect(campanhaRepository.getAllByCriador).toHaveBeenCalledWith(admin.id);
    expect(campanhaRepository.getAllPublicas).not.toHaveBeenCalled();
  });

  it("deve listar campanhas públicas para cliente", async () => {
    const campanhas = [
      {
        id: 1,
        nome: "Bolão Copa",
        status: "ATIVA",
        is_publica: true,
      },
    ];

    (campanhaRepository.getAllPublicas as jest.Mock).mockResolvedValue(
      campanhas,
    );

    const resultado = await campanhaService.getAll(cliente);

    expect(resultado).toEqual(campanhas);
    expect(campanhaRepository.getAllPublicas).toHaveBeenCalledTimes(1);
    expect(campanhaRepository.getAllByCriador).not.toHaveBeenCalled();
  });

  it("deve buscar campanha por ID existente para administrador criador", async () => {
    const campanha = {
      id: 1,
      nome: "Bolão Copa",
      criador_id: admin.id,
      status: "ATIVA",
      is_publica: true,
    };

    (campanhaRepository.getById as jest.Mock).mockResolvedValue(campanha);

    const resultado = await campanhaService.getById(1, admin);

    expect(resultado).toEqual(campanha);
    expect(campanhaRepository.getById).toHaveBeenCalledWith(1);
  });

  it("deve retornar erro ao buscar campanha inexistente", async () => {
    (campanhaRepository.getById as jest.Mock).mockResolvedValue(null);

    await expect(campanhaService.getById(99, admin)).rejects.toThrow(
      "Campanha não encontrada",
    );
  });

  it("não deve permitir administrador acessar campanha de outro administrador", async () => {
    const campanha = {
      id: 1,
      nome: "Bolão Copa",
      criador_id: 999,
      status: "ATIVA",
      is_publica: true,
    };

    (campanhaRepository.getById as jest.Mock).mockResolvedValue(campanha);

    await expect(campanhaService.getById(1, admin)).rejects.toThrow(
      "Você não tem permissão para acessar esta campanha",
    );
  });

  it("deve permitir cliente acessar campanha pública e ativa", async () => {
    const campanha = {
      id: 1,
      nome: "Bolão Copa",
      criador_id: admin.id,
      status: "ATIVA",
      is_publica: true,
    };

    (campanhaRepository.getById as jest.Mock).mockResolvedValue(campanha);

    const resultado = await campanhaService.getById(1, cliente);

    expect(resultado).toEqual(campanha);
  });

  it("não deve permitir cliente acessar campanha privada", async () => {
    const campanha = {
      id: 1,
      nome: "Bolão Privado",
      criador_id: admin.id,
      status: "ATIVA",
      is_publica: false,
    };

    (campanhaRepository.getById as jest.Mock).mockResolvedValue(campanha);

    await expect(campanhaService.getById(1, cliente)).rejects.toThrow(
      "Campanha não disponível",
    );
  });

  it("deve criar campanha válida para administrador", async () => {
    const data = {
      nome: "Bolão Copa 2026",
      data_inicio: new Date("2026-06-01"),
      data_fim: new Date("2026-07-31"),
      tx_operacional: 10,
      valor_bolao: 50,
      is_publica: true,
      codigo_campanha: "COPA2026",
      status: "ATIVA",
    };

    const campanhaCriada = {
      id: 1,
      ...data,
      criador_id: admin.id,
    };

    (campanhaRepository.create as jest.Mock).mockResolvedValue(campanhaCriada);

    const resultado = await campanhaService.create(data, admin);

    expect(resultado).toEqual(campanhaCriada);
    expect(campanhaRepository.create).toHaveBeenCalledWith({
      ...data,
      criador_id: admin.id,
    });
  });

  it("não deve permitir cliente criar campanha", async () => {
    const data = {
      nome: "Bolão Copa 2026",
      data_inicio: new Date("2026-06-01"),
      data_fim: new Date("2026-07-31"),
      tx_operacional: 10,
      valor_bolao: 50,
      is_publica: true,
      codigo_campanha: "COPA2026",
      status: "ATIVA",
    };

    await expect(campanhaService.create(data, cliente)).rejects.toThrow(
      "Apenas administradores podem criar campanhas",
    );

    expect(campanhaRepository.create).not.toHaveBeenCalled();
  });

  it("não deve criar campanha com data inicial maior que data final", async () => {
    const data = {
      nome: "Campanha inválida",
      data_inicio: new Date("2026-08-01"),
      data_fim: new Date("2026-07-01"),
      tx_operacional: 10,
      valor_bolao: 50,
      is_publica: true,
      codigo_campanha: "ERRADA",
      status: "ATIVA",
    };

    await expect(campanhaService.create(data, admin)).rejects.toThrow(
      "A data de início deve ser anterior à data de fim",
    );

    expect(campanhaRepository.create).not.toHaveBeenCalled();
  });

  it("deve atualizar campanha do próprio administrador", async () => {
    const campanhaExistente = {
      id: 1,
      nome: "Bolão",
      criador_id: admin.id,
      status: "ATIVA",
      is_publica: true,
    };

    const dadosAtualizacao = {
      nome: "Bolão Atualizado",
    };

    const campanhaAtualizada = {
      ...campanhaExistente,
      ...dadosAtualizacao,
    };

    (campanhaRepository.getById as jest.Mock).mockResolvedValue(
      campanhaExistente,
    );
    (campanhaRepository.update as jest.Mock).mockResolvedValue(
      campanhaAtualizada,
    );

    const resultado = await campanhaService.update(
      1,
      dadosAtualizacao,
      admin,
    );

    expect(resultado).toEqual(campanhaAtualizada);
    expect(campanhaRepository.update).toHaveBeenCalledWith(
      1,
      dadosAtualizacao,
    );
  });

  it("não deve atualizar campanha inexistente", async () => {
    (campanhaRepository.getById as jest.Mock).mockResolvedValue(null);

    await expect(
      campanhaService.update(99, { nome: "Teste" }, admin),
    ).rejects.toThrow("Campanha não encontrada");

    expect(campanhaRepository.update).not.toHaveBeenCalled();
  });

  it("não deve atualizar campanha de outro administrador", async () => {
    const campanha = {
      id: 1,
      nome: "Bolão",
      criador_id: 999,
      status: "ATIVA",
      is_publica: true,
    };

    (campanhaRepository.getById as jest.Mock).mockResolvedValue(campanha);

    await expect(
      campanhaService.update(1, { nome: "Teste" }, admin),
    ).rejects.toThrow("Você não tem permissão para editar esta campanha");

    expect(campanhaRepository.update).not.toHaveBeenCalled();
  });

  it("deve remover campanha do próprio administrador", async () => {
    const campanha = {
      id: 1,
      nome: "Bolão Copa",
      criador_id: admin.id,
      status: "ATIVA",
      is_publica: true,
    };

    (campanhaRepository.getById as jest.Mock).mockResolvedValue(campanha);
    (campanhaRepository.delete as jest.Mock).mockResolvedValue(campanha);

    const resultado = await campanhaService.delete(1, admin);

    expect(resultado).toEqual(campanha);
    expect(campanhaRepository.delete).toHaveBeenCalledWith(1);
  });

  it("não deve remover campanha inexistente", async () => {
    (campanhaRepository.getById as jest.Mock).mockResolvedValue(null);

    await expect(campanhaService.delete(99, admin)).rejects.toThrow(
      "Campanha não encontrada",
    );

    expect(campanhaRepository.delete).not.toHaveBeenCalled();
  });

  it("não deve remover campanha de outro administrador", async () => {
    const campanha = {
      id: 1,
      nome: "Bolão Copa",
      criador_id: 999,
      status: "ATIVA",
      is_publica: true,
    };

    (campanhaRepository.getById as jest.Mock).mockResolvedValue(campanha);

    await expect(campanhaService.delete(1, admin)).rejects.toThrow(
      "Você não tem permissão para excluir esta campanha",
    );

    expect(campanhaRepository.delete).not.toHaveBeenCalled();
  });
});