import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { statusRelation } from '../../constants/status-relation';
import { getDoxType } from '../../models/doxType';
import { getShipmentMode } from '../../models/shipmentMode';
import { getTransportMode } from '../../models/transportMode';
import { formatDate, toUnix } from 'src/app/utils/date-utils';
import { courierStatus, getShipmentStatus } from '../../../../../shared/courier-status';

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
  styleUrls: ['./track.component.scss'],
  standalone: false,
})
export class TrackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  courierStatus = courierStatus;
  statusRelation = statusRelation;
  getDoxType = getDoxType;
  getShipmentMode = getShipmentMode;
  getTransportMode = getTransportMode;
  statusList: DeliveryResult[] = [];
  trackResult: any;
  loader = true;
  status = false;

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.queryParamMap.get('id');
    const track = this.route.snapshot.queryParamMap.get('track');

    if (!id || !track || ['1', '2'].includes(track) === false) {
      this.router.navigate(['home']);
      return;
    }

    await this.getTrackingInfo(id, track);

    if (this.status && this.trackResult) {
      this.constructStatus();
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
  }

  async constructStatus() {
    this.statusList = [];

    if (this.trackResult) {
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

    this.statusList.sort((x, y) => x.fullDateTime - y.fullDateTime);
  }

  getDeliveryStatusText(id: number): string {
    return getShipmentStatus(id, '');
  }

  getStatusRelation(id: number | string): string {
    if (typeof id === 'string') return id as string;
    const found = statusRelation.find(x => x.RelationId === id);
    return found?.Name || '';
  }

  /**
   * Returns the resolved tracking URL for the current booking.
   * Uses courierTrack + courierMode from the API response (enriched by admin).
   * - 'link'     → replace <AWB> with referenceNumber (external courier deep-link)
   * - 'internal' → replace <AWB> with awbNumber (Frontline-managed / generic)
   * - 'api'      → no link (handled server-side)
   */
  getTrackUrl(): string {
    const mode: string = this.trackResult?.courierMode ?? 'internal';
    const rawUrl: string = this.trackResult?.courierTrack ?? '';

    if (!rawUrl || mode === 'api') return '';

    const awb =
      mode === 'link'
        ? (this.trackResult?.referenceNumber ?? this.trackResult?.awbNumber ?? '')
        : (this.trackResult?.awbNumber ?? '');

    return rawUrl.replace('<AWB>', awb).trim();
  }
}
