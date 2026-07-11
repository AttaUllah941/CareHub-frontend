import { Router } from '@angular/router';
import { SymptomItem } from '../data/home-content';

export function navigateToHealthTopic(
  router: Router,
  item: SymptomItem,
  city: string,
): void {
  router.navigate(['/find-doctors', item.specialtySlug], {
    queryParams: {
      city,
      condition: item.name,
    },
  });
}
