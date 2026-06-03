import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserSideBar } from '../../../../shared/user-side-bar/user-side-bar';

@Component({
  selector: 'app-user-account-dashboard',
  imports: [RouterOutlet, UserSideBar],
  templateUrl: './user-account-dashboard.html',
  styleUrl: './user-account-dashboard.css',
})
export class UserAccountDashboard {}
