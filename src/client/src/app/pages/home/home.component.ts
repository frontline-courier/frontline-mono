import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false
})
export class HomeComponent implements OnInit {

  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
  ) { }
  
  trackForm: UntypedFormGroup;

  ngOnInit(): void {
    this.trackForm = this.formBuilder.group({
      id: ['', [Validators.required]],
      track: ['1', [Validators.required]],
    });
  }

  gotoTrack() {
    this.router.navigate(['track'], { queryParams: this.trackForm.value } );
  }

}
