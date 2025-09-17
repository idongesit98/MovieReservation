import express from "express";
import * as controller from '../controllers/auditoriumController'
import { authenticate,authorize } from "../middleware/authMiddleware";

const router = express.Router();

//The availability routes and update needs to be checked. for availability when showtime id is created for update individial updated should be allowed
router.post("/:theatre_id/add-torium",authenticate,authorize(["ADMIN"]),controller.addAuditorium)
router.get("/:theatreId/by-theatre",authenticate,controller.auditoriumByTheatre)
router.get("/:auditoriumId/:showtimeId/avail",authenticate,controller.availability)
router.get("/admin-report/:theatre_id",authenticate,authorize(["ADMIN"]),controller.adminReports)
router.post("/:auditoriumId/update-auditorium",authenticate,authorize(["ADMIN"]),controller.auditoriumUpdate)

export default router;