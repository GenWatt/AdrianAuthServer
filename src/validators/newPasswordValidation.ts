import Joi from 'joi'

const newPasswordValidation = Joi.object({
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .error(new Error('Passwords do not match')),
})

export default newPasswordValidation
