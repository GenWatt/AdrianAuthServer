import Joi from 'joi'

const userSettingsValidation = Joi.object({
  _id: Joi.string(),
  theme: Joi.string().valid('light', 'dark').required(),
  language: Joi.string().valid('en', 'pl').required(),
  user: Joi.string(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
  __v: Joi.number(),
})

export default userSettingsValidation
