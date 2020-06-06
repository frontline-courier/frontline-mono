import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { getDoxType } from '../../models/doxType';
import { getShipmentMode } from '../../models/shipmentMode';
import { getTransportMode } from '../../models/transportMode';
import { FirebaseFirestoreService } from 'src/app/services/firebase-firestore.service';
import { Booking } from '../../models/booking';
import { MatSnackBar } from '@angular/material/snack-bar';
import { courierLists } from '../../constants/courier-list';
import { courierStatus } from '../../constants/courier-status';


export interface DialogData {
  couriers: any;
  status: any;
  deleteId: string;
}

const courierList = courierLists;
const statusList = courierStatus;
let bookingList: any;

@Component({
  selector: 'app-frontline-booking',
  templateUrl: './frontline-booking.component.html',
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
      'id'
    ];

  getDoxTypes = getDoxType;
  getShipmentModes = getShipmentMode;
  getTransportModes = getTransportMode;

  dataSource = this.afs.getDocument('frontline-booking');
  loader = true;

  constructor(
    private afs: FirebaseFirestoreService,
    public dialog: MatDialog) { }

  ngOnInit(): void {

    this.afs.getDocument('frontline-booking')
      .subscribe((data) => {
        bookingList = data;
        this.loader = false;
      });

  }

  // get data from list
  getShipmentStatus(status: number): string {
    return statusList.find((s) => s.StatusId === status).ShipmentStatus;
  }

  getCourierName(courierId: number): string {
    return courierList.find((c) => c.CourierId === courierId).Courier;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    // this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(viewType?: string, row?: any) {
    const dialogRef = this.dialog.open(FrontLineBookingDialogComponent, {
      data: {
        viewType,
        row,
        couriers: courierList,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openDeleteDialog(docId: string) {
    const dialogRef = this.dialog.open(FrontLineBookingDeleteDialogComponent, {
      data: {
        deleteId: docId,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

@Component({
  selector: 'app-frontline-booking-dialog',
  templateUrl: './dialog/frontline-booking-dialog.html',
})
export class FrontLineBookingDialogComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private afs: FirebaseFirestoreService,
    public dialogRef: MatDialogRef<FrontLineBookingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  bookingForm: FormGroup;
  enableSubmitButton = true;
  enableCancelButton = true;
  enableCloseButton = false;
  enableUpdateButton = false;

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

    if (this.data.viewType
      && this.data.row) {
      this.bookingForm.patchValue({
        awb: this.data.row.awbNumber,
        referenceNumber: this.data.row.referenceNumber,
        courier: this.data.row.courier,
        bookingDate: this.data.row.bookedDate,
        shipperName: this.data.row.shipperName,
        origin: this.data.row.origin,
        bookingAmount: this.data.row.bookingAmount,
        billAmount: this.data.row.billAmount,
        doxType: this.data.row.doxType,
        receiverName: this.data.row.receiverName,
        destination: this.data.row.destination,
        shipmentMode: this.data.row.shipmentMode,
        transportMode: this.data.row.transportMode,
        additionalPhoneNumber: this.data.row.additionalContacts,
        volumetricWeightOrSize: this.data.row.additionalWeights,
        leafNumber: this.data.row.additionalLeaf,
        remarks: this.data.row.remarks,
        deliveryOfficeLocation: this.data.row.deliveryOfficeAddress,
      });
    }

    if (this.data.viewType === 'edit') {
      this.enableSubmitButton = false;
      this.enableUpdateButton = true;
    } else if (this.data.viewType === 'view') {
      this.bookingForm.disable();
      this.enableSubmitButton = false;
      this.enableCancelButton = false;
      this.enableCloseButton = true;
    }
  }

  async addBooking() {
    const data: Booking = {
      awbNumber: this.bookingForm.value.awb,
      referenceNumber: this.bookingForm.value.referenceNumber,
      bookedDate: this.bookingForm.value.bookingDate,
      shipperName: this.bookingForm.value.shipperName,
      origin: this.bookingForm.value.origin,
      receiverName: this.bookingForm.value.receiverName,
      destination: this.bookingForm.value.destination,
      courier: this.bookingForm.value.courier,
      doxType: this.bookingForm.value.doxType,
      shipmentMode: this.bookingForm.value.shipmentMode,
      transportMode: this.bookingForm.value.transportMode,
      shipmentStatus: 1,
      remarks: this.bookingForm.value.remarks,
      deliveryOfficeAddress: this.bookingForm.value.deliveryOfficeLocation,
      additionalContacts: this.bookingForm.value.additionalPhoneNumber,
      additionalWeights: this.bookingForm.value.volumetricWeightOrSize,
      additionalLeaf: this.bookingForm.value.leafNumber,
      bookingAmount: this.bookingForm.value.bookingAmount,
      billAmount: this.bookingForm.value.billAmount,
      createTimestamp: new Date(),
      createdBy: '',
    };
    this.afs.createDocument('frontline-booking', data);
  }

  async updateBooking() {
    const data: Booking = {
      awbNumber: this.bookingForm.value.awb,
      referenceNumber: this.bookingForm.value.referenceNumber,
      bookedDate: this.bookingForm.value.bookingDate,
      shipperName: this.bookingForm.value.shipperName,
      origin: this.bookingForm.value.origin,
      receiverName: this.bookingForm.value.receiverName,
      destination: this.bookingForm.value.destination,
      courier: this.bookingForm.value.courier,
      doxType: this.bookingForm.value.doxType,
      shipmentMode: this.bookingForm.value.shipmentMode,
      transportMode: this.bookingForm.value.transportMode,
      shipmentStatus: 1,
      remarks: this.bookingForm.value.remarks,
      deliveryOfficeAddress: this.bookingForm.value.deliveryOfficeLocation,
      additionalContacts: this.bookingForm.value.additionalPhoneNumber,
      additionalWeights: this.bookingForm.value.volumetricWeightOrSize,
      additionalLeaf: this.bookingForm.value.leafNumber,
      bookingAmount: this.bookingForm.value.bookingAmount,
      billAmount: this.bookingForm.value.billAmount,
      createTimestamp: new Date(),
      createdBy: '',
    };
    this.afs.updateDocument('frontline-booking', this.data.row.id, data);
  }

  async deleteBooking() {
    this.afs.deleteDocument('frontline-booking', this.data.row.id)
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}


@Component({
  selector: 'app-frontline-booking-delete-dialog',
  templateUrl: './dialog/frontline-booking-delete-dialog.html',
})

export class FrontLineBookingDeleteDialogComponent {
  constructor(
    private afs: FirebaseFirestoreService,
    public dialogRef: MatDialogRef<FrontLineBookingDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    ) {}

  confirmDelete(docId: string) {
    this.afs.deleteDocument('frontline-booking', docId);
    this.snackBar.open('Booking Deleted', 'OK', {
      duration: 2000,
    });
  }
}

