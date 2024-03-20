import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, of, switchMap, tap, throwError} from "rxjs";
import {HttpClient} from "@angular/common/http";

import * as AuthActions from './auth.actions';
import {environment} from "../../../environments/environment";
import {Action} from "@ngrx/store";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {AuthService} from "../auth.service";
import {User} from "../user.model";

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}
const handleAuthentication = (
  expiresIn: number,
  email: string,
  userId: string,
  token: string
) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));
  return new AuthActions.AuthenticateSuccess({
    email: email,
    userId: userId,
    token: token,
    expirationDate: expirationDate,
    redirect: true
  });
}
const handleError = (errorRes: any) => {
  let errorMessage = 'An unknown error occurred!';
  if (!errorRes.error || !errorRes.error.error) {
    return of(new AuthActions.AuthenticateFail(errorMessage));
  }
  switch (errorRes.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'This email exists already!';
      break;
    case 'EMAIL_NOT_FOUND':
      errorMessage = 'This email dos not exist';
      break;
    case 'INVALID_PASSWORD':
      errorMessage = 'This password is invalid';
      break;
  }
  return of(new AuthActions.AuthenticateFail(errorMessage));// return new Obs
}
@Injectable()
export class AuthEffects {
  //*** old version ***//
  // @Effect
  // authLogin = this.actions$.pipe(...)
  //*** old version ***//

  authSignup = createEffect(():any => this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupAction: AuthActions.SignupStart) => {
      return this.http.post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
        {
          email: signupAction.payload.email,
          password: signupAction.payload.password,
          returnSecureToken: true,
        }).pipe(
          tap(resDate => {
            this.authService.setLogoutTimer(+resDate.expiresIn * 1000); //millisecond
          }),
          map((resData: any) => {
            return handleAuthentication(
              +resData.expiresIn,
              resData.email,
              resData.localId,
              resData.idToken
            )
          }),
          catchError(errorRes => {
            return handleError(errorRes);
          })
        )
      })
    )
  )

  authLogin = createEffect((): any => this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http.post<AuthResponseData>(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" + environment.firebaseAPIKey,
        {
            email: authData.payload.email,
            password: authData.payload.password,
            returnSecureToken: true,
          }
        ).pipe(
          tap(resDate => {
            this.authService.setLogoutTimer(+resDate.expiresIn * 1000); //millisecond
          }),
          map(resData => {
            return handleAuthentication(
              +resData.expiresIn,
              resData.email,
              resData.localId,
              resData.idToken
            )
          }),
          catchError(errorRes => {
            return handleError(errorRes);
          }))
        }),
    )
  )

  authRedirect = createEffect(():any => this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
      if (authSuccessAction.payload.redirect) {
        this.router.navigate(['/']);
      }
    })
  ), {dispatch: false});


  autoLogin = createEffect(():any => this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      interface UserData {
        email: string;
        id: string;
        _token: string;
        _tokenExpirationDate: string;
      }
      const userData: UserData = JSON.parse(localStorage.getItem('userData') as string);
      console.log('userData', userData)
      if (!userData) {
        return {type: 'DUMMY'}
      }
      const loadedUser = new User(
        userData.email,
        userData.id,
        userData._token,
        new Date(userData._tokenExpirationDate) //create date obj
      );
      console.log('loadedUser', loadedUser);

      if (loadedUser.token) {
        const expirationDuration =  new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
        this.authService.setLogoutTimer(expirationDuration);
        return new AuthActions.AuthenticateSuccess({ // dispatch new action
          email: loadedUser.email,
          userId: loadedUser.id,
          token: loadedUser.token,
          expirationDate: new Date(userData._tokenExpirationDate),
          redirect: false
        })
      }
      return {type: 'DUMMY'}
    })
  ))


  authLogout = createEffect((): any => this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      this.authService.clearLogoutTimer();
      localStorage.removeItem('userData');
      this.router.navigate(['/auth']);
    })
  ), {dispatch: false})

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService) {}
}
