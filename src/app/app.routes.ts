import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import { AuthGuard } from './core/guard/auth-guard.service';
import { PageNotFoundComponent } from './core/pagenotfound/page-not-found.component';


const appRoutes: Routes = [
  { path: 'home', redirectTo: '/survey', pathMatch: 'full'},
  /* { path: 'questionitems',    component: QuestionComponent, canActivate: [AuthGuard] }, */
/*   { path: 'responsedomains', component: ResponsedomainComponent, canActivate: [AuthGuard] }, */
/*   { path: 'schemes',      component: CategorySchemeComponent, canActivate: [AuthGuard] },
     { path: 'categories',   component: RegisterComponent , canActivate: [AuthGuard]},
     { path: 'instruments',  component: InstrumentComponent , canActivate: [AuthGuard]},
  */
  { path: '**', component: PageNotFoundComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, {enableTracing: false});