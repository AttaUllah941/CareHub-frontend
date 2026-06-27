import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PAKISTAN_CITIES } from '../../../home/data/home-content';

@Component({
  selector: 'app-medicines-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './medicines-page.component.html',
  styleUrl: './medicines-page.component.scss',
})
export class MedicinesPageComponent {
  readonly cities = PAKISTAN_CITIES;
}
