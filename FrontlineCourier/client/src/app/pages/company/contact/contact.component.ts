import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, EmailValidator } from '@angular/forms';
import { HttpServiceService } from 'src/app/services/http-service.service';
import * as moment from 'moment';

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

  sendEmail() {

    const emailBody = {
      to: ['Aravind from FrontlineCourier <aravin.it@gmail.com>', 'Varun from FrontlineCourier <varunn.cliquee@gmail.com>'],
      cc: undefined,
      bcc: undefined,
      from: "Varun from FrontlineCourier <noreply@epix.io>", // Use the email address or domain you verified above
      replyTo: this.contactForm.value.email || undefined,
      subject: `Contact Request - Frontlinecourier.com - ${this.contactForm.value.name} - ${moment().format('DD MMM YYYY h:mm A (ddd)')}`,
      text: this.contactForm.value.body,
      html:
        `<p>Hi Team,</p>
      <p>Contact Request received. Please find the details below:</p>
      <p><strong>Contact Person</strong>: ${this.contactForm.value.name}</p>
      <p><strong>Phone</strong>: ${this.contactForm.value.phone}</p>
      <p><strong>Email</strong>: <a href="mailto:${this.contactForm.value.email}">${this.contactForm.value.email}</a></p>
      <p><strong>Request</strong>:</p>
      <ul>
      <li>${this.contactForm.value.body}</li>
      </ul>
      <br/>
      <p>---</p>`,
    };
    this.httpService.sendEmail(emailBody)
      .then(
        (data) => {
          this.mailSent = true;
          this.mailCompleted = true;
        },
        (err) => {
          this.mailSent = false;
          this.mailCompleted = true;
        });


    const emailBody2 = {
      to: this.contactForm.value.email,
      cc: undefined,
      bcc: undefined,
      from: "Varun from FrontlineCourier <noreply@epix.io>", // Use the email address or domain you verified above
      replyTo: "Varun from FrontlineCourier <varunn.cliquee@gmail.com>",
      subject: `Thanks for reaching FrontlineCourier.com`,
      text: this.contactForm.value.body,
      html:
        `<p>Hi Team,</p>
          <p>Contact Request received. Please find the details below:</p>
          <p><strong>Contact Person</strong>: ${this.contactForm.value.name}</p>
          <p><strong>Phone</strong>: ${this.contactForm.value.phone}</p>
          <p><strong>Email</strong>: <a href="mailto:${this.contactForm.value.email}">${this.contactForm.value.email}</a></p>
          <p><strong>Request</strong>:</p>
          <ul>
          <li>${this.contactForm.value.body}</li>
          </ul>
          <br/>
          <p>---</p>`,
    };
    this.httpService.sendEmail(emailBody2)
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
