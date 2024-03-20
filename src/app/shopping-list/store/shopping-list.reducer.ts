import {Action} from "@ngrx/store";
import {Ingredient} from "../../shared/ingredient-model";
import * as ShoppingListActions from "./shopping-list.actions";
import {ShoppingListActionsTypes} from "./shopping-list.actions";

export interface State{
  ingredients: Ingredient[];
  editedIngredient: Ingredient | null;
  editedIngredientIndex: number;
}

const initialState: State = {
  ingredients: [
      new Ingredient('Apples', 5),
      new Ingredient('Oranges', 10),
  ],
  editedIngredient: null,
  editedIngredientIndex: -1
};

export function shoppingListReducer(
  state:State = initialState,
  action: ShoppingListActions.ShoppingListActionsTypes
) {
    console.log('shoppingListReducer', state)
    switch (action.type) {
      case ShoppingListActions.ADD_INGREDIENT:
        return {
          ...state,
          ingredients: [...state.ingredients, action.payload]
        };
      case ShoppingListActions.ADD_INGREDIENTS:
        return {
          ...state,
          ingredients: [...state.ingredients, ...action.payload]
        }
      case ShoppingListActions.UPDATE_INGREDIENT:
        // debugger;
        const ingredient = state.ingredients[state.editedIngredientIndex];
        const updatedIngredient = {
          ...ingredient,
          ...action.payload //overwrite
        };
        const updatedIngredients = [...state.ingredients];
        updatedIngredients[state.editedIngredientIndex] = updatedIngredient;
        return {
          ...state,
          ingredients: updatedIngredients,
          editedIngredientIndex: -1,
          editedIngredient: null
        };
      case ShoppingListActions.DELETE_INGREDIENT:
        return  {
          ...state,
          ingredients: state.ingredients.filter((ig, igIndex) => igIndex !== state.editedIngredientIndex),// filter() return new Array
          editedIngredientIndex: -1,
          editedIngredient: null
        };
      case ShoppingListActions.START_EDIT:
        return {
          ...state,
          editedIngredientIndex: action.payload, // 3
          editedIngredient: {...state.ingredients[action.payload]}
        };
      case ShoppingListActions.STOP_EDIT:
        return {
          ...state,
          editedIngredient: null,
          editedIngredientIndex: -1
        };
      default:
        return state;
    }
}
