import client from './client'

export const getCategories   = ()      => client.get('/categories')
export const getCategory     = (id)    => client.get(`/categories/${id}`)
export const createCategory  = (data)  => client.post('/categories', data)
export const updateCategory  = (id, d) => client.put(`/categories/${id}`, d)
export const deleteCategory  = (id)    => client.delete(`/categories/${id}`)
