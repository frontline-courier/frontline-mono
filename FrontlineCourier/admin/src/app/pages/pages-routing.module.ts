import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FrontlineBookingComponent } from './frontline-booking/frontline-booking.component';
import { FrontlineStatusComponent } from './frontline-status/frontline-status.component';


const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'frontline-booking', component: FrontlineBookingComponent},
  { path: 'frontline-status', component: FrontlineStatusComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
