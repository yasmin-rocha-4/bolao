type DadosCartao = {
  numero: string;
  nome: string;
  validade: string;
  cvv: string;
};

type PagamentoFormProps = {
  tipo: string;
  comprovante: string;
  boletoGerado: boolean;
  dadosCartao: DadosCartao;
  onComprovanteChange: (valor: string) => void;
  onBoletoGeradoChange: (valor: boolean) => void;
  onDadosCartaoChange: (dados: DadosCartao) => void;
};

export default function PagamentoForm({
  tipo,
  comprovante,
  boletoGerado,
  dadosCartao,
  onComprovanteChange,
  onBoletoGeradoChange,
  onDadosCartaoChange,
}: PagamentoFormProps) {
  if (tipo === "PIX") {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
        <p className="text-sm font-bold text-green-800">Pagamento via PIX</p>

        <p className="mt-2 text-sm text-slate-700">Chave PIX:</p>

        <div className="mt-1 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-800">
          bolao@copa.com.br
        </div>

        <button
          type="button"
          onClick={() => navigator.clipboard.writeText("bolao@copa.com.br")}
          className="mt-3 rounded-full bg-green-700 px-4 py-2 text-sm font-bold text-white hover:bg-green-800"
        >
          Copiar chave PIX
        </button>

        <div className="mt-4">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Enviar comprovante
          </label>

          <input
            type="file"
            accept="image/*,.pdf"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            onChange={(e) => {
              const arquivo = e.target.files?.[0];

              if (arquivo) {
                onComprovanteChange(arquivo.name);
              }
            }}
          />

          {comprovante && (
            <p className="mt-2 text-xs text-green-700">
              Arquivo selecionado: <strong>{comprovante}</strong>
            </p>
          )}
        </div>
      </div>
    );
  }

  if (tipo === "CARTAO_CREDITO" || tipo === "CARTAO_DEBITO") {
    return (
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
        <p className="text-sm font-bold text-blue-800">Pagamento com Cartão</p>

        <div className="mt-3 grid gap-3">
          <input
            className="rounded-lg border border-slate-300 px-3 py-2"
            placeholder="Número do cartão"
            value={dadosCartao.numero}
            onChange={(e) =>
              onDadosCartaoChange({
                ...dadosCartao,
                numero: e.target.value,
              })
            }
          />

          <input
            className="rounded-lg border border-slate-300 px-3 py-2"
            placeholder="Nome impresso no cartão"
            value={dadosCartao.nome}
            onChange={(e) =>
              onDadosCartaoChange({
                ...dadosCartao,
                nome: e.target.value,
              })
            }
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              className="rounded-lg border border-slate-300 px-3 py-2"
              placeholder="Validade"
              value={dadosCartao.validade}
              onChange={(e) =>
                onDadosCartaoChange({
                  ...dadosCartao,
                  validade: e.target.value,
                })
              }
            />

            <input
              className="rounded-lg border border-slate-300 px-3 py-2"
              placeholder="CVV"
              value={dadosCartao.cvv}
              onChange={(e) =>
                onDadosCartaoChange({
                  ...dadosCartao,
                  cvv: e.target.value,
                })
              }
            />
          </div>
        </div>

        <p className="mt-2 text-xs text-slate-500">
          Interface demonstrativa. Nenhum dado real de cartão será processado.
        </p>
      </div>
    );
  }

  if (tipo === "BOLETO") {
    return (
      <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4">
        <p className="text-sm font-bold text-yellow-800">
          Pagamento via Boleto
        </p>

        <p className="mt-2 text-sm text-slate-700">Código de barras:</p>

        <div className="mt-1 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-800">
          34191.79001 01043.510047 91020.150008 7 92450026000
        </div>

        <button
          type="button"
          onClick={() => onBoletoGeradoChange(true)}
          className="mt-3 rounded-full bg-yellow-500 px-4 py-2 text-sm font-bold text-white hover:bg-yellow-600"
        >
          Gerar boleto
        </button>

        {boletoGerado && (
          <p className="mt-2 text-xs font-semibold text-green-700">
            Boleto gerado com sucesso.
          </p>
        )}
      </div>
    );
  }

  return null;
}
