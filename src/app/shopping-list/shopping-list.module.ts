import {NgModule} from "@angular/core";
import {ShoppingListComponent} from "./shopping-list.component";
import {ShoppingEditComponent} from "./shopping-edit/shopping-edit.component";
import {RouterModule} from "@angular/router";
import {ShoppingListRoutingModule} from "./shopping-list-routing.module";
import {SharedModule} from "../shared/shared.module";
import {LoggingService} from "../logging.service";

@NgModule({
  declarations: [
    ShoppingListComponent,
    ShoppingEditComponent,
  ],
  imports: [
    SharedModule,
    // RouterModule,
    ShoppingListRoutingModule
  ],
  exports: [
    ShoppingListComponent,
    ShoppingEditComponent,
  ],
  providers: [LoggingService]
})
export class ShoppingListModule {}
