import express from "express";
import * as controller from '../controllers/authController'
import { loginSchema, signUpSchema, validate } from "../middleware/Validations";

const router = express.Router();

router.post('/login',controller.login)
router.post('/register-user',validate(signUpSchema),controller.registerUser)
router.post('/logout',validate(loginSchema),controller.logoutUser)

export default router
