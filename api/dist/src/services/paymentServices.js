"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPay = exports.createPayment = void 0;
const database_1 = __importDefault(require("../utils/config/database"));
const responseFormat_1 = require("../utils/config/responseFormat");
const client_1 = require("@prisma/client");
const paystack_1 = require("../utils/payment/paystack");
const createPayment = async (reservationId, amount, customerEmail) => {
    try {
        const reference = `TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const payment = await database_1.default.payment.create({
            data: {
                reservation_id: reservationId,
                amount,
                status: client_1.PaymentStatus.Pending,
                method: "paystack",
                transactionRef: reference,
            }
        });
        await database_1.default.reservation.update({
            where: { id: reservationId },
            data: { status: "Pending" }
        });
        const pay = await (0, paystack_1.initializePayment)(customerEmail, amount, reference);
        return (0, responseFormat_1.successResponse)(201, "Payment initiated", {
            paymentId: payment.id, reference, authorization_url: pay?.data?.authorization_url, access_code: pay?.data?.access_code
        });
    }
    catch (error) {
        console.error("Create payment error", error);
        return (0, responseFormat_1.errorResponse)(500, "Failed Payment", null, error);
    }
};
exports.createPayment = createPayment;
const verifyPay = async (reference) => {
    try {
        const response = await (0, paystack_1.verifyPayment)(reference);
        const status = response.data.status === client_1.PaymentStatus.Confirmed ? client_1.PaymentStatus.Confirmed : client_1.PaymentStatus.Cancelled;
        const payment = await database_1.default.payment.update({
            where: { transactionRef: reference },
            data: { status },
            include: { reservation: true }
        });
        await database_1.default.reservation.update({
            where: { id: payment.reservation_id },
            data: { status }
        });
        return (0, responseFormat_1.successResponse)(200, "Payment verified", { Payment: payment, Reservation: { id: payment.reservation_id, status }, });
    }
    catch (error) {
        console.error("Verify payment error", error);
        return (0, responseFormat_1.errorResponse)(500, "Failed Payment", null, error);
    }
};
exports.verifyPay = verifyPay;
