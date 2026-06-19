import Joi from "joi";

export const createEmployeeSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("employee", "admin").default("employee"),
  jobTitle: Joi.string().valid(
    "Software Developer/Engineer",
    "Marketing",
    "Systems Admin",
    "Sales",
    "HR",
    "Customer Service",
    "Information Technology",
    "Legal & Compliance",
    "Operations",
    "Finance & Accounting"
  ).optional().allow(null, ""),
});
