import { Component, input, output, signal, effect } from '@angular/core';
import { Permission } from '../../../../core/models/role.model';

/** Dumb component — permission checkbox picker grouped by module */
@Component({
  selector: 'app-permission-picker',
  standalone: true,
  templateUrl: './permission-picker.component.html',
  styleUrl: './permission-picker.component.scss'
})
export class PermissionPickerComponent {
  readonly permissionsByModule = input.required<Record<string, Permission[]>>();
  readonly selectedPermissionIds = input<string[]>([]);
  readonly selectionChange = output<string[]>();

  readonly selectedIds = signal<string[]>([]);
  readonly moduleKeys = signal<string[]>([]);

  constructor() {
    effect(() => {
      this.selectedIds.set([...this.selectedPermissionIds()]);
      this.moduleKeys.set(Object.keys(this.permissionsByModule()));
    });
  }

  toggle(id: string): void {
    const current = this.selectedIds();
    const updated = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    this.selectedIds.set(updated);
    this.selectionChange.emit(updated);
  }
}
