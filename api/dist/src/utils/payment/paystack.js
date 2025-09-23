"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializePayment = void 0;
exports.verifyPayment = verifyPayment;
const axios_1 = __importDefault(require("axios"));
const responseFormat_1 = require("../config/responseFormat");
const initializePayment = async (email, amount, reference) => {
    try {
        const response = await axios_1.default.post("https://api.paystack.co/transaction/initialize", {
            email,
            amount: amount * 100,
            reference: reference,
            callback_url: ""
        }, {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
                "Content-Type": "application/json"
            }
        });
        return response.data;
    }
    catch (error) {
        console.error("Initialize Payment error", error);
        return (0, responseFormat_1.errorResponse)(500, "Failed to initialize payment", null, error);
    }
};
exports.initializePayment = initializePayment;
async function verifyPayment(reference) {
    try {
        const response = await axios_1.default.get(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET}` }
        });
        return response.data;
    }
    catch (error) {
        console.error("Verify payment", error);
        return (0, responseFormat_1.errorResponse)(500, "Verify Payment", null, error);
    }
}
