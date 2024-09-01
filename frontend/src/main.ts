import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, Routes } from '@angular/router';
import { authInterceptor } from './app/auth.interceptor';
import { LoginComponent } from './app/login/login.component';
import { RegisterComponent } from './app/register/register.component';
import { MainContentComponent } from './app/main-content/main-content.component';
import { AuthGuard } from './app/auth.guard';


export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: MainContentComponent },
  { path: 'dashboard', component: MainContentComponent, canActivate: [AuthGuard] }  //AuthGuard später wieder entfernen
];




bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor]))  // AuthInterceptor hier einbinden
  ]
}).catch(err => console.error(err));



