import { Component } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-doctor-layout',
  standalone: true,
  imports: [RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './doctor-layout.component.html',
  styleUrl: './doctor-layout.component.scss',
})
export class DoctorLayoutComponent {}
