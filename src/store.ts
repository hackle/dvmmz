import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { ReducerRegistry } from "./reducers-lens";
import { composeWithDevTools } from 'redux-devtools-extension';
import { setSequentially } from 'tsminilens';
import { Image, Face, AppState, appStateTo, initialState } from './app.state'

type UpdateFaceAction = { imageId: string, faces: Face[] };
const actions = {
    UpdateImages: (payload: Image[]) => payload,
    UpdateFaces: (payload: UpdateFaceAction) => payload
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

const updateImages = (st: AppState, images: Image[]) => 
    setSequentially(appStateTo.images, images)
        .thenWith(appStateTo.currentImageId, images[0]?.id)
        .apply(st);

function updateFaces(st: AppState, { imageId, faces }: UpdateFaceAction) {
    return appStateTo.faces.over(st, fs => fs[imageId] ? fs : { ...fs, [imageId]: faces });
}

const reduce = new ReducerRegistry<AppState>()
    .register('UpdateImages', updateImages)
    .register('UpdateFaces', updateFaces)
    .toReducer();

export const store = createStore(reduce as any, initialState, composeWithDevTools(applyMiddleware(thunk)));