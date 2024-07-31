/*
  Warnings:

  - You are about to drop the `Contrato` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Contrato";

-- CreateTable
CREATE TABLE "contrato" (
    "id" SERIAL NOT NULL,
    "numero" VARCHAR(50) NOT NULL,
    "nomeGestor" VARCHAR(255) NOT NULL,
    "descricao" VARCHAR(255) NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataTermino" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contrato_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contrato_numero_key" ON "contrato"("numero");
