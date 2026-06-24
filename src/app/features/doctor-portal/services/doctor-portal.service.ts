import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  AppointmentStatus,
  ConsultationStats,
  DoctorAppointment,
  DoctorApplicationStatus,
  DoctorPatientRecord,
  DoctorPortalProfile,
  DoctorPrescription,
  DoctorRegistrationApplication,
  DoctorRegistrationPayload,
  EarningsSummary,
} from '../models/doctor-portal.model';

const APPLICATIONS_KEY = 'carehub_doctor_applications';
const SESSION_KEY = 'carehub_doctor_session';
const APPOINTMENTS_KEY = 'carehub_doctor_appointments';
const PATIENTS_KEY = 'carehub_doctor_patients';
const PRESCRIPTIONS_KEY = 'carehub_doctor_prescriptions';

const DEMO_DOCTOR_ID = 'doc-demo-001';
const DEMO_APPLICATION_ID = 'app-demo-001';

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

@Injectable({ providedIn: 'root' })
export class DoctorPortalService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly applications = signal<DoctorRegistrationApplication[]>(this.loadApplications());
  private readonly sessionDoctorId = signal<string | null>(this.loadSession());
  private readonly appointments = signal<DoctorAppointment[]>(this.loadAppointments());
  private readonly patients = signal<DoctorPatientRecord[]>(this.loadPatients());
  private readonly prescriptions = signal<DoctorPrescription[]>(this.loadPrescriptions());

  readonly allApplications = this.applications.asReadonly();
  readonly currentDoctorId = this.sessionDoctorId.asReadonly();

  readonly isLoggedIn = computed(() => !!this.sessionDoctorId());

  readonly currentProfile = computed<DoctorPortalProfile | null>(() => {
    const id = this.sessionDoctorId();
    if (!id) return null;
    return this.profileForDoctorId(id);
  });

  readonly myAppointments = computed(() =>
    this.appointments().filter((a) => a.doctorId === this.sessionDoctorId()),
  );

  readonly pendingAppointments = computed(() =>
    this.myAppointments().filter((a) => a.status === 'pending'),
  );

  readonly myPatients = computed(() =>
    this.patients().filter((p) => p.doctorId === this.sessionDoctorId()),
  );

  readonly myPrescriptions = computed(() =>
    this.prescriptions().filter((p) => p.doctorId === this.sessionDoctorId()),
  );

  readonly stats = computed<ConsultationStats>(() => {
    const appts = this.myAppointments();
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const completed = appts.filter((a) => a.status === 'completed');
    const completedThisMonth = completed.filter((a) => {
      const d = new Date(a.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });

    return {
      totalConsultations: completed.length,
      videoConsultations: completed.filter((a) => a.type === 'video').length,
      clinicVisits: completed.filter((a) => a.type === 'clinic').length,
      completedThisMonth: completedThisMonth.length,
      pendingAppointments: appts.filter((a) => a.status === 'pending').length,
      averageRating: 4.8,
      totalReviews: 127,
    };
  });

  readonly earnings = computed<EarningsSummary>(() => {
    const appts = this.myAppointments().filter((a) => a.status === 'completed');
    const now = new Date();
    const thisMonth = now.getMonth();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const thisYear = thisMonth === 0 ? now.getFullYear() - 1 : now.getFullYear();
    const lastMonthYear = thisMonth === 0 ? now.getFullYear() - 1 : now.getFullYear();

    const total = appts.reduce((s, a) => s + a.fee, 0);
    const monthTotal = appts
      .filter((a) => {
        const d = new Date(a.date);
        return d.getMonth() === thisMonth && d.getFullYear() === now.getFullYear();
      })
      .reduce((s, a) => s + a.fee, 0);
    const lastMonthTotal = appts
      .filter((a) => {
        const d = new Date(a.date);
        return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
      })
      .reduce((s, a) => s + a.fee, 0);
    const pending = this.myAppointments()
      .filter((a) => a.status === 'accepted')
      .reduce((s, a) => s + a.fee, 0);

    const recent = appts
      .slice(-5)
      .reverse()
      .map((a) => ({
        id: a.id,
        date: a.date,
        patientName: a.patientName,
        type: a.type,
        amount: a.fee,
        status: 'paid' as const,
      }));

    return {
      totalEarnings: total,
      thisMonth: monthTotal,
      lastMonth: lastMonthTotal,
      pendingPayout: pending,
      currency: 'PKR',
      recentTransactions: recent,
    };
  });

  constructor() {
    this.seedDemoData();
  }

  submitApplication(payload: DoctorRegistrationPayload): DoctorRegistrationApplication {
    const application: DoctorRegistrationApplication = {
      id: generateId('app'),
      ...payload,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    this.applications.update((list) => [...list, application]);
    this.persistApplications();

    if (this.isBrowser) {
      console.group('Doctor Registration Submitted');
      console.log(JSON.stringify(application, null, 2));
      console.groupEnd();
    }

    return application;
  }

  getApplication(id: string): DoctorRegistrationApplication | undefined {
    return this.applications().find((a) => a.id === id);
  }

  getApplicationByEmail(email: string): DoctorRegistrationApplication | undefined {
    return this.applications().find((a) => a.email.toLowerCase() === email.toLowerCase());
  }

  login(email: string, password: string): { success: boolean; message: string } {
    const app = this.getApplicationByEmail(email);
    if (!app) {
      return { success: false, message: 'No doctor account found with this email.' };
    }
    if (app.password !== password) {
      return { success: false, message: 'Invalid password.' };
    }
    if (app.status === 'pending') {
      return { success: false, message: 'Your application is still under admin review.' };
    }
    if (app.status === 'rejected') {
      return { success: false, message: app.reviewNotes ?? 'Your application was not approved.' };
    }

    const profile = this.profileForApplication(app);
    this.sessionDoctorId.set(profile.id);
    this.persistSession();
    return { success: true, message: 'Welcome back, Dr. ' + app.fullName.split(' ')[0] };
  }

  logout(): void {
    this.sessionDoctorId.set(null);
    this.persistSession();
  }

  updateProfile(updates: Partial<DoctorPortalProfile>): void {
    const profile = this.currentProfile();
    if (!profile) return;

    const app = this.applications().find((a) => a.id === profile.applicationId);
    if (!app) return;

    const updatedApp: DoctorRegistrationApplication = {
      ...app,
      fullName: updates.fullName ?? app.fullName,
      phone: updates.phone ?? app.phone,
      specialization: updates.specialization ?? app.specialization,
      qualifications: updates.qualifications ?? app.qualifications,
      yearsOfExperience: updates.yearsOfExperience ?? app.yearsOfExperience,
      clinic: updates.clinic ?? app.clinic,
      consultationFee: updates.consultationFee ?? app.consultationFee,
      videoConsultationFee: updates.videoConsultationFee ?? app.videoConsultationFee,
      availability: updates.availability ?? app.availability,
      bio: updates.bio ?? app.bio,
    };

    this.applications.update((list) =>
      list.map((a) => (a.id === app.id ? updatedApp : a)),
    );
    this.persistApplications();
  }

  setAvailability(slots: DoctorPortalProfile['availability']): void {
    this.updateProfile({ availability: slots });
  }

  updateAppointmentStatus(appointmentId: string, status: AppointmentStatus): void {
    this.appointments.update((list) =>
      list.map((a) => (a.id === appointmentId ? { ...a, status } : a)),
    );
    this.persistAppointments();
  }

  createPrescription(
    patientId: string,
    diagnosis: string,
    medicines: DoctorPrescription['medicines'],
    notes?: string,
  ): DoctorPrescription {
    const doctorId = this.sessionDoctorId()!;
    const patient = this.patients().find((p) => p.id === patientId);
    const rx: DoctorPrescription = {
      id: generateId('rx'),
      doctorId,
      patientId,
      patientName: patient?.name ?? 'Unknown',
      diagnosis,
      medicines,
      notes,
      createdAt: new Date().toISOString(),
    };
    this.prescriptions.update((list) => [...list, rx]);
    this.persistPrescriptions();

    if (this.isBrowser) {
      console.group('Prescription Created');
      console.log(JSON.stringify(rx, null, 2));
      console.groupEnd();
    }

    return rx;
  }

  formatCurrency(amount: number): string {
    return `Rs. ${amount.toLocaleString('en-PK')}`;
  }

  private profileForDoctorId(doctorId: string): DoctorPortalProfile | null {
    if (doctorId === DEMO_DOCTOR_ID) {
      const app = this.applications().find((a) => a.id === DEMO_APPLICATION_ID);
      if (app) return this.profileForApplication(app, DEMO_DOCTOR_ID);
    }
    const app = this.applications().find(
      (a) => a.status === 'approved' && `doc-${a.id}` === doctorId,
    );
    if (!app) return null;
    return this.profileForApplication(app, doctorId);
  }

  private profileForApplication(
    app: DoctorRegistrationApplication,
    doctorId?: string,
  ): DoctorPortalProfile {
    return {
      id: doctorId ?? `doc-${app.id}`,
      applicationId: app.id,
      fullName: app.fullName,
      email: app.email,
      phone: app.phone,
      specialization: app.specialization,
      qualifications: app.qualifications,
      yearsOfExperience: app.yearsOfExperience,
      clinic: app.clinic,
      consultationFee: app.consultationFee,
      videoConsultationFee: app.videoConsultationFee,
      availability: app.availability,
      profilePhotoUrl: app.documents.profilePhoto?.dataUrl,
      bio: app.bio ?? `Board-certified ${app.specialization} with ${app.yearsOfExperience}+ years of experience.`,
    };
  }

  private seedDemoData(): void {
    const apps = this.applications();
    const hasDemo = apps.some((a) => a.id === DEMO_APPLICATION_ID);
    if (!hasDemo) {
      const demoApp: DoctorRegistrationApplication = {
        id: DEMO_APPLICATION_ID,
        fullName: 'Dr. Ahmad Hassan',
        email: 'dr.ahmad@carehub.demo',
        phone: '03001234567',
        password: 'Doctor@123',
        specialization: 'Cardiologist',
        qualifications: [
          { degree: 'MBBS', institution: 'King Edward Medical University', year: 2010 },
          { degree: 'FCPS Cardiology', institution: 'College of Physicians & Surgeons Pakistan', year: 2016 },
        ],
        yearsOfExperience: 12,
        clinic: {
          name: 'CareHub Heart Clinic',
          address: '45 Main Boulevard, Gulberg III',
          city: 'Lahore',
          phone: '042-34500888',
        },
        consultationFee: 2500,
        videoConsultationFee: 2000,
        availability: [
          { day: 1, dayLabel: 'Monday', startTime: '10:00 AM', endTime: '02:00 PM' },
          { day: 3, dayLabel: 'Wednesday', startTime: '04:00 PM', endTime: '08:00 PM' },
          { day: 5, dayLabel: 'Friday', startTime: '10:00 AM', endTime: '01:00 PM' },
        ],
        documents: {},
        status: 'approved',
        submittedAt: '2025-01-15T10:00:00.000Z',
        reviewedAt: '2025-01-16T14:00:00.000Z',
      };
      this.applications.update((list) => [...list, demoApp]);
      this.persistApplications();
    }

    const appts = this.appointments();
    if (!appts.some((a) => a.doctorId === DEMO_DOCTOR_ID)) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const demoAppts: DoctorAppointment[] = [
        {
          id: 'apt-001',
          doctorId: DEMO_DOCTOR_ID,
          patientName: 'Sara Khan',
          patientPhone: '03009876543',
          patientAge: 34,
          patientGender: 'Female',
          type: 'video',
          date: tomorrow.toISOString().split('T')[0],
          timeSlot: '05:00 PM',
          status: 'pending',
          notes: 'Chest pain and shortness of breath',
          fee: 2000,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'apt-002',
          doctorId: DEMO_DOCTOR_ID,
          patientName: 'Ali Raza',
          patientPhone: '03001112233',
          patientAge: 45,
          patientGender: 'Male',
          type: 'clinic',
          date: today.toISOString().split('T')[0],
          timeSlot: '11:00 AM',
          status: 'accepted',
          fee: 2500,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'apt-003',
          doctorId: DEMO_DOCTOR_ID,
          patientName: 'Fatima Noor',
          patientPhone: '03004445566',
          patientAge: 28,
          patientGender: 'Female',
          type: 'video',
          date: '2025-06-10',
          timeSlot: '06:30 PM',
          status: 'completed',
          fee: 2000,
          createdAt: '2025-06-09T10:00:00.000Z',
        },
      ];
      this.appointments.update((list) => [...list, ...demoAppts]);
      this.persistAppointments();
    }

    const pts = this.patients();
    if (!pts.some((p) => p.doctorId === DEMO_DOCTOR_ID)) {
      const demoPatients: DoctorPatientRecord[] = [
        {
          id: 'pat-001',
          doctorId: DEMO_DOCTOR_ID,
          name: 'Fatima Noor',
          age: 28,
          gender: 'Female',
          phone: '03004445566',
          lastVisit: '2025-06-10',
          conditions: ['Hypertension', 'Anxiety'],
          visitCount: 3,
        },
        {
          id: 'pat-002',
          doctorId: DEMO_DOCTOR_ID,
          name: 'Usman Tariq',
          age: 52,
          gender: 'Male',
          phone: '03007778899',
          lastVisit: '2025-06-05',
          conditions: ['Coronary artery disease'],
          visitCount: 7,
        },
        {
          id: 'pat-003',
          doctorId: DEMO_DOCTOR_ID,
          name: 'Ayesha Malik',
          age: 38,
          gender: 'Female',
          phone: '03003334455',
          lastVisit: '2025-05-28',
          conditions: ['Arrhythmia'],
          visitCount: 2,
        },
      ];
      this.patients.update((list) => [...list, ...demoPatients]);
      this.persistPatients();
    }
  }

  private loadApplications(): DoctorRegistrationApplication[] {
    return this.loadJson(APPLICATIONS_KEY, []);
  }

  private loadAppointments(): DoctorAppointment[] {
    return this.loadJson(APPOINTMENTS_KEY, []);
  }

  private loadPatients(): DoctorPatientRecord[] {
    return this.loadJson(PATIENTS_KEY, []);
  }

  private loadPrescriptions(): DoctorPrescription[] {
    return this.loadJson(PRESCRIPTIONS_KEY, []);
  }

  private loadSession(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(SESSION_KEY);
  }

  private persistApplications(): void {
    this.persistJson(APPLICATIONS_KEY, this.applications());
  }

  private persistAppointments(): void {
    this.persistJson(APPOINTMENTS_KEY, this.appointments());
  }

  private persistPatients(): void {
    this.persistJson(PATIENTS_KEY, this.patients());
  }

  private persistPrescriptions(): void {
    this.persistJson(PRESCRIPTIONS_KEY, this.prescriptions());
  }

  private persistSession(): void {
    if (!this.isBrowser) return;
    const id = this.sessionDoctorId();
    if (id) localStorage.setItem(SESSION_KEY, id);
    else localStorage.removeItem(SESSION_KEY);
  }

  private loadJson<T>(key: string, fallback: T): T {
    if (!this.isBrowser) return fallback;
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  }

  private persistJson(key: string, data: unknown): void {
    if (!this.isBrowser) return;
    localStorage.setItem(key, JSON.stringify(data));
  }
}
