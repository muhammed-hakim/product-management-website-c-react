import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

const navItems = [
  { path: '/dashboard', label: 'الرئيسية', icon: '◉' },
  { path: '/customers', label: 'العملاء', icon: '◈' },
  { path: '/products', label: 'المنتجات', icon: '◧' },
  { path: '/orders', label: 'الطلبات', icon: '◫' },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className="flex h-screen bg-gray-50" dir="rtl">
      <aside className="w-56 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800 text-sm">إدارة المبيعات</h2>
          <p className="text-xs text-gray-400 mt-0.5">لوحة التحكم</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                location.pathname === item.path
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}>
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-100">
          <div className="px-3 py-2 mb-1">
            <p className="text-xs font-medium text-gray-700">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-gray-400">{user?.roles?.[0]}</p>
          </div>
          <button onClick={handleLogout}
            className="w-full text-right px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition">
            تسجيل الخروج
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  )
}
