import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  async sendEmail(emailBody: string): Promise<boolean> {

    const currentTime = moment().utc().format();

    const headers: HttpHeaders =  new HttpHeaders({
      'x-api-request-time': currentTime,
      'x-api-key': `${MD5('epix.io').toString(enc.Hex)}.${MD5(currentTime).toString(enc.Hex)}`.toLowerCase(),
    });

    const options = {
      headers,
    };

    let status = false;

   this.http.post(environment.apiUrl + environment.apiPaths.email, emailBody, options)
      .subscribe(
        (data) => { status = true},
        (err) => { status = false});


    return status;
  }
}
