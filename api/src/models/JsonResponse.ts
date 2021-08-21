type ErrorCode = 'EMAIL_ALREADY_REGISTERED' | 'INTERNAL_SERVER_ERROR';

export default interface JsonResponse {
  success: boolean;
  data?: any;
  error?: ErrorCode;
}
