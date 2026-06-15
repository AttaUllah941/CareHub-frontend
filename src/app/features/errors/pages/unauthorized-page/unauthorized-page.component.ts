import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-unauthorized-page',
  standalone: true,
  imports: [RouterLink, ButtonComponent],
  templateUrl: './unauthorized-page.component.html',
  styleUrl: './unauthorized-page.component.scss'
})
export class UnauthorizedPageComponent {}
