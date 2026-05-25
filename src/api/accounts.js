import client from './client'

export const getAccounts   = ()       => client.get('/accounts')
export const getAccount    = (id)     => client.get(`/accounts/${id}`)
export const getSummary    = (id)     => client.get(`/accounts/${id}/summary`)
export const createAccount = (data)   => client.post('/accounts', data)
export const updateAccount = (id, d)  => client.put(`/accounts/${id}`, d)
export const deleteAccount = (id)     => client.delete(`/accounts/${id}`)
