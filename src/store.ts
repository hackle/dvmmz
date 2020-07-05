import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { ReducerRegistry } from "./reducers-lens";
import { composeWithDevTools } from 'redux-devtools-extension';
import { Image } from './cully.types';

export type AppState = {
    images?: Image[],
    currentImage?: Image
}

const initialState: AppState = {};

const actions = {
    UpdateImages: (payload: Image[]) => payload
};

type Parameter<T> = T extends (p: infer P) => any ? P : never;

export type ActionType = keyof typeof actions;
export type PayloadType<Ta extends ActionType> = Parameter<typeof actions[Ta]>;

type ActionsWithType = { 
    [P in keyof typeof actions]: (ps: Parameter<typeof actions[P]>) => { payload: Parameter<typeof actions[P]>, type: P }
};

export const makeAction: ActionsWithType = Object.keys(actions).reduce(
    (aggr, cur) => ({ 
        ...aggr, 
        [cur]: (payload: any) => ({ payload, type: cur }) 
    }),
    {}
) as any;

const reduce = new ReducerRegistry<AppState>()
    .register('UpdateImages', (st, payload) => ({ ...st, images: payload, currentImage: payload[0] }))
    .toReducer();

export const store = createStore(reduce as any, initialState, composeWithDevTools(applyMiddleware(thunk)));