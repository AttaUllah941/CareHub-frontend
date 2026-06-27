import { Component, ElementRef, HostListener, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NotificationBellComponent } from '../../core/components/notification-bell/notification-bell.component';
import { UserRole } from '../../core/models/auth.model';
import { AuthService } from '../../features/auth/services/auth.service';
import { ReferenceDataService } from '../../core/services/reference-data.service';
import { MedicineCartService } from '../../features/medicines/services/medicine-cart.service';
import { FOOTER_CITY_LINKS, NAV_LINKS, PAKISTAN_CITIES } from '../../features/home/data/home-content';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NotificationBellComponent],
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.scss',
})
export class PublicLayoutComponent implements OnInit {
  protected readonly authService = inject(AuthService);
  protected readonly referenceData = inject(ReferenceDataService);
  protected readonly UserRole = UserRole;
  protected readonly cartService = inject(MedicineCartService);
  protected readonly navLinks = NAV_LINKS;
  protected readonly footerCityLinks = FOOTER_CITY_LINKS;
  protected readonly hospitalCities = PAKISTAN_CITIES;
  protected readonly labCities = PAKISTAN_CITIES;
  protected readonly surgeryCities = PAKISTAN_CITIES;
  protected readonly mobileMenuOpen = signal(false);
  protected readonly doctorsDropdownOpen = signal(false);
  protected readonly hospitalsDropdownOpen = signal(false);
  protected readonly labsDropdownOpen = signal(false);
  protected readonly surgeryDropdownOpen = signal(false);

  private readonly elementRef = inject(ElementRef);

  ngOnInit(): void {
    this.referenceData.loadSpecialties();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeDropdowns();
    }
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  toggleDoctorsDropdown(): void {
    this.hospitalsDropdownOpen.set(false);
    this.labsDropdownOpen.set(false);
    this.surgeryDropdownOpen.set(false);
    this.doctorsDropdownOpen.update((open) => !open);
  }

  toggleHospitalsDropdown(): void {
    this.doctorsDropdownOpen.set(false);
    this.labsDropdownOpen.set(false);
    this.surgeryDropdownOpen.set(false);
    this.hospitalsDropdownOpen.update((open) => !open);
  }

  toggleLabsDropdown(): void {
    this.doctorsDropdownOpen.set(false);
    this.hospitalsDropdownOpen.set(false);
    this.surgeryDropdownOpen.set(false);
    this.labsDropdownOpen.update((open) => !open);
  }

  toggleSurgeryDropdown(): void {
    this.doctorsDropdownOpen.set(false);
    this.hospitalsDropdownOpen.set(false);
    this.labsDropdownOpen.set(false);
    this.surgeryDropdownOpen.update((open) => !open);
  }

  closeDropdowns(): void {
    this.doctorsDropdownOpen.set(false);
    this.hospitalsDropdownOpen.set(false);
    this.labsDropdownOpen.set(false);
    this.surgeryDropdownOpen.set(false);
  }

  closeDoctorsDropdown(): void {
    this.doctorsDropdownOpen.set(false);
  }

  closeHospitalsDropdown(): void {
    this.hospitalsDropdownOpen.set(false);
  }

  closeLabsDropdown(): void {
    this.labsDropdownOpen.set(false);
  }

  closeSurgeryDropdown(): void {
    this.surgeryDropdownOpen.set(false);
  }
}
