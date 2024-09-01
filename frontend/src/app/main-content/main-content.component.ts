import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [RouterOutlet], // Importiert RouterOutlet für die Routenanzeige
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})

export class MainContentComponent{

  constructor(private http: HttpClient, private router: Router) {}

  
  routeDashboard() {
    this.router.navigate(['/home/dashboard']);
  }
  routeProfil() {
    this.router.navigate(['/home/profil']);
  }
}
