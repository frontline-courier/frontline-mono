import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MD5, enc } from 'crypto-js';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {

  constructor(
    private http: HttpClient,
  ) { }

  sendEmail(emailBody: string) {

    const currentTime = moment().utc().format();

    const headers: HttpHeaders =  new HttpHeaders({
      'x-api-request-time': currentTime,
      'x-api-key': `${MD5('epix.io').toString(enc.Hex)}.${MD5(currentTime).toString(enc.Hex)}`.toLowerCase(),
    });

    const options = {
      headers,
    };

    this.http.post(environment.apiUrl + environment.apiPaths.email, emailBody, options)
      .subscribe((data) => console.log(data));
  }
}
