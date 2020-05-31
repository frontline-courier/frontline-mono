import { Component, OnInit, Inject } from '@angular/core';
import { FrontlineBookingService } from './frontline-booking.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

export interface DialogData {
  couriers: any;
  status: any;
}


@Component({
  selector: 'app-frontline-booking',
  templateUrl: './frontline-booking.component.html',
  styleUrls: ['./frontline-booking.component.scss']
})

export class FrontlineBookingComponent implements OnInit {

  courierList = [];
  // statusList = [];

  constructor(private service: FrontlineBookingService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.lookupCourier();
    // this.lookupStatus();
    console.log('oninit called')
  }

  async lookupCourier() {
    (await this.service.lookupCourier())
      .valueChanges().subscribe((observable => this.courierList.push(observable)));
  }

  // async lookupStatus() {
  //   (await this.service.lookupStatus())
  //     .valueChanges().subscribe((observable => this.statusList.push(observable)));
  // }

  // addBooking() {
  //   this.service.addBooking();
  // }

  populateData() {
    this.service.populateData();
  }

  openDialog() {
    const dialogRef = this.dialog.open(FrontLineBookingDialogComponent, {
      data: {
        couriers: this.courierList,
        // status: this.statusList,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}

@Component({
  selector: 'app-frontline-booking-dialog',
  templateUrl: './frontline-booking-dialog.html',
})
export class FrontLineBookingDialogComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private service: FrontlineBookingService,
    public dialogRef: MatDialogRef<FrontLineBookingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  bookingForm: FormGroup;

  ngOnInit() {
    this.bookingForm = this.formBuilder.group({
      awb: ['', [Validators.required]],
      referenceNumber: [''],
      courier: ['', [Validators.required]],
      bookingDate: ['', [Validators.required]],
      shipperName: [''],
      origin: [''],
      bookingAmount: [''],
      billAmount: [''],
      doxType: ['', [Validators.required]],
      receiverName: [''],
      destination: ['', [Validators.required]],
      shipmentMode: ['', [Validators.required]],
      transportMode: ['', [Validators.required]],
      // shipmentStatus: ['', [Validators.required]],
      additionalPhoneNumber: [''],
      volumetricWeightOrSize: [''],
      leafNumber: [''],
      remarks: [''],
      deliveryOfficeLocation: [''],
    });
  }

  addBooking() {
    this.service.addBooking(this.bookingForm.value);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
