import {Actions, createEffect, ofType} from "@ngrx/effects";
import * as RecipesActions from './recipe.actions';
import {map, switchMap, withLatestFrom} from "rxjs";
import {Recipe} from "../recipe.model";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {STORE_RECIPES} from "./recipe.actions";
import {Store} from "@ngrx/store";
import * as fromApp from '../../store/app.reducer';
@Injectable()
export class RecipeEffects {
  fetchRecipes = createEffect((): any => this.actions$.pipe(
    ofType(RecipesActions.FETCH_RECIPES),
    switchMap(() => {
      return this.http.get<Recipe[]>(
        'https://angular-project-19dee-default-rtdb.firebaseio.com/recipes.json')
      }),
    map(recipes => {
      return recipes.map(recipes => {
        return {...recipes, ingredients: recipes.ingredients ? recipes.ingredients : []}
      })
    }),
    map(recipes => {
      return new RecipesActions.SetRecipes(recipes);
    })
  ))

  storeRecipes = createEffect(() => this.actions$.pipe(
    ofType(RecipesActions.STORE_RECIPES),
    withLatestFrom(this.store.select('recipes')),
    switchMap(([actionData, recipesState]) => {
      return this.http.put(
        'https://angular-project-19dee-default-rtdb.firebaseio.com/recipes.json',
        recipesState.recipes);
    })
  ), {dispatch: false})
  constructor(private actions$: Actions, private http: HttpClient, private store: Store<fromApp.AppState>) {}
}
