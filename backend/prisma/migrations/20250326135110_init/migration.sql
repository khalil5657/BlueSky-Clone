/*
  Warnings:

  - You are about to drop the `Test` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Test";

-- CreateTable
CREATE TABLE "Testa" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "Testa_pkey" PRIMARY KEY ("id")
);
