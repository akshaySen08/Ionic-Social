import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {

  user: BehaviorSubject<any>;
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  ngOnInit() { }

  login(username, password) {
    return this.http.post(`${this.apiUrl}login`,
      {
        email: username,
        password: password
      }).pipe(
        catchError(this.handleError),
        tap(resposneData => {
          this.handleAuthentication(
            resposneData['email'],
            resposneData['token'],
            resposneData['expires_at']
          )
        })
      );
  }

  private handleAuthentication(email: string, token: string, expiresIn) {
    expiresIn = new Date(expiresIn);
    let expireDuration = new Date(expiresIn).getTime() - new Date().getTime();

    const user = [email, token, expiresIn.getTime()]

    this.user.next(user);
  }

  private handleError(errRes: HttpErrorResponse) {

    console.log(errRes);

    let errorMessage = 'An unknown error occoured.';

    if (!errRes.error || !errRes.error.error) {
      return throwError(errorMessage);
    }

    switch (errRes.error.error.message) {
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email is not registered';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'Entered password is invalid';
        break;
      case 'EMAIL_EXISTS':
        errorMessage = 'This email alreay exists';
        break;
    }

    return throwError(errorMessage);
  }
}
