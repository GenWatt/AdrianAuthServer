import Joi from 'joi'

const registerValidation = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string()
    .regex(/[a-zA-Z0-9]{3,30}/, 'password')
    .required()
    .messages({
      'string.pattern.base':
        'Password must be between 3 and 30 characters and contain only letters and numbers',
      'any.required': 'Password is required',
    }),
  username: Joi.string().alphanum().min(3).max(25).required().messages({
    'string.alphanum': 'Username must contain only letters and numbers',
    'string.min': 'Username must be at least 3 characters long',
    'string.max': 'Username cannot be longer than 25 characters',
    'any.required': 'Username is required',
  }),
}).options({ abortEarly: false })

export default registerValidation
