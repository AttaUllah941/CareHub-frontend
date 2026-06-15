import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FamilyMemberService } from '../../services/family-member.service';
import { FamilyMemberFormComponent } from '../../components/family-member-form/family-member-form.component';
import { FamilyMemberTableComponent } from '../../components/family-member-table/family-member-table.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { FamilyMember, FamilyRelationship, CreateFamilyMemberRequest } from '../../../../core/models/family-member.model';

@Component({
  selector: 'app-family-members-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    FamilyMemberFormComponent,
    FamilyMemberTableComponent,
    ButtonComponent,
    AlertComponent,
  ],
  templateUrl: './family-members-page.component.html',
  styleUrl: './family-members-page.component.scss',
})
export class FamilyMembersPageComponent implements OnInit {
  protected readonly familyMemberService = inject(FamilyMemberService);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);

  readonly patientMode = signal(true);
  readonly adminPatientId = signal<string | null>(null);
  readonly showForm = signal(false);
  readonly editingId = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    relationship: ['CHILD' as FamilyRelationship, Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    gender: ['' as '' | 'MALE' | 'FEMALE' | 'OTHER'],
    dateOfBirth: [''],
    phone: [''],
    email: ['', Validators.email],
    notes: [''],
  });

  constructor() {
    effect(() => {
      if (this.familyMemberService.successMessage()) {
        this.showForm.set(false);
        this.editingId.set(null);
        this.resetForm();
      }
    });
  }

  ngOnInit(): void {
    const patientId = this.route.snapshot.paramMap.get('id');
    this.familyMemberService.clearError();
    this.familyMemberService.clearSuccessMessage();

    if (patientId) {
      this.patientMode.set(false);
      this.adminPatientId.set(patientId);
      this.familyMemberService.loadByPatient(patientId);
    } else {
      this.familyMemberService.loadMyFamilyMembers();
    }
  }

  startAdd(): void {
    this.editingId.set(null);
    this.resetForm();
    this.showForm.set(true);
  }

  startEdit(member: FamilyMember): void {
    this.editingId.set(member.id);
    this.form.patchValue({
      relationship: member.relationship,
      firstName: member.firstName,
      lastName: member.lastName,
      gender: member.gender ?? '',
      dateOfBirth: member.dateOfBirth ? member.dateOfBirth.slice(0, 10) : '',
      phone: member.phone ?? '',
      email: member.email ?? '',
      notes: member.notes ?? '',
    });
    this.showForm.set(true);
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const raw = this.form.getRawValue();
    const clean: CreateFamilyMemberRequest = {
      relationship: raw.relationship,
      firstName: raw.firstName,
      lastName: raw.lastName,
      gender: raw.gender || undefined,
      dateOfBirth: raw.dateOfBirth || undefined,
      phone: raw.phone || undefined,
      email: raw.email || undefined,
      notes: raw.notes || undefined,
    };

    const id = this.editingId();
    if (id) {
      this.familyMemberService.updateFamilyMember(id, clean, this.patientMode());
    } else if (this.adminPatientId()) {
      this.familyMemberService.createFamilyMember(
        { ...clean, patientProfileId: this.adminPatientId()! },
        false,
      );
    } else {
      this.familyMemberService.createFamilyMember(clean, true);
    }
  }

  onDelete(id: string): void {
    if (confirm('Remove this family member?')) {
      this.familyMemberService.deleteFamilyMember(id, this.patientMode());
    }
  }

  cancelForm(): void {
    this.showForm.set(false);
    this.editingId.set(null);
    this.resetForm();
  }

  private resetForm(): void {
    this.form.reset({
      relationship: 'CHILD' as FamilyRelationship,
      firstName: '',
      lastName: '',
      gender: '' as '' | 'MALE' | 'FEMALE' | 'OTHER',
      dateOfBirth: '',
      phone: '',
      email: '',
      notes: '',
    });
  }
}
