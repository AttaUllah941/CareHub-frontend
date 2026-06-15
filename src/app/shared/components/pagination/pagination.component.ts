import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {
  readonly page = input(1);
  readonly totalPages = input(0);
  readonly total = input(0);
  readonly pageChange = output<number>();
}
