import { useMemo } from 'react'

/**
 * Returns a currency formatter using the browser locale.
 * @param {string} currency - ISO 4217 code, defaults to 'USD'
 */
export function useCurrency(currency = 'USD') {
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    [currency],
  )

  const format = (value) => formatter.format(Number(value))

  return { format }
}
