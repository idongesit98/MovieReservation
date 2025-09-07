import express from "express";
import * as controller from '../controllers/authController'

const router = express.Router();

router.post('/login',controller.login)
router.post('/register-user',controller.registerUser)
router.post('/logout',controller.logoutUser)

export default router
