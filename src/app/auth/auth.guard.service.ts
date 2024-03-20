import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Injectable} from "@angular/core";
import {map, Observable, take, tap} from "rxjs";
import {AuthService} from "./auth.service";
import {Store} from "@ngrx/store";
import * as fromApp from '../store/app.reducer';
@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
  {
    return this.store.select('auth').pipe(
      take(1),// take() get only one data and automatically unsubscribe;
      map(authState => {
        return authState.user;
      }),
      map(user => {
        // return user ? true : false;
        const isAuth = !!user;
        if (isAuth) {
          return true;
        }
        return this.router.createUrlTree(['/auth']);
      }),
      //******* old version angular use tap() operator *****//
      // tap(isAuth => {
      //     if(!isAuth) {
      //       this.router.navigate(['/auth']);
      //     }
      //   }
      // )
    );
  }
}
