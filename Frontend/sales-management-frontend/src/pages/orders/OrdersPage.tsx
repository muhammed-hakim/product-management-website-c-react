import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ordersApi } from '../../api/orders.api'
import { customersApi } from '../../api/customers.api'
import { productsApi } from '../../api/products.api'

const statusLabels: Record<number, { label: string; color: string }> = {
  1: { label: 'قيد الانتظار', color: 'bg-yellow-100 text-yellow-700' },
  2: { label: 'قيد التجهيز', color: 'bg-blue-100 text-blue-700' },
  3: { label: 'تم الشحن', color: 'bg-purple-100 text-purple-700' },
  4: { label: 'تم التسليم', color: 'bg-green-100 text-green-700' },
  5: { label: 'ملغي', color: 'bg-red-100 text-red-700' },
}

export default function OrdersPage() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [customerId, setCustomerId] = useState('')
  const [items, setItems] = useState([{ productId: '', quantity: 1 }])

  const { data: orders, isLoading } = useQuery({ queryKey: ['orders'], queryFn: ordersApi.getAll })
  const { data: customers } = useQuery({ queryKey: ['customers'], queryFn: customersApi.getAll })
  const { data: products } = useQuery({ queryKey: ['products'], queryFn: productsApi.getAll })

  const createMutation = useMutation({
    mutationFn: ordersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      setShowForm(false)
      setCustomerId('')
      setItems([{ productId: '', quantity: 1 }])
    },
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: number }) => ordersApi.updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
  })

  const handleAddItem = () => setItems([...items, { productId: '', quantity: 1 }])
  const handleRemoveItem = (i: number) => setItems(items.filter((_, idx) => idx !== i))
  const handleItemChange = (i: number, field: string, value: string | number) => {
    const updated = [...items]
    updated[i] = { ...updated[i], [field]: value }
    setItems(updated)
  }

  const handleSubmit = () => {
    if (!customerId || items.some(i => !i.productId)) return
    createMutation.mutate({
      customerId: Number(customerId),
      items: items.map(i => ({ productId: Number(i.productId), quantity: Number(i.quantity) })),
    })
  }

  return (
    <div dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-800">الطلبات</h1>
        <button onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition">
          + إنشاء طلب
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h2 className="font-medium text-gray-800 mb-4">إنشاء طلب جديد</h2>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">العميل</label>
            <select value={customerId} onChange={e => setCustomerId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">اختر عميلاً</option>
              {customers?.map(c => (
                <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
              ))}
            </select>
          </div>
          <div className="mb-4 space-y-3">
            <label className="block text-sm text-gray-600">المنتجات</label>
            {items.map((item, i) => (
              <div key={i} className="flex gap-3 items-center">
                <select value={item.productId} onChange={e => handleItemChange(i, 'productId', e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">اختر منتجاً</option>
                  {products?.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {p.price.toLocaleString()} ر.س (متاح: {p.stockQuantity})
                    </option>
                  ))}
                </select>
                <input type="number" min="1" value={item.quantity}
                  onChange={e => handleItemChange(i, 'quantity', e.target.value)}
                  className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                {items.length > 1 && (
                  <button onClick={() => handleRemoveItem(i)} className="text-red-500 hover:text-red-700 text-sm">✕</button>
                )}
              </div>
            ))}
            <button onClick={handleAddItem} className="text-blue-600 hover:underline text-sm">+ إضافة منتج آخر</button>
          </div>
          <div className="flex gap-3 justify-end">
            <button onClick={() => { setShowForm(false); setCustomerId(''); setItems([{ productId: '', quantity: 1 }]) }}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">إلغاء</button>
            <button onClick={handleSubmit} disabled={createMutation.isPending}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {createMutation.isPending ? 'جاري الإنشاء...' : 'إنشاء الطلب'}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200">
        {isLoading ? (
          <div className="p-8 text-center text-gray-400">جاري التحميل...</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 text-right border-b border-gray-100">
                <th className="px-5 py-3 font-medium">رقم الطلب</th>
                <th className="px-5 py-3 font-medium">العميل</th>
                <th className="px-5 py-3 font-medium">التاريخ</th>
                <th className="px-5 py-3 font-medium">المبلغ</th>
                <th className="px-5 py-3 font-medium">الحالة</th>
                <th className="px-5 py-3 font-medium">تغيير الحالة</th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order) => (
                <tr key={order.id} className="border-t border-gray-50 hover:bg-gray-50">
                  <td className="px-5 py-3 text-gray-600">#{order.id}</td>
                  <td className="px-5 py-3 text-gray-800">{order.customerName}</td>
                  <td className="px-5 py-3 text-gray-500">{new Date(order.orderDate).toLocaleDateString('ar')}</td>
                  <td className="px-5 py-3 font-medium text-gray-800">{order.totalAmount.toLocaleString()} ر.س</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusLabels[order.status]?.color}`}>
                      {statusLabels[order.status]?.label}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <select value={order.status}
                      onChange={e => statusMutation.mutate({ id: order.id, status: Number(e.target.value) })}
                      className="border border-gray-300 rounded-lg px-2 py-1 text-xs focus:outline-none">
                      {Object.entries(statusLabels).map(([val, { label }]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {!orders?.length && (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-gray-400">لا يوجد طلبات بعد</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
