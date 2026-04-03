import axiosInstance from './axiosInstance'
import { Customer, CreateCustomerRequest } from '../types'

export const customersApi = {
  getAll: async (): Promise<Customer[]> => (await axiosInstance.get('/customers')).data,
  getById: async (id: number): Promise<Customer> => (await axiosInstance.get(`/customers/${id}`)).data,
  create: async (data: CreateCustomerRequest): Promise<number> => (await axiosInstance.post('/customers', data)).data,
  update: async (id: number, data: CreateCustomerRequest): Promise<void> => {
    await axiosInstance.put(`/customers/${id}`, { id, ...data })
  },
  delete: async (id: number): Promise<void> => { await axiosInstance.delete(`/customers/${id}`) },
}
