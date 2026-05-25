import client from './client'

export const getIncomes    = (params) => client.get('/incomes', { params })
export const getIncome     = (id)     => client.get(`/incomes/${id}`)
export const createIncome  = (data)   => client.post('/incomes', data)
export const updateIncome  = (id, d)  => client.put(`/incomes/${id}`, d)
export const deleteIncome  = (id)     => client.delete(`/incomes/${id}`)
