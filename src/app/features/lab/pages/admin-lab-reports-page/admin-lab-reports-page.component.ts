import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LabService } from '../../services/lab.service';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-admin-lab-reports-page',
  standalone: true,
  imports: [FormsModule, AlertComponent],
  template: `
    <div class="space-y-6">
      <h1 class="text-2xl font-bold">Upload Lab Reports</h1>
      @if (labService.error()) { <app-alert [message]="labService.error()!" variant="error" /> }
      @if (labService.successMessage()) { <app-alert [message]="labService.successMessage()!" variant="success" /> }
      <form class="bg-white border rounded-xl p-4 grid md:grid-cols-2 gap-4 max-w-2xl" (ngSubmit)="submit($event)">
        <select class="border rounded-lg px-3 py-2 text-sm" [(ngModel)]="labId" name="labId" required>
          <option value="">Select lab</option>
          @for (l of labService.labs(); track l.id) { <option [value]="l.id">{{ l.name }}</option> }
        </select>
        <input class="border rounded-lg px-3 py-2 text-sm" placeholder="Patient profile ID" [(ngModel)]="patientProfileId" name="patientProfileId" required />
        <input class="border rounded-lg px-3 py-2 text-sm" placeholder="Booking ID (optional)" [(ngModel)]="labBookingId" name="labBookingId" />
        <input class="border rounded-lg px-3 py-2 text-sm" placeholder="Report title" [(ngModel)]="title" name="title" />
        <input type="file" accept=".pdf,image/*" (change)="onFile($event)" class="md:col-span-2 text-sm" required />
        <button type="submit" class="md:col-span-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm" [disabled]="labService.saving()">Upload Report</button>
      </form>
      <div class="bg-white border rounded-xl overflow-x-auto">
        <table class="min-w-full divide-y">
          <thead class="bg-gray-50"><tr>
            <th class="px-4 py-3 text-left text-xs uppercase text-gray-500">Title</th>
            <th class="px-4 py-3 text-left text-xs uppercase text-gray-500">Patient</th>
            <th class="px-4 py-3 text-left text-xs uppercase text-gray-500">File</th>
            <th class="px-4 py-3 text-left text-xs uppercase text-gray-500">Status</th>
          </tr></thead>
          <tbody class="divide-y">
            @for (r of labService.reports(); track r.id) {
              <tr><td class="px-4 py-3 text-sm">{{ r.title }}</td><td class="px-4 py-3 text-sm">{{ r.patient?.user?.firstName }} {{ r.patient?.user?.lastName }}</td>
                <td class="px-4 py-3 text-sm">{{ r.originalFileName }}</td><td class="px-4 py-3 text-sm">{{ r.status }}</td></tr>
            } @empty { <tr><td colspan="4" class="px-4 py-8 text-center text-sm text-gray-500">No reports</td></tr> }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class AdminLabReportsPageComponent implements OnInit {
  protected readonly labService = inject(LabService);
  labId = ''; patientProfileId = ''; labBookingId = ''; title = 'Lab Report';
  private file: File | null = null;
  ngOnInit(): void { this.labService.loadLabs({ limit: 100 }); this.labService.loadReports({ limit: 50 }); }
  onFile(e: Event): void { this.file = (e.target as HTMLInputElement).files?.[0] ?? null; }
  submit(e: Event): void {
    e.preventDefault();
    if (!this.file || !this.labId || !this.patientProfileId) return;
    const fd = new FormData();
    fd.append('file', this.file);
    fd.append('labId', this.labId);
    fd.append('patientProfileId', this.patientProfileId);
    if (this.labBookingId) fd.append('labBookingId', this.labBookingId);
    fd.append('title', this.title);
    this.labService.uploadReport(fd);
  }
}
