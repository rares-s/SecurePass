import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDrawerContainer, MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';  
import { DashboardComponent } from './dashboard/dashboard.component';


export interface Section {
  name: string;
}
@Component({
  selector: 'app-main-content', 
  standalone: true,
  imports: [RouterOutlet, 
    MatToolbarModule, 
    MatIconModule, 
    MatSidenavModule, 
    MatButtonModule, 
    MatDrawerContainer,
    MatDividerModule,
    MatListModule,
    CommonModule,
    DashboardComponent
  ], 

  templateUrl: './main-content.component.html', 
  styleUrls: ['./main-content.component.scss',] 
})


export class MainContentComponent{
  links: any[] = []; 

  folders: Section[] = [
    {
      name: 'Alle',    
    },
    {
      name: 'Arbeit',    
    },
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

  selectedCategory: string = 'Alle';  // Standardmäßig ist "Alle" ausgewählt



  constructor(private router: Router) {}

  routeDashboard() {
    this.router.navigate(['/home/dashboard']);
  }
  routeProfil() {
    console.log('Profil wird aufgerufen');  // Debugging
    this.router.navigate(['/home/profil']);
  }

  onLogout() {
    localStorage.removeItem('token');  // Token aus dem Local Storage entfernen
    this.router.navigate(['/login']);  // Weiterleitung zur Login-Seite
  }

    // Method to get the number of websites
    getWebsiteCount(): number {
      return this.links.length;
    }

  selectCategory(category: string) {
    this.router.navigate(['home/dashboard', category]);
  }

// Methode zum Abrufen des passenden Icons
getCategoryIcon(category: string): string {
  switch (category) {
    case 'Arbeit':
      return 'work';
    case 'SocialMedia':
      return 'group';
    case 'Privat':
      return 'lock';
    case 'Sonstiges':
      return 'category';
      case 'Alle':
        return 'apps';  
    default:
      return 'folder';  
  }
}




}
