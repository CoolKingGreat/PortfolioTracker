/*
  Warnings:

  - You are about to alter the column `quantity` on the `assets` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `cash` on the `users` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - A unique constraint covering the columns `[ticker]` on the table `assets` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."assets" ADD COLUMN     "costBasis" DECIMAL(65,30) NOT NULL DEFAULT 0,
ALTER COLUMN "quantity" SET DEFAULT 0,
ALTER COLUMN "quantity" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "public"."users" ALTER COLUMN "cash" SET DATA TYPE DECIMAL(65,30);

-- CreateIndex
CREATE UNIQUE INDEX "assets_ticker_key" ON "public"."assets"("ticker");
