import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-lab-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="min-h-screen bg-gray-50">
      <header class="bg-white border-b border-gray-200 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 py-4 flex items-center gap-8">
          <a routerLink="/lab/dashboard" class="text-xl font-bold text-teal-600">CareHub Lab</a>
          <nav class="flex gap-4 text-sm flex-wrap">
            <a routerLink="/lab/dashboard" routerLinkActive="text-teal-600 font-medium" class="text-gray-600">Dashboard</a>
            <a routerLink="/lab/labs" routerLinkActive="text-teal-600 font-medium" class="text-gray-600">Labs</a>
            <a routerLink="/lab/tests" routerLinkActive="text-teal-600 font-medium" class="text-gray-600">Tests</a>
            <a routerLink="/lab/bookings" routerLinkActive="text-teal-600 font-medium" class="text-gray-600">Bookings</a>
            <a routerLink="/lab/reports" routerLinkActive="text-teal-600 font-medium" class="text-gray-600">Reports</a>
          </nav>
        </div>
      </header>
      <main class="max-w-7xl mx-auto px-4 py-8"><router-outlet /></main>
    </div>
  `,
})
export class LabLayoutComponent {}
