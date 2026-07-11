import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  readonly type = input<'button' | 'submit'>('button');
  readonly variant = input<'primary' | 'secondary' | 'outline'>('primary');
  readonly disabled = input(false);
  readonly loading = input(false);
  readonly fullWidth = input(false);

  buttonClasses(): string {
    const base = 'btn';
    const width = this.fullWidth() ? 'w-full' : '';

    const variants: Record<string, string> = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      outline: 'btn-outline',
    };

    return `${base} ${width} ${variants[this.variant()]}`;
  }
}
