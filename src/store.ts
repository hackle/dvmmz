import { AppState } from "./App.io";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

export function reduce(st: AppState | undefined, a: { type: string, payload: any }): AppState {
    return { countries: a.payload };
}  

export const store = createStore(reduce, applyMiddleware(thunk));