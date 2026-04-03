import axiosInstance from './axiosInstance'
import { Product, CreateProductRequest } from '../types'

export const productsApi = {
  getAll: async (): Promise<Product[]> => (await axiosInstance.get('/products')).data,
  getById: async (id: number): Promise<Product> => (await axiosInstance.get(`/products/${id}`)).data,
  create: async (data: CreateProductRequest): Promise<number> => (await axiosInstance.post('/products', data)).data,
  update: async (id: number, data: CreateProductRequest): Promise<void> => {
    await axiosInstance.put(`/products/${id}`, { id, ...data })
  },
  delete: async (id: number): Promise<void> => { await axiosInstance.delete(`/products/${id}`) },
}
