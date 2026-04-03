import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { authApi } from '../../api/auth.api'
import { useAuthStore } from '../../store/authStore'

const loginSchema = z.object({
  email: z.string().email('صيغة الايميل غير صحيحة'),
  password: z.string().min(8, 'كلمة المرور لا تقل عن 8 أحرف'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const navigate = useNavigate()
  const { setToken, setUser } = useAuthStore()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)
    setError('')
    try {
      const response = await authApi.login(data)
      setToken(response.token)
      const user = await authApi.getCurrentUser()
      setUser(user)
      navigate('/dashboard')
    } catch {
      setError('الايميل أو كلمة المرور غير صحيحة')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">نظام إدارة المبيعات</h1>
          <p className="text-gray-500 mt-1 text-sm">سجل دخولك للمتابعة</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" dir="rtl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
            <input {...register('email')} type="email" placeholder="admin@sales.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
            <input {...register('password')} type="password" placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>
          )}
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-50">
            {loading ? 'جاري الدخول...' : 'تسجيل الدخول'}
          </button>
        </form>
        <p className="text-center text-xs text-gray-400 mt-6">admin@sales.com / Admin@123456</p>
      </div>
    </div>
  )
}
