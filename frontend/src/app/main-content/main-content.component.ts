import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import {Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDrawerContainer, MatSidenavModule} from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';

export interface Section {
  name: string;
}
@Component({
  selector: 'app-main-content', // Du kannst 'sidenav-autosize-example' wählen, wenn das bevorzugt ist
  standalone: true,
  imports: [RouterOutlet, 
    MatToolbarModule, 
    MatIconModule, 
    MatSidenavModule, 
    MatButtonModule, 
    MatDrawerContainer,
    MatDividerModule,
    MatListModule], // Alle Importe aus beiden Komponenten
  templateUrl: './main-content.component.html', // Wähle ein Template oder kombiniere sie
  styleUrls: ['./main-content.component.scss',] // Beide CSS-Dateien zusammengeführt
})


export class MainContentComponent{

  folders: Section[] = [
    {
      name: 'Arbeit',    },
    {
      name: 'SocialMedia',
    },
    {
      name: 'Privat',
    },
    {
      name: 'Sonstiges',
    },

  ];


  constructor(private router: Router) {}

  routeDashboard() {
    this.router.navigate(['/home/dashboard']);
  }
  routeProfil() {
    this.router.navigate(['/home/profil']);
  }

  onLogout() {
    localStorage.removeItem('token');  // Token aus dem Local Storage entfernen
    this.router.navigate(['/login']);  // Weiterleitung zur Login-Seite
  }


}
