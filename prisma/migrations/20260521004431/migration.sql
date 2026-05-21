/*
  Warnings:

  - You are about to drop the column `tipo_campanha_id` on the `Campanha` table. All the data in the column will be lost.
  - Added the required column `is_publica` to the `Campanha` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MeioPagamentoTipo" AS ENUM ('PIX', 'CARTAO_CREDITO', 'CARTAO_DEBITO', 'BOLETO');

-- AlterTable
ALTER TABLE "Campanha" DROP COLUMN "tipo_campanha_id",
ADD COLUMN     "is_publica" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "Aposta" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "campanha_opcao_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "meio_pagamento" "MeioPagamentoTipo" NOT NULL,
    "comprovante" TEXT,
    "dt_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Aposta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Aposta_usuario_id_idx" ON "Aposta"("usuario_id");

-- CreateIndex
CREATE INDEX "Aposta_campanha_opcao_id_idx" ON "Aposta"("campanha_opcao_id");

-- CreateIndex
CREATE INDEX "Aposta_status_idx" ON "Aposta"("status");

-- AddForeignKey
ALTER TABLE "Aposta" ADD CONSTRAINT "Aposta_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aposta" ADD CONSTRAINT "Aposta_campanha_opcao_id_fkey" FOREIGN KEY ("campanha_opcao_id") REFERENCES "CampanhaOpcoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
