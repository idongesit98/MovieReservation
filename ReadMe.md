# 🎥 Movie Reservation Api
A backend service for managing movies, showtimes, seats, reservations, and payments (integrated with Paystack). This API powers a movie booking system where users can browse movies, reserve seats, and make secure payments.
---

# 🚀Features
- **Movies & Showtimes**
    - Create,update,list movies
    - Schedule showtimes with automatic validation

-   **Auditoriums & Seats**
    - Static seat generation (Regular & VIP)
    - Seat availability check
    - Seat reports per screen

-   **Reservations**
    - Reserve one or more seats for a showtime
    - Prevent double-booking
    - Cancel reservations (frees up seats)

-   **Payments (Paystack Integration)**
    - Initialize and confirm payments
    - Webhook support for real-time payment updates
    - Reservation status auto-updates (Pending → Confirmed/Cancelled)
---
# 🛠️ Tech Stack
- Backend: Node.js, Express, TypeScript
- Database: PostgreSQL + Prisma ORM
- Payments: Paystack API
- Containerization: Docker
---

# ⚙️Setup and Installation
## 1. Clone the Repo
```bash
clone 
cd project folder
```
## 2. Install Dependencies
```bash
npm install
```
## 3. Environment Variable
```bash
DATABASE_URL=
REDIS_URL=
JWT_SECRET=
JWT_REFRESH_SECRET=
API_PREFIX=
API_VERSION=
PORT=
```
## 4. Run Database Migrations
```bash
npx prisma migrate dev
```
## 5. Start Server
```bash
npm run start
```
# 📌 API ENDPOINTS

## 🎥 Movies
- POST /api/v1/movies/add-movie → *Create movie*
- GET /api/v1/movies/all-movies → *List movies*
- GET /api/v1/movies/:movieId/single → *Get movie by ID*
- PUT /api/v1/movies/:movieId/update → *Update movie*
- DELETE /api/v1/movies/:id → *Delete movie*

## 🏟️ Auditorium
- POST /api/v1/auditorium/:theatreId/add → *Add Auditorium*
- GET /api/v1/auditorium/:theatreId/by-theatre → *Get By Theatre*
- GET /api/v1/auditorium/:auditoriumId/:showtimeId/avail → *Check auditorium availability*
- GET /api/v1/auditorium/admin-report/:theatreId → *Admin auditorium Reports*
- GET /api/v1/auditorium/:auditoriumId/update → *Update auditorium*

## 💺 Seat
- POST /api/v1/seat/:auditoriumId/generate → *Generate seats*
- GET /api/v1/auditorium/:auditoriumId/seats → *List seats*
- GET /api/v1/seat/:seatId/avail → *Check seat availability*
- GET /api/v1/seat/:screenId/report → *Get report*
- GET /api/v1/seat/:reservationSeatId/cancel  → *Cancel Seat*

## 🎞️ Showtimes
- POST /api/v1/showtimes/create → *Create showtime*
- GET /api/v1/showtimes/allshow → *List showtimes*
- GET /api/v1/showtimes/:showId/single → *Get showtime details*
- PUT /api/v1/showtimes/:showId/update → *Update showtime*
- DELETE /api/v1/showtimes/:showId/delete → *Delete showtime*

## 🎟️ Reservations
- POST /api/v1/reservation/create → *Create reservation*
- GET /api/v1/reservations/:bookingRef → *Get Single reservation*
- GET /api/v1/reservations/all → *Cancel reservation*

## 💳 Payments (Paystack)
- POST /api/v1/payments/initiate → *Initiate payment*
- GET /api/v1/payments/callback → *Handle Paystack callback*
- POST /api/v1/payments/webhook → *Webhook for Paystack events*

## 🔐 Authentication
- POST /api/v1/auth/login → *Login User*
- POST /api/v1/auth/register-user → *Register User*
- POST /api/v1/auth/logout → *Logout User*

## 🧪 Testing
```bash
npm test
```
## 📖 Roadmap
 User authentication (JWT / OAuth)

 Seat selection with seat map API

 Admin panel for managing movies & showtimes

 Email/SMS notifications for bookings

## 🎮 Contributing 
Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to improve.

## 🪪 License
In-coming