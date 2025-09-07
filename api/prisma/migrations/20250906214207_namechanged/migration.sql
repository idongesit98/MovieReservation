/*
  Warnings:

  - You are about to drop the `screens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."screens" DROP CONSTRAINT "screens_theatre_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."seats" DROP CONSTRAINT "seats_screen_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."showtime" DROP CONSTRAINT "showtime_screen_id_fkey";

-- DropTable
DROP TABLE "public"."screens";

-- CreateTable
CREATE TABLE "public"."auditorium" (
    "id" TEXT NOT NULL,
    "theatre_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "seatLayout" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "auditorium_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "auditorium_theatre_id_name_key" ON "public"."auditorium"("theatre_id", "name");

-- AddForeignKey
ALTER TABLE "public"."auditorium" ADD CONSTRAINT "auditorium_theatre_id_fkey" FOREIGN KEY ("theatre_id") REFERENCES "public"."theatres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."seats" ADD CONSTRAINT "seats_screen_id_fkey" FOREIGN KEY ("screen_id") REFERENCES "public"."auditorium"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."showtime" ADD CONSTRAINT "showtime_screen_id_fkey" FOREIGN KEY ("screen_id") REFERENCES "public"."auditorium"("id") ON DELETE CASCADE ON UPDATE CASCADE;
