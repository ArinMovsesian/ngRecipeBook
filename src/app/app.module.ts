import { NgModule } from '@angular/core';
import {BrowserModule} from "@angular/platform-browser";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HeaderComponent} from "./header/header.component";
import {HttpClientModule} from "@angular/common/http";
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {StoreRouterConnectingModule} from '@ngrx/router-store';

import {SharedModule} from "./shared/shared.module";
import {CoreModule} from "./core.module";
import {LoggingService} from "./logging.service";
import { FooterComponent } from './footer/footer.component';
import * as fromApp from './store/app.reducer';
import {AuthEffects} from "./auth/store/auth.effects";
import {environment} from "../environments/environment";
import {RecipeEffects} from "./recipes/store/recipe.effects";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule, // must be load root level
    HttpClientModule, // must be load root level
    AppRoutingModule,
    // RecipesModule, // must be comment on lazyLoad
    // ShoppingListModule, // must be comment on lazyLoad
    // AuthModule, // must be comment on lazyLoad
    SharedModule,
    CoreModule,
    StoreModule.forRoot(fromApp.appReducer),
    EffectsModule.forRoot([AuthEffects, RecipeEffects]),
    StoreDevtoolsModule.instrument({logOnly: environment.production}),
    StoreRouterConnectingModule.forRoot()
  ],
  providers: [LoggingService],
  bootstrap: [AppComponent],
  // entryComponents: [ ---> if use Angular 9 > dont need
  //   AlertComponent
  // ]
})
export class AppModule { }
