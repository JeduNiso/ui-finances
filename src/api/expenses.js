import client from './client'

export const getExpenses   = (params) => client.get('/expenses', { params })
export const getExpense    = (id)     => client.get(`/expenses/${id}`)
export const getCalendar   = (params) => client.get('/expenses/calendar', { params })
export const createExpense = (data)   => client.post('/expenses', data)
export const updateExpense = (id, d)  => client.put(`/expenses/${id}`, d)
export const deleteExpense = (id)     => client.delete(`/expenses/${id}`)
export const payExpense    = (id, d)  => client.post(`/expenses/${id}/pay`, d)
