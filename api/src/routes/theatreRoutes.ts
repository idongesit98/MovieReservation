import express from "express";
import * as controller from '../controllers/theatreController'
import { authenticate,authorize } from "../middleware/authMiddleware";
import { run } from "node:test";

const router = express.Router();

router.post("/add-theatre",authenticate,authorize,controller.addTheatre);
router.get("/:theatreId/single",controller.singleTheatre)
router.get("/all-movie",authenticate,controller.alltheatre)
router.post("/:theatreId/update",authenticate,authorize,controller.theatreUpdate);
router.delete("/:id",authenticate,authorize,controller.theatreDeleted)

export default router;