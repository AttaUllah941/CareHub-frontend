import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { authReducer } from './features/auth/store/auth.reducer';
import { AuthEffects } from './features/auth/store/auth.effects';
import { AUTH_FEATURE_KEY } from './features/auth/store/auth.state';
import { usersReducer } from './features/users/store/users.reducer';
import { UsersEffects } from './features/users/store/users.effects';
import { USERS_FEATURE_KEY } from './features/users/store/users.state';
import { rolesReducer } from './features/roles/store/roles.reducer';
import { RolesEffects } from './features/roles/store/roles.effects';
import { ROLES_FEATURE_KEY } from './features/roles/store/roles.state';
import { medicalSpecialtiesReducer } from './features/medical-specialties/store/medical-specialties.reducer';
import { MedicalSpecialtiesEffects } from './features/medical-specialties/store/medical-specialties.effects';
import { MEDICAL_SPECIALTIES_FEATURE_KEY } from './features/medical-specialties/store/medical-specialties.state';
import { languagesReducer } from './features/languages/store/languages.reducer';
import { LanguagesEffects } from './features/languages/store/languages.effects';
import { LANGUAGES_FEATURE_KEY } from './features/languages/store/languages.state';
import { doctorsReducer } from './features/doctors/store/doctors.reducer';
import { DoctorsEffects } from './features/doctors/store/doctors.effects';
import { DOCTORS_FEATURE_KEY } from './features/doctors/store/doctors.state';
import { doctorAvailabilityReducer } from './features/doctor-availability/store/doctor-availability.reducer';
import { DoctorAvailabilityEffects } from './features/doctor-availability/store/doctor-availability.effects';
import { DOCTOR_AVAILABILITY_FEATURE_KEY } from './features/doctor-availability/store/doctor-availability.state';
import { clinicsReducer } from './features/clinics/store/clinics.reducer';
import { ClinicsEffects } from './features/clinics/store/clinics.effects';
import { CLINICS_FEATURE_KEY } from './features/clinics/store/clinics.state';
import { patientsReducer } from './features/patients/store/patients.reducer';
import { PatientsEffects } from './features/patients/store/patients.effects';
import { PATIENTS_FEATURE_KEY } from './features/patients/store/patients.state';
import { familyMembersReducer } from './features/family-members/store/family-members.reducer';
import { FamilyMembersEffects } from './features/family-members/store/family-members.effects';
import { FAMILY_MEMBERS_FEATURE_KEY } from './features/family-members/store/family-members.state';
import { appointmentsReducer } from './features/appointments/store/appointments.reducer';
import { AppointmentsEffects } from './features/appointments/store/appointments.effects';
import { APPOINTMENTS_FEATURE_KEY } from './features/appointments/store/appointments.state';
import { consultationsReducer } from './features/consultations/store/consultations.reducer';
import { ConsultationsEffects } from './features/consultations/store/consultations.effects';
import { CONSULTATIONS_FEATURE_KEY } from './features/consultations/store/consultations.state';
import { prescriptionsReducer } from './features/prescriptions/store/prescriptions.reducer';
import { PrescriptionsEffects } from './features/prescriptions/store/prescriptions.effects';
import { PRESCRIPTIONS_FEATURE_KEY } from './features/prescriptions/store/prescriptions.state';
import { medicalRecordsReducer } from './features/medical-records/store/medical-records.reducer';
import { MedicalRecordsEffects } from './features/medical-records/store/medical-records.effects';
import { MEDICAL_RECORDS_FEATURE_KEY } from './features/medical-records/store/medical-records.state';
import { reviewsReducer } from './features/reviews/store/reviews.reducer';
import { ReviewsEffects } from './features/reviews/store/reviews.effects';
import { REVIEWS_FEATURE_KEY } from './features/reviews/store/reviews.state';
import { notificationsReducer } from './features/notifications/store/notifications.reducer';
import { NotificationsEffects } from './features/notifications/store/notifications.effects';
import { NOTIFICATIONS_FEATURE_KEY } from './features/notifications/store/notifications.state';
import { paymentsReducer } from './features/payments/store/payments.reducer';
import { PaymentsEffects } from './features/payments/store/payments.effects';
import { PAYMENTS_FEATURE_KEY } from './features/payments/store/payments.state';
import { dashboardReducer } from './features/dashboard/store/dashboard.reducer';
import { DashboardEffects } from './features/dashboard/store/dashboard.effects';
import { DASHBOARD_FEATURE_KEY } from './features/dashboard/store/dashboard.state';
import { reportsReducer } from './features/reports/store/reports.reducer';
import { ReportsEffects } from './features/reports/store/reports.effects';
import { REPORTS_FEATURE_KEY } from './features/reports/store/reports.state';
import { pharmacyReducer } from './features/pharmacy/store/pharmacy.reducer';
import { PharmacyEffects } from './features/pharmacy/store/pharmacy.effects';
import { PHARMACY_FEATURE_KEY } from './features/pharmacy/store/pharmacy.state';
import { labReducer } from './features/lab/store/lab.reducer';
import { LabEffects } from './features/lab/store/lab.effects';
import { LAB_FEATURE_KEY } from './features/lab/store/lab.state';
import { chatReducer } from './features/chat/store/chat.reducer';
import { ChatEffects } from './features/chat/store/chat.effects';
import { CHAT_FEATURE_KEY } from './features/chat/store/chat.state';
import { analyticsReducer } from './features/analytics/store/analytics.reducer';
import { AnalyticsEffects } from './features/analytics/store/analytics.effects';
import { ANALYTICS_FEATURE_KEY } from './features/analytics/store/analytics.state';
import { auditLogReducer } from './features/audit-logs/store/audit-log.reducer';
import { AuditLogEffects } from './features/audit-logs/store/audit-log.effects';
import { AUDIT_LOG_FEATURE_KEY } from './features/audit-logs/store/audit-log.state';
import { settingsReducer } from './features/settings/store/settings.reducer';
import { SettingsEffects } from './features/settings/store/settings.effects';
import { SETTINGS_FEATURE_KEY } from './features/settings/store/settings.state';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor, errorInterceptor])),
    provideStore({
      [AUTH_FEATURE_KEY]: authReducer,
      [USERS_FEATURE_KEY]: usersReducer,
      [ROLES_FEATURE_KEY]: rolesReducer,
      [MEDICAL_SPECIALTIES_FEATURE_KEY]: medicalSpecialtiesReducer,
      [LANGUAGES_FEATURE_KEY]: languagesReducer,
      [DOCTORS_FEATURE_KEY]: doctorsReducer,
      [DOCTOR_AVAILABILITY_FEATURE_KEY]: doctorAvailabilityReducer,
      [CLINICS_FEATURE_KEY]: clinicsReducer,
      [PATIENTS_FEATURE_KEY]: patientsReducer,
      [FAMILY_MEMBERS_FEATURE_KEY]: familyMembersReducer,
      [APPOINTMENTS_FEATURE_KEY]: appointmentsReducer,
      [CONSULTATIONS_FEATURE_KEY]: consultationsReducer,
      [PRESCRIPTIONS_FEATURE_KEY]: prescriptionsReducer,
      [MEDICAL_RECORDS_FEATURE_KEY]: medicalRecordsReducer,
      [REVIEWS_FEATURE_KEY]: reviewsReducer,
      [NOTIFICATIONS_FEATURE_KEY]: notificationsReducer,
      [PAYMENTS_FEATURE_KEY]: paymentsReducer,
      [DASHBOARD_FEATURE_KEY]: dashboardReducer,
      [REPORTS_FEATURE_KEY]: reportsReducer,
      [PHARMACY_FEATURE_KEY]: pharmacyReducer,
      [LAB_FEATURE_KEY]: labReducer,
      [CHAT_FEATURE_KEY]: chatReducer,
      [ANALYTICS_FEATURE_KEY]: analyticsReducer,
      [AUDIT_LOG_FEATURE_KEY]: auditLogReducer,
      [SETTINGS_FEATURE_KEY]: settingsReducer,
    }),
    provideEffects([
      AuthEffects,
      UsersEffects,
      RolesEffects,
      MedicalSpecialtiesEffects,
      LanguagesEffects,
      DoctorsEffects,
      DoctorAvailabilityEffects,
      ClinicsEffects,
      PatientsEffects,
      FamilyMembersEffects,
      AppointmentsEffects,
      ConsultationsEffects,
      PrescriptionsEffects,
      MedicalRecordsEffects,
      ReviewsEffects,
      NotificationsEffects,
      PaymentsEffects,
      DashboardEffects,
      ReportsEffects,
      PharmacyEffects,
      LabEffects,
      ChatEffects,
      AnalyticsEffects,
      AuditLogEffects,
      SettingsEffects,
    ]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};
