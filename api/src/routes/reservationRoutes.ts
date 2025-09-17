import express from "express";
import *  as controller from '../controllers/reservationController'
import { authenticate, authorize } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/create",authenticate,authorize(["ADMIN"]),controller.createReserv)
router.post("/:reservationId/cancel",authenticate,authorize(["ADMIN"]),controller.cancelReserv)
router.get("/:bookingRef/bookings",authenticate,authorize(["ADMIN"]),controller.getReserv)

export default router;