# Sales Management System — Full Stack
## ASP.NET Core 8 + React + TypeScript + Clean Architecture

---

## هيكل المشروع

```
FullProject/
├── Backend/    ← ASP.NET Core 8 API
└── Frontend/   ← React + TypeScript + Tailwind
    └── sales-management-frontend/
```

---

## المتطلبات

| الأداة | الإصدار |
|--------|---------|
| Visual Studio 2022 | آخر إصدار |
| .NET SDK | 8.0 |
| SQL Server | Developer Edition |
| Node.js | 18 أو أعلى |

---

## تشغيل الـ Backend

**1.** افتح `Backend/SalesManagement.sln` في Visual Studio 2022

**2.** تأكد من `Backend/API/appsettings.json`:
```json
"Server=.;Database=SalesManagementDb;Trusted_Connection=True;TrustServerCertificate=True"
```

**3.** افتح Package Manager Console وشغّل:
```
Add-Migration InitialCreate -Project SalesManagement.Infrastructure -StartupProject SalesManagement.API
Update-Database -Project SalesManagement.Infrastructure -StartupProject SalesManagement.API
```

**4.** اضغط F5 — سيعمل على `https://localhost:7001`

---

## تشغيل الـ Frontend

**1.** افتح Terminal وانتقل للمجلد:
```bash
cd Frontend/sales-management-frontend
```

**2.** ثبّت المكتبات:
```bash
npm install
```

**3.** شغّل المشروع:
```bash
npm run dev
```

**4.** افتح المتصفح على: `http://localhost:5173`

---

## بيانات الدخول

```
Email:    admin@sales.com
Password: Admin@123456
Role:     Admin
```

---

## الـ Roles والصلاحيات

| Role | القراءة | الإنشاء والتعديل | الحذف |
|------|---------|-----------------|-------|
| Admin | ✅ | ✅ | ✅ |
| Manager | ✅ | ✅ | ❌ |
| User | ✅ | ❌ | ❌ |

---

## التقنيات المستخدمة

### Backend
- ASP.NET Core 8
- Entity Framework Core 8
- SQL Server
- MediatR — نمط CQRS
- FluentValidation
- AutoMapper
- JWT Authentication
- ASP.NET Identity
- Clean Architecture

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Query — إدارة طلبات API
- Zustand — إدارة الحالة
- React Hook Form + Zod — النماذج والتحقق
- Axios — HTTP Client
- React Router — التنقل بين الصفحات
