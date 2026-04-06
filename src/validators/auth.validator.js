const Joi = require('joi');

const registerSchema = Joi.object({
  firstName: Joi.string().required().min(2).max(50),
  lastName: Joi.string().required().min(2).max(50),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('STUDENT', 'TEAM', 'ADMIN').optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Middleware to validate requests against a schema
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessage = error.details.map((details) => details.message).join(', ');
      res.status(400);
      throw new Error(`Validation Error: ${errorMessage}`);
    }
    next();
  };
};

module.exports = {
  registerSchema,
  loginSchema,
  validate
};
