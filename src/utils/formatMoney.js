const FORMATTERS = {}

/**
 * Formats a monetary value with the correct locale and symbol.
 * @param {number|string} value
 * @param {'BOB'|'USD'} currency - defaults to 'BOB'
 * @returns {string}
 */
export function formatMoney(value, currency = 'BOB') {
  const key = currency
  if (!FORMATTERS[key]) {
    FORMATTERS[key] = new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'es-BO', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }
  return FORMATTERS[key].format(Number(value ?? 0))
}

export const CURRENCIES = ['BOB', 'USD']
