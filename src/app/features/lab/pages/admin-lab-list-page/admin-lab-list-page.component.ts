import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LabService } from '../../services/lab.service';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-admin-lab-list-page',
  standalone: true,
  imports: [FormsModule, AlertComponent],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold">Lab Listings</h1>
        <button type="button" (click)="showForm.set(!showForm())" class="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm">{{ showForm() ? 'Cancel' : 'Add Lab' }}</button>
      </div>
      @if (labService.error()) { <app-alert [message]="labService.error()!" variant="error" /> }
      @if (labService.successMessage()) { <app-alert [message]="labService.successMessage()!" variant="success" /> }
      @if (showForm()) {
        <form class="bg-white border rounded-xl p-4 grid md:grid-cols-2 gap-4" (ngSubmit)="submit()">
          <input class="border rounded-lg px-3 py-2 text-sm" placeholder="Lab name" [(ngModel)]="name" name="name" required />
          <input class="border rounded-lg px-3 py-2 text-sm" placeholder="City" [(ngModel)]="city" name="city" />
          <input class="border rounded-lg px-3 py-2 text-sm" placeholder="Phone" [(ngModel)]="phone" name="phone" />
          <input class="border rounded-lg px-3 py-2 text-sm" placeholder="Address" [(ngModel)]="address" name="address" />
          <label class="flex items-center gap-2 text-sm"><input type="checkbox" [(ngModel)]="homeCollection" name="hc" /> Home collection available</label>
          <input type="number" class="border rounded-lg px-3 py-2 text-sm" placeholder="Home collection fee" [(ngModel)]="homeCollectionFee" name="fee" />
          <button type="submit" class="md:col-span-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm">Save Lab</button>
        </form>
      }
      <div class="bg-white border rounded-xl overflow-x-auto">
        <table class="min-w-full divide-y">
          <thead class="bg-gray-50"><tr>
            <th class="px-4 py-3 text-left text-xs uppercase text-gray-500">Name</th>
            <th class="px-4 py-3 text-left text-xs uppercase text-gray-500">City</th>
            <th class="px-4 py-3 text-left text-xs uppercase text-gray-500">Home Collection</th>
            <th class="px-4 py-3 text-left text-xs uppercase text-gray-500">Fee</th>
          </tr></thead>
          <tbody class="divide-y">
            @for (l of labService.labs(); track l.id) {
              <tr><td class="px-4 py-3 text-sm font-medium">{{ l.name }}</td><td class="px-4 py-3 text-sm">{{ l.city || '—' }}</td>
                <td class="px-4 py-3 text-sm">{{ l.homeCollectionAvailable ? 'Yes' : 'No' }}</td><td class="px-4 py-3 text-sm">{{ l.homeCollectionFee }}</td></tr>
            } @empty { <tr><td colspan="4" class="px-4 py-8 text-center text-sm text-gray-500">No labs</td></tr> }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class AdminLabListPageComponent implements OnInit {
  protected readonly labService = inject(LabService);
  readonly showForm = signal(false);
  name = ''; city = ''; phone = ''; address = ''; homeCollection = true; homeCollectionFee = 0;
  ngOnInit(): void { this.labService.loadLabs({ limit: 50 }); }
  submit(): void {
    this.labService.createLab({ name: this.name, city: this.city, phone: this.phone, address: this.address, homeCollectionAvailable: this.homeCollection, homeCollectionFee: this.homeCollectionFee });
    this.showForm.set(false);
  }
}
