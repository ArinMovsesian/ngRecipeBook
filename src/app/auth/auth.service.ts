import {Injectable} from "@angular/core";
import {Store} from "@ngrx/store";
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';

@Injectable()
export class AuthService {
  private tokenExpirationTimer: any;
  constructor(
    private store: Store<fromApp.AppState>
    ) {}
  setLogoutTimer(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
     this.store.dispatch(new AuthActions.Logout());
    }, expirationDuration) //millisecond
  }

  clearLogoutTimer() {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }
}
