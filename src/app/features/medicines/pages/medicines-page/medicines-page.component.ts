import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MEDICINE_CITIES } from '../../data/dummy-medicines.data';

@Component({
  selector: 'app-medicines-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './medicines-page.component.html',
  styleUrl: './medicines-page.component.scss',
})
export class MedicinesPageComponent {
  readonly cities = MEDICINE_CITIES;
}
