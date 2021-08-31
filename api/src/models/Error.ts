type ErrorType =
  | 'DUPLICATE'
  | 'INTERNAL_SERVER_ERROR'
  | 'REQUIRED'
  | 'MIN_LENGTH'
  | 'MAX_LENGTH'
  | 'INVALID_FORMAT'
  | 'INVALID_EMAIL'
  | 'INVALID_PHONE'
  | 'FIELD_HAS_TO_BE_STRING'
  | 'INVALID_VALUE';

interface Error {
  type: ErrorType;
  path?: string | number;
  minlength?: number;
  maxlength?: number;
  validValues?: any[];
}

export default Error;
