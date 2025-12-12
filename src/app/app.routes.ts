import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { PublicListingComponent } from './components/public-listing/public-listing.component';
import { PropertyDetailComponent } from './components/property-detail/property-detail.component';
import { PropertyFormComponent } from './components/property-form/property-form.component';
import { MyPropertiesComponent } from './components/my-properties/my-properties.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'properties', component: PublicListingComponent },
  { path: 'properties/:id', component: PropertyDetailComponent },
  {
    path: 'add-property',
    component: PropertyFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'my-properties',
    component: MyPropertiesComponent,
    canActivate: [authGuard]
  },
  {
    path: 'admin/dashboard',
    component: AdminDashboardComponent,
    canActivate: [authGuard, adminGuard]
  },
  { path: '', redirectTo: '/properties', pathMatch: 'full' },
  { path: '**', redirectTo: '/properties' } // Wildcard route for a 404 page
];