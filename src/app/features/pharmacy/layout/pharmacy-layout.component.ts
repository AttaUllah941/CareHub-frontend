import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-pharmacy-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './pharmacy-layout.component.html',
  styleUrl: './pharmacy-layout.component.scss',
})
export class PharmacyLayoutComponent {}
