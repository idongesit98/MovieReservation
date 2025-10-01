import express from "express";
import * as controller from '../controllers/movieController'
import { authenticate, authorize } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/add-movie",authenticate,controller.addMovies)
router.get("/:movieId/single",controller.singleMovies)
router.get("/all-movie",authenticate,controller.allMovies)
router.put("/:movieId/update",authenticate,authorize(["ADMIN"]),controller.movieUpdate)
router.delete("/:id", authenticate,authorize,controller.movieDeleted);
router.get("/search",authenticate,authorize(["ADMIN"]),controller.moviesSearch);

export default router


