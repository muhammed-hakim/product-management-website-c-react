import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { customersApi } from '../../api/customers.api'
import { Customer } from '../../types'

const schema = z.object({
  firstName: z.string().min(1, 'مطلوب'),
  lastName: z.string().min(1, 'مطلوب'),
  email: z.string().email('صيغة غير صحيحة'),
  phone: z.string().min(1, 'مطلوب'),
})
type FormData = z.infer<typeof schema>

export default function CustomersPage() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)

  const { data: customers, isLoading } = useQuery({ queryKey: ['customers'], queryFn: customersApi.getAll })

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const createMutation = useMutation({
    mutationFn: customersApi.create,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['customers'] }); setShowForm(false); reset() },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) => customersApi.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['customers'] }); setShowForm(false); setEditId(null); reset() },
  })

  const deleteMutation = useMutation({
    mutationFn: customersApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customers'] }),
  })

  const onSubmit = (data: FormData) => {
    if (editId) updateMutation.mutate({ id: editId, data })
    else createMutation.mutate(data)
  }

  const handleEdit = (c: Customer) => {
    setEditId(c.id)
    setValue('firstName', c.firstName)
    setValue('lastName', c.lastName)
    setValue('email', c.email)
    setValue('phone', c.phone)
    setShowForm(true)
  }

  const handleCancel = () => { setShowForm(false); setEditId(null); reset() }

  return (
    <div dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-800">العملاء</h1>
        <button onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition">
          + إضافة عميل
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h2 className="font-medium text-gray-800 mb-4">{editId ? 'تعديل عميل' : 'إضافة عميل جديد'}</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
            {[
              { name: 'firstName' as const, label: 'الاسم الأول' },
              { name: 'lastName' as const, label: 'الاسم الأخير' },
              { name: 'email' as const, label: 'البريد الإلكتروني', type: 'email' },
              { name: 'phone' as const, label: 'رقم الهاتف' },
            ].map(({ name, label, type }) => (
              <div key={name}>
                <label className="block text-sm text-gray-600 mb-1">{label}</label>
                <input {...register(name)} type={type ?? 'text'}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]?.message}</p>}
              </div>
            ))}
            <div className="col-span-2 flex gap-3 justify-end">
              <button type="button" onClick={handleCancel}
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
                <th className="px-5 py-3 font-medium">الاسم</th>
                <th className="px-5 py-3 font-medium">البريد</th>
                <th className="px-5 py-3 font-medium">الهاتف</th>
                <th className="px-5 py-3 font-medium">تاريخ الإضافة</th>
                <th className="px-5 py-3 font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {customers?.map((c) => (
                <tr key={c.id} className="border-t border-gray-50 hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-800">{c.firstName} {c.lastName}</td>
                  <td className="px-5 py-3 text-gray-600">{c.email}</td>
                  <td className="px-5 py-3 text-gray-600">{c.phone}</td>
                  <td className="px-5 py-3 text-gray-500">{new Date(c.createdAt).toLocaleDateString('ar')}</td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(c)} className="text-blue-600 hover:underline text-xs">تعديل</button>
                      <button onClick={() => { if (confirm('هل أنت متأكد من الحذف؟')) deleteMutation.mutate(c.id) }}
                        className="text-red-500 hover:underline text-xs">حذف</button>
                    </div>
                  </td>
                </tr>
              ))}
              {!customers?.length && (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-400">لا يوجد عملاء بعد</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
