import { Component, OnInit } from '@angular/core';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { FormBuilder, FormGroup, Validators, EmailValidator } from '@angular/forms';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { getMaxListeners } from 'process';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  contactForm: FormGroup;

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
      subject: 'Contact Request - Frontlinecourier.com',
      text: this.contactForm.value.body,
      html: this.contactForm.value.body,
    };
    this.httpService.sendEmail(JSON.stringify(emailBody));
  }

}
