import express from "express";
import * as controller from '../controllers/seatController';
import { authenticate, authorize } from "../middleware/authMiddleware";

const router = express.Router()

router.post("/:auditoriumId/generate",authenticate,authorize(["ADMIN"]),controller.generateSeat)
router.get("/:auditoriumId/seats",authenticate,authorize(["ADMIN"]),controller.listSeats)
router.put("/:seatId/update",authenticate,authorize(["ADMIN"]),controller.update)
router.get("/:seatId/avail",authenticate,authorize(["ADMIN"]),controller.seatAvail)
router.get("/:screenId/report",authenticate,authorize(["ADMIN"]),controller.getReport)
router.get("/:reservationSeatId/cancel",authenticate,authorize(["ADMIN"]),controller.cancel)

export default router