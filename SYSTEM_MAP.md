# SYSTEM_MAP.md — RBUBA
> Kompas arsitektur proyek. Baca file ini di awal setiap sesi. Update jika flow/file utama berubah.
> Terakhir diperbarui: 2026-07-08 | Status: Sprint 4 (Main Application UI) — Task 1–8 selesai (menunggu verifikasi Freeze UI)

---

## 1. Project Summary
- **Tujuan Aplikasi**: Sistem manajemen sekolah (RBUBA) — manajemen user, siswa, pegawai, komitmen pembayaran, pembayaran, dashboard KPI, laporan, audit trail. (Ref: Flow Build System RBUBA.docx)
- **Tech Stack**: React 19, Vite 7, Bootstrap 5.3 (npm import), Firebase 12 (Auth + Firestore + Hosting), React Router DOM 7, React Hook Form 7, React Toastify 11, React Icons 5.
- **Arsitektur**: Standard Vite + folder-based layering (`components / pages / routes / services / contexts / hooks / firebase / layouts / constants / utils`). Pola: UI (Pages) -> Hooks/Context -> Service Layer -> Firebase SDK.

---

## 2. Core Component Flow

### Entry Chain
`index.html` -> `src/main.jsx` (ErrorBoundary > BrowserRouter > AuthProvider > LoadingProvider > App + ToastContainer; import CSS Bootstrap/Toastify/custom) -> `src/App.jsx` -> `src/routes/AppRoutes.jsx`

### Auth Flow
- `/login` -> `GuestRoute` (loading -> PageLoader; user ada -> redirect /dashboard) -> `pages/auth/Login` -> authService -> Firebase Auth.
- Session: `AuthContext` memantau Firebase session -> auto login/logout -> role: superadmin | admin | student.

### Protected + Layout Flow
- Rute protected: `ProtectedRoute` (cek login + role; role tak cocok -> redirect `/403`) -> `MainLayout` (layout route, render sekali) -> `Outlet` (page).
- MainLayout: state `collapsed` (persist di localStorage key `sidebar-collapsed`), `mobileOpen`, deteksi `isMobile` (<992px, listener resize), auto-close sidebar mobile saat pindah halaman, backdrop overlay mobile.

### Sidebar Behavior (frozen)
- Desktop: collapse smooth 240px <-> 64px; hover-expand saat collapsed; `suppressHover` (ref) mencegah re-expand setelah klik menu sampai pointer keluar.
- Mobile: hidden total (`return null`) sampai hamburger diklik -> overlay fixed + backdrop.
- Menu role-based dari `constants/menu.js` (MENU_ITEMS: path, label, icon, roles?).

### Global Loading Flow
Page/service -> `useLoading().withLoading(task)` -> `LoadingContext` (counter, aman paralel) -> overlay fullscreen spinner.

### Error Flow
- URL tak dikenal -> `*` -> `pages/errors/NotFound` (404).
- Role tak sesuai -> `/403` -> `Forbidden`.
- Crash render React -> `ErrorBoundary` (main.jsx) -> `ServerError` (500).

### Setup Wizard Flow (Sprint 3)
`/system/setup` -> `pages/system/SetupWizard` -> `setupService` + `counterService` -> Firestore (init collection, counter, log).

### Rute Aktif (AppRoutes.jsx)
| Path | Guard | Page |
|---|---|---|
| `/` | - | Redirect -> /dashboard |
| `/login` | GuestRoute | pages/auth/Login |
| `/dashboard` | ProtectedRoute + MainLayout | pages/dashboard/Dashboard |
| `/profile` | ProtectedRoute + MainLayout | pages/profile/Profile |
| `/students` | ProtectedRoute + MainLayout | pages/students/StudentList |
| `/payments` | ProtectedRoute + MainLayout | pages/payments/PaymentList |
| `/system/setup` | ProtectedRoute + MainLayout | pages/system/SetupWizard |
| `/403` | - | pages/errors/Forbidden |
| `*` | - | pages/errors/NotFound |

---

## 3. Clean Tree (src/)
```
src/
├── assets/
├── components/
│   ├── common/        # PageLoader, EmptyState, ErrorBoundary
│   └── layout/        # Header, Sidebar, Footer, Breadcrumb (FROZEN)
├── constants/         # menu.js, breadcrumb.js
├── contexts/          # AuthContext, LoadingContext
├── counters/          # Logika counter (Setup Wizard / nomor dokumen)
├── firebase/          # config.js, auth.js, firestore.js, index.js
├── hooks/             # useAuth, useLoading
├── layouts/           # MainLayout (FROZEN)
├── pages/
│   ├── auth/          # Login
│   ├── dashboard/     # Dashboard
│   ├── errors/        # ErrorPage, NotFound, Forbidden, ServerError
│   ├── payments/      # PaymentList
│   ├── profile/       # Profile
│   ├── students/      # StudentList
│   └── system/        # SetupWizard
├── routes/            # AppRoutes, ProtectedRoute, GuestRoute
├── services/          # authService, setupService, counterService
├── styles/            # index.css, auth.css
├── utils/
├── App.jsx
└── main.jsx
```

---

## 4. Module Map (The Chapters)

### Entry & Root
- `src/main.jsx`: Mount React — ErrorBoundary, BrowserRouter, AuthProvider, LoadingProvider, ToastContainer, import Bootstrap CSS+JS bundle.
- `src/App.jsx`: Root tipis; merender AppRoutes.
- `vite.config.js`: Konfigurasi minimal (plugin react, base "/").

### Routing
- `routes/AppRoutes.jsx`: Definisi rute + guard nesting; MainLayout sebagai layout route; 404/403; /users & /commitments masih dikomentari.
- `routes/GuestRoute.jsx`: Guard tamu; loading -> PageLoader; sudah login -> /dashboard.
- `routes/ProtectedRoute.jsx`: Guard login + role (prop `roles`); role tak cocok -> /403. *(dipetakan dari pemakaian)*

### Layout (FROZEN — ubah via constants/props saja)
- `layouts/MainLayout.jsx`: Layout responsif; state collapsed (localStorage), mobileOpen, isMobile; backdrop mobile; Breadcrumb + Outlet di main.
- `components/layout/Header.jsx`: Toggle sidebar, brand, dropdown profil (Bootstrap dropdown), logout via useAuth.
- `components/layout/Sidebar.jsx`: Menu role-based, collapse smooth + hover-expand (suppressHover ref), mobile hidden total.
- `components/layout/Footer.jsx`: Footer statis.
- `components/layout/Breadcrumb.jsx`: Breadcrumb otomatis dari URL; segmen tanpa halaman = non-link (LINKABLE_PATHS).

### Common Components
- `components/common/PageLoader.jsx`: Loading verifikasi sesi.
- `components/common/EmptyState.jsx`: Tampilan data kosong reusable (props: icon, title, message, actionLabel, onAction).
- `components/common/ErrorBoundary.jsx`: Class component penangkap crash render -> ServerError.

### Error Pages
- `pages/errors/ErrorPage.jsx`: Template dasar (code, title, message, icon).
- `pages/errors/NotFound.jsx` (404), `Forbidden.jsx` (403), `ServerError.jsx` (500).

### Firebase Layer
- `firebase/config.js`: initializeApp dari env VITE_FIREBASE_*. ⚠ console.log debug API key — hapus sebelum production.
- `firebase/auth.js`: instance getAuth. | `firebase/firestore.js`: instance getFirestore (db). | `firebase/index.js`: barrel export { app, auth, db }.

### State & Hooks
- `contexts/AuthContext.jsx`: user, loading, role, logout, session listener. *(dipetakan dari pemakaian)*
- `contexts/LoadingContext.jsx`: Global loading (counter) + overlay fullscreen.
- `hooks/useAuth.js`: Konsumsi AuthContext.
- `hooks/useLoading.js`: Konsumsi LoadingContext + helper `withLoading(task)` (auto on/off, aman error).

### Constants
- `constants/menu.js`: MENU_ITEMS sidebar (path, label, icon, roles?).
- `constants/breadcrumb.js`: BREADCRUMB_LABELS (path->label) + LINKABLE_PATHS.

### Services (dari blueprint)
- `services/authService`: login/logout Firebase Auth.
- `services/setupService`: inisialisasi sistem (Setup Wizard).
- `services/counterService` (+ `counters/`): counter dokumen Firestore.

### Pages
- `pages/auth/Login.jsx`: Form login (RHF, validasi, toast, show password).
- `pages/dashboard/Dashboard.jsx`: Halaman utama (KPI — Sprint 10).
- `pages/profile/Profile.jsx`, `pages/students/StudentList.jsx`, `pages/payments/PaymentList.jsx`, `pages/system/SetupWizard.jsx`.

---

## 5. Styling & UI Context
- **Bootstrap**: npm import di `main.jsx` (CSS + JS bundle). Bukan CDN/SCSS.
- **CSS kustom**: `styles/index.css`, `styles/auth.css`.
- **Toastify**: ToastContainer global (top-right, 3s, colored).
- **Komponen Bootstrap dipakai**: Grid/flex utilities, Navbar (Header), Dropdown (profil), Breadcrumb, Spinner (loading), Buttons, Forms (Login).
- **Animasi kustom**: transisi width sidebar (cubic-bezier) + fade label (inline style).

---

## 6. Data & Config
- **Env**: `.env*` di root — `VITE_FIREBASE_*` (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId).
- **Persistensi klien**: localStorage `sidebar-collapsed` ("0"/"1").
- **Global State**: AuthContext (user/role/loading), LoadingContext (isLoading).
- **Integrasi eksternal**: Firebase Auth & Firestore via SDK (bukan REST/Axios). Pemanggil: services + AuthContext.
- **Firestore Collections (blueprint)**: `users`, `students`, `employees`, `commitments`, `payments`, `logs`, + setup/counter (Sprint 3).

---

## 7. Risks / Blind Spots
- ⚠ `firebase/config.js` masih mencetak API key & env ke console — wajib dihapus sebelum deploy.
- ⚠ Terindikasi **MainLayout remount saat navigasi** (state reset) — dimitigasi dengan localStorage `sidebar-collapsed`, tapi akar masalah struktur route belum diverifikasi. Cek jika state layout lain ikut reset.
- File dipetakan dari pemakaian/blueprint (belum diverifikasi langsung): `ProtectedRoute.jsx`, `AuthContext.jsx`, `useAuth.js`, isi `pages/*` (kecuali errors), `services/*`, `counters/*`, `utils/*`, `index.html`.
- Sprint 3 Step 6 (testing end-to-end Setup Wizard) belum dinyatakan selesai.
- Rute role-based (/users, /commitments) masih dikomentari — aktifkan di Sprint 5 & 8.
- Firestore security rules belum terdokumentasi di repo.

---

## 8. Log Perubahan Peta
- 2026-07-08: Sprint 4 Task 1–8 — tambah MainLayout, Header, Sidebar, Footer, Breadcrumb, menu.js, breadcrumb.js, LoadingContext, useLoading, EmptyState, ErrorBoundary, pages/errors/*; AppRoutes: layout route + 404/403; layout components FROZEN.
- 2026-07-08 (awal): Peta pertama dibuat (Sprint 1–3).
