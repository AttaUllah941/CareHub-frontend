import { Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  FAMILY_RELATIONSHIP_OPTIONS,
} from '../../../../core/models/family-member.model';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-family-member-form',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent, ButtonComponent],
  templateUrl: './family-member-form.component.html',
  styleUrl: './family-member-form.component.scss',
})
export class FamilyMemberFormComponent {
  readonly form = input.required<FormGroup>();
  readonly loading = input(false);
  readonly isEdit = input(false);
  readonly submitted = output<void>();
  readonly cancelled = output<void>();

  readonly relationships = FAMILY_RELATIONSHIP_OPTIONS;
}
