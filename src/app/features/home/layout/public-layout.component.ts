import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { DoctorPortalService } from '../../doctor/services/doctor-portal.service';
import { MedicineCartService } from '../services/medicine-cart.service';
import { FIND_DOCTOR_SPECIALTIES, FOOTER_CITY_LINKS, NAV_LINKS } from '../data/home-content';
import { HOSPITAL_CITIES } from '../data/dummy-hospitals.data';
import { LAB_CITIES } from '../data/dummy-labs.data';
import { SURGERY_CITIES } from '../data/dummy-surgery.data';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.scss',
})
export class PublicLayoutComponent {
  protected readonly authService = inject(AuthService);
  protected readonly cartService = inject(MedicineCartService);
  protected readonly doctorPortal = inject(DoctorPortalService);
  protected readonly navLinks = NAV_LINKS;
  protected readonly footerCityLinks = FOOTER_CITY_LINKS;
  protected readonly findDoctorSpecialties = FIND_DOCTOR_SPECIALTIES;
  protected readonly hospitalCities = HOSPITAL_CITIES;
  protected readonly labCities = LAB_CITIES;
  protected readonly surgeryCities = SURGERY_CITIES;
  protected readonly mobileMenuOpen = signal(false);
  protected readonly doctorsDropdownOpen = signal(false);
  protected readonly hospitalsDropdownOpen = signal(false);
  protected readonly labsDropdownOpen = signal(false);
  protected readonly surgeryDropdownOpen = signal(false);

  private readonly elementRef = inject(ElementRef);

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
