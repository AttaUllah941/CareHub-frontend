import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-clinic-layout',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './clinic-layout.component.html',
  styleUrl: './clinic-layout.component.scss',
})
export class ClinicLayoutComponent {}
