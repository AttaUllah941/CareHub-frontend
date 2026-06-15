import { Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LabService } from '../../services/lab.service';
import { LabApiService } from '../../services/lab-api.service';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-patient-lab-reports-page',
  standalone: true,
  imports: [AlertComponent, DatePipe],
  template: `
    <div class="space-y-6">
      <h1 class="text-2xl font-bold">My Lab Reports</h1>
      @if (labService.error()) { <app-alert [message]="labService.error()!" variant="error" /> }
      <div class="bg-white border rounded-xl overflow-x-auto">
        <table class="min-w-full divide-y">
          <thead class="bg-gray-50"><tr>
            <th class="px-4 py-3 text-left text-xs uppercase text-gray-500">Title</th>
            <th class="px-4 py-3 text-left text-xs uppercase text-gray-500">File</th>
            <th class="px-4 py-3 text-left text-xs uppercase text-gray-500">Status</th>
            <th class="px-4 py-3 text-left text-xs uppercase text-gray-500">Date</th>
            <th class="px-4 py-3 text-right text-xs uppercase text-gray-500">Download</th>
          </tr></thead>
          <tbody class="divide-y">
            @for (r of labService.myReports(); track r.id) {
              <tr>
                <td class="px-4 py-3 text-sm font-medium">{{ r.title }}</td>
                <td class="px-4 py-3 text-sm text-gray-600">{{ r.originalFileName }}</td>
                <td class="px-4 py-3 text-sm">{{ r.status }}</td>
                <td class="px-4 py-3 text-sm text-gray-500">{{ r.createdAt | date: 'medium' }}</td>
                <td class="px-4 py-3 text-sm text-right">
                  <button type="button" (click)="download(r.id, r.originalFileName)" class="text-teal-600 hover:text-teal-800">Download</button>
                </td>
              </tr>
            } @empty { <tr><td colspan="5" class="px-4 py-8 text-center text-sm text-gray-500">No reports yet</td></tr> }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class PatientLabReportsPageComponent implements OnInit {
  protected readonly labService = inject(LabService);
  private readonly api = inject(LabApiService);
  ngOnInit(): void { this.labService.loadMyReports(); }
  download(id: string, fileName: string): void {
    this.api.downloadReport(id).subscribe((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = fileName; a.click();
      URL.revokeObjectURL(url);
    });
  }
}
