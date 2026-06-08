/*
  Warnings:

  - A unique constraint covering the columns `[codigo_campanha]` on the table `Campanha` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Campanha_codigo_campanha_key" ON "Campanha"("codigo_campanha");
