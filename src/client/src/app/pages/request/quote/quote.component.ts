import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { buildQuoteEmails } from 'src/app/utils/request-email';

@Component({
  selector: 'app-quote',
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.scss'],
  standalone: false,
})
export class QuoteComponent {
  mailSent = false;
  isSubmitting = false;
  mailError = '';

  constructor(private httpService: HttpServiceService) {}

  async sendQuote(form: NgForm): Promise<void> {
    if (form.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.mailError = '';

    try {
      const { team, customer } = buildQuoteEmails(form.value);
      const teamSent = await this.httpService.sendEmail(team);
      const customerSent = customer ? await this.httpService.sendEmail(customer) : true;

      this.mailSent = teamSent && customerSent;

      if (this.mailSent) {
        this.mailError = '';
        form.resetForm();
      } else {
        this.mailError = 'Failed to send your request. Please contact us through email or phone.';
      }
    } catch (error) {
      console.error('Failed to submit quote request', error);
      this.mailSent = false;
      this.mailError = 'Failed to send your request. Please contact us through email or phone.';
    } finally {
      this.isSubmitting = false;
    }
  }
}
