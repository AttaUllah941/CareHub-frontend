import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LabService } from '../../services/lab.service';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-admin-lab-tests-page',
  standalone: true,
  imports: [FormsModule, AlertComponent],
  template: `
    <div class="space-y-6">
      <h1 class="text-2xl font-bold">Lab Tests</h1>
      @if (labService.error()) { <app-alert [message]="labService.error()!" variant="error" /> }
      <form class="bg-white border rounded-xl p-4 grid md:grid-cols-3 gap-4" (ngSubmit)="submit()">
        <select class="border rounded-lg px-3 py-2 text-sm" [(ngModel)]="labId" name="labId" required>
          <option value="">Select lab</option>
          @for (l of labService.labs(); track l.id) { <option [value]="l.id">{{ l.name }}</option> }
        </select>
        <input class="border rounded-lg px-3 py-2 text-sm" placeholder="Test name" [(ngModel)]="name" name="name" required />
        <input type="number" class="border rounded-lg px-3 py-2 text-sm" placeholder="Price" [(ngModel)]="price" name="price" required />
        <select class="border rounded-lg px-3 py-2 text-sm" [(ngModel)]="category" name="category">
          <option value="BLOOD">Blood</option><option value="URINE">Urine</option><option value="IMAGING">Imaging</option><option value="OTHER">Other</option>
        </select>
        <label class="flex items-center gap-2 text-sm"><input type="checkbox" [(ngModel)]="homeCollection" name="hc" /> Home collection</label>
        <button type="submit" class="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm">Add Test</button>
      </form>
      <div class="bg-white border rounded-xl overflow-x-auto">
        <table class="min-w-full divide-y">
          <thead class="bg-gray-50"><tr>
            <th class="px-4 py-3 text-left text-xs uppercase text-gray-500">Test</th>
            <th class="px-4 py-3 text-left text-xs uppercase text-gray-500">Lab</th>
            <th class="px-4 py-3 text-left text-xs uppercase text-gray-500">Category</th>
            <th class="px-4 py-3 text-left text-xs uppercase text-gray-500">Price</th>
          </tr></thead>
          <tbody class="divide-y">
            @for (t of labService.tests(); track t.id) {
              <tr><td class="px-4 py-3 text-sm font-medium">{{ t.name }}</td><td class="px-4 py-3 text-sm">{{ t.lab?.name }}</td>
                <td class="px-4 py-3 text-sm">{{ t.category }}</td><td class="px-4 py-3 text-sm">{{ t.currency }} {{ t.price }}</td></tr>
            } @empty { <tr><td colspan="4" class="px-4 py-8 text-center text-sm text-gray-500">No tests</td></tr> }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class AdminLabTestsPageComponent implements OnInit {
  protected readonly labService = inject(LabService);
  labId = ''; name = ''; price = 0; category = 'BLOOD'; homeCollection = true;
  ngOnInit(): void { this.labService.loadLabs({ limit: 100 }); this.labService.loadTests({ limit: 100 }); }
  submit(): void {
    if (!this.labId) return;
    this.labService.createTest({ labId: this.labId, name: this.name, price: this.price, category: this.category as 'BLOOD', homeCollectionAvailable: this.homeCollection });
  }
}
