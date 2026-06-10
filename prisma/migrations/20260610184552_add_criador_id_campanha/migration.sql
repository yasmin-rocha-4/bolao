/*
  Warnings:

  - Added the required column `criador_id` to the `Campanha` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Campanha" ADD COLUMN     "criador_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Campanha" ADD CONSTRAINT "Campanha_criador_id_fkey" FOREIGN KEY ("criador_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
