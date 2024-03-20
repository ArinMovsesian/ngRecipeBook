import {Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {NgForm} from "@angular/forms";
import {Subscription} from "rxjs";
import {AlertComponent} from '../shared/alert/alert.component';
import {PlaceholderDirective} from "../shared/placeholder/placeholder.directive";
import {Store} from "@ngrx/store";
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class  AuthComponent implements OnInit,OnDestroy{
  isLoginMode = true;
  isLoading = false;
  error: string | null = null;
  @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective; // dynamic component via programmatically (not-recommend)
  private closeSub: Subscription;
  private storeSub: Subscription;
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver, // dynamic component via programmatically (not-recommend)
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.storeSub = this.store.select('auth').subscribe(authState => {
        // debugger;
        this.isLoading = authState.loading;
        this.error = authState.authError;
        if(this.error) {
          this.showErrorAlert(this.error)
        }
        // if (authState.user) {
        //   this.router.navigate([''])
        // }
    });
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    console.log(form.value);
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    this.isLoading = true;
    if (this.isLoginMode) {
       // authObs = this.authService.login(email, password);
      this.store.dispatch(new AuthActions.LoginStart({email: email, password: password}));
    } else {
       // authObs = this.authService.signup(email, password);
      this.store.dispatch(new AuthActions.SignupStart({email: email, password: password}));
    }


    // authObs.subscribe(resData => {
    //   console.log(resData);
    //   this.isLoading = false;
    //   this.router.navigate(['/recipes']);
    // }, errorMessage => {
    //   console.log(errorMessage);
    //   this.error = errorMessage;
    //   this.showErrorAlert(errorMessage); // dynamic component via programmatically (not-recommend)
    //   this.isLoading = false;
    // });
    // form.reset();
  }

  onHandleError() {
    // this.error = null;
    this.store.dispatch(new AuthActions.ClearError());
  }


  ngOnDestroy() {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }


  // dynamic component via programmatically (not-recommend)
  private showErrorAlert(message: string) {
    // const alertCmp = new AlertComponent(); // ---> not valid angular code
    const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();
    const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);
    componentRef.instance.message = message;
    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe();
      hostViewContainerRef.clear();
    })
  }
}
