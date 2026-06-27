# CareHub Frontend — Integration Guide (Phase 1)

## Integration status (Phases 0–10)

The frontend and backend are **fully integrated** for all core marketplace flows. Every major feature uses live API calls via `ApiClientService` — no dummy data files remain.

| Area | Status | API |
|------|--------|-----|
| Auth (login, register, refresh, logout) | ✅ | `/auth/*` |
| Doctors search & profile | ✅ | `/doctors/public/*` |
| Doctor reviews (read + write) | ✅ | `/doctors/:id/reviews` |
| Appointments (book, cancel, doctor actions) | ✅ | `/appointments`, `/doctor/appointments` |
| Doctor portal (profile, schedule, prescriptions) | ✅ | `/doctors/me`, `/schedules`, `/clinics` |
| Doctor registration | ✅ | `/doctor-applications`, `/uploads/application` |
| Hospitals, labs, surgery | ✅ | `/hospitals`, `/labs`, `/surgeries` |
| Medicines & orders | ✅ | `/medicines/*` (checkout via API) |
| Lab bookings & surgery requests | ✅ | `/lab-bookings`, `/surgeries/consultation-requests` |
| Notifications | ✅ | `/notifications/me` |
| Admin | ✅ | `/admin/*` |
| Patient prescriptions | ✅ | `/prescriptions/me` |
| Video consultation room | ✅ | Jitsi embed (booking ref as room) |

### Intentional client-side persistence

- **JWT tokens** — `TokenStorageService` (localStorage)
- **Medicine cart & saved addresses** — `MedicineCartService` (localStorage); orders go to API at checkout

### Known limitations (not blockers)

- Doctor registration collects clinic/fees/availability in UI; only identity + documents are sent until admin approval; doctor completes profile after login
- Earnings are derived from completed appointments × `consultationFee` (no dedicated payouts API)
- Video uses Jitsi Meet demo embed — swap provider for production HIPAA compliance
- Coupon codes (`CARE10`, `FREESHIP`) are validated client-side only until a backend coupons API exists
- Doctor register does not auto-create schedules/clinics from the registration wizard

### Prerequisites to run

1. Backend: `npm run seed` then `npm start` on port **5800**
2. Frontend: `ng serve` on port **4200**
3. Seed logins: `admin@carehub.test`, `dr.ayesha@carehub.test` / `Password123!`

## API layer

All HTTP calls should go through `ApiClientService` (`src/app/core/api/api-client.service.ts`).

```typescript
import { inject } from '@angular/core';
import { ApiClientService } from '@app/core/api/api-client.service';

private readonly api = inject(ApiClientService);

this.api.get<MyDto>('/some-endpoint', { params: { page: 1 } });
this.api.post<MyDto>('/some-endpoint', payload);
```

### Request options

| Option | Purpose |
|--------|---------|
| `params` | Query string object |
| `skipErrorToast` | Suppress global error notification |
| `skipLoading` | Exclude from global loading bar |

## Interceptor chain (order matters)

1. **authInterceptor** — attaches JWT Bearer token
2. **loadingInterceptor** — global loading bar
3. **errorInterceptor** — 401 → refresh token → retry; failure → logout + redirect
4. **apiErrorInterceptor** — toast for 4xx/5xx (except validation + 401)

## Error handling

- **Form validation (422)** — handle in component via `ApiErrorService.getFieldErrors(error)`
- **403** — toast + redirect to `/unauthorized`
- **401** — handled by error interceptor (no toast)
- **5xx / offline** — global error toast

```typescript
import { ApiErrorService } from '@app/core/services/api-error.service';

catchError((err: HttpErrorResponse) => {
  const message = this.apiErrorService.getMessage(err);
  const fieldErrors = this.apiErrorService.getFieldErrors(err);
})
```

## Loading states

### Global
`LoadingService.isLoading()` — true while any API request is in flight (top progress bar in `GlobalShellComponent`).

### Page / button level (recommended pattern)
```typescript
readonly loading = signal(false);
readonly error = signal<string | null>(null);

submit(): void {
  this.loading.set(true);
  this.error.set(null);
  this.api.post('/endpoint', payload).subscribe({
    next: () => this.loading.set(false),
    error: (err) => {
      this.loading.set(false);
      this.error.set(this.apiErrorService.getMessage(err));
    },
  });
}
```

## Environments

| File | When used |
|------|-----------|
| `src/environments/environment.ts` | `ng serve` (development) |
| `src/environments/environment.production.ts` | `ng build` production (via `fileReplacements`) |

| Variable | Dev | Production |
|----------|-----|------------|
| `apiUrl` | `http://localhost:5800/api/v1` | `/api/v1` (proxied) |
| `socketUrl` | `http://localhost:5800` | same origin |
| `apiTimeoutMs` | 30000 | 30000 |

## Phase 1 verification checklist

- [ ] `ng serve` starts without errors
- [ ] Global loading bar appears during login request
- [ ] Login works and stores tokens
- [ ] Invalid API call shows error toast
- [ ] `ng build` uses production environment (`apiUrl: '/api/v1'`)

## Phase 2 verification checklist

- [ ] Patient register only allows PATIENT role (no doctor option on `/auth/register`)
- [ ] Doctor login at `/doctor/login` redirects to `/auth/login`
- [ ] Doctor seed user (`dr.ayesha@carehub.test` / `Password123!`) logs in → `/doctor/dashboard`
- [ ] Non-doctor user visiting `/doctor/dashboard` → `/unauthorized`
- [ ] Protected route redirect includes `?returnUrl=` and login honors it after sign-in
- [ ] Session refresh on page reload restores user via `GET /auth/me`
- [ ] Logout from doctor portal clears JWT and returns to login

## Phase 3 — Reference data & catalogs

### Services

| Service | Endpoint | Purpose |
|---------|----------|---------|
| `SpecialtyApiService` | `GET /medical-specialties/public` | Public specialty list |
| `LanguageApiService` | `GET /languages/public` | Public language list |
| `ReferenceDataService` | (cached signals) | Shared catalog state, label helpers |

`ReferenceDataService` is initialized in `app.ts` via `loadAll()`. Pages that need fresh data can call `loadSpecialties()` / `loadLanguages()` (no-op if already loaded).

### Wired UI

- Home page — popular specialty chips from API
- Public layout — Find Doctors nav dropdown (desktop + mobile)
- Find doctors page — page title / breadcrumb labels from API
- Doctor register — specialization dropdown from API
- Doctor portal profile — specialization dropdown from API
- Doctor detail — breadcrumb specialty label from API

### Phase 3 verification checklist

- [ ] Backend running; `GET /api/v1/medical-specialties/public` returns seeded specialties
- [ ] Home page shows API specialties (Cardiology, Dermatology, etc.) — not hardcoded list
- [ ] Nav “Find Doctors” dropdown matches API specialties
- [ ] `/find-doctors/cardiology?city=Lahore` shows “Cardiologists” in title
- [ ] Doctor register specialization dropdown lists API specialties
- [ ] `ng build` passes

## Phase 8 — Doctor portal live API & registration

### Backend (prerequisites)

| Route | Purpose |
|-------|---------|
| `GET/PATCH /doctors/me` | Doctor profile (DOCTOR role) |
| `GET /clinics/me`, `POST/PUT /clinics` | Doctor clinic management |
| `GET/POST /schedules/me`, `DELETE /schedules/:id` | Weekly availability |
| `POST /uploads/application` | Public document upload for registration |
| `POST /doctor-applications` | Doctor signup (creates inactive user + pending doctor) |

### Services

| Service | Endpoint | Purpose |
|---------|----------|---------|
| `DoctorPortalApiService` | `GET/PATCH /doctors/me` | Profile read/update |
| `DoctorPortalApiService` | `GET/POST/PUT /clinics` | Clinic list/create/update |
| `DoctorPortalApiService` | `GET/POST/DELETE /schedules` | Availability slots |
| `DoctorApplicationsApiService` | `POST /doctor-applications` | Public doctor registration |
| `UploadsApiService` | `POST /uploads/application` | Registration document upload (no auth) |
| `DoctorPortalService` | (facade) | Loads profile + derives stats/patients/earnings from live appointments |

### Wired UI

- **Doctor layout** loads portal data on init (`loadPortalData`)
- **Dashboard / earnings / patients** — stats and lists derived from `GET /doctor/appointments` + profile API (no dedicated prescriptions/patients/earnings endpoints yet)
- **Profile** — `PATCH /doctors/me` + clinic create/update via clinics API
- **Schedule** — `POST /schedules` + `DELETE /schedules/:id` (video slots)
- **Prescriptions** — live API at `/doctor/prescriptions` (Phase 9)
- **Doctor register** (`/join-as-doctor`) — uploads documents then `POST /doctor-applications`; admin must approve before login

### Notes

- Doctor login uses unified `/auth/login` with `returnUrl=/doctor/dashboard` (localStorage demo session removed).
- Registration collects clinic/fees/availability in the UI for review; only core fields + documents are persisted on the application until admin approval.
- Earnings use `consultationFee` from the doctor profile for completed appointments (appointments API has no fee field).

### Phase 8 verification checklist

- [ ] `POST /uploads/application` uploads a PDF/image without auth
- [ ] `/join-as-doctor` submits application with uploaded document URLs
- [ ] Admin approves application → doctor can log in (`dr.*@carehub.test` after seed + approval)
- [ ] Doctor dashboard loads profile, pending appointments, and earnings summary from API
- [ ] Doctor profile save updates `PATCH /doctors/me` and clinic record
- [ ] Doctor schedule add/remove persists via schedules API
- [ ] Patients page lists unique patients from appointment history
- [ ] `ng build` passes

## Phase 9 — Polish, prescriptions & appointment phone

### Backend

| Route | Purpose |
|-------|---------|
| `GET /doctor/prescriptions` | List doctor's issued prescriptions |
| `POST /doctor/prescriptions` | Create prescription for a patient |
| `POST /appointments` | Optional `patientPhone` stored on appointment |

### Services

| Service | Endpoint | Purpose |
|---------|----------|---------|
| `PrescriptionsApiService` | `GET/POST /doctor/prescriptions` | Doctor prescription list + create |
| `AppointmentsApiService` | `POST /appointments` | Passes `patientPhone` from booking modals |

### Wired UI

- **Prescriptions page** — live create/list via API
- **Patients page** — phone from `patientPhone` on appointments
- **Doctor portal** — loading/error states on earnings, patients, schedule, prescriptions
- **Nav + medicines** — shared `PAKISTAN_CITIES` (no dummy city imports in layout)
- **Video/clinic booking** — sends `patientPhone` to API

### Phase 9 verification checklist

- [ ] Book appointment with phone → doctor appointments include `patientPhone`
- [ ] Doctor patients page shows phone numbers
- [ ] Doctor issues prescription → appears in prescriptions list
- [ ] Portal sub-pages show loading/error UI on API failure
- [ ] `ng build` passes

## Phase 10 — Cleanup, patient prescriptions & consultation type

### Backend

| Route | Purpose |
|-------|---------|
| `GET /prescriptions/me` | Patient prescription list (PATIENT role) |
| `POST /appointments` | `consultationType`: `video` \| `clinic` |
| Appointment responses | `doctorName`, `consultationType` |

### Frontend

- Removed all `dummy-*.data.ts` files
- `/my-prescriptions` — patient prescription view
- My Appointments — doctor name, type badge, video join only for video
- Booking modals pass `consultationType`
- Nav: “My Prescriptions” for patients

### Phase 10 verification checklist

- [ ] Video vs clinic booking stores correct `consultationType`
- [ ] Patient sees doctor name on appointments
- [ ] Patient sees prescriptions at `/my-prescriptions`
- [ ] `ng build` passes

## Next phase

Production hardening: E2E tests, error monitoring, environment config review.

## Phase 7 — Uploads, notifications, video & admin

### Services

| Service | Endpoint | Purpose |
|---------|----------|---------|
| `UploadsApiService` | `POST /uploads` | Multipart file upload (auth required) |
| `NotificationsApiService` | `GET /notifications/me` | User notification inbox |
| `NotificationsApiService` | `PATCH /notifications/:id/read` | Mark notification read |
| `AdminApiService` | `GET /admin/dashboard/stats` | Dashboard aggregates |
| `AdminApiService` | `GET /admin/users` | User management list |
| `AdminApiService` | `PATCH /admin/users/:id/status` | Activate/deactivate user |
| `DoctorApplicationsAdminApiService` | `GET /admin/doctor-applications` | Review doctor signups |
| `DoctorApplicationsAdminApiService` | `PATCH /admin/doctor-applications/:id/approve` | Approve application |
| `DoctorApplicationsAdminApiService` | `PATCH /admin/doctor-applications/:id/reject` | Reject with reason |

### Wired UI

- **Prescription upload** — medicine checkout uploads files via API, then passes `prescriptionUrls` to `POST /medicines/orders`
- **Notification bell** — public layout header (authenticated users)
- **Video room** — `/consultation/:roomRef` with Jitsi Meet embed; patient “Join video call” on `/my-appointments`; doctor “Start Call” on `/doctor/consultations` (live appointments API)
- **Admin area** — `/admin/dashboard`, `/admin/users`, `/admin/doctor-applications` (ADMIN / SUPER_ADMIN)

### Notes

- Upload URLs are resolved to absolute URLs (`resolveAssetUrl`) for API validators expecting full URLs.
- Video uses booking reference (`VC-…`) as the Jitsi room name — demo integration; swap provider in production.
- Doctor register uploads via `POST /uploads/application` then submits `POST /doctor-applications` (Phase 8).

### Phase 7 verification checklist

- [ ] Patient login → upload prescription at checkout → order places with Rx items
- [ ] Notification bell loads after booking/appointment events (backend creates notifications)
- [ ] Confirmed appointment → patient/doctor can open `/consultation/{bookingRef}`
- [ ] Admin login (`admin@carehub.test`) → dashboard stats, user list, approve/reject doctor application
- [ ] `ng build` passes

## Phase 6 — Hospitals, labs, surgery & medicines

### Services

| Service | Endpoint | Purpose |
|---------|----------|---------|
| `HospitalsApiService` | `GET /hospitals/public` | Hospital listings by city |
| `HospitalsApiService` | `GET /hospitals/public/:citySlug/:slug` | Hospital detail |
| `LabsApiService` | `GET /labs/public` | Lab listings |
| `LabsApiService` | `GET /labs/public/:id/tests` | Lab test catalog |
| `LabsApiService` | `POST /lab-bookings` | Book lab test (guest or patient) |
| `MedicinesApiService` | `GET /medicines/public` | Medicine catalog (grouped by pharmacy in UI) |
| `MedicinesApiService` | `POST /medicines/orders` | Place medicine order |
| `MedicinesApiService` | `GET /medicines/orders/me` | Patient order history |
| `MedicinesApiService` | `GET /medicines/orders/:id` | Order detail |
| `SurgeriesApiService` | `GET /surgeries/public/procedures` | Surgery procedure catalog |
| `SurgeriesApiService` | `POST /surgeries/consultation-requests` | Surgery consultation request |

### Wired UI

- Hospital city & detail pages → live API
- Lab city & detail pages → live API; booking modal → `POST /lab-bookings`
- Medicine city & pharmacy detail → live API; checkout → `POST /medicines/orders`; orders → API
- Surgery city & hospital detail → live API; booking modal → consultation request API
- Nav city dropdowns still use static city lists from dummy data files (labels only)

### Notes

- Pharmacies are derived by grouping `medicines/public` results (no separate public pharmacies endpoint).
- Lab routes use slug in URL; tests API uses MongoDB lab id (resolved via city listing).
- Prescription medicine orders require `prescriptionUrls` on the API — file upload deferred to Phase 7; checkout blocks Rx items with a clear message.
- Surgery procedures may show empty if seed data has no procedures linked to hospitals.

### Phase 6 verification checklist

- [ ] `/hospitals/lahore` lists seeded hospitals from API
- [ ] Hospital detail shows doctors and facilities from API
- [ ] `/labs/lahore` lists labs; lab detail shows tests from API
- [ ] Lab test booking modal submits to `POST /lab-bookings` with success toast
- [ ] `/medicines/lahore` shows pharmacies derived from medicines API
- [ ] Patient checkout places order via API (non-prescription items); cart clears on success
- [ ] `/medicines/orders` loads from `GET /medicines/orders/me` (login required)
- [ ] Surgery hospital detail loads procedures; consultation modal submits to API
- [ ] `ng build` passes

## Phase 5 — Appointments

### Services

| Service | Endpoint | Purpose |
|---------|----------|---------|
| `AppointmentsApiService` | `POST /appointments` | Book appointment (guest or patient) |
| `AppointmentsApiService` | `GET /appointments/me` | Patient appointment list |
| `AppointmentsApiService` | `PATCH /appointments/:id/cancel` | Patient cancel |
| `AppointmentsApiService` | `GET /doctor/appointments` | Doctor appointment list |
| `AppointmentsApiService` | `PATCH /doctor/appointments/:id/confirm` | Doctor accept |
| `AppointmentsApiService` | `PATCH /doctor/appointments/:id/reject` | Doctor reject |
| `AppointmentsApiService` | `PATCH /doctor/appointments/:id/complete` | Doctor complete |

### Wired UI

- Video & clinic booking modals → `POST /appointments`
- `/my-appointments` — patient list + cancel (PATIENT role, auth required)
- `/doctor/appointments` — live list + confirm/reject/complete (replaces localStorage demo data)

Guest bookings require `patientName` + `patientEmail`. Logged-in patients use JWT identity automatically.

### Phase 5 verification checklist

- [ ] Book video/clinic appointment from doctor profile → success toast with booking ref
- [ ] Guest booking without email → validation error
- [ ] Patient login → `/my-appointments` shows booked appointments
- [ ] Patient can cancel pending/confirmed appointments
- [ ] Doctor login → `/doctor/appointments` shows bookings
- [ ] Doctor can Accept / Reject (pending) and Mark Complete (confirmed)
- [ ] `ng build` passes

## Phase 4 — Doctors & reviews

### Services

| Service | Endpoint | Purpose |
|---------|----------|---------|
| `PublicDoctorApiService` | `GET /doctors/public/search` | Paginated doctor search |
| `PublicDoctorApiService` | `GET /doctors/public/:id` | Doctor public profile |
| `DoctorReviewsApiService` | `GET /doctors/:doctorId/reviews` | Paginated patient reviews |

Search and detail pages use **live API only** — dummy doctor fallback removed from find-doctors and doctor-detail.

Booking modals build a minimal profile from the listing card if the detail request fails (no fake doctor IDs).

### Phase 4 verification checklist

- [ ] `GET /doctors/public/search?city=Lahore` returns seeded doctors with `user`, `specialties`, `averageRating`
- [ ] `/find-doctors/dermatology?city=Lahore` lists Dr. Sana Malik (title match)
- [ ] Doctor profile `/doctors/:id` loads from API; invalid ID shows "Doctor not found"
- [ ] Reviews section loads from `GET /doctors/:id/reviews` (empty state if none seeded)
- [ ] Listing cards show API `averageRating` and `reviewCount`
- [ ] `ng build` passes
