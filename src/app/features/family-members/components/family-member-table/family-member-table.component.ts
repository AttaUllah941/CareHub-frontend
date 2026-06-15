import { Component, input, output } from '@angular/core';
import { FamilyMember, relationshipLabel } from '../../../../core/models/family-member.model';

@Component({
  selector: 'app-family-member-table',
  standalone: true,
  templateUrl: './family-member-table.component.html',
  styleUrl: './family-member-table.component.scss',
})
export class FamilyMemberTableComponent {
  readonly members = input<FamilyMember[]>([]);
  readonly loading = input(false);
  readonly showActions = input(true);

  readonly editMember = output<FamilyMember>();
  readonly deleteMember = output<string>();

  readonly relationshipLabel = relationshipLabel;
}
