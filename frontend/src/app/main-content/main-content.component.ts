import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import {Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDrawerContainer, MatSidenavModule} from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-main-content', // Du kannst 'sidenav-autosize-example' wählen, wenn das bevorzugt ist
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, MatIconModule, MatSidenavModule, MatButtonModule, MatDrawerContainer], // Alle Importe aus beiden Komponenten
  templateUrl: './main-content.component.html', // Wähle ein Template oder kombiniere sie
  styleUrls: ['./main-content.component.scss',] // Beide CSS-Dateien zusammengeführt
})


export class MainContentComponent{

  constructor(private router: Router) {}

  routeDashboard() {
    this.router.navigate(['/home/dashboard']);
  }
  routeProfil() {
    this.router.navigate(['/home/profil']);
  }
}
