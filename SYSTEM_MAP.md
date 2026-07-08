# SYSTEM_MAP.md — RBUBA
> Kompas arsitektur proyek. Baca file ini di awal setiap sesi. Update jika flow/file utama berubah.
> Terakhir diperbarui: 2026-07-08 | Status: Sprint 3 (System Initialization) — Step 6 Testing

---

## 1. Project Summary
- **Tujuan Aplikasi**: Sistem manajemen sekolah (RBUBA) — mencakup manajemen user, siswa, pegawai, komitmen pembayaran, pembayaran, dashboard KPI, laporan, dan audit trail. (Ref: Flow Build System RBUBA.docx)
- **Tech Stack**: React 19, Vite 7, Bootstrap 5.3 (via npm import), Firebase 12 (Auth + Firestore + Hosting), React Router DOM 7, React Hook Form 7, React Toastify 11, React Icons 5.
- **Arsitektur**: Standard Vite structure + folder-based layering (`components / pages / routes / services / contexts / hooks / firebase / utils`). Pola: UI (Pages) -> Hooks/Context -> Service Layer -> Firebase SDK (Firestore/Auth).

---

## 2. Core Component Flow

### Entry Chain
`index.html` -> `src/main.jsx` (BrowserRouter + AuthProvider + ToastContainer + import CSS Bootstrap/Toastify/custom) -> `src/App.jsx` -> `src/routes/AppRoutes.jsx`

### Auth Flow
- Buka `/login` -> `GuestRoute` (cek `useAuth`: loading -> PageLoader; user ada -> redirect `/dashboard`) -> `pages/auth/Login` -> auth service (`services/`) -> Firebase Auth (`firebase/auth.js`).
- Session: `AuthContext` (contexts/) memantau Firebase session -> auto login/logout -> role: superadmin | admin | student.

### Protected Flow
- Route terproteksi -> `ProtectedRoute` (routes/) -> `useAuth` -> render `Outlet` atau redirect login.
- Role-based nesting: `ProtectedRoute roles={["superadmin"]}` (untuk /users — belum aktif), `roles={["superadmin","admin"]}` (untuk /commitments — belum aktif).

### Setup Wizard Flow (Sprint 3)
`/system/setup` -> `pages/system/SetupWizard` -> `setupService` + `counterService` (services/ & counters/) -> Firestore (inisialisasi collection, counter, log).

### Rute Aktif (AppRoutes.jsx)
| Path | Guard | Page |
|---|---|---|
| `/` | - | Redirect -> /dashboard |
| `/login` | GuestRoute | pages/auth/Login |
| `/dashboard` | ProtectedRoute | pages/dashboard/Dashboard |
| `/profile` | ProtectedRoute | pages/profile/Profile |
| `/students` | ProtectedRoute | pages/students/StudentList |
| `/payments` | ProtectedRoute | pages/payments/PaymentList |
| `/system/setup` | ProtectedRoute | pages/system/SetupWizard |
| `*` | - | Redirect -> /dashboard |

---

## 3. Clean Tree (src/)
```
src/
├── assets/        # Aset statis
├── components/    # Komponen reusable (a.l. common/PageLoader)
├── constants/     # Konstanta aplikasi
├── contexts/      # AuthContext (global auth state)
├── counters/      # Logika counter (Setup Wizard / nomor dokumen)
├── firebase/      # Init Firebase: config.js, auth.js, firestore.js, index.js
├── hooks/         # Custom hooks (useAuth)
├── layouts/       # Layout dasar (MainLayout — Sprint 4)
├── pages/         # auth/Login, dashboard/, profile/, students/, payments/, system/SetupWizard
├── routes/        # AppRoutes, ProtectedRoute, GuestRoute
├── services/      # Service layer (authService, setupService, counterService)
├── styles/        # index.css, auth.css
├── utils/         # Helper umum
├── App.jsx        # Root component -> AppRoutes
└── main.jsx       # Entrypoint: Router, AuthProvider, Toast, CSS imports
```

---

## 4. Module Map (The Chapters)

### Entry & Root
- `src/main.jsx`: Bootstrap aplikasi — mount React, BrowserRouter, AuthProvider, ToastContainer, import Bootstrap CSS+JS bundle.
- `src/App.jsx`: Root component tipis; hanya merender AppRoutes.
- `vite.config.js`: Konfigurasi Vite minimal (plugin react, base "/").

### Routing
- `src/routes/AppRoutes.jsx`: Definisi seluruh rute + guard nesting (guest/protected/role-based); rute /users & /commitments masih dikomentari.
- `src/routes/GuestRoute.jsx`: Guard untuk tamu; loading -> PageLoader, sudah login -> redirect /dashboard, belum -> Outlet.
- `src/routes/ProtectedRoute.jsx`: Guard login + role (menerima prop `roles`). *(File belum diupload — dipetakan dari pemakaian)*

### Firebase Layer
- `src/firebase/config.js`: initializeApp dari env VITE_FIREBASE_*. ⚠ Ada console.log debug API key & env — hapus sebelum production.
- `src/firebase/auth.js`: Ekspor instance `getAuth(app)`.
- `src/firebase/firestore.js`: Ekspor instance `getFirestore(app)` sebagai `db`.
- `src/firebase/index.js`: Barrel export `{ app, auth, db }`.

### State & Hooks
- `src/contexts/AuthContext.jsx`: Provider auth global — user, loading, role, session listener Firebase. *(Belum diupload — dipetakan dari pemakaian)*
- `src/hooks/useAuth.js`: Hook konsumsi AuthContext — mengembalikan `{ user, loading, ... }`.

### Services (dari blueprint)
- `services/authService`: login/logout via Firebase Auth.
- `services/setupService`: inisialisasi sistem/collection (Setup Wizard).
- `services/counterService` (+ `counters/`): pengelolaan counter dokumen di Firestore.

### Pages
- `pages/auth/Login.jsx`: Form login (React Hook Form, validasi, toast, show password).
- `pages/dashboard/Dashboard.jsx`: Halaman utama pasca-login (KPI — Sprint 10).
- `pages/profile/Profile.jsx`: Profil user.
- `pages/students/StudentList.jsx`: Daftar siswa (Sprint 6).
- `pages/payments/PaymentList.jsx`: Daftar pembayaran (Sprint 9).
- `pages/system/SetupWizard.jsx`: Wizard inisialisasi sistem (Sprint 3).

### Components
- `components/common/PageLoader.jsx`: Indikator loading saat verifikasi sesi.

---

## 5. Styling & UI Context
- **Bootstrap**: di-import via npm di `main.jsx` (`bootstrap.min.css` + `bootstrap.bundle.min.js`). Bukan CDN, bukan SCSS kustom.
- **CSS kustom**: `src/styles/index.css`, `src/styles/auth.css`.
- **Toastify CSS**: di-import di `main.jsx`; ToastContainer global (top-right, autoClose 3s, theme colored).
- **Komponen Bootstrap utama**: Grid system, Form controls (Login), diperkirakan Navbar/Sidebar/Modal menyusul di Sprint 4. Detail pemakaian per-page: Not found (file page belum dianalisis).

---

## 6. Data & Config
- **Env**: `.env`, `.env.example`, `.env.development`, `.env.production` di root — variabel `VITE_FIREBASE_*` (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId).
- **vite.config.js**: root proyek, konfigurasi minimal.
- **Global State**: `AuthContext` (user, loading, role). State lain: Not found.
- **Integrasi eksternal**: Firebase Auth & Firestore via SDK (bukan Axios/REST). Pemanggil: service layer (`services/`) dan `AuthContext`.
- **Firestore Collections (blueprint)**: `users`, `students`, `employees`, `commitments`, `payments`, `logs`, + counter/setup collection (Sprint 3).

---

## 7. Risks / Blind Spots
- ⚠ `firebase/config.js` mencetak API key & seluruh env ke console (debug) — wajib dihapus sebelum deploy.
- File belum terverifikasi langsung (dipetakan dari pemakaian/blueprint): `ProtectedRoute.jsx`, `AuthContext.jsx`, `useAuth.js`, semua `pages/*`, `services/*`, `counters/*`, `layouts/*`, `constants/*`, `utils/*`, `index.html`.
- Firestore structure final (nama field, security rules) belum terdokumentasi di repo — hanya di docx blueprint.
- Rute role-based (/users, /commitments) masih dikomentari — pastikan diaktifkan saat Sprint 5 & 8.
- Sprint 3 Step 6 (testing end-to-end Setup Wizard: counter, log, redirect, error handling) belum selesai.
