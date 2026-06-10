import { useEffect, useState } from "react";
import { apostaService } from "../services/aposta.service";
import type { Aposta } from "../types/aposta";

export default function UsuariosPage() {
  const [vencedores, setVencedores] = useState<Aposta[]>([]);

  async function carregarVencedores() {
    const apostas = await apostaService.getAllVencedores();

    const apostasVencedoras = apostas.filter(
      (aposta: Aposta) =>
        aposta.campanhaOpcao?.eh_resultado_final === true,
    );

    setVencedores(apostasVencedoras);
  }

  useEffect(() => {
    carregarVencedores();
  }, []);

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-green-700 via-yellow-400 to-blue-700 p-8 text-white shadow-xl">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-widest text-white/90">
            Festa dos Campeões 🇧🇷
          </p>

          <h2 className="mt-3 text-4xl font-black">
            Vencedores do Bolão
          </h2>

          <p className="mt-3 text-lg font-medium text-white/90">
            Aqui aparecem os participantes que apostaram na opção marcada como
            resultado final.
          </p>
        </div>
      </section>

      {vencedores.length === 0 && (
        <div className="rounded-3xl border border-yellow-200 bg-yellow-50 p-8 text-center shadow-sm">
          <p className="text-5xl">🏆</p>

          <h3 className="mt-4 text-2xl font-bold text-slate-900">
            Ainda não há vencedores
          </h3>

          <p className="mt-2 text-slate-600">
            Quando o administrador marcar uma opção como resultado final, os
            apostadores dessa opção aparecerão aqui.
          </p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {vencedores.map((aposta) => (
          <div
            key={aposta.id}
            className="relative overflow-hidden rounded-3xl border border-yellow-300 bg-white p-6 shadow-lg"
          >
            <div className="absolute right-4 top-4 text-4xl">🏆</div>

            <p className="text-sm font-bold uppercase tracking-wide text-green-700">
              Vencedor confirmado
            </p>

            <h3 className="mt-2 text-2xl font-black text-slate-900">
              {aposta.usuario?.nome || "Participante"}
            </h3>

            <div className="mt-4 space-y-2 text-sm text-slate-700">
              <p>
                <strong>Campanha:</strong>{" "}
                {aposta.campanhaOpcao?.campanha?.nome || "-"}
              </p>

              <p>
                <strong>Palpite vencedor:</strong>{" "}
                {aposta.campanhaOpcao?.descricao || "-"}
              </p>

              <p>
                <strong>Status da aposta:</strong> {aposta.status}
              </p>

              <p>
                <strong>Pagamento:</strong> {aposta.meio_pagamento}
              </p>
            </div>

            <div className="mt-5 rounded-2xl bg-gradient-to-r from-green-600 to-blue-700 px-4 py-3 text-center font-bold text-white">
              Parabéns! Você acertou o resultado 🇧🇷
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}