/*
  Warnings:

  - You are about to drop the column `created_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `theaters` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[theatre_id,name]` on the table `screens` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `seatLayout` on the `screens` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "public"."screens" DROP CONSTRAINT "screens_theatre_id_fkey";

-- AlterTable
ALTER TABLE "public"."screens" DROP COLUMN "seatLayout",
ADD COLUMN     "seatLayout" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "created_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "public"."theaters";

-- CreateTable
CREATE TABLE "public"."theatres" (
    "id" TEXT NOT NULL,
    "theatre_name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "contact_info" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "theatres_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "screens_theatre_id_name_key" ON "public"."screens"("theatre_id", "name");

-- AddForeignKey
ALTER TABLE "public"."screens" ADD CONSTRAINT "screens_theatre_id_fkey" FOREIGN KEY ("theatre_id") REFERENCES "public"."theatres"("id") ON DELETE CASCADE ON UPDATE CASCADE;
