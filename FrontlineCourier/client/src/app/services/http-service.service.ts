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
    const host = environment.apiHost;
    const secretKey = host + '.' + MD5(currentTime).toString(enc.Hex);
    console.log(secretKey)
    

    try {
      const apiKey = jwt.sign({ secret: environment.apiKey }, secretKey).toString();
    } catch (err)
    {
      console.log(err)
    }

    const headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-api-request-time': currentTime,
      // 'x-api-key': apiKey,
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
