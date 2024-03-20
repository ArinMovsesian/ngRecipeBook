import {NgModule} from "@angular/core";
import {DataStorageService} from "./shared/data-storage.service";
import {RecipesResolverService} from "./recipes/recipes-resolver.service";
import {AuthService} from "./auth/auth.service";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {AuthInterceptorService} from "./auth/auth-interceptor.service";
import {AuthGuardService} from "./auth/auth.guard.service";
import {LoggingService} from "./logging.service";

@NgModule({
  providers: [
    DataStorageService,
    RecipesResolverService,
    AuthService,
    AuthGuardService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    // LoggingService
  ]
})
export class CoreModule {}
