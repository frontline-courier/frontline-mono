import { Component, OnInit } from '@angular/core';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private recaptchaV3Service: ReCaptchaV3Service,
    private formBuilder: FormBuilder,
    private router: Router,
  ) { }
  
  trackForm: FormGroup;

  ngOnInit(): void {
    this.trackForm = this.formBuilder.group({
      id: ['', [Validators.required]],
      track: ['', [Validators.required]],
    });
  }

  gotoTrack() {
    this.router.navigate(['track'], { queryParams: this.trackForm.value } );
  }

  public executeImportantAction(): void {
    this.recaptchaV3Service.execute('importantAction')
      .subscribe((token) => console.log(token));
  }
}
