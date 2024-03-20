import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {Observable, Subscription} from "rxjs";

import {Ingredient} from "../shared/ingredient-model";
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';
import * as fromApp from '../store/app.reducer';
@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients$: Observable<{ingredients: Ingredient[]}>;
  private igChangeSub: Subscription;

  constructor(
    private store: Store<fromApp.AppState>
  ) {
  }

  ngOnInit() {
    this.ingredients$ = this.store.select('shoppingList');
    // this.store.select('shoppingList').subscribe((state) => {
    //   console.log(state.editedIngredientIndex)
    // }); // alternative
  }
  onEditItem(index: number){
    this.store.dispatch(new ShoppingListActions.StartEdit(index))
  }
  ngOnDestroy() {
    // this.igChangeSub.unsubscribe();
  }

}
