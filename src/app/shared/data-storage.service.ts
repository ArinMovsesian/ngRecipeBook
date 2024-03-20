import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Recipe} from "../recipes/recipe.model";
import {exhaustMap, map, take, tap} from 'rxjs';
import {Store} from "@ngrx/store";
import * as fromApp from '../store/app.reducer';
import * as RecipesActions from '../recipes/store/recipe.actions';
@Injectable()
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private store: Store<fromApp.AppState>
    ) {}

  storeRecipes() {
    // const recipes = this.recipesService.getRecipes();
    // return this.http.put(
    //   'https://angular-project-19dee-default-rtdb.firebaseio.com/recipes.json',
    //   recipes);
  }


  fetchRecipes() {
      return this.http.get<Recipe[]>(
        'https://angular-project-19dee-default-rtdb.firebaseio.com/recipes.json')
        .pipe(
          map(recipes => {
            return recipes.map(recipes => {
              return {...recipes, ingredients: recipes.ingredients ? recipes.ingredients : []}
            })
          }),
          tap(
            recipes => {
              // this.recipesService.setRecipes(recipes);
              this.store.dispatch(new RecipesActions.SetRecipes(recipes));
          }))
  }
  fetchRecipes_NoInterceptor() { // user NgRx here
    // return this.authService.user.pipe(
    //     take(1), // take() get only one data and automatically unsubscribe;
    //     exhaustMap((user: any) => {
    //       return this.http.get<Recipe[]>(
    //         'https://angular-project-19dee-default-rtdb.firebaseio.com/recipes.json', {
    //           params: new HttpParams().set('auth', user.token)
    //         })
    //     }),
    //     map(recipes => {
    //       return recipes.map(recipes => {
    //         return {...recipes, ingredients: recipes.ingredients ? recipes.ingredients : []}
    //       })
    //     }),
    //     tap(
    //       recipes => {
    //         this.recipesService.setRecipes(recipes);
    //     })
    // )
  }


}
