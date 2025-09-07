"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = exports.successResponse = void 0;
const successResponse = (code, message, data) => {
    return {
        code,
        status: "success",
        message,
        data,
        error: null
    };
};
exports.successResponse = successResponse;
const errorResponse = (code, message, data, error) => {
    let serializedError = null;
    if (error instanceof Error) {
        serializedError = {
            name: error.name,
            message: error.message,
            stack: error.stack
        };
    }
    else if (typeof error === "string") {
        serializedError = {
            name: "Error",
            message: error
        };
    }
    else if (error && typeof error === "object") {
        serializedError = {
            name: "Error",
            message: JSON.stringify(error)
        };
    }
    return {
        code,
        status: 'error',
        message,
        data,
        error: serializedError
    };
};
exports.errorResponse = errorResponse;
