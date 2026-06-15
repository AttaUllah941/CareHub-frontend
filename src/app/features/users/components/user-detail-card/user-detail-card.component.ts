import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ManagedUser } from '../../../../core/models/user.model';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

/** Dumb component — user detail card */
@Component({
  selector: 'app-user-detail-card',
  standalone: true,
  imports: [DatePipe, RouterLink, ButtonComponent],
  templateUrl: './user-detail-card.component.html',
  styleUrl: './user-detail-card.component.scss'
})
export class UserDetailCardComponent {
  readonly user = input<ManagedUser | null>(null);
  readonly deleteUser = output<string>();
}
