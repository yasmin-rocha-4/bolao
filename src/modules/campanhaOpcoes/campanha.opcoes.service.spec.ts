import { campanhaOpcoesService } from "./campanha.opcoes.service";
import { campanhaOpcoesRepository } from "./campanha.opcoes.repo";
import { campanhaRepository } from "../campanha/campanha.repo";

jest.mock("./campanha.opcoes.repo", () => ({
  campanhaOpcoesRepository: {
    getAll: jest.fn(),
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

describe("campanhaOpcoesService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve listar opções de campanha", async () => {
    const opcoes = [{ id: 1, descricao: "Brasil campeão", status: "ATIVA" }];

    (campanhaOpcoesRepository.getAll as jest.Mock).mockResolvedValue(opcoes);

    const resultado = await campanhaOpcoesService.getAll();

    expect(resultado).toEqual(opcoes);
    expect(campanhaOpcoesRepository.getAll).toHaveBeenCalledTimes(1);
  });

  it("deve buscar opção por ID existente", async () => {
    const opcao = { id: 1, descricao: "Brasil campeão", status: "ATIVA" };

    (campanhaOpcoesRepository.getById as jest.Mock).mockResolvedValue(opcao);

    const resultado = await campanhaOpcoesService.getById(1);

    expect(resultado).toEqual(opcao);
    expect(campanhaOpcoesRepository.getById).toHaveBeenCalledWith(1);
  });

  it("deve retornar erro ao buscar opção inexistente", async () => {
    (campanhaOpcoesRepository.getById as jest.Mock).mockResolvedValue(null);

    await expect(campanhaOpcoesService.getById(99)).rejects.toThrow(
      "Opção da campanha não encontrada",
    );
  });

  it("deve criar opção quando campanha existe", async () => {
    const campanha = { id: 1, nome: "Bolão Copa" };

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

    const resultado = await campanhaOpcoesService.create(data);

    expect(resultado).toEqual(opcaoCriada);
    expect(campanhaRepository.getById).toHaveBeenCalledWith(1);
    expect(campanhaOpcoesRepository.create).toHaveBeenCalledWith(data);
  });

  it("não deve criar opção quando campanha não existe", async () => {
    const data = {
      campanha_id: 999,
      descricao: "Argentina campeã",
      status: "ATIVA",
      eh_resultado_final: false,
    };

    (campanhaRepository.getById as jest.Mock).mockResolvedValue(null);

    await expect(campanhaOpcoesService.create(data)).rejects.toThrow(
      "Campanha inválida",
    );

    expect(campanhaOpcoesRepository.create).not.toHaveBeenCalled();
  });

  it("deve atualizar opção existente", async () => {
    const opcao = { id: 1, descricao: "Brasil campeão", status: "ATIVA" };
    const dados = { descricao: "Brasil Hexacampeão" };
    const opcaoAtualizada = { ...opcao, ...dados };

    (campanhaOpcoesRepository.getById as jest.Mock).mockResolvedValue(opcao);
    (campanhaOpcoesRepository.update as jest.Mock).mockResolvedValue(
      opcaoAtualizada,
    );

    const resultado = await campanhaOpcoesService.update(1, dados);

    expect(resultado).toEqual(opcaoAtualizada);
    expect(campanhaOpcoesRepository.update).toHaveBeenCalledWith(1, dados);
  });

  it("não deve atualizar opção inexistente", async () => {
    (campanhaOpcoesRepository.getById as jest.Mock).mockResolvedValue(null);

    await expect(
      campanhaOpcoesService.update(99, { status: "INATIVA" }),
    ).rejects.toThrow("Opção da campanha não encontrada");

    expect(campanhaOpcoesRepository.update).not.toHaveBeenCalled();
  });

  it("deve remover opção existente", async () => {
    const opcao = { id: 1, descricao: "Brasil campeão" };

    (campanhaOpcoesRepository.getById as jest.Mock).mockResolvedValue(opcao);
    (campanhaOpcoesRepository.delete as jest.Mock).mockResolvedValue(opcao);

    const resultado = await campanhaOpcoesService.delete(1);

    expect(resultado).toEqual(opcao);
    expect(campanhaOpcoesRepository.delete).toHaveBeenCalledWith(1);
  });

  it("não deve remover opção inexistente", async () => {
    (campanhaOpcoesRepository.getById as jest.Mock).mockResolvedValue(null);

    await expect(campanhaOpcoesService.delete(99)).rejects.toThrow(
      "Opção da campanha não encontrada",
    );

    expect(campanhaOpcoesRepository.delete).not.toHaveBeenCalled();
  });
});
