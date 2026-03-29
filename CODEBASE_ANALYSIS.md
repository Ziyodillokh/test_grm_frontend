# New-GRM Frontend — To'liq Kodebase Tahlili

> **Loyiha:** new_grm_admin | **Versiya:** 0.1.0 | **Tahlil sanasi:** 2026-03-12

---

## 1. LOYIHA HAQIDA UMUMIY MA'LUMOT

**Tur:** React 19 TypeScript Admin Dashboard (PWA)
**Build Tool:** Vite 6.3.3
**API Base URL:** `https://test.ziyodulloh.uz/api`
**Maqsad:** Gilam Market uchun rol asosida boshqariladigan admin panel

---

## 2. TEXNOLOGIYA STEKI

### Asosiy (Core)
| Texnologiya | Versiya | Maqsad |
|---|---|---|
| React | 19.0.0 | UI framework |
| TypeScript | 5.7.3 | Type xavfsizligi |
| Vite | 6.3.3 | Build tool + dev server |
| React Router DOM | 7.1.5 | Client-side routing |

### State Management
| Kutubxona | Versiya | Maqsad |
|---|---|---|
| Zustand | 5.0.3 | Global state (localStorage persistence) |
| TanStack React Query | 5.74.4 | Server state + data fetching |
| TanStack React Table | 8.21.2 | Jadval boshqaruvi |

### UI / Stil
| Kutubxona | Versiya | Maqsad |
|---|---|---|
| Tailwind CSS | 4.0.6 | Utility-first styling |
| Radix UI | Various | Accessible UI primitives |
| tailwindcss-animate | 1.0.7 | Animatsiyalar |
| class-variance-authority | 0.7.1 | Component variantlari |
| clsx + tailwind-merge | — | Xavfsiz class birlashtirish |
| lucide-react | 0.475.0 | Ikonalar |

### Forma va Validatsiya
| Kutubxona | Versiya | Maqsad |
|---|---|---|
| React Hook Form | 7.54.2 | Forma state boshqaruvi |
| @hookform/resolvers | 4.0.0 | Forma validatsiya adapterlari |
| Zod | 3.24.2 | Schema validatsiya |

### Ma'lumotlar va API
| Kutubxona | Versiya | Maqsad |
|---|---|---|
| Axios | 1.8.1 | HTTP client + interceptorlar |
| qs | 6.14.0 | Query string parsing |

### Maxsus Funksionallik
| Kutubxona | Maqsad |
|---|---|
| i18next + react-i18next | Internatsionalizatsiya (RU, EN, UZ) |
| react-phone-number-input | Telefon raqam formatlash |
| date-fns | Sana yordamchilari |
| qrcode.react + qrcode | QR kod generatsiya |
| react-barcode | Barcode ko'rsatish |
| jspdf | PDF generatsiya |
| react-to-print | Chop etish |
| sonner | Toast xabarnomalar |
| nuqs | URL search params |
| embla-carousel | Carousel |
| vaul | Drawer komponent |

### Dev Tools
| Kutubxona | Maqsad |
|---|---|
| ESLint 9 | Kod linting |
| Prettier 3.5 | Kod formatlash |
| Husky | Git hooks |
| lint-staged | Pre-commit linting |
| vite-plugin-pwa | PWA qo'llab-quvvatlash |

---

## 3. PAPKA TUZILMASI

```
New-Grm_front/
├── src/
│   ├── components/          # Qayta ishlatiladigan UI komponentlar
│   ├── hooks/               # Custom React hooklar
│   ├── layouts/             # Layout komponentlar
│   │   ├── main-layout/     # Asosiy authenticated layout
│   │   └── public-layout/   # Login layout
│   ├── lib/                 # Yordamchi kutubxonalar
│   ├── pages/               # Sahifa komponentlar (27+ sahifa)
│   ├── providers/           # Context/Provider sozlamalari
│   ├── router/              # Route konfiguratsiyasi
│   ├── service/             # API servislar
│   ├── store/               # Zustand state storlari
│   ├── types/               # TypeScript type ta'riflari
│   ├── utils/               # Yordamchi funksiyalar
│   ├── constants/           # Global konstantalar
│   ├── globals.css          # Tailwind + CSS o'zgaruvchilar
│   ├── App.tsx              # Root komponent
│   └── main.tsx             # Kirish nuqtasi
├── public/                  # Statik assetlar
├── conf/                    # Konfiguratsiya fayllari
├── .github/workflows/       # CI/CD
├── index.html               # HTML shablon
├── package.json             # Dependencylar
├── tsconfig.json            # TypeScript konfiguratsiya
└── vite.config.ts           # Vite konfiguratsiya
```

---

## 4. SAHIFALAR VA ROUTLAR

**Jami:** 27+ sahifa

| Sahifa | URL | Maqsad | Rol Talabi |
|---|---|---|---|
| Dashboard | `/dashboard` | Tahlil va hisobot markazi | Admin |
| Products | `/products` | Mahsulot inventarizatsiyasi | Admin |
| Filial | `/filial` | Filial/lokatsiya boshqaruvi | Admin |
| Cashier Home | `/cashier/home` | Kassa operatsiyalari | Kassir (Rol 3) |
| Cashier Report | `/cashier/report` | Kassa hisoboti | Kassir (Rol 3) |
| Clients | `/clients` | Mijozlar boshqaruvi | Admin |
| Crops | `/crops` | Qishloq xo'jaligi ma'lumotlari | Admin |
| Employees | `/employees` | Xodimlar boshqaruvi | HR/Admin |
| Orders | `/order` | Buyurtmalar boshqaruvi | Admin |
| Transfer | `/transfer` | Inventar transferlari | Admin |
| Warehouse | `/warehouse` | Ombor boshqaruvi | Ombor Menejeri |
| Reports | `/reports` | Ko'p modulli hisobotlar | Turli rollar |
| Debt | `/debt` | Qarz kuzatuvi | Moliya Menejeri |
| Bonus | `/bonus` | Bonus hisoblash tizimi | Admin |
| Awards | `/awards` | Mukofot boshqaruvi | Admin |
| Price | `/price` | Narxlar boshqaruvi + chegirmalar | Admin |
| Statement | `/statement` | Moliyaviy bayonotlar | Buxgalter |
| QR Code | `/qr-code` | QR kod generatsiya | Admin |
| Products Check | `/products-check` | Mahsulot tekshiruvi | Admin |
| Product Characteristics | `/product-characteristics` | Mahsulot atributlari | Admin |
| Broned | `/broned` | Bronlar/rezervatsiyalar | Admin |
| Not Published Products | `/not-published-products` | Nashr etilmagan inventar | Admin |
| Published Products | `/puplished-products` | Nashr etilgan mahsulotlar | Admin |
| Re-register | `/re-register` | Qayta ro'yxatdan o'tish | Admin |
| Bugalteriya | `/bugalteriya` | Buxgalteriya operatsiyalari | Buxgalter |
| Deller | `/deller` | Diler boshqaruvi | Admin |
| HIK Vision | `/hik-vision` | Video monitoring | Admin |
| HR Monitoring | `/hr-monitoring` | HR tahlili | HR |
| Monitoring | `/monitoring` | Umumiy monitoring | Admin |
| Login | `/login` | Autentifikatsiya | Ommaviy |
| Report | `/report` | Umumiy hisobotlar | Admin |

### Sahifa Tuzilmasi Namunasi

Har bir sahifa quyidagi standart tuzilmaga ega:

```
pages/[page-name]/
├── route.ts           # Route ta'rifi + metadata
├── type.ts            # TypeScript typelar
├── form/              # Forma komponentlar
│   ├── index.tsx      # Forma wrapper
│   ├── content.tsx    # Forma JSX
│   ├── schema.ts      # Zod validatsiya sxemasi
│   └── actions.ts     # API mutatsiyalari
├── table/             # Jadval komponentlar
│   ├── index.tsx      # Jadval wrapper
│   ├── columns.tsx    # TanStack ustun ta'riflari
│   ├── filters.tsx    # Filter UI
│   └── queries.ts     # React Query hooklar
└── info/ yoki single/ # Batafsil/preview sahifalar
```

---

## 5. KOMPONENTLAR

**Joylashuv:** `/src/components/`

### UI Asosiy Komponentlar
| Fayl | Maqsad |
|---|---|
| `actionButton.tsx` | Custom tugma |
| `actionBadge.tsx` | Badge (yorliq) |
| `check.tsx` | Checkbox |
| `container.tsx` | Layout konteyner |
| `Select.tsx` | Radix UI asosida custom select |
| `file-upload.tsx` | Fayl yuklash |
| `UploadCloud.tsx` | Cloud storage yuklash |

### Ma'lumot Ko'rsatish
| Fayl | Maqsad |
|---|---|
| `table-action.tsx` | Jadval qator amallar (edit/delete/preview) |
| `table-image.tsx` | Jadvaldagi rasm ko'rsatish |
| `card-sort.tsx` | Saralanuvchi karta |
| `carpet-card.tsx` | Gilam kartasi |
| `dashboard-card.tsx` | Dashboard statistika kartasi |

### Maxsus Funksionallik
| Fayl | Maqsad |
|---|---|
| `barcode-generat.tsx` | Barcode generatsiya |
| `react-barcode.tsx` | Barcode ko'rsatish |
| `qrcode-generat.tsx` | QR kod generatsiya |
| `bidirectional-audio-visualizer.tsx` | Audio vizualizatsiya |
| `image-slider.tsx` | Rasm karuseli |
| `icons.tsx` | Ikonalar kutubxonasi |
| `ThemeSwitcherDock.tsx` | Qorang'u/yorug' rejim almashtirish |

### Shadcn UI (`/src/components/ui/`)
Oldindan stilllangan Tailwind asosidagi komponentlar:
- `button`, `dialog`, `dropdown-menu`, `select`, `tabs`, `checkbox`
- `form`, `input`, `label`, `badge`, `card`, `separator`
- `sheet`, `skeleton`, `table`, `tooltip`, va boshqalar

---

## 6. STATE BOSHQARUVI

### Zustand Storlari (localStorage'da saqlangan)

#### `auth-store.ts` — Autentifikatsiya
```typescript
{
  token: string | null
  setToken(token: string): void
  removeToken(): void
}
// localStorage kaliti: 'auth-storage'
```

#### `me-store.ts` — Joriy foydalanuvchi
```typescript
{
  meUser: IUserData | null
  setUserMe(meUser: IUserData): void
  removeUserMe(): void
}
// localStorage kaliti: 'userMe-storage'
```

#### `year-store.ts` — Yil filtri
```typescript
{
  year: number  // standart: joriy yil
  setYear(year: number): void
  removeYear(): void
}
// localStorage kaliti: 'Year-storage'
```

### React Query (Server State)

**Konfiguratsiya** (`/src/providers/QueryProvider.tsx`):
```typescript
{
  defaultOptions: {
    queries: { retry: 0 }  // Avtomatik qayta urinish yo'q
  }
}
```

---

## 7. API QATLAMLARI

### API Asosiy Konfiguratsiya
**Fayl:** `/src/service/fetchInstance.ts`

```typescript
axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,  // https://test.ziyodulloh.uz/api
  withCredentials: true
})
```

**401 Interceptor:**
1. API 401 qaytarsa → `/auth/refresh` chaqiriladi
2. Muvaffaqiyatli bo'lsa → asl so'rov qaytariladi
3. Muvaffaqiyatsiz bo'lsa → token tozalanadi, login sahifasiga yo'naltiriladi

### API Yordamchi Funksiyalar
**Fayl:** `/src/service/apiHelpers.ts`

```typescript
getAllData<T, Q>(url, query?)          // GET (list)
getByIdData<T, Q>(url, id, query?)     // GET (single)
AddData<D>(url, data)                  // POST
UpdateData<D>(url, id, data)           // PUT
UpdatePatchData<D>(url, id, data)      // PATCH (id bilan)
PatchData<D>(url, data)                // PATCH (id siz)
DeleteData(url, id)                    // DELETE
UploadFile(url, formData)              // POST (multipart)
```

### Asosiy API Marshrutlar
**Fayl:** `/src/service/apiRoutes.ts` — 128+ endpoint ta'riflangan

| Kategoriya | Endpointlar |
|---|---|
| Auth | `/auth/login`, `/auth/refresh` |
| Foydalanuvchi | `/user/info/me` |
| Mahsulot | `/product`, `/product/:id` |
| Filial | `/filial` |
| Kassa | `/kassa`, `/cashflow` |
| Transfer | `/transfer` |
| Buyurtma | `/order` |
| Mijoz | `/client` |
| Qarz | `/debt` |
| Hisobotlar | `/reports/*` |
| Excel export | `/excel/*` |
| QR | `/qr-base` |
| Kolleksiya | `/collection/*` |

### Rasm CDN
```
https://test.ziyodulloh.uz/storage + image.path
```

---

## 8. AUTENTIFIKATSIYA VA AVTORIZATSIYA

### Login Jarayoni

1. **Forma Validatsiyasi** (`schema.ts`):
```typescript
LoginSchema = {
  login: required string
  password: optional string
}
```

2. **API Mutation** (`actions.ts`):
```typescript
useAuthMutation()
// POST /auth/login
// Qaytaradi: { accessToken, refreshToken, user }
// Token Zustand store'ga saqlanadi
```

### Himoyalangan Marshrutlar
**Fayl:** `/src/router/index.tsx`

```typescript
interface IRouter {
  url: string
  Element: React.ComponentType
  meta?: {
    isAuth: boolean     // Autentifikatsiya talab qiladi
    role: Set<string>   // Kerakli rol(lar)
  }
}
```

Marshrutlar `import.meta.glob` orqali avtomatik topiladi:
```typescript
import.meta.glob('../pages/**/route.ts')
```

### Layout Himoyasi
**Fayl:** `/src/layouts/main-layout/index.tsx`

- Token yo'q → `/login`ga yo'naltiradi
- Rol 3 (Kassir) → `/products`ga yo'naltiradi
- Boshqa rollar → `/dashboard`ga yo'naltiradi

---

## 9. ROL TIZIMI — O'ZGARTIRISH MUMKIN EMAS

```typescript
Roles = {
  OTHER:      0,
  CLIENT:     1,
  CASHIER:    3,   // Kassir
  F_MANAGER:  4,   // Moliya Menejeri
  DEALER:     5,   // Diler
  D_MANAGER:  6,   // Bo'lim Menejeri
  W_MANAGER:  7,   // Ombor Menejeri
  I_MANAGER:  8,   // Internet/Do'kon Menejeri
  M_MANAGER:  9,   // Bosh Menejer
  ACCOUNTANT: 10,  // Buxgalter
  HR:         11,  // HR
  BOSS:       12   // Direktor
}
```

**Rol asosida UI ko'rinishi:**
```typescript
{meUser?.position?.role === 3 ? <CashierUI /> : <AdminUI />}
```

**Kassir (Rol 3) uchun maxsus holatlar:**
- `/cashier/home` sahifasida header yashiriladi
- Qisqartirilgan UI ko'rsatiladi
- Default redirect: `/products`

---

## 10. CUSTOM HOOKLAR

**Joylashuv:** `/src/hooks/`

### `useIsMobile()` (`use-mobile.ts`)
```typescript
// window.matchMedia asosida mobil aniqlash
// Mobil breakpoint: 768px
// Resize eventlarini kuzatadi
// Qaytaradi: boolean
```

### `useDebounce<T>()` (`useDebounce.tsx`)
```typescript
// Generic debounce hook
// Standart kechikish: 500ms
// Qidirish/filter inputlar uchun ishlatiladi
// Qaytaradi: debounce qilingan qiymat
```

---

## 11. YORDAMCHI FUNKSIYALAR

**Joylashuv:** `/src/utils/`

| Fayl | Funksiya | Maqsad |
|---|---|---|
| `formatPrice.ts` | `formatPrice()` | Intl.NumberFormat bilan raqam formatlash |
| `formatPhoneNumber.ts` | `formatPhoneNumber()` | O'zbekiston telefon formati (+998 XX XXX-XX-XX) |
| `farmatNumber.ts` | `farmatNumber()` | Umumiy raqam formatlash |
| `debounce.ts` | `debounce()` | Debounce funksiyasi fabrikasi |
| `generate.ts` | `generate()` | Tasodifiy raqam generatsiyasi |
| `get.ts` | `get()` | Nuqta notatsiyasi orqali chuqur object xossasiga kirish |
| `fetch.ts` | `fetchData()` | JSON parsing bilan umumiy fetch wrapper |

### Schema Yordamchilari (`schemaHelper.ts`)
```typescript
requiredStringField(msg?)   // Majburiy matn maydoni
requiredEmailField          // Email validatsiya
requiredPasswordField       // Murakkab parol validatsiyasi:
  // - Kamida 6 belgi
  // - Kamida 1 ta katta harf
  // - Kamida 1 ta kichik harf
  // - Kamida 1 ta raqam
  // - Maxsus belgilar: #!@$%^&*_
  // - Bo'sh joy yo'q
DeleteSchema                // O'chirish tasdiqlash sxemasi
```

### `lib/utils.ts`
```typescript
cn(...inputs)  // clsx + tailwind-merge kombinatsiyasi
               // Xavfsiz CSS class birlashtirish uchun
```

### Internatsionalizatsiya (`/src/utils/i18n/`)
- 3 til: Rus (faol), Ingliz, O'zbek (sozlangan, lekin ishlatilmaydi)
- Brauzer til avtomatik aniqlanadi
- Hozirda faqat rus tilidagi tarjimalar yuklangan

---

## 12. STYLING YONDASHUVI

### CSS O'zgaruvchilari (Yorug'/Qorang'u rejim)
**Fayl:** `src/globals.css`

```css
:root {
  --background, --foreground
  --primary, --primary-foreground
  --secondary, --secondary-foreground
  --accent, --destructive
  --border, --input, --ring
  --chart-1 ... --chart-5    /* Grafiklar uchun */
  --sidebar-*                 /* Sidebar theming */
}

.dark { /* Invertlangan ranglar */ }
```

### Stil Qatlamlari
1. **Tailwind Base** — Reset va standartlar
2. **Component Classes** — Shadcn/Radix UI
3. **Utility Classes** — Tailwind yordamchilari
4. **Custom CSS** — SVG o'lchamlari, tema o'zgaruvchilari

### Maxsus Klasslar
```css
.scrollCastom    /* Custom scroll styling */
.cashflow_type svg { ... }  /* SVG o'lchamlash */
```

---

## 13. MUHIM BIZNES LOGIKASI — O'ZGARTIRISH MUMKIN EMAS

### 1. Paginatsiya va Cheksiz Aylanma (Infinite Scroll)
```typescript
useInfiniteQuery({
  getNextPageParam: (lastPage) => {
    if (lastPage?.meta?.currentPage <= lastPage?.meta?.totalPages) {
      return lastPage?.meta?.currentPage + 1
    }
    return null
  }
})
```

### 2. Server Javob Formati
```typescript
type TResponse<T> = {
  items: T[]
  meta: {
    page: number
    totalItems: number
    itemCount: number
    itemsPerPage: number
    totalPages: number
    currentPage: number
    limit: number
    total: number
  }
}
```

### 3. Cache Yaroqsizlashtirish
```typescript
// Har qanday mutatsiyadan keyin tegishli querylar qayta yuklanadi
queryClient.invalidateQueries({ queryKey: [refetchUrl || url] })
```

### 4. URL orqali State Boshqaruvi
```typescript
// nuqs yordamida URL state
const [id, setId] = useQueryState('id')
// URL: ?id=123
// Forma tahrirlash, filtrlash uchun ishlatiladi
```

### 5. Token Yangilash Jarayoni
```
API 401 → _retry flag o'rnatiladi → POST /auth/refresh
→ Muvaffaqiyatli: asl so'rov qaytariladi
→ Muvaffaqiyatsiz: token tozalanadi → /login
```

### 6. Dinamik Marshrut Yuklash
```typescript
// Barcha route.ts fayllari avtomatik topiladi
import.meta.glob('../pages/**/route.ts')
// Yangi sahifa qo'shish uchun faqat route.ts yaratish kifoya
```

### 7. Xabarnoma Namunasi
```typescript
// Xato (API xatolaridan avtomatik)
toast.error(error?.response?.data?.message)

// Muvaffaqiyat (qo'lda)
toast.success(t('translation_key'))
```

---

## 14. KONFIGURATSIYA FAYLLARI

### TypeScript (`tsconfig.json`)
- **Path Alias:** `@/* → ./src/*`
- **References:** `tsconfig.app.json`, `tsconfig.node.json`

### Vite (`vite.config.ts`)
- React 19 + Vite React plugin
- PWA: VitePWA with auto-update
- Resolve Alias: `@` → `./src`
- PWA App Name: "Кacca" (ruscha)
- Start URL: `/`

### Environment
```env
# .env.development
VITE_BASE_URL=https://test.ziyodulloh.uz/api

# .env.production
VITE_BASE_URL=https://test.ziyodulloh.uz/api
```

### Prettier
```json
{
  "trailingComma": "es5",
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "printWidth": 80,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### Skriptlar
```bash
npm run dev       # Vite dev server (--host bilan)
npm run build     # TypeScript + Vite build
npm run lint      # ESLint --fix
npm run prettier  # Prettier --write
npm run preview   # Build preview
```

---

## 15. ILOVANI ISHGA TUSHIRISH TARTIBI

**Fayl:** `src/main.tsx`

```
1. globals.css yuklash (Tailwind)
2. i18n konfiguratsiyasi import
3. React root yaratish
4. Providerlar bilan render:
   - StrictMode
   - BrowserRouter
   - NuqsAdapter (URL params)
   - QueryProvider (React Query)
   - Toaster (sonner)
   - App komponenti
```

**App.tsx:**
- Mount bo'lishda `/user/info/me` so'rovi
- Natija Zustand `me-store`ga saqlanadi
- `MyRoutes` komponenti render qilinadi

---

## 16. KODLASH KONVENTSIYALARI

### Fayl Nomlash
- **Komponentlar:** PascalCase (`TableAction.tsx`)
- **Yordamchilar/Hooklar:** camelCase, hooklar `use` prefiksi bilan
- **Sahifalar:** kebab-case papkalar (`products-check`)
- **Routlar:** Har doim `route.ts` deb nomlanadi

### Forma Fayllari Namunasi
```
form/
├── index.tsx    → Konteyner/wrapper
├── content.tsx  → Forma JSX
├── schema.ts    → Zod validatsiya
└── actions.ts   → API mutatsiyalari
```

### Query Fayllari Namunasi
```
table/
├── queries.ts   → React Query hooklar (useInfiniteQuery, useQuery)
├── columns.tsx  → TanStack Table ustun ta'riflari
└── filters.tsx  → Filter komponent UI
```

### Xato Boshqaruvi
```typescript
// API xatolar
try {
  await apiCall()
} catch (error) {
  handleError(error)  // Toast ko'rsatadi
  throw error
}

// Forma submit
onError: (error) => console.error(error)
```

---

## 17. MUHIM FAYL JOYLASHUVI

| Element | Yo'l |
|---|---|
| Kirish nuqtasi | `src/main.tsx` |
| App Root | `src/App.tsx` |
| Router konfiguratsiya | `src/router/index.tsx` |
| API servis | `src/service/` |
| State storlari | `src/store/` |
| UI komponentlar | `src/components/` |
| Sahifalar | `src/pages/` |
| Custom hooklar | `src/hooks/` |
| Yordamchi funksiyalar | `src/utils/` |
| TypeScript typelar | `src/types/` |
| Konstantalar | `src/constants/` |
| Global stillar | `src/globals.css` |
| Env konfiguratsiya | `.env.development`, `.env.production` |

---

## 18. O'ZGARTIRMASLIK KERAK BO'LGAN NARSALAR

> **OGOHLANTIRISH:** Quyidagi logikalar butun tizimning asosi. Noto'g'ri o'zgartirish butun ilovani buzishi mumkin.

1. **Rol raqamlari** — `Roles` konstantasidagi raqamlar server bilan mos keladi
2. **Token yangilash interceptori** — `/src/service/fetchInstance.ts` dagi 401 logikasi
3. **Route meta tuzilmasi** — `isAuth` va `role` maydonlari himoya mexanizmi
4. **Dinamik marshrut yuklash** — `import.meta.glob` pattern
5. **Server javob formati** — `TResponse<T>` bilan `items` va `meta` tuzilmasi
6. **localStorage kalitlari** — `auth-storage`, `userMe-storage`, `Year-storage`
7. **API base URL** — Environment o'zgaruvchisidan keladi
8. **Rasm CDN URL** — `https://test.ziyodulloh.uz/storage` prefiksi
9. **Kassir (Rol 3) logikasi** — Maxsus UI va redirect logikasi
10. **Parol validatsiya qoidalari** — Server bilan mos keladi
11. **Sahifa tuzilmasi** — `route.ts`, `type.ts`, `form/`, `table/` pattern
12. **nuqs URL state** — `?id=` parametrini o'chirish formalar ishlashini buzadi

---

## 19. LOYIHA METADATA

| Xususiyat | Qiymat |
|---|---|
| Loyiha nomi | new_grm_admin |
| Versiya | 0.1.0 |
| Private | Ha |
| Target foydalanuvchilar | Rol asosida admin xodimlar |
| Til qo'llab-quvvatlash | Rus (faol), Ingliz, O'zbek (sozlangan) |
| Backend API | https://test.ziyodulloh.uz/api |
| Rasm CDN | https://test.ziyodulloh.uz/storage |
| PWA | Ha (auto-update) |
| Davlat | O'zbekiston |
