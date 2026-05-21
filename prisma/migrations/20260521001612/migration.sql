-- CreateTable
CREATE TABLE "Campanha" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "data_inicio" TIMESTAMP(3) NOT NULL,
    "data_fim" TIMESTAMP(3) NOT NULL,
    "tx_operacional" DECIMAL(10,2) NOT NULL,
    "valor_bolao" DECIMAL(10,2) NOT NULL,
    "tipo_campanha_id" BOOLEAN NOT NULL,
    "codigo_campanha" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Campanha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampanhaOpcoes" (
    "id" SERIAL NOT NULL,
    "campanha_id" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "eh_resultado_final" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampanhaOpcoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CampanhaOpcoes_campanha_id_descricao_key" ON "CampanhaOpcoes"("campanha_id", "descricao");

-- AddForeignKey
ALTER TABLE "CampanhaOpcoes" ADD CONSTRAINT "CampanhaOpcoes_campanha_id_fkey" FOREIGN KEY ("campanha_id") REFERENCES "Campanha"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
