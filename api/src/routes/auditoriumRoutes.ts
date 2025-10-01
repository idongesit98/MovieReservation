import express from "express";
import * as controller from '../controllers/auditoriumController'
import { authenticate,authorize } from "../middleware/authMiddleware";
import { createAuditoriumSchema, validate } from "../middleware/Validations";

const router = express.Router();

router.post("/:theatreId/add",authenticate,authorize(["ADMIN"]),validate(createAuditoriumSchema),controller.addAuditorium)
router.get("/:theatreId/by-theatre",authenticate,controller.auditoriumByTheatre)
router.get("/:auditoriumId/:showtimeId/avail",authenticate,controller.availability)
router.get("/admin-report/:theatreId",authenticate,authorize(["ADMIN"]),controller.adminReports)
router.put("/:auditoriumId/update",authenticate,authorize(["ADMIN"]),controller.auditoriumUpdate)

export default router;