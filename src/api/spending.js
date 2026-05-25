import client from './client'

export const getSpendings    = (params) => client.get('/spending', { params })
export const getSpending     = (id)     => client.get(`/spending/${id}`)
export const getSpendingSummary = ()    => client.get('/spending/summary')
export const createSpending  = (data)   => client.post('/spending', data)
export const updateSpending  = (id, d)  => client.put(`/spending/${id}`, d)
export const deleteSpending  = (id)     => client.delete(`/spending/${id}`)
