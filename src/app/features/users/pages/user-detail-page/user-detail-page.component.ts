import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserDetailCardComponent } from '../../components/user-detail-card/user-detail-card.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-user-detail-page',
  standalone: true,
  imports: [RouterLink, UserDetailCardComponent, AlertComponent],
  templateUrl: './user-detail-page.component.html',
  styleUrl: './user-detail-page.component.scss'
})
export class UserDetailPageComponent implements OnInit {
  protected readonly userService = inject(UserService);
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.userService.clearError();
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) this.userService.loadUser(id);
    });
  }

  onDelete(id: string): void {
    if (confirm('Are you sure you want to deactivate this user?')) {
      this.userService.deleteUser(id);
    }
  }
}
