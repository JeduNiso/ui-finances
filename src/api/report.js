import client from './client'

export const getReport = (params) => client.get('/report', { params })
