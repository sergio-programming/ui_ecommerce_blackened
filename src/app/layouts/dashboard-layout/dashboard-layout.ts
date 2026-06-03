import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../shared/header-component/header-component';
import { FooterComponent } from "../../shared/footer-component/footer-component";

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
})
export class DashboardLayout {}
