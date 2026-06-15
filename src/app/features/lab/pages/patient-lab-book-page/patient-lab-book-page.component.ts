import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LabService } from '../../services/lab.service';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { LabCollectionType } from '../../../../core/models/lab.model';

@Component({
  selector: 'app-patient-lab-book-page',
  standalone: true,
  imports: [FormsModule, AlertComponent],
  template: `
    <div class="space-y-6">
      <h1 class="text-2xl font-bold">Book Lab Tests</h1>
      <p class="text-sm text-gray-500">Browse labs and tests. Choose lab visit or home sample collection.</p>
      @if (labService.error()) { <app-alert [message]="labService.error()!" variant="error" /> }
      @if (labService.successMessage()) { <app-alert [message]="labService.successMessage()!" variant="success" /> }

      <div class="flex gap-2">
        <input class="border rounded-lg px-3 py-2 text-sm flex-1" placeholder="Search tests..." [(ngModel)]="search" (keyup.enter)="onSearch()" />
        <button type="button" (click)="onSearch()" class="px-4 py-2 bg-gray-100 rounded-lg text-sm">Search</button>
      </div>

      <div class="flex gap-4 text-sm">
        <label class="flex items-center gap-2"><input type="radio" name="ct" [checked]="collectionType() === 'LAB_VISIT'" (change)="collectionType.set('LAB_VISIT')" /> Lab visit</label>
        <label class="flex items-center gap-2"><input type="radio" name="ct" [checked]="collectionType() === 'HOME_COLLECTION'" (change)="collectionType.set('HOME_COLLECTION')" /> Home collection</label>
      </div>

      @if (collectionType() === 'HOME_COLLECTION') {
        <div class="bg-purple-50 border border-purple-200 rounded-xl p-4 grid md:grid-cols-2 gap-4">
          <input class="border rounded-lg px-3 py-2 text-sm" placeholder="Home address *" [(ngModel)]="homeAddress" />
          <input class="border rounded-lg px-3 py-2 text-sm" placeholder="City" [(ngModel)]="homeCity" />
          <input class="border rounded-lg px-3 py-2 text-sm" placeholder="Phone" [(ngModel)]="homePhone" />
          <input type="date" class="border rounded-lg px-3 py-2 text-sm" [(ngModel)]="scheduledDate" />
        </div>
      }

      @if (selected().length) {
        <div class="bg-teal-50 border border-teal-200 rounded-xl p-4 flex justify-between items-center">
          <span class="text-sm text-teal-800">{{ selected().length }} test(s) selected</span>
          <button type="button" (click)="book()" class="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm" [disabled]="labService.saving()">Book Now</button>
        </div>
      }

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        @for (t of labService.tests(); track t.id) {
          <div class="bg-white border rounded-xl p-4" [class.ring-2]="isSelected(t.id)" [class.ring-teal-500]="isSelected(t.id)">
            <h3 class="font-semibold">{{ t.name }}</h3>
            <p class="text-sm text-gray-500">{{ t.lab?.name }} · {{ t.category }}</p>
            <p class="text-lg font-bold text-teal-600 mt-2">{{ t.currency }} {{ t.price }}</p>
            @if (t.homeCollectionAvailable) { <span class="text-xs text-purple-600">Home collection OK</span> }
            <button type="button" (click)="toggle(t.id)" class="mt-3 w-full px-3 py-2 bg-gray-100 rounded-lg text-sm">{{ isSelected(t.id) ? 'Remove' : 'Select' }}</button>
          </div>
        } @empty { <p class="text-gray-500 col-span-full text-center py-8">No tests found</p> }
      </div>
    </div>
  `,
})
export class PatientLabBookPageComponent implements OnInit {
  protected readonly labService = inject(LabService);
  readonly collectionType = signal<LabCollectionType>('LAB_VISIT');
  readonly selected = signal<string[]>([]);
  search = ''; homeAddress = ''; homeCity = ''; homePhone = ''; scheduledDate = '';
  ngOnInit(): void { this.labService.loadTests({ limit: 50 }); }
  onSearch(): void { this.labService.loadTests({ search: this.search, limit: 50 }); }
  isSelected(id: string): boolean { return this.selected().includes(id); }
  toggle(id: string): void {
    this.selected.update((list) => list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  }
  book(): void {
    const items = this.selected().map((labTestId) => ({ labTestId }));
    this.labService.createBooking({
      items,
      collectionType: this.collectionType(),
      homeAddress: this.collectionType() === 'HOME_COLLECTION' ? this.homeAddress : undefined,
      homeCity: this.homeCity,
      homePhone: this.homePhone,
      scheduledDate: this.scheduledDate || undefined,
    });
    this.selected.set([]);
  }
}
