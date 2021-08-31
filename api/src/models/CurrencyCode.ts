const validCurrencyCodes = [
  'ARS',
  'AUD',
  'BOB',
  'BRL',
  'CAD',
  'CLP',
  'CNY',
  'COP',
  'EUR',
  'GBP',
  'INR',
  'JPY',
  'KRW',
  'MXN',
  'NZD',
  'PEN',
  'PYG',
  'RUB',
  'THB',
  'TWD',
  'USD',
  'UYU'
] as const;

type CurrencyCode = typeof validCurrencyCodes[number];

export { CurrencyCode, validCurrencyCodes };
