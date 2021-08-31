import Joi from 'joi';
import { validCurrencyCodes } from '../models/CurrencyCode';

const userSchema = Joi.object({
  displayName: Joi.string()
    .pattern(new RegExp(/^[a-zA-Z0-9 ]+$/))
    .min(2)
    .max(100)
    .required(),
  password: Joi.string()
    .pattern(new RegExp(/^[a-zA-Z0-9!@#\$%&*\(\)\[\]\{\}\\\/\-_\+\=\'"\?<>\.,]+$/))
    .min(8)
    .max(72)
    .required(),
  email: Joi.string().email({ allowUnicode: true, minDomainSegments: 2 }).required(),
  phone: Joi.string().pattern(new RegExp(/^\+[0-9]+$/)),
  totalFundsCurrencyCode: Joi.string()
    .valid(...validCurrencyCodes)
    .required()
});

export default userSchema;
