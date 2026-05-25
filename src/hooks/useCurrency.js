import { formatMoney } from '../utils/formatMoney'

/**
 * Returns a currency formatter. Currency defaults to 'BOB'.
 * @param {string} currency - 'BOB' or 'USD'
 */
export function useCurrency(currency = 'BOB') {
  const format = (value) => formatMoney(value, currency)
  return { format }
}
