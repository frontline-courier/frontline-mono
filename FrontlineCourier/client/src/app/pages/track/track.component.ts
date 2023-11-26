import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { courierStatus } from '../../constants/courier-status';
import { courierLists } from '../../constants/courier-list';
import { statusRelation } from '../../constants/status-relation';
import { getDoxType } from '../../models/doxType';
import { getShipmentMode } from '../../models/shipmentMode';
import { getTransportMode } from '../../models/transportMode';
import * as moment from 'moment';

interface DeliveryResult {
  statusDate: string;
  statusTime: string;
  fullDateTime: number;
  status: string;
  remark: string;
}

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.scss']
})
export class TrackComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  courierStatus = courierStatus;
  courierLists = courierLists;
  statusRelation = statusRelation;
  getDoxType = getDoxType;
  getShipmentMode = getShipmentMode;
  getTransportMode = getTransportMode;
  statusList: DeliveryResult[] = [];
  trackResult: any;
  loader = true;
  status = false;

  ngOnInit(): void {
    let id = this.route.snapshot.queryParamMap.get('id');
    let track = this.route.snapshot.queryParamMap.get('track');

    if (id === '' || track === '' || ['1', '2'].includes(track) === false) {
      this.router.navigate(['home']);
    }
    this.getTrackingInfo(id, track);
  }

  async getTrackingInfo(id: string, track: string) {

    try {
      const res = await fetch(`https://next.frontlinecourier.com/api/bookings/find?track=${track}&id=${id}`, { mode: 'cors'});
      const data = await res.json();
      console.log(data);

      if (data) {
        this.status = true;
        this.trackResult = data;
        this.constructStatus();
      } else {
        this.status = false;
      }
      this.loader = false;
    } catch (err) {
      this.loader = false;
      this.status = false;
    }

    // return this.firestore.collection('frontline-booking', (query) => query.where(searchType, '==', id))
    //   .valueChanges()
    //   .subscribe((data) => {
    //     if (data.length === 1) {
    //       this.status = true;
    //       this.trackResult = data[0];
    //       this.constructStatus();
    //     } else {
    //       this.status = false;
    //     }
    //     this.loader = false;
    //   }, ((err) => {
    //     this.loader = false;
    //     this.status = false;
    //   }));
  }

  async constructStatus() {

    if (this.trackResult) {
      const status: DeliveryResult = {
        statusDate: moment((this.trackResult.bookedDate)).format('MMM DD, YYYY'),
        statusTime: moment((this.trackResult.bookedDate)).format('ddd, h:mm:ss a'),
        fullDateTime: moment((this.trackResult.bookedDate)).unix(),
        status: 'Booked',
        remark: '',
      }
      this.statusList.push(status);
    }

    if (this.trackResult.delivery) {
      for (const delivery of this.trackResult.delivery) {
        const status: DeliveryResult = {
          statusDate: moment(delivery.statusDate).format('MMM DD, YYYY'),
          statusTime: moment(delivery.statusDate).format('ddd, h:mm:ss a'),
          fullDateTime: moment(delivery.statusDate).unix(),
          status: this.getDeliveryStatusText(delivery.statusId),
          remark: delivery.remark !== 'NULL' ? delivery.remark : '',
        }
        this.statusList.push(status);
      }
    }

    this.statusList.sort((x, y) => { return x.fullDateTime - y.fullDateTime })
  }

  getDeliveryStatusText(id: number): string {
    if (typeof id === 'string') { return id; }
    return this.courierStatus.find((c) => c.StatusId === id).ShipmentStatus;
  }

  getStatusRelation(id: number | string): string {
    if (typeof id === 'string') {
      return id as string;
    }
    return statusRelation.find((x) => x.RelationId === id).Name;
  };

  getCourierName(id: number): string {
    return courierLists.find((x) => x.CourierId === id).Courier;
  };

  getCourierUrl(id: number): string {
    return courierLists.find((x) => x.CourierId === id).Track;
  };

}
