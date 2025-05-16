import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { LoginComponent } from './components/login/login.component';

import { AuthGuard } from './guards/auth.guard';


const routes: Routes = [
  {path: 'about', component: AboutComponent},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  {path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

