/*
  Warnings:

  - A unique constraint covering the columns `[theatre_name]` on the table `theatres` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "theatres_theatre_name_key" ON "public"."theatres"("theatre_name");
