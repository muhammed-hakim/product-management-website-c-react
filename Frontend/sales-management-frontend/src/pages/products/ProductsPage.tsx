import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { productsApi } from '../../api/products.api'
import { Product } from '../../types'

const schema = z.object({
  name: z.string().min(1, 'مطلوب'),
  description: z.string().optional().default(''),
  price: z.coerce.number().min(0.01, 'السعر يجب أن يكون أكبر من صفر'),
  stockQuantity: z.coerce.number().min(0, 'الكمية لا تكون سالبة'),
})
type FormData = z.infer<typeof schema>

export default function ProductsPage() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)

  const { data: products, isLoading } = useQuery({ queryKey: ['products'], queryFn: productsApi.getAll })

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const createMutation = useMutation({
    mutationFn: productsApi.create,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['products'] }); setShowForm(false); reset() },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) => productsApi.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['products'] }); setShowForm(false); setEditId(null); reset() },
  })

  const deleteMutation = useMutation({
    mutationFn: productsApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  })

  const onSubmit = (data: FormData) => {
    if (editId) updateMutation.mutate({ id: editId, data })
    else createMutation.mutate(data)
  }

  const handleEdit = (p: Product) => {
    setEditId(p.id)
    setValue('name', p.name)
    setValue('description', p.description)
    setValue('price', p.price)
    setValue('stockQuantity', p.stockQuantity)
    setShowForm(true)
  }

  return (
    <div dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-800">المنتجات</h1>
        <button onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition">
          + إضافة منتج
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h2 className="font-medium text-gray-800 mb-4">{editId ? 'تعديل منتج' : 'إضافة منتج جديد'}</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">اسم المنتج</label>
              <input {...register('name')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">الوصف</label>
              <input {...register('description')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">السعر</label>
              <input {...register('price')} type="number" step="0.01"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">الكمية في المخزون</label>
              <input {...register('stockQuantity')} type="number"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {errors.stockQuantity && <p className="text-red-500 text-xs mt-1">{errors.stockQuantity.message}</p>}
            </div>
            <div className="col-span-2 flex gap-3 justify-end">
              <button type="button" onClick={() => { setShowForm(false); setEditId(null); reset() }}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">إلغاء</button>
              <button type="submit" disabled={createMutation.isPending || updateMutation.isPending}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                {editId ? 'حفظ التعديلات' : 'إضافة'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200">
        {isLoading ? (
          <div className="p-8 text-center text-gray-400">جاري التحميل...</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 text-right border-b border-gray-100">
                <th className="px-5 py-3 font-medium">المنتج</th>
                <th className="px-5 py-3 font-medium">السعر</th>
                <th className="px-5 py-3 font-medium">المخزون</th>
                <th className="px-5 py-3 font-medium">الحالة</th>
                <th className="px-5 py-3 font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {products?.map((p) => (
                <tr key={p.id} className="border-t border-gray-50 hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-800">{p.name}</p>
                    <p className="text-gray-400 text-xs">{p.description}</p>
                  </td>
                  <td className="px-5 py-3 text-gray-800">{p.price.toLocaleString()} ر.س</td>
                  <td className="px-5 py-3 text-gray-600">{p.stockQuantity}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      p.stockQuantity > 10 ? 'bg-green-100 text-green-700' :
                      p.stockQuantity > 0 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {p.stockQuantity > 10 ? 'متوفر' : p.stockQuantity > 0 ? 'كمية محدودة' : 'نفذ'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(p)} className="text-blue-600 hover:underline text-xs">تعديل</button>
                      <button onClick={() => { if (confirm('هل أنت متأكد؟')) deleteMutation.mutate(p.id) }}
                        className="text-red-500 hover:underline text-xs">حذف</button>
                    </div>
                  </td>
                </tr>
              ))}
              {!products?.length && (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-400">لا يوجد منتجات بعد</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
