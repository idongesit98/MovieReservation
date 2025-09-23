import express from "express";
import * as controller from "../controllers/paymentController"
import { authenticate, authorize } from "../middleware/authMiddleware";

const route = express.Router();

route.post("/initiate-pay",authenticate,authorize(["ADMIN","USER"]),controller.initiate)
route.post("/verify",authenticate,authorize(["ADMIN","USER"]),controller.verify)

export default route