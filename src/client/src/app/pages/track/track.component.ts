import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { courierLists as fallbackCourierLists } from '../../constants/courier-list';
import { courierStatus } from '../../constants/courier-status';
import { statusRelation } from '../../constants/status-relation';
import { getDoxType } from '../../models/doxType';
import { getShipmentMode } from '../../models/shipmentMode';
import { getTransportMode } from '../../models/transportMode';
import { formatDate, toUnix } from 'src/app/utils/date-utils';

interface DeliveryResult {
  statusDate: string;
  statusTime: string;
  fullDateTime: number;
  status: string;
  remark: string;
}

interface CourierType {
  CourierId: number;
  Courier: string;
  Description: string;
  Track: string;
  Mode?: number;
  Status: number;
}

const COURIER_LISTS_CACHE_KEY = 'courierLists:v2';
const COURIER_LISTS_CACHE_TIME_KEY = 'courierListsTime:v2';
const LEGACY_COURIER_LISTS_CACHE_KEYS = ['courierLists', 'courierListsTime'];

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.scss'],
  standalone: false,
})
export class TrackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  courierStatus = courierStatus;
  courierLists: CourierType[] = [];
  statusRelation = statusRelation;
  getDoxType = getDoxType;
  getShipmentMode = getShipmentMode;
  getTransportMode = getTransportMode;
  statusList: DeliveryResult[] = [];
  trackResult: any;
  loader = true;
  status = false;
  courier: CourierType | undefined;
  courierAPIResult: any;
  courierAPIStatus: boolean = false;

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.queryParamMap.get('id');
    const track = this.route.snapshot.queryParamMap.get('track');

    if (!id || !track || ['1', '2'].includes(track) === false) {
      this.router.navigate(['home']);
      return;
    }

    await Promise.all([this.getCourierLists(), this.getTrackingInfo(id, track)]);

    if (this.status && this.trackResult) {
      this.constructStatus();
    }
  }

  async getCourierLists() {
    const cachedData = localStorage.getItem(COURIER_LISTS_CACHE_KEY);
    // If you previously used mergeCourierLists, replace with direct usage of fallbackCourierLists or API data as needed.
    const cacheTime = localStorage.getItem(COURIER_LISTS_CACHE_TIME_KEY);

    // Check if cached data exists and is less than 4 hours old
    if (cachedData && cacheTime) {
      const now = new Date().getTime();
      if (now - Number(cacheTime) < 4 * 60 * 60 * 1000) {
        // 4 hours in milliseconds
        try {
          const parsedData = JSON.parse(cachedData);

          if (Array.isArray(parsedData)) {
            // Use fallbackCourierLists directly since mergeCourierLists is removed
            this.courierLists = parsedData.length ? parsedData : fallbackCourierLists;
            return;
          }
        } catch (err) {
          console.warn('Invalid cached courier list. Fetching a fresh copy.', err);
        }

        localStorage.removeItem(COURIER_LISTS_CACHE_KEY);
        localStorage.removeItem(COURIER_LISTS_CACHE_TIME_KEY);
      }
    }

    for (const legacyKey of LEGACY_COURIER_LISTS_CACHE_KEYS) {
      localStorage.removeItem(legacyKey);
    }

    // Fetch new data if no valid cache
    try {
      const res = await fetch('https://next.frontlinecourier.com/api/couriers', { mode: 'cors' });
      const courierReponse = await res.json();
      // Use fallbackCourierLists directly since mergeCourierLists is removed
      const apiCouriers = Array.isArray(courierReponse?.couriers) ? courierReponse.couriers : [];
      this.courierLists = apiCouriers.length ? apiCouriers : fallbackCourierLists;
      // Cache the data and the current time
      localStorage.setItem(COURIER_LISTS_CACHE_KEY, JSON.stringify(this.courierLists));
      localStorage.setItem(COURIER_LISTS_CACHE_TIME_KEY, new Date().getTime().toString());
    } catch (err) {
      console.error('Error fetching courier lists:', err);
    }
  }

  async getTrackingInfo(id: string, track: string) {
    try {
      const res = await fetch(
        `https://next.frontlinecourier.com/api/bookings/find?track=${track}&id=${id}`,
        { mode: 'cors' }
      );
      const data = await res.json();

      if (data && data._id) {
        this.status = true;
        this.trackResult = data;
      } else {
        this.status = false;
      }
      this.loader = false;
    } catch (err) {
      console.log({ err });
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
    this.statusList = [];

    if (this.trackResult) {
      // set courier name, url, status, mode etc for html
      this.getCourier(this.trackResult.courier);
      // api call
      if (this.courier?.Mode === 3) {
        // // bluedart
        // if (this.courier.Courier.toLowerCase().includes('bluedart')) {
        //   try {
        //     this.loader = true;
        //     const res = await fetch(`https://kkdyyvadmd2r2lmlymjlkecaby0bosil.lambda-url.ap-south-1.on.aws/bluedart?awb=${this.trackResult.referenceNumber}`, {
        //       mode: 'cors',
        //       cache: 'force-cache'
        //     });
        //     this.courierAPIResult = await res.json();
        //   } catch (err) {
        //     console.log({ err });
        //     this.loader = false;
        //     this.courierAPIStatus = false;
        //   }
        // }
      }

      const status: DeliveryResult = {
        statusDate: formatDate(this.trackResult.bookedDate, 'MMM DD, YYYY'),
        statusTime: formatDate(this.trackResult.bookedDate, 'ddd, h:mm:ss a'),
        fullDateTime: toUnix(this.trackResult.bookedDate),
        status: 'Booked',
        remark: '',
      };
      this.statusList.push(status);
    }

    if (this.trackResult.delivery) {
      for (const delivery of this.trackResult.delivery) {
        const status: DeliveryResult = {
          statusDate: formatDate(delivery.statusDate, 'MMM DD, YYYY'),
          statusTime: formatDate(delivery.statusDate, 'ddd, h:mm:ss a'),
          fullDateTime: toUnix(delivery.statusDate),
          status: this.getDeliveryStatusText(delivery.statusId),
          remark: delivery.remark !== 'NULL' ? delivery.remark : '',
        };
        this.statusList.push(status);
      }
    }

    this.statusList.sort((x, y) => {
      return x.fullDateTime - y.fullDateTime;
    });
  }

  getDeliveryStatusText(id: number): string {
    if (typeof id === 'string') {
      return id;
    }
    const found = this.courierStatus.find(c => c.StatusId === id);
    return found?.ShipmentStatus || '';
  }

  getStatusRelation(id: number | string): string {
    if (typeof id === 'string') {
      return id as string;
    }
    const found = statusRelation.find(x => x.RelationId === id);
    return found?.Name || '';
  }

  getCourier(id: number): void {
    this.courier =
      this.courierLists.find(x => x.CourierId === id) ||
      fallbackCourierLists.find(x => x.CourierId === id);
  }

  getCourierName(id: number): string {
    return this.courierLists.find(x => x.CourierId === id)?.Courier || '';
  }

  getCourierUrl(id: number): string {
    return this.courierLists.find(x => x.CourierId === id)?.Track || '';
  }

  getCourierMode(id: number): number {
    return this.courierLists.find(x => x.CourierId === id)?.Mode || 1;
  }

  getCourierTrackUrl(courierId: number, awb: string): string {
    const url = this.getCourierUrl(courierId);
    return url ? url.replace('<AWB>', awb) : '';
  }
}
