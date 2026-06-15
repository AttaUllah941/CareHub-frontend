import { Component, computed, inject, input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-clinic-map-preview',
  standalone: true,
  templateUrl: './clinic-map-preview.component.html',
  styleUrl: './clinic-map-preview.component.scss',
})
export class ClinicMapPreviewComponent {
  private readonly sanitizer = inject(DomSanitizer);

  readonly latitude = input<number | null | undefined>(null);
  readonly longitude = input<number | null | undefined>(null);
  readonly mapUrl = input<string | null | undefined>(null);
  readonly address = input<string>('');

  readonly hasCoordinates = computed(() => this.latitude() != null && this.longitude() != null);

  readonly safeEmbedUrl = computed((): SafeResourceUrl | null => {
    const lat = this.latitude();
    const lng = this.longitude();
    if (lat == null || lng == null) return null;
    const delta = 0.01;
    const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`;
    const url = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${lat},${lng}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  });
}
