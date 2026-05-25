import client from './client'

export const getDebts     = (params) => client.get('/debts', { params })
export const getDebt      = (id)     => client.get(`/debts/${id}`)
export const getDebtSummary = ()     => client.get('/debts/summary')
export const createDebt   = (data)   => client.post('/debts', data)
export const updateDebt   = (id, d)  => client.put(`/debts/${id}`, d)
export const deleteDebt   = (id)     => client.delete(`/debts/${id}`)
export const addPayment   = (id, d)  => client.post(`/debts/${id}/payment`, d)
