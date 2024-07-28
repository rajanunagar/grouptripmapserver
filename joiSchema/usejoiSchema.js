

const Joi = require('joi');

const userSchema = Joi.object({
      name: Joi.string()
            .min(3)
            .max(50)
            .required()
            .messages({
                  'string.base': 'Name should be a type of string',
                  'string.empty': 'Name cannot be an empty field',
                  'string.min': 'Name should have a minimum length of 3',
                  'string.max': 'Name should have a maximum length of 50',
                  'any.required': 'Name is a required field'
            }),

      email: Joi.string()
            .email()
            .max(100)
            .required()
            .messages({
                  'string.base': 'Email should be a type of string',
                  'string.empty': 'Email cannot be an empty field',
                  'string.email': 'Email must be a valid email address',
                  'string.max': 'Email should have a maximum length of 100',
                  'any.required': 'Email is a required field'
            }),
      username: Joi.string()
            .max(50)
            .required()
            .min(5)
            .messages({
                  'string.base': 'Username should be a type of string',
                  'string.empty': 'Username cannot be an empty field',
                  'string.email': 'Username must be a valid email address',
                  'string.max': 'Username should have a maximum length of 50',
                  'any.required': 'Username is a required field',
                  'string.min': 'Name should have a minimum length of 5',
            }),

      password: Joi.string()
            .required()
            .messages({
                  'string.base': 'Password should be a type of string',
                  'string.empty': 'Password cannot be an empty field',
                  'any.required': 'Password is a required field',
            }),

      groupIds: Joi.array()
            .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/).message('Each groupId must be a valid ObjectId'))
            .optional()
            .messages({
                  'array.base': 'groupIds should be an array',
                  'string.pattern.base': 'Each groupId must be a valid ObjectId'
            })
});

module.exports = userSchema;
