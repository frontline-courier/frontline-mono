import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MD5, enc } from 'crypto-js';
import * as moment from 'moment';
import * as jwt from 'jsonwebtoken';

@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {

  constructor(
    private http: HttpClient,
  ) { }

  async sendEmail(emailBody: any): Promise<boolean> {

    const currentTime = moment().utc().format();
    const apiSecret = 'epix.io';
    const secretKey = MD5(apiSecret).toString(enc.Hex) + '.' + MD5(currentTime).toString(enc.Hex);
    const apiKey = MD5(secretKey).toString(enc.Hex);

    const headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-api-request-time': currentTime,
      'x-api-token': apiKey,
    });

    const options = {
      headers,
    };

    let status = false;

    this.http.post(environment.apiUrl + environment.apiPaths.email, emailBody, options)
      .subscribe(
        (data) => { status = true },
        (err) => { console.log(err); status = false;  });


    return status;
  }
}
