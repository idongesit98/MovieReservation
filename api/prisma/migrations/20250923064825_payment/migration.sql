/*
  Warnings:

  - A unique constraint covering the columns `[transactionRef]` on the table `payment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "payment_transactionRef_key" ON "public"."payment"("transactionRef");
