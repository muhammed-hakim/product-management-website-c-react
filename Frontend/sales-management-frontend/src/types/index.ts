export interface LoginRequest { email: string; password: string }
export interface RegisterRequest { firstName: string; lastName: string; email: string; password: string }
export interface AuthResponse { token: string; refreshToken: string }
export interface CurrentUser { firstName: string; lastName: string; email: string; roles: string[] }

export interface Customer {
  id: number; firstName: string; lastName: string
  email: string; phone: string; createdAt: string
}
export interface CreateCustomerRequest {
  firstName: string; lastName: string; email: string; phone: string
}

export interface Product {
  id: number; name: string; description: string
  price: number; stockQuantity: number; createdAt: string
}
export interface CreateProductRequest {
  name: string; description: string; price: number; stockQuantity: number
}

export interface OrderItem {
  productId: number; productName: string
  quantity: number; unitPrice: number; total: number
}
export interface Order {
  id: number; customerId: number; customerName: string
  orderDate: string; status: number; statusName: string
  totalAmount: number; orderItems: OrderItem[]
}
export interface CreateOrderRequest {
  customerId: number
  items: { productId: number; quantity: number }[]
}
