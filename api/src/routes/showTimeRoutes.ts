import express from 'express';
import * as showTimeController from '../controllers/showTimeController'
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.post("/create",authenticate,authorize(["ADMIN"]),showTimeController.createShow );
router.get("/allShows",authenticate,authorize(["ADMIN"]),showTimeController.getAllShowsTimes);
router.get("/:showId/single",authenticate,authorize(["ADMIN"]),showTimeController.getShowById);
router.put("/:showId/update",authenticate,authorize(["ADMIN"]),showTimeController.updateShow);
router.delete("/:showId/delete",authenticate,authorize(["ADMIN"]),showTimeController.deleteShow);

router.get("/movie/:movieId",authenticate,authorize(["ADMIN"]),showTimeController.getTimeByMovie);
router.get("/auditorium/:screenId",authenticate,authorize(["ADMIN"]),showTimeController.getShowTimeAuditorium);
router.get("/:showId/alternatives",authenticate,authorize(["ADMIN"]),showTimeController.getAlternativeShowTimes);
router.get("/upcoming/list",authenticate,authorize(["ADMIN"]),showTimeController.getUpcomingShowTimes);

export default router
