import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { buildPickupEmails } from 'src/app/utils/request-email';

@Component({
  selector: 'app-pickup',
  templateUrl: './pickup.component.html',
  styleUrls: ['./pickup.component.scss'],
  standalone: false,
})
export class PickupComponent {
  shipmentType = 'Dox';
  mailSent = false;
  isSubmitting = false;
  mailError = '';

  constructor(private httpService: HttpServiceService) {}

  async sendPickup(form: NgForm): Promise<void> {
    if (form.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.mailError = '';

    try {
      const { team, customer } = buildPickupEmails(form.value);
      const teamSent = await this.httpService.sendEmail(team);
      const customerSent = customer ? await this.httpService.sendEmail(customer) : true;

      this.mailSent = teamSent && customerSent;

      if (this.mailSent) {
        this.mailError = '';
        form.resetForm({ shipmentType: 'Dox' });
        this.shipmentType = 'Dox';
      } else {
        this.mailError = 'Failed to send your request. Please contact us through email or phone.';
      }
    } catch (error) {
      console.error('Failed to submit pickup request', error);
      this.mailSent = false;
      this.mailError = 'Failed to send your request. Please contact us through email or phone.';
    } finally {
      this.isSubmitting = false;
    }
  }
}
