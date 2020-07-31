import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { getDoxType } from '../../models/doxType';
import { getShipmentMode } from '../../models/shipmentMode';
import { getTransportMode } from '../../models/transportMode';
import { getShipmentStatus } from '../../models/shipmentStatus';
import { FirebaseFirestoreService } from 'src/app/services/firebase-firestore.service';
import { Booking } from '../../models/booking';
import { MatSnackBar } from '@angular/material/snack-bar';
import { courierLists } from '../../constants/courier-list';
import { courierStatus } from '../../constants/courier-status';
import {PageEvent} from '@angular/material/paginator';
import * as moment from 'moment';
import { shipmentStatus } from 'src/app/models/shipmentStatus';
import {MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
import { auth } from 'firebase/app';
// import { FrontlineBookingService } from './frontline-booking.service';

export interface DialogData {
  couriers: any;
  status: any;
  deleteId: string;
}

const courierList = courierLists;
const statusList = courierStatus;

@Component({
  selector: 'app-frontline-booking',
  templateUrl: './frontline-booking.component.html',
})

export class FrontlineBookingComponent implements OnInit {

  // table inputs
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

  // local consts
  couriers = courierList;
  statuses = statusList;

  dataSource: any[];
  loader = true;

  // MatPaginator Inputs
  length = 0;
  pageSize = 50;
  pageSizeOptions: number[] = [this.pageSize];

  // MatPaginator Output
  pageEvent: PageEvent;

  searchForm: FormGroup;

  constructor(
    private afs: FirebaseFirestoreService,
    public dialog: MatDialog,
    private bottomSheet: MatBottomSheet,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    // private service: FrontlineBookingService,
    ) { }

  ngOnInit(): void {
    this.getInitialData();

    this.searchForm = this.formBuilder.group({
      courier: [null],
      shipmentMode: [null],
      transportMode: [null],
      doxType: [null],
      shipmentStatus: [null],
      searchText: [null],
      searchField: [null],
    });
  }

  async getInitialData() {
    (await this.afs.getDocument(
      'frontline-booking',
      this.pageSize,
      this.searchForm?.value?.courier || undefined,
      this.searchForm?.value?.shipmentMode || undefined,
      this.searchForm?.value?.transportMode || undefined,
      this.searchForm?.value?.doxType || undefined,
      this.searchForm?.value?.shipmentStatus || undefined,
      this.searchForm?.value?.searchText || undefined,
      this.searchForm?.value?.searchField || undefined,
      )).subscribe((data) => {
      this.dataSource = data;
      this.length = data[0].count;
      this.loader = false;
    });
  }

  // get paginated data
  getPageData(event?: PageEvent): PageEvent {

    if (event.previousPageIndex < event.pageIndex) {
      this.loader = true;
      const lastDocId = this.dataSource[this.dataSource.length - 1].id;
      this.getNextPage(lastDocId);
    }
    else {
      this.loader = true;
      const firstDocId = this.dataSource[0].id;
      this.getPrevPage(firstDocId);
    }

    return this.pageEvent;
  }

  async getNextPage(lastDocId) {
    (await this.afs.getNextDocument(
      'frontline-booking',
      lastDocId,
      this.pageSize,
      this.searchForm?.value?.courier || undefined,
      this.searchForm?.value?.shipmentMode || undefined,
      this.searchForm?.value?.transportMode || undefined,
      this.searchForm?.value?.doxType || undefined,
      this.searchForm?.value?.shipmentStatus || undefined,
      this.searchForm?.value?.searchText || undefined,
      this.searchForm?.value?.searchField || undefined,
      )).subscribe((data) => {
      this.dataSource = data;
      this.length = data[0].count;
      this.loader = false;
    });
  }

  async getPrevPage(firstDocId) {
    (await this.afs.getPrevDocument(
      'frontline-booking',
      firstDocId,
      this.pageSize,
      this.searchForm?.value?.courier || undefined,
      this.searchForm?.value?.shipmentMode || undefined,
      this.searchForm?.value?.transportMode || undefined,
      this.searchForm?.value?.doxType || undefined,
      this.searchForm?.value?.shipmentStatus || undefined,
      this.searchForm?.value?.searchText || undefined,
      this.searchForm?.value?.searchField || undefined,
      )).subscribe((data) => {
      this.dataSource = data;
      this.length = data[0].count;
      this.loader = false;
    });
  }

  async getSearchData() {
    if ((this.searchForm.value.courier === undefined
      || this.searchForm.value.courier === '')
      && (this.searchForm.value.shipmentMode === undefined
        || this.searchForm.value.shipmentMode === '')
      && (this.searchForm.value.transportMode === undefined
        || this.searchForm.value.transportMode === '')
      && (this.searchForm.value.doxType === undefined
        || this.searchForm.value.doxType === '')
      && (this.searchForm.value.shipmentStatus === undefined
        || this.searchForm.value.shipmentStatus === '')
      && (this.searchForm.value.searchText === undefined
      || this.searchForm.value.searchText === '')
      && (this.searchForm.value.searchField === undefined
        || this.searchForm.value.searchField === '')
      )
    {
      return;
    }

    this.loader = true;
    (await this.afs.getDocument(
      'frontline-booking',
      this.pageSize,
      this.searchForm.value.courier,
      this.searchForm.value.shipmentMode,
      this.searchForm.value.transportMode,
      this.searchForm.value.doxType,
      this.searchForm.value.shipmentStatus,
      this.searchForm.value.searchText,
      this.searchForm.value.searchField,
      )).subscribe((data) => {
        if (data.length === 0) {
          this.snackBar.open('No Search Result Found, Loading all data', 'OK', {
            duration: 5000,
          });
        }
        else {
          this.dataSource = data;
          this.length = data[0].count;
        }
        this.loader = false;

    });
  }

  // get data from list
  // to be removed after sometime
  getShipmentStatus(status: number | string): string {
    if (typeof status === 'string') { return status; }
    return statusList.find((s) => s.StatusId === status).ShipmentStatus || 'NA';
  }

  getCourierName(courierId: number): string {
    if (courierId === null || courierId === undefined) { return 'NA'; }
    return courierList.find((c) => c.CourierId === courierId)?.Courier || 'NA';
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
      // console.log(`Dialog result: ${result}`);
    });
  }

  openDeleteDialog(docId: string) {
    const dialogRef = this.dialog.open(FrontLineBookingDeleteDialogComponent, {
      data: {
        deleteId: docId,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
    });
  }

  openUpdateStatusDialog(docId: string) {
    const dialogRef = this.dialog.open(FrontLineBookingStatusDialogComponent, {
      data: {
        docId,
        shipmentStatus,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
    });
  }

  openBottomSheet(row: any): void {
    const bottomSheetRef = this.bottomSheet.open(DeliveryBottomSheetOverviewComponent, {
      data: {
        row,
        shipmentStatus,
      }
    });
  }

  // getDateTime(dateTime: string, format: string) {
  //   return moment(dateTime, format).format();
  // }

  // populateData() {
  //   this.service.populateData();
  // }
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
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
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
      bookingDate: [moment().format(moment.HTML5_FMT.DATETIME_LOCAL), [Validators.required]],
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
      internalRemark: [''],
    });

    if (this.data.viewType
      && this.data.row) {
      this.bookingForm.patchValue({
        awb: this.data.row.awbNumber,
        referenceNumber: this.data.row.referenceNumber,
        courier: this.data.row.courier,
        bookingDate: moment(this.data.row.bookedDate.toDate(), 'DD-MM-YYYY HH:mm').format(moment.HTML5_FMT.DATETIME_LOCAL),
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
        internalRemark: this.data.row.internalRemark,
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
      bookedDate: moment(this.bookingForm.value.bookingDate, moment.HTML5_FMT.DATETIME_LOCAL).toDate(),
      shipperName: this.bookingForm.value.shipperName,
      origin: this.bookingForm.value.origin,
      receiverName: this.bookingForm.value.receiverName,
      destination: this.bookingForm.value.destination,
      courier: this.bookingForm.value.courier,
      doxType: this.bookingForm.value.doxType,
      shipmentMode: this.bookingForm.value.shipmentMode,
      transportMode: this.bookingForm.value.transportMode,
      shipmentStatus: 'Booked',
      remarks: this.bookingForm.value.remarks,
      deliveryOfficeAddress: this.bookingForm.value.deliveryOfficeLocation,
      additionalContacts: this.bookingForm.value.additionalPhoneNumber,
      additionalWeights: this.bookingForm.value.volumetricWeightOrSize,
      additionalLeaf: this.bookingForm.value.leafNumber,
      bookingAmount: this.bookingForm.value.bookingAmount,
      billAmount: this.bookingForm.value.billAmount,
      createdDateTime: new Date(),
      createdBy: auth().currentUser.email,
      internalRemark: this.bookingForm.value.internalRemark || '',
    };
    this.afs.createDocument('frontline-booking', data)
      .then((res) => {
        this.snackBar.open(res, 'OK', {
          duration: 5000,
        });
      })
      .catch((err) => {
        this.snackBar.open(err, 'OK', {
          duration: 5000,
        });
      });
  }

  async updateBooking() {
    const data: Booking = {
      awbNumber: this.bookingForm.value.awb,
      referenceNumber: this.bookingForm.value.referenceNumber,
      bookedDate: moment(this.bookingForm.value.bookingDate, moment.HTML5_FMT.DATETIME_LOCAL).toDate(),
      shipperName: this.bookingForm.value.shipperName,
      origin: this.bookingForm.value.origin,
      receiverName: this.bookingForm.value.receiverName,
      destination: this.bookingForm.value.destination,
      courier: this.bookingForm.value.courier,
      doxType: this.bookingForm.value.doxType,
      shipmentMode: this.bookingForm.value.shipmentMode,
      transportMode: this.bookingForm.value.transportMode,
      remarks: this.bookingForm.value.remarks,
      deliveryOfficeAddress: this.bookingForm.value.deliveryOfficeLocation,
      additionalContacts: this.bookingForm.value.additionalPhoneNumber,
      additionalWeights: this.bookingForm.value.volumetricWeightOrSize,
      additionalLeaf: this.bookingForm.value.leafNumber,
      bookingAmount: this.bookingForm.value.bookingAmount,
      billAmount: this.bookingForm.value.billAmount,
      updatedDateTime: new Date(),
      updatedBy: auth().currentUser.email,
      internalRemark: this.bookingForm.value.internalRemark || '',
    };
    this.afs.updateDocument('frontline-booking', this.data.row.id, data)
      .then(() => {
        this.snackBar.open('Booking Updated', 'OK', {
          duration: 5000,
        });
      })
      .catch((err) => {
        this.snackBar.open(err, 'OK', {
          duration: 5000,
        });
      });
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
    this.afs.deleteDocument('frontline-booking', docId)
    .then((data) => {
      this.snackBar.open('Booking Deleted ', 'OK', {
        duration: 5000,
      });
    })
    .catch((err) => {
      this.snackBar.open(err, 'OK', {
        duration: 5000,
      });
    });
  }

}

@Component({
  selector: 'app-frontline-booking-status-dialog',
  templateUrl: './dialog/frontline-booking-status-dialog.html',
})

export class FrontLineBookingStatusDialogComponent implements OnInit {
  constructor(
    private afs: FirebaseFirestoreService,
    public dialogRef: MatDialogRef<FrontLineBookingStatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    ) {}

    statusForm: FormGroup;


    ngOnInit(): void {
      this.statusForm = this.formBuilder.group({
        remark: [''],
        statusDate: [moment().format(moment.HTML5_FMT.DATETIME_LOCAL), [Validators.required]],
        statusId: ['', [Validators.required]],
        receivedPerson: [''],
        receivedPersonRelation: [],
      });
    }

    saveDeliveryStatus() {
      const status = {
        remark: this.statusForm.value.remark,
        statusDate: this.statusForm.value.statusDate,
        statusId: this.statusForm.value.statusId,
        updatedDateTime: new Date(),
        updatedBy: auth().currentUser.email,
      };

      this.afs.updateDocumentArray(
        'frontline-booking',
        this.data.docId,
        status,
        this.statusForm.value.receivedPerson,
        this.statusForm.value.receivedPersonRelation);
    }

    onNoClick(): void {
      this.dialogRef.close();
    }

}

@Component({
  selector: 'app-delivery-bottom-sheet-overview',
  templateUrl: 'bottom-sheet/delivery-bottom-sheet-overview.html',
})
export class DeliveryBottomSheetOverviewComponent {
  constructor(
    private afs: FirebaseFirestoreService,
    private snackBar: MatSnackBar,
    private bottomSheetRef: MatBottomSheetRef<DeliveryBottomSheetOverviewComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    ) {}

  getStatus = getShipmentStatus;

  openLink(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }

  getDateTime(dateTime: string, format: string) {
    return moment(dateTime, format).format();
  }

  // show delete button if lesser than 30 sec
  enableDeliveryButton(dateTime: string): boolean {
    return moment(dateTime).diff(moment(), 'minutes') > -100;
  }

  deleteDeliveryStatus(data: any) {
    this.afs.removeDocumentArray('frontline-booking', data.id, data.delivery[data.delivery.length - 1]);

    this.bottomSheetRef.dismiss();
    this.snackBar.open('Delivery Stats Deleted Successfully!', 'OK', {
      duration: 5000,
    });

  }
  // todo: to show the confirmation before deleting / deleted status should be updated in list view
}
