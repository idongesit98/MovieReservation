"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const database_1 = __importDefault(require("../utils/config/database"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const responseFormat_1 = require("../utils/config/responseFormat");
const hash_1 = require("../utils/config/hash");
const client_1 = require("@prisma/client");
const redis_1 = require("../utils/config/redis");
const registerUser = async (firstname, lastname, email, password, role) => {
    try {
        const existing = await database_1.default.user.findUnique({ where: { email } });
        if (existing) {
            return (0, responseFormat_1.errorResponse)(400, "User already exist", null);
        }
        const hashedPassword = await (0, hash_1.hashPassword)(password);
        const normalizedRole = Object.values(client_1.UserRole).includes(role)
            ? role : client_1.UserRole.USER;
        const newUser = await database_1.default.user.create({
            data: {
                firstname,
                lastname,
                email,
                password: hashedPassword,
                role: normalizedRole
            }
        });
        const { password: _p, ...userWithoutPassword } = newUser;
        return (0, responseFormat_1.successResponse)(201, "User signed up successfully", { User: userWithoutPassword });
    }
    catch (error) {
        console.error("SignUp Error", error);
        const errorMessage = (error instanceof Error) ? error : null;
        return (0, responseFormat_1.errorResponse)(500, "Failed to SignUp User", null, errorMessage);
    }
};
exports.registerUser = registerUser;
const loginUser = async (email, password) => {
    try {
        const user = await database_1.default.user.findUnique({ where: { email } });
        if (!user) {
            return (0, responseFormat_1.errorResponse)(403, "No email found", null);
        }
        const correctPassword = await (0, hash_1.comparePassword)(password, user?.password);
        const { password: _password, ...userwithoutPassword } = user;
        if (!correctPassword) {
            return (0, responseFormat_1.errorResponse)(401, "Invalid credentials", null);
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
        await redis_1.redisClient.setEx(`token:${token}`, 600, token);
        return (0, responseFormat_1.successResponse)(200, "User signed in successfully", { Data: { user: userwithoutPassword, token: token } });
    }
    catch (error) {
        console.error("Login error", error);
        return (0, responseFormat_1.errorResponse)(500, "Couldnt login user", null, error);
    }
};
exports.loginUser = loginUser;
const logoutUser = async (token) => {
    await redis_1.redisClient.del(`token:${token}`);
    return { message: "Logged out successfully" };
};
exports.logoutUser = logoutUser;
