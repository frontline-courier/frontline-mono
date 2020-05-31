import { Component, OnInit, Inject } from '@angular/core';
import { FrontlineBookingService } from './frontline-booking.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-frontline-booking',
  templateUrl: './frontline-booking.component.html',
  styleUrls: ['./frontline-booking.component.scss']
})
export class FrontlineBookingComponent implements OnInit {

  constructor(private service: FrontlineBookingService, public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  addBooking() {
    this.service.addBooking();
  }

  populateData() {
    this.service.populateData();
  }

  openDialog() {
    const dialogRef = this.dialog.open(FrontLineBookingDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}

@Component({
  selector: 'app-frontline-booking-dialog',
  templateUrl: './frontline-booking-dialog.html',
})
export class FrontLineBookingDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<FrontLineBookingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
