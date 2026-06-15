import { Component, inject, OnInit } from '@angular/core';
import { LabService } from '../../services/lab.service';

@Component({
  selector: 'app-lab-dashboard-page',
  standalone: true,
  template: `
    <div class="space-y-6">
      <h1 class="text-2xl font-bold">Lab Dashboard</h1>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-xl border p-6"><p class="text-sm text-gray-500">Labs</p><p class="text-3xl font-bold text-teal-600 mt-2">{{ labService.labs().length }}</p></div>
        <div class="bg-white rounded-xl border p-6"><p class="text-sm text-gray-500">Tests</p><p class="text-3xl font-bold text-blue-600 mt-2">{{ labService.tests().length }}</p></div>
        <div class="bg-white rounded-xl border p-6"><p class="text-sm text-gray-500">Pending bookings</p><p class="text-3xl font-bold text-amber-600 mt-2">{{ pending() }}</p></div>
        <div class="bg-white rounded-xl border p-6"><p class="text-sm text-gray-500">Home collections</p><p class="text-3xl font-bold text-purple-600 mt-2">{{ homeCollections() }}</p></div>
      </div>
    </div>
  `,
})
export class LabDashboardPageComponent implements OnInit {
  protected readonly labService = inject(LabService);
  ngOnInit(): void {
    this.labService.loadLabs({ limit: 5 });
    this.labService.loadTests({ limit: 5 });
    this.labService.loadBookings({ status: 'PENDING', limit: 50 });
  }
  pending(): number { return this.labService.bookings().filter((b) => b.status === 'PENDING').length; }
  homeCollections(): number { return this.labService.bookings().filter((b) => b.collectionType === 'HOME_COLLECTION').length; }
}
