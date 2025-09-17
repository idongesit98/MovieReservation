"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.createAuditoriumSchema = exports.updateTheatreSchema = exports.theatreSchema = exports.loginSchema = exports.signUpSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.signUpSchema = joi_1.default.object({
    firstname: joi_1.default.string().min(2).max(10).required().messages({
        "string.min": "Firstname must be more than 2 characters",
    }),
    lastname: joi_1.default.string().min(2).max(10).required().messages({
        "string.min": "Lastname must be more than 2 characters",
    }),
    email: joi_1.default.string().email().required().messages({
        "string.email": "Email must be valid",
        "any.required": "Email is required",
    }),
    password: joi_1.default.string().min(6).required().messages({
        "string.min": "Password must be at least 6 characters long",
        "any.required": "Password is required",
    }),
})
    .rename("firstName", "firstname", { ignoreUndefined: true, multiple: false })
    .rename("lastName", "lastname", { ignoreUndefined: true, multiple: false });
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
});
exports.theatreSchema = joi_1.default.object({
    theatre_name: joi_1.default.string().min(3).max(100).required(),
    location: joi_1.default.string().min(3).max(200).required(),
    contact_info: joi_1.default.string()
        .pattern(/^[0-9+\-() ]+$/)
        .required(),
});
exports.updateTheatreSchema = joi_1.default.object({
    theatre_name: joi_1.default.string().min(3).max(100),
    location: joi_1.default.string().min(3).max(200),
    contact_info: joi_1.default.string().pattern(/^[0-9+\-() ]+$/),
}).min(1);
exports.createAuditoriumSchema = joi_1.default.object({
    theatreId: joi_1.default.string().uuid().required(),
    name: joi_1.default.string().min(2).max(100).required(),
    capacity: joi_1.default.number().integer().min(1).required(),
    seatLayout: joi_1.default.object({
        rows: joi_1.default.number().integer().min(1).required(),
        columns: joi_1.default.number().integer().min(1).required(),
        seats: joi_1.default.array()
            .items(joi_1.default.object({
            row: joi_1.default.number().integer().min(1).required(),
            column: joi_1.default.number().integer().min(1).required(),
            status: joi_1.default.string().valid("available", "booked", "reserved").default("available")
        }))
            .required()
    }).required()
});
const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({
            status: "error",
            code: 400,
            message: "Validation error",
            details: error.details.map((err) => err.message),
        });
    }
    next();
};
exports.validate = validate;
