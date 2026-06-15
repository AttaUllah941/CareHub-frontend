import { Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { USER_ROLE_OPTIONS } from '../../../../core/models/user.model';

/** Dumb component — create/update user form */
@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent, ButtonComponent, AlertComponent],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent {
  readonly form = input.required<FormGroup>();
  readonly loading = input(false);
  readonly error = input('');
  readonly isEdit = input(false);
  readonly submitted = output<void>();
  readonly cancelled = output<void>();

  readonly roleOptions = USER_ROLE_OPTIONS;
}
