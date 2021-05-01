import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
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

}
