import Error from './Error';

export default interface JsonResponse {
  data?: any;
  error?: Error;
}
