import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PagamentoForm from "../components/PagamentoForm";
import { campanhaService } from "../services/campanha.service";
import { campanhaOpcaoService } from "../services/campanhaOpcao.service";
import { apostaService } from "../services/aposta.service";

import type { Campanha } from "../types/campanha";
import type { CampanhaOpcao } from "../types/campanhaOpcao";
import type { Aposta } from "../types/aposta";
import { getUsuarioLogado, isAdmin } from "../utils/auth";

export default function HomePage() {
  const admin = isAdmin();

  if (admin) {
    return <AdminDashboard />;
  }

  return <ClienteDashboard />;
}

function AdminDashboard() {
  const [campanhas, setCampanhas] = useState(0);
  const [opcoes, setOpcoes] = useState(0);
  const [apostas, setApostas] = useState(0);
  const [participantes, setParticipantes] = useState(0);

  async function carregarDashboard() {
    try {
      const [campanhasData, opcoesData, apostasData] = await Promise.all([
        campanhaService.getAll(),
        campanhaOpcaoService.getAll(),
        apostaService.getAll(),
      ]);

      const idsUsuariosQueApostaram = new Set(
        apostasData.map((aposta: Aposta) => aposta.usuario_id),
      );

      setCampanhas(campanhasData.length);
      setOpcoes(opcoesData.length);
      setApostas(apostasData.length);
      setParticipantes(idsUsuariosQueApostaram.size);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Erro ao carregar dashboard.",
      );
    }
  }

  useEffect(() => {
    carregarDashboard();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">
          Dashboard Administrativo
        </h2>

        <p className="mt-2 text-slate-600">
          Visão geral das campanhas, opções e apostas gerenciadas por você.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <DashboardCard titulo="Minhas Campanhas" valor={campanhas} />
        <DashboardCard titulo="Opções" valor={opcoes} />
        <DashboardCard titulo="Apostas" valor={apostas} />
        <DashboardCard titulo="Participantes" valor={participantes} />
      </div>
    </div>
  );
}

function ClienteDashboard() {
  const usuario = getUsuarioLogado();

  const [campanhas, setCampanhas] = useState<Campanha[]>([]);
  const [opcoes, setOpcoes] = useState<CampanhaOpcao[]>([]);

  const [opcoesSelecionadas, setOpcoesSelecionadas] = useState<
    Record<number, number>
  >({});
  const [pagamentos, setPagamentos] = useState<Record<number, string>>({});
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [comprovantes, setComprovantes] = useState<Record<number, string>>({});
  const [boletosGerados, setBoletosGerados] = useState<Record<number, boolean>>(
    {},
  );
  const [dadosCartoes, setDadosCartoes] = useState<
    Record<
      number,
      {
        numero: string;
        nome: string;
        validade: string;
        cvv: string;
      }
    >
  >({});

  async function carregarDados() {
    try {
      const [campanhasData, opcoesData] = await Promise.all([
        campanhaService.getAll(),
        campanhaOpcaoService.getAll(),
      ]);

      setCampanhas(campanhasData);
      setOpcoes(opcoesData);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Erro ao carregar campanhas.",
      );
    }
  }

  function opcoesDaCampanha(campanhaId: number) {
    return opcoes.filter(
      (opcao) => opcao.campanha_id === campanhaId && opcao.status === "ATIVA",
    );
  }

  async function apostar(campanha: Campanha) {
    const opcaoId = opcoesSelecionadas[campanha.id];
    const meioPagamento = pagamentos[campanha.id] || "PIX";

    if (!opcaoId) {
      toast.error("Selecione uma opção de palpite.");
      return;
    }
    if (meioPagamento === "PIX" && !comprovantes[campanha.id]) {
      toast.error("É necessário enviar o comprovante do PIX.");
      return;
    }

    if (
      meioPagamento === "CARTAO_CREDITO" ||
      meioPagamento === "CARTAO_DEBITO"
    ) {
      const cartao = dadosCartoes[campanha.id];

      if (
        !cartao?.numero ||
        !cartao?.nome ||
        !cartao?.validade ||
        !cartao?.cvv
      ) {
        toast.error("Preencha todos os dados do cartão.");
        return;
      }
    }

    if (meioPagamento === "BOLETO" && !boletosGerados[campanha.id]) {
      toast.error("Gere o boleto antes de confirmar a aposta.");
      return;
    }

    try {
      setLoadingId(campanha.id);

      await apostaService.create({
        campanha_opcao_id: opcaoId,
        meio_pagamento: meioPagamento,
        status: "PENDENTE",
        comprovante: comprovantes[campanha.id] || "",
      });

      toast.success("Aposta criada com sucesso!");

      setOpcoesSelecionadas({
        ...opcoesSelecionadas,
        [campanha.id]: 0,
      });

      setComprovantes({
        ...comprovantes,
        [campanha.id]: "",
      });
    } catch (error: any) {
      const primeiroErro = error?.response?.data?.errors?.[0]?.mensagem;

      toast.error(
        primeiroErro ||
          error?.response?.data?.message ||
          "Erro ao criar aposta.",
      );
    } finally {
      setLoadingId(null);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">
          Olá, {usuario?.nome}
        </h2>

        <p className="mt-2 text-slate-600">
          Escolha uma campanha disponível, selecione uma opção de palpite e
          confirme sua aposta.
        </p>
      </div>

      {campanhas.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
          Nenhuma campanha disponível no momento.
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {campanhas.map((campanha) => {
          const opcoesCampanha = opcoesDaCampanha(campanha.id);

          return (
            <div
              key={campanha.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-4">
                <h3 className="text-xl font-bold text-slate-900">
                  {campanha.nome}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Código: {campanha.codigo_campanha}
                </p>
              </div>

              <div className="mb-4 grid gap-3 text-sm text-slate-700">
                <p>
                  <strong>Valor:</strong> R$ {campanha.valor_bolao}
                </p>

                <p>
                  <strong>Taxa:</strong> R$ {campanha.tx_operacional}
                </p>

                <p>
                  <strong>Status:</strong> {campanha.status}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Seu palpite
                  </label>

                  <select
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={opcoesSelecionadas[campanha.id] || 0}
                    onChange={(e) =>
                      setOpcoesSelecionadas({
                        ...opcoesSelecionadas,
                        [campanha.id]: Number(e.target.value),
                      })
                    }
                  >
                    <option value={0}>Selecione uma opção</option>

                    {opcoesCampanha.map((opcao) => (
                      <option key={opcao.id} value={opcao.id}>
                        {opcao.descricao}
                      </option>
                    ))}
                  </select>

                  {opcoesCampanha.length === 0 && (
                    <p className="mt-1 text-xs text-red-500">
                      Esta campanha ainda não possui opções cadastradas.
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Meio de pagamento
                  </label>

                  <select
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={pagamentos[campanha.id] || "PIX"}
                    onChange={(e) =>
                      setPagamentos({
                        ...pagamentos,
                        [campanha.id]: e.target.value,
                      })
                    }
                  >
                    <PagamentoForm
                      tipo={pagamentos[campanha.id] || "PIX"}
                      comprovante={comprovantes[campanha.id] || ""}
                      boletoGerado={boletosGerados[campanha.id] || false}
                      dadosCartao={
                        dadosCartoes[campanha.id] || {
                          numero: "",
                          nome: "",
                          validade: "",
                          cvv: "",
                        }
                      }
                      onComprovanteChange={(valor) =>
                        setComprovantes({
                          ...comprovantes,
                          [campanha.id]: valor,
                        })
                      }
                      onBoletoGeradoChange={(valor) =>
                        setBoletosGerados({
                          ...boletosGerados,
                          [campanha.id]: valor,
                        })
                      }
                      onDadosCartaoChange={(dados) =>
                        setDadosCartoes({
                          ...dadosCartoes,
                          [campanha.id]: dados,
                        })
                      }
                    />
                    <option value="PIX">PIX</option>
                    <option value="CARTAO_CREDITO">Cartão de Crédito</option>
                    <option value="CARTAO_DEBITO">Cartão de Débito</option>
                    <option value="BOLETO">Boleto</option>
                  </select>
                </div>

                <button
                  onClick={() => apostar(campanha)}
                  disabled={
                    loadingId === campanha.id || opcoesCampanha.length === 0
                  }
                  className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:bg-slate-400"
                >
                  {loadingId === campanha.id ? "Criando aposta..." : "Apostar"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DashboardCard({ titulo, valor }: { titulo: string; valor: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{titulo}</p>
      <strong className="mt-3 block text-4xl font-bold text-slate-900">
        {valor}
      </strong>
    </div>
  );
}
