import axiosInstance from './axiosInstance'
import { Order, CreateOrderRequest } from '../types'

export const ordersApi = {
  getAll: async (): Promise<Order[]> => (await axiosInstance.get('/orders')).data,
  getById: async (id: number): Promise<Order> => (await axiosInstance.get(`/orders/${id}`)).data,
  create: async (data: CreateOrderRequest): Promise<number> => (await axiosInstance.post('/orders', data)).data.id,
  updateStatus: async (id: number, status: number): Promise<void> => {
    await axiosInstance.patch(`/orders/${id}/status`, status)
  },
}
