"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = __importDefault(require("../utils/config/database"));
const authenticate = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'Access denied. No token provided.' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!decoded || typeof decoded === "string" || !decoded.id) {
            res.status(401).json({ message: "Invalid token" });
            return;
        }
        const user = await database_1.default.user.findUnique({ where: { id: decoded.id } });
        if (!user) {
            res.status(401).json({ message: "User not found" });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Invalid token." });
        return;
    }
};
exports.authenticate = authenticate;
const authorize = (roles) => {
    (req, res, next) => {
        // const user = req.user as {role:string};
        // if (!roles.includes(user.role)) {
        //     res.status(403).json({error:"Access Denied"});
        // }
        const user = req.user;
        if (!user || !roles.includes(user.role)) {
            res.status(403).json({ error: "Access denied" });
        }
        next();
    };
    return;
};
exports.authorize = authorize;
