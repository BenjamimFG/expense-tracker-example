import Joi from 'joi';

import Error from '../models/Error';

class ErrorParser {
  static parse(error: Joi.ValidationError | undefined): Error | any {
    if (error && error.details) {
      const errorType = error.details[0].type;
      const errorPath = error.details[0].path[0];

      if (errorType === 'any.required') {
        return { type: 'REQUIRED', path: errorPath };
      } else if (errorType === 'string.min') {
        return { type: 'MIN_LENGTH', path: errorPath, minlength: error.details[0].context?.limit };
      } else if (errorType === 'string.max') {
        return { type: 'MAX_LENGTH', path: errorPath, maxlength: error.details[0].context?.limit };
      } else if (errorType === 'string.pattern.base') {
        return { type: 'INVALID_FORMAT', path: errorPath };
      } else if (errorType === 'string.email') {
        return { type: 'INVALID_EMAIL', path: errorPath };
      } else if (errorType === 'string.base') {
        return { type: 'FIELD_HAS_TO_BE_STRING', path: errorPath };
      } else if (errorType === 'any.only') {
        return {
          type: 'INVALID_VALUE',
          path: errorPath,
          validValues: error.details[0].context?.valids
        };
      } else if (errorType === 'phoneNumber.invalid') {
        return { type: 'INVALID_PHONE_NUMBER', path: errorPath };
      }
    }
    return error;
  }
}

export default ErrorParser;
