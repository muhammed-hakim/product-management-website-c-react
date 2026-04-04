# Sales Management System — ASP.NET Core 8 + Clean Architecture

## المتطلبات قبل التشغيل
- Visual Studio 2022
- .NET 8 SDK
- SQL Server (Developer Edition أو أعلى)
- SQL Server Management Studio (اختياري)

---

## خطوات التشغيل

### 1. افتح المشروع
افتح ملف `SalesManagement.sln` في Visual Studio 2022

### 2. تأكد من Connection String
افتح `API/appsettings.json` وتأكد أن السيرفر صحيح:
```json
"DefaultConnection": "Server=.;Database=SalesManagementDb;Trusted_Connection=True;TrustServerCertificate=True"
```
- `Server=.` تعني SQL Server على نفس الجهاز
- إذا كان اسم السيرفر مختلفاً، عدّله هنا

### 3. أنشئ قاعدة البيانات
افتح Package Manager Console من:
```
Tools → NuGet Package Manager → Package Manager Console
```
ثم شغّل:
```
Add-Migration InitialCreate -Project SalesManagement.Infrastructure -StartupProject SalesManagement.API
Update-Database -Project SalesManagement.Infrastructure -StartupProject SalesManagement.API
```

### 4. شغّل المشروع
اضغط F5 أو زر Run في Visual Studio

### 5. افتح Swagger
سيفتح المتصفح تلقائياً على:
```
https://localhost:{port}/swagger
```

---

## بيانات الدخول الافتراضية

| الحقل | القيمة |
|-------|--------|
| Email | admin@sales.com |
| Password | Admin@123456 |
| Role | Admin |

---

## هيكل المشروع

```
SalesManagement/
├── Domain/                    ← الكيانات الأساسية (لا تعتمد على أحد)
│   ├── Common/BaseEntity.cs
│   ├── Enums/OrderStatus.cs
│   ├── Identity/ApplicationUser.cs
│   └── Entities/
│       ├── Customer.cs
│       ├── Product.cs
│       ├── Order.cs
│       └── OrderItem.cs
│
├── Application/               ← منطق العمل (تعتمد على Domain فقط)
│   ├── Common/
│   │   ├── Interfaces/
│   │   └── Mappings/
│   ├── Customers/
│   ├── Products/
│   ├── Orders/
│   └── DependencyInjection.cs
│
├── Infrastructure/            ← قاعدة البيانات والخدمات الخارجية
│   ├── Persistence/
│   │   ├── Configurations/
│   │   ├── AppDbContext.cs
│   │   └── AppDbContextSeed.cs
│   ├── Services/AuthService.cs
│   ├── Settings/JwtSettings.cs
│   └── DependencyInjection.cs
│
└── API/                       ← الواجهة الخارجية فقط
    ├── Controllers/
    ├── Middleware/
    ├── Program.cs
    └── appsettings.json
```

---

## الـ Endpoints المتاحة

### Auth
| Method | Endpoint | الوصف |
|--------|----------|-------|
| POST | /api/auth/register | تسجيل مستخدم جديد |
| POST | /api/auth/login | تسجيل الدخول |
| POST | /api/auth/assign-role | تعيين Role (Admin فقط) |
| GET | /api/auth/me | بيانات المستخدم الحالي |

### Customers
| Method | Endpoint | الوصف | الصلاحية |
|--------|----------|-------|---------|
| GET | /api/customers | جلب كل العملاء | الجميع |
| GET | /api/customers/{id} | جلب عميل | الجميع |
| POST | /api/customers | إنشاء عميل | Admin, Manager |
| PUT | /api/customers/{id} | تعديل عميل | Admin, Manager |
| DELETE | /api/customers/{id} | حذف عميل | Admin فقط |

### Products
| Method | Endpoint | الوصف | الصلاحية |
|--------|----------|-------|---------|
| GET | /api/products | جلب كل المنتجات | الجميع |
| GET | /api/products/{id} | جلب منتج | الجميع |
| POST | /api/products | إنشاء منتج | Admin, Manager |
| PUT | /api/products/{id} | تعديل منتج | Admin, Manager |
| DELETE | /api/products/{id} | حذف منتج | Admin فقط |

### Orders
| Method | Endpoint | الوصف | الصلاحية |
|--------|----------|-------|---------|
| GET | /api/orders | جلب كل الطلبات | الجميع |
| GET | /api/orders/{id} | جلب طلب | الجميع |
| POST | /api/orders | إنشاء طلب | الجميع |
| PATCH | /api/orders/{id}/status | تحديث حالة الطلب | Admin, Manager |

---

## الـ Roles

| Role | الصلاحيات |
|------|----------|
| Admin | كل العمليات بما فيها الحذف |
| Manager | القراءة والإنشاء والتعديل |
| User | القراءة فقط |

---

## التقنيات المستخدمة

- **ASP.NET Core 8** — Backend Framework
- **Entity Framework Core 8** — ORM
- **SQL Server** — قاعدة البيانات
- **MediatR** — نمط CQRS
- **FluentValidation** — التحقق من البيانات
- **AutoMapper** — تحويل الكيانات
- **JWT Bearer** — المصادقة
- **ASP.NET Identity** — إدارة المستخدمين
- **Swagger** — توثيق الـ API
- **Clean Architecture** — هيكل المشروع
