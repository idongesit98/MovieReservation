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
