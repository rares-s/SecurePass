import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, Routes } from '@angular/router';
import { authInterceptor } from './app/auth.interceptor';
import { LoginComponent } from './app/login/login.component';
import { RegisterComponent } from './app/register/register.component';
import { MainContentComponent } from './app/main-content/main-content.component';
import { AuthGuard } from './app/auth.guard';
import { DashboardComponent } from './app/main-content/dashboard/dashboard.component';
import { ProfilComponent } from './app/main-content/profil/profil.component';
import { provideAnimations } from '@angular/platform-browser/animations';


const routes: Routes = [
  { path: 'login', component: LoginComponent }, // explizite Route für Login
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Standard-Redirect zur Login-Seite
  { path: 'register', component: RegisterComponent }, // Route zur Registrierungsseite
  {
    path: 'home',
    component: MainContentComponent,
    children: [
      { path: '', component: DashboardComponent }, // Standard-Route für Homepage
      { path: 'dashboard', component: DashboardComponent }, // Weitere Child-Routen
      { path: 'profil', component: ProfilComponent } // Weitere Child-Routen
    ]
  },
  { path: '**', redirectTo: '/login' } // Fallback für nicht existierende Routen
];


bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations()
  ]
}).catch(err => console.error(err));
