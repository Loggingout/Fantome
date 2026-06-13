import Joi from "joi";

export const createEmployeeSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid("employee", "admin").default("employee"),
});
