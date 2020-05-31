import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FrontlineBookingService } from './frontline-booking.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import {getDoxType } from '../../models/doxType';
import {getShipmentMode } from '../../models/shipmentMode';
import { getTransportMode } from '../../models/transportMode';
import { MatPaginator } from '@angular/material/paginator';


export interface DialogData {
  couriers: any;
  status: any;
}

const courierList = [];
const statusList = [];
const bookingList = [];

@Component({
  selector: 'app-frontline-booking',
  templateUrl: './frontline-booking.component.html',
  styleUrls: ['./frontline-booking.component.scss']
})


export class FrontlineBookingComponent implements OnInit {

  displayedColumns: string[] =
    ['awbNumber',
    'referenceNumber',
    'courier',
    'bookedDate',
    'shipperName',
    'receiverName',
    'destination',
    'doxType',
    'shipmentMode',
    'transportMode',
    'additionalLeaf',
    'shipmentStatus',
    'amount',
  ];

  getDoxTypes = getDoxType;
  getShipmentModes = getShipmentMode;
  getTransportModes = getTransportMode;

  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private service: FrontlineBookingService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.lookupCourier();
    this.lookupStatus();
    this.lookupBooking();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    console.log(this.dataSource)
  }

  async lookupCourier() {
    (await this.service.lookupCourier())
      .valueChanges().subscribe((observable => courierList.push(observable)));
  }

  async lookupStatus() {
    (await this.service.lookupStatus())
      .valueChanges().subscribe((observable => statusList.push(observable)));
  }

  async lookupBooking() {
    (await this.service.lookupBooking())
      .valueChanges().subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
      });
  }

  getShipmentStatus(status: number): string {
    return statusList[0].find((s) => s.statusId === status).shipmentStatus;
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  populateData() {
    this.service.populateData();
  }

  openDialog() {
    const dialogRef = this.dialog.open(FrontLineBookingDialogComponent, {
      data: {
        couriers: courierList,
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
