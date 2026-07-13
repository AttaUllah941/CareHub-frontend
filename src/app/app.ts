import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './features/auth/services/auth.service';
import { GlobalShellComponent } from './core/components/global-shell/global-shell.component';
import { ReferenceDataService } from './core/services/reference-data.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GlobalShellComponent],
  templateUrl: './app.html',
})
export class App implements OnInit {
  protected readonly title = signal('CareHub | Doctor Appointments');
  private readonly authService = inject(AuthService);
  private readonly referenceData = inject(ReferenceDataService);

  ngOnInit(): void {
    this.authService.initSession();
    this.referenceData.loadAll();
  }
}
