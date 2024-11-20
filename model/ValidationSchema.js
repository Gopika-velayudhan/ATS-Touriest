import Joi from "joi";

export const userValidationSchema = Joi.object({
  name: Joi.string().required(),

  email: Joi.string().email().required(),

  address: Joi.string().required(),

  password: Joi.string().min(6).required(),

  phoneNumber: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .required(),
});

export const packageValidationSchema = Joi.object({
  name: Joi.string().trim().required(),

  description: Joi.string().trim().required(),

  price: Joi.number().min(0).required(),

  destination: Joi.string().trim().required(),

  startDate: Joi.date().required(),

  endDate: Joi.date().greater(Joi.ref("startDate")).required(),

  images: Joi.array().items(Joi.string().uri()),
  includedActivities: Joi.array().items(Joi.string().hex()),

  availableSeats: Joi.number().min(0).required(),
});

export const activityValidationSchema = Joi.object({
  name: Joi.string().trim().required(),

  description: Joi.string().trim().required(),
  duration: Joi.string().trim().required(),
  price: Joi.number().min(0).required(),

  date: Joi.date().required(),
});
