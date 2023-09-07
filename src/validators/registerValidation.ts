import Joi from 'joi'

const registerValidation = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string()
    .regex(/^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{3,30}$/, 'password')
    .required()
    .messages({
      'string.pattern.base':
        'Password must be between 3 and 30 characters',
      'any.required': 'Password is required',
    }),
  username: Joi.string().alphanum().min(3).max(25).required().regex(/^\S+$/).messages({
    'string.alphanum': 'Username must contain only letters and numbers',
    'string.min': 'Username must be at least 3 characters long',
    'string.max': 'Username cannot be longer than 25 characters',
    'any.required': 'Username is required',
    'string.pattern.base': 'Username cannot contain spaces',
  }),
}).options({ abortEarly: false })

export default registerValidation
