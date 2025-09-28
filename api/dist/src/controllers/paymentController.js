"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentWebook = exports.verify = exports.initiate = void 0;
const paymentServices_1 = require("../services/paymentServices");
const initiate = async (req, res) => {
    const { reservationId, amount, customerEmail } = req.body;
    const result = await (0, paymentServices_1.createPayment)(reservationId, amount, customerEmail);
    res.status(result.code).json(result);
};
exports.initiate = initiate;
const verify = async (req, res) => {
    const { reference } = req.body;
    const response = await (0, paymentServices_1.verifyPay)(reference);
    res.status(response.code).json(response);
};
exports.verify = verify;
const paymentWebook = async (req, res) => {
    try {
        const event = req.body;
        if (event.event === "charge.success") {
            await (0, paymentServices_1.verifyPay)(event.data.reference);
        }
        else if (event.event === "charge.failed") {
            await (0, paymentServices_1.verifyPay)(event.data.reference);
        }
        res.sendStatus(200);
    }
    catch (error) {
        console.error("Webhook error:", error);
        res.sendStatus(500);
    }
};
exports.paymentWebook = paymentWebook;
