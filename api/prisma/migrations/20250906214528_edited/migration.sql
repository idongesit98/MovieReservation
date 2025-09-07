/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `auditorium` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "auditorium_name_key" ON "public"."auditorium"("name");
