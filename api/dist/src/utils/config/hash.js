"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = exports.REFRESH_TOKEN_EXP = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const SALT_ROUNDS = Number(10);
const ACCESS_TOKEN_EXP = "15m";
exports.REFRESH_TOKEN_EXP = 60 * 60 * 24 * 7; //7 days in second
const hashPassword = async (plain) => {
    return bcrypt_1.default.hash(plain, SALT_ROUNDS);
};
exports.hashPassword = hashPassword;
const comparePassword = async (plain, hash) => {
    return bcrypt_1.default.compare(plain, hash);
};
exports.comparePassword = comparePassword;
