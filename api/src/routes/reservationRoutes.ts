import express from "express";
import *  as controller from '../controllers/reservationController'
import { authenticate, authorize } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/create",authenticate,authorize(["ADMIN"]),controller.createReserv)
router.get("/:bookingRef/bookings",authenticate,authorize(["ADMIN"]),controller.getReserv)
router.get("/all",authenticate,authorize(["ADMIN"]),controller.getAllReserv)


export default router;