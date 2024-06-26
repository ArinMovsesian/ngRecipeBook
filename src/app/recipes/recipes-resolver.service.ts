import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Recipe} from "./recipe.model";
import {Store} from "@ngrx/store";
import * as fromApp from '../store/app.reducer';
import * as RecipesActions from '../recipes/store/recipe.actions';
import {Actions, ofType} from '@ngrx/effects';
import {map, of, switchMap, take} from "rxjs";
@Injectable()
export class RecipesResolverService implements Resolve<Recipe[]>{
  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions,
  ) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
      return this.store.select('recipes').pipe(
        take(1),
        map(recipesState => {
          return recipesState.recipes;
        }),
        switchMap(recipes => {
          if (recipes.length === 0) {
            this.store.dispatch(new RecipesActions.FetchRecipes());
            return this.actions$.pipe(
              ofType(RecipesActions.SET_RECIPES),
              take(1)
            );
          } else {
            return of(recipes);
          }
        })
      )
  }
}
