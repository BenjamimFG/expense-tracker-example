import { CurrencyCode } from './CurrencyCode';

export default interface User {
  displayName: string;
  email: string;
  phone: string;
  password: string;
  totalFundsCurrencyCode: CurrencyCode;
}
