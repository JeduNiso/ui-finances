import { useState, useCallback } from 'react'

/**
 * Wraps an async API call exposing { data, isLoading, error, execute }.
 * @param {Function} apiFn - function that returns a Promise
 */
export function useApi(apiFn) {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const execute = useCallback(
    async (...args) => {
      setIsLoading(true)
      setError(null)
      try {
        const res = await apiFn(...args)
        setData(res.data)
        return res.data
      } catch (e) {
        setError(e.response?.data ?? e.message)
        throw e
      } finally {
        setIsLoading(false)
      }
    },
    [apiFn],
  )

  return { data, isLoading, error, execute }
}
