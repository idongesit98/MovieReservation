import Joi from "joi";
import { Request, Response, NextFunction } from "express";

export const signUpSchema = Joi.object({
    firstname: Joi.string().min(2).max(10).required().messages({
    "string.min": "Firstname must be more than 2 characters",
  }),
   lastname: Joi.string().min(2).max(10).required().messages({
    "string.min": "Lastname must be more than 2 characters",
  }),
   email: Joi.string().email().required().messages({
    "string.email": "Email must be valid",
    "any.required": "Email is required",
  }),
    password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "any.required": "Password is required",
  }),
})

  .rename("firstName", "firstname", { ignoreUndefined: true, multiple: false })
  .rename("lastName", "lastname", { ignoreUndefined: true, multiple: false });

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const theatreSchema = Joi.object({
  theatre_name: Joi.string().min(3).max(100).required(),
  location: Joi.string().min(3).max(200).required(),
  contact_info: Joi.string()
    .pattern(/^[0-9+\-() ]+$/) 
    .required(),
});

export const updateTheatreSchema = Joi.object({
  theatre_name: Joi.string().min(3).max(100),
  location: Joi.string().min(3).max(200),
  contact_info: Joi.string().pattern(/^[0-9+\-() ]+$/),
}).min(1);

export const createAuditoriumSchema = Joi.object({
  theatreId: Joi.string().uuid().required(),
  name: Joi.string().min(2).max(100).required(),
  capacity: Joi.number().integer().min(1).required(),
  seatLayout: Joi.object({
    rows: Joi.number().integer().min(1).required(),
    columns: Joi.number().integer().min(1).required(),
    seats: Joi.array()
      .items(
        Joi.object({
          row: Joi.number().integer().min(1).required(),
          column: Joi.number().integer().min(1).required(),
          status: Joi.string().valid("available", "booked", "reserved").default("available")
        })
      )
      .required()
  }).required()
});

export const validate = (schema: Joi.ObjectSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
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
