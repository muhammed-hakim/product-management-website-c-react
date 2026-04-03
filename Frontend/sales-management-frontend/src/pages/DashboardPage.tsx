import { useQuery } from '@tanstack/react-query'
import { customersApi } from '../api/customers.api'
import { productsApi } from '../api/products.api'
import { ordersApi } from '../api/orders.api'
import { useAuthStore } from '../store/authStore'

export default function DashboardPage() {
  const { user } = useAuthStore()

  const { data: customers } = useQuery({ queryKey: ['customers'], queryFn: customersApi.getAll })
  const { data: products } = useQuery({ queryKey: ['products'], queryFn: productsApi.getAll })
  const { data: orders } = useQuery({ queryKey: ['orders'], queryFn: ordersApi.getAll })

  const totalRevenue = orders?.reduce((sum, o) => sum + o.totalAmount, 0) ?? 0

  const stats = [
    { label: 'العملاء', value: customers?.length ?? 0, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'المنتجات', value: products?.length ?? 0, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'الطلبات', value: orders?.length ?? 0, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'إجمالي الإيرادات', value: `${totalRevenue.toLocaleString()} ر.س`, color: 'text-purple-600', bg: 'bg-purple-50' },
  ]

  const statusColors: Record<string, string> = {
    Delivered: 'bg-green-100 text-green-700',
    Pending: 'bg-yellow-100 text-yellow-700',
    Cancelled: 'bg-red-100 text-red-700',
    Processing: 'bg-blue-100 text-blue-700',
    Shipped: 'bg-purple-100 text-purple-700',
  }

  return (
    <div dir="rtl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-800">مرحباً، {user?.firstName} 👋</h1>
        <p className="text-gray-500 text-sm mt-1">هذا ملخص النظام</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
            <p className={`text-2xl font-semibold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-medium text-gray-800">آخر الطلبات</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 text-right">
              <th className="px-5 py-3 font-medium">رقم الطلب</th>
              <th className="px-5 py-3 font-medium">العميل</th>
              <th className="px-5 py-3 font-medium">الحالة</th>
              <th className="px-5 py-3 font-medium">المبلغ</th>
            </tr>
          </thead>
          <tbody>
            {orders?.slice(0, 5).map((order) => (
              <tr key={order.id} className="border-t border-gray-50 hover:bg-gray-50">
                <td className="px-5 py-3 text-gray-600">#{order.id}</td>
                <td className="px-5 py-3 text-gray-800">{order.customerName}</td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.statusName] ?? 'bg-gray-100 text-gray-700'}`}>
                    {order.statusName}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-800">{order.totalAmount.toLocaleString()} ر.س</td>
              </tr>
            ))}
            {!orders?.length && (
              <tr><td colSpan={4} className="px-5 py-8 text-center text-gray-400">لا يوجد طلبات بعد</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
