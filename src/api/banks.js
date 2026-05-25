import client from './client'

export const getBanks   = ()      => client.get('/banks')
export const createBank = (data)  => client.post('/banks', data)
export const updateBank = (id, d) => client.put(`/banks/${id}`, d)
export const deleteBank = (id)    => client.delete(`/banks/${id}`)
