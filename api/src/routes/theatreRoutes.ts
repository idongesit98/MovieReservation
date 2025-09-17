import express from "express";
import * as controller from '../controllers/theatreController'
import { authenticate,authorize } from "../middleware/authMiddleware";
import { theatreSchema, updateTheatreSchema, validate } from "../middleware/Validations";


const router = express.Router();

router.post("/add-theatre",authenticate,authorize(["ADMIN"]),validate(theatreSchema),controller.addTheatre);
router.get("/:theatreId/single",controller.singleTheatre)
router.get("/all-theatre",authenticate,controller.alltheatre)
router.post("/:theatreId/update",authenticate,authorize(["ADMIN"]),validate(updateTheatreSchema),controller.theatreUpdate);
router.delete("/:theatreId/delete",authenticate,authorize(["ADMIN"]),controller.theatreDeleted)

export default router;