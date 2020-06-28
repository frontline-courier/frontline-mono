import { Component, OnInit } from '@angular/core';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { FormBuilder, FormGroup, Validators, EmailValidator } from '@angular/forms';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  contactForm: FormGroup;
  mailSent: boolean;
  mailCompleted: boolean;

  constructor(
    private recaptchaV3Service: ReCaptchaV3Service,
    private formBuilder: FormBuilder,
    private httpService: HttpServiceService,
  ) { }

  ngOnInit(): void {

    this.contactForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [new EmailValidator()]],
      phone: ['', []],
      body: ['', [Validators.required]],
    });
  }

  sendEmail( ) {

    const emailBody = {
      to: ['Aravind A <aravin.it@gmail.com>', 'Varun A <varunn.cliquee@gmail.com>'],
      cc: undefined,
      bcc: undefined,
      from: "Varun A <varun@frontlinecourier.com", // Use the email address or domain you verified above
      replyTo: this.contactForm.value.email || undefined,
      subject: 'Contact Request - Frontlinecourier.com ' + new Date().toDateString(),
      text: this.contactForm.value.body,
      html:
      `<p>Hi Team,</p>
      <p>&nbsp;</p>
      <p>Contact Request received. Please find the details below:</p>
      <p><strong>Contact Person</strong>: ${this.contactForm.value.name}</p>
      <p><strong>Phone</strong>: ${this.contactForm.value.phone}</p>
      <p><strong>Email</strong>: <a href="mailto:${this.contactForm.value.email}">${this.contactForm.value.email}</a></p>
      <p>&nbsp;</p>
      <p><strong>Request</strong>:</p>
      <ul>
      <li>${this.contactForm.value.body}</li>
      </ul>
      <p>&nbsp;</p>
      <p>---</p>`,
    };
    this.httpService.sendEmail(JSON.stringify(emailBody))
      .then(
        (data) => {
          this.mailSent = true;
          this.mailCompleted = true;
        },
        (err) => {
          this.mailSent = false;
          this.mailCompleted = true;
        });
  }

}
