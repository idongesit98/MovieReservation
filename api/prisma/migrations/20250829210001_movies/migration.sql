-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('User', 'Admin');

-- CreateEnum
CREATE TYPE "public"."Type" AS ENUM ('Vip', 'Regular');

-- CreateEnum
CREATE TYPE "public"."ReservationStatus" AS ENUM ('Pending', 'Confirmed', 'Cancelled');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('Pending', 'Confirmed', 'Cancelled');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "dob" TIMESTAMP(3),
    "email" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'User',
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."movies" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "releasedDate" TIMESTAMP(3),
    "rating" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "language" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "movies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."theaters" (
    "id" TEXT NOT NULL,
    "theatre_name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "contact_info" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "theaters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."screens" (
    "id" TEXT NOT NULL,
    "theatre_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "seatLayout" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "screens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."seats" (
    "id" TEXT NOT NULL,
    "screen_id" TEXT NOT NULL,
    "row" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "type" "public"."Type" NOT NULL DEFAULT 'Regular',
    "price" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "seats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."showtime" (
    "id" TEXT NOT NULL,
    "movie_id" TEXT NOT NULL,
    "screen_id" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "price" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "showtime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reservation" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "showtime_id" TEXT NOT NULL,
    "status" "public"."ReservationStatus" NOT NULL DEFAULT 'Pending',
    "bookingReference" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reservation_seat" (
    "id" TEXT NOT NULL,
    "reservation_id" TEXT NOT NULL,
    "seat_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "reservation_seat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."payment" (
    "id" TEXT NOT NULL,
    "reservation_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" "public"."PaymentStatus" NOT NULL DEFAULT 'Pending',
    "method" TEXT NOT NULL,
    "transactionRef" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "reservation_bookingReference_key" ON "public"."reservation"("bookingReference");

-- AddForeignKey
ALTER TABLE "public"."screens" ADD CONSTRAINT "screens_theatre_id_fkey" FOREIGN KEY ("theatre_id") REFERENCES "public"."theaters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."seats" ADD CONSTRAINT "seats_screen_id_fkey" FOREIGN KEY ("screen_id") REFERENCES "public"."screens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."showtime" ADD CONSTRAINT "showtime_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "public"."movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."showtime" ADD CONSTRAINT "showtime_screen_id_fkey" FOREIGN KEY ("screen_id") REFERENCES "public"."screens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reservation" ADD CONSTRAINT "reservation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reservation" ADD CONSTRAINT "reservation_showtime_id_fkey" FOREIGN KEY ("showtime_id") REFERENCES "public"."showtime"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reservation_seat" ADD CONSTRAINT "reservation_seat_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "public"."reservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reservation_seat" ADD CONSTRAINT "reservation_seat_seat_id_fkey" FOREIGN KEY ("seat_id") REFERENCES "public"."seats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payment" ADD CONSTRAINT "payment_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "public"."reservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
