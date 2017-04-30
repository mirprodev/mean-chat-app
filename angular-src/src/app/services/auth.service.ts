import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from "@angular/http";
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthService {
  // development
  apiUrl: string = "http://localhost:8080/users"; //!CHANGE this with the backend url

  // build
  // apiUrl: string = "/users";
  authToken: any;
  user: any;

  constructor(private http: Http) { }

  registerUser(user): any {
    let url: string = this.apiUrl + "/register";

    // prepare the request
    let headers = new Headers({ "Content-Type": "application/json" });
    let options = new RequestOptions({ headers: headers });
    let reqBody = user;

    // POST
    let observableReq = this.http.post(url, reqBody, options)
                                 .map(this.extractData);

    return observableReq;
  }

  authenticateUser(user): any {
    let url: string = this.apiUrl + "/authenticate";

    // prepare the request
    let headers = new Headers({ "Content-Type": "application/json" });
    let options = new RequestOptions({ headers: headers });
    let reqBody = user;

    // POST
    let observableReq = this.http.post(url, reqBody, options)
                                 .map(this.extractData);

    return observableReq;
  }

  getProfile(): any {
    let url: string = this.apiUrl + "/profile";
    this.loadToken();

    // prepare the request
    let headers = new Headers({
      "Content-Type": "application/json",
      "Authorization": this.authToken
    });
    let options = new RequestOptions({ headers: headers });

    // POST
    let observableReq = this.http.get(url, options)
                                 .map(this.extractData);

    return observableReq;
  }

  storeUserData(token, user): void {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  loadToken(): void {
    let token = localStorage.getItem("token");
    this.authToken = token;
  }

  loggedIn(): boolean {
    return tokenNotExpired();
  }

  logout(): void {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  extractData(res: Response): any {
    let body = res.json();
    return body || { };
  }

}
