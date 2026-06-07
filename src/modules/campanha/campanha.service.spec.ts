import { campanhaService } from "./campanha.service";
import { campanhaRepository } from "./campanha.repo";

jest.mock("./campanha.repo", () => ({
  campanhaRepository: {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("campanhaService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve listar campanhas", async () => {
    const campanhas = [{ id: 1, nome: "Bolão Copa", status: "ATIVA" }];

    (campanhaRepository.getAll as jest.Mock).mockResolvedValue(campanhas);

    const resultado = await campanhaService.getAll();

    expect(resultado).toEqual(campanhas);
    expect(campanhaRepository.getAll).toHaveBeenCalledTimes(1);
  });

  it("deve buscar campanha por ID existente", async () => {
    const campanha = { id: 1, nome: "Bolão Copa", status: "ATIVA" };

    (campanhaRepository.getById as jest.Mock).mockResolvedValue(campanha);

    const resultado = await campanhaService.getById(1);

    expect(resultado).toEqual(campanha);
    expect(campanhaRepository.getById).toHaveBeenCalledWith(1);
  });

  it("deve retornar erro ao buscar campanha inexistente", async () => {
    (campanhaRepository.getById as jest.Mock).mockResolvedValue(null);

    await expect(campanhaService.getById(99)).rejects.toThrow(
      "Campanha não encontrada",
    );
  });

  it("deve criar campanha válida", async () => {
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

    const campanhaCriada = { id: 1, ...data };

    (campanhaRepository.create as jest.Mock).mockResolvedValue(campanhaCriada);

    const resultado = await campanhaService.create(data);

    expect(resultado).toEqual(campanhaCriada);
    expect(campanhaRepository.create).toHaveBeenCalledWith(data);
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

    await expect(campanhaService.create(data)).rejects.toThrow(
      "A data de início deve ser anterior à data de fim",
    );

    expect(campanhaRepository.create).not.toHaveBeenCalled();
  });

  it("deve atualizar campanha existente", async () => {
    const campanhaExistente = { id: 1, nome: "Bolão", status: "ATIVA" };
    const dadosAtualizacao = { nome: "Bolão Atualizado" };
    const campanhaAtualizada = { ...campanhaExistente, ...dadosAtualizacao };

    (campanhaRepository.getById as jest.Mock).mockResolvedValue(
      campanhaExistente,
    );
    (campanhaRepository.update as jest.Mock).mockResolvedValue(
      campanhaAtualizada,
    );

    const resultado = await campanhaService.update(1, dadosAtualizacao);

    expect(resultado).toEqual(campanhaAtualizada);
    expect(campanhaRepository.update).toHaveBeenCalledWith(1, dadosAtualizacao);
  });

  it("não deve atualizar campanha inexistente", async () => {
    (campanhaRepository.getById as jest.Mock).mockResolvedValue(null);

    await expect(campanhaService.update(99, { nome: "Teste" })).rejects.toThrow(
      "Campanha não encontrada",
    );

    expect(campanhaRepository.update).not.toHaveBeenCalled();
  });

  it("deve remover campanha existente", async () => {
    const campanha = { id: 1, nome: "Bolão Copa" };

    (campanhaRepository.getById as jest.Mock).mockResolvedValue(campanha);
    (campanhaRepository.delete as jest.Mock).mockResolvedValue(campanha);

    const resultado = await campanhaService.delete(1);

    expect(resultado).toEqual(campanha);
    expect(campanhaRepository.delete).toHaveBeenCalledWith(1);
  });

  it("não deve remover campanha inexistente", async () => {
    (campanhaRepository.getById as jest.Mock).mockResolvedValue(null);

    await expect(campanhaService.delete(99)).rejects.toThrow(
      "Campanha não encontrada",
    );

    expect(campanhaRepository.delete).not.toHaveBeenCalled();
  });
});
