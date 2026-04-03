import axiosInstance from './axiosInstance'
import { LoginRequest, RegisterRequest, AuthResponse, CurrentUser } from '../types'

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/auth/login', data)
    return response.data
  },
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/auth/register', data)
    return response.data
  },
  getCurrentUser: async (): Promise<CurrentUser> => {
    const response = await axiosInstance.get('/auth/me')
    return response.data
  },
}
