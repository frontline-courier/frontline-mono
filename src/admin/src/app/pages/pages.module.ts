import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PagesRoutingModule } from './pages-routing.module';
import { FrontlineBookingComponent,
  FrontLineBookingDialogComponent,
  FrontLineBookingDeleteDialogComponent,
  FrontLineBookingStatusDialogComponent,
  DeliveryBottomSheetOverviewComponent } from './frontline-booking/frontline-booking.component';
import { SharedModule } from '../shared/shared.module';

// duplicate import for popup
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  entryComponents: [
    FrontLineBookingDialogComponent,
    FrontLineBookingDeleteDialogComponent,
    FrontLineBookingStatusDialogComponent,
    DeliveryBottomSheetOverviewComponent,
  ],
  declarations: [
    FrontlineBookingComponent,
    FrontLineBookingDialogComponent,
    FrontLineBookingDeleteDialogComponent,
    FrontLineBookingStatusDialogComponent,
    DeliveryBottomSheetOverviewComponent,
    ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    PagesRoutingModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    // MatDatepickerModule,
    MatSelectModule,
  ],
})
export class PagesModule { }
