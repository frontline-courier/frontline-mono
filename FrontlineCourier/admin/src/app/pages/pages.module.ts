import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PagesRoutingModule } from './pages-routing.module';
import { FrontlineBookingComponent, FrontLineBookingDialogComponent } from './frontline-booking/frontline-booking.component';
import { SharedModule } from '../shared/shared.module';

// duplicate import for popup
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatDatepickerModule } from '@angular/material/datepicker';



@NgModule({
  entryComponents: [FrontLineBookingDialogComponent],
  declarations: [FrontlineBookingComponent, FrontLineBookingDialogComponent],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    PagesRoutingModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    // MatDatepickerModule,
  ],
})
export class PagesModule { }
