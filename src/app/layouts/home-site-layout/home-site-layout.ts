import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../shared/header-component/header-component';
import { FooterComponent } from "../../shared/footer-component/footer-component";

@Component({
  selector: 'app-home-site-layout',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './home-site-layout.html',
  styleUrl: './home-site-layout.css',
})
export class HomeSiteLayout {}
