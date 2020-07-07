import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { ReducerRegistry } from "./reducer-registry";
import { composeWithDevTools } from 'redux-devtools-extension';
import { setSequentially } from 'tsminilens';
import { Image, Face, AppState, appStateTo, initialState } from './app.state'

export type UpdateFacesPayload = { imageId: string, faces: Face[] };
export type DeleteFacePayload = { imageId: string, faceId: string };

const actions = {
    UpdateImages: (payload: Image[]) => payload,
    UpdateFaces: (payload: UpdateFacesPayload) => payload,
    DeleteFace: (payload: DeleteFacePayload) => payload,
    UpdateImageIndex: (offset: number) => offset
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

function updateFaces(st: AppState, { imageId, faces }: UpdateFacesPayload) {
    return appStateTo.faces.over(st, fs => fs[imageId] ? fs : { ...fs, [imageId]: faces });
}

const deleteFace = (st: AppState, { faceId, imageId }: DeleteFacePayload) =>
    appStateTo.faces.then.to(imageId).over(st, fs => fs.filter(f => f.id !== faceId));

function updateImageIndex(st: AppState, offset: number) {
    return appStateTo.currentImageId.over(st, cur => st.images[moveIndex(findCurrentIndex(cur), offset)].id);

    function findCurrentIndex(imageId: string): number {
        const [ [, cur]] = st.images.map((m, idx) => [m, idx] as [Image, number])
            .filter(([m, idx]) => m.id === imageId);

        return cur;
    }

    function moveIndex(cur: number, offset: number) {
        return Math.min(Math.max(0, cur + offset), st.images.length - 1);
    }
}

export const reduce = new ReducerRegistry<AppState>()
    .register('UpdateImages', updateImages)
    .register('UpdateFaces', updateFaces)
    .register('DeleteFace', deleteFace)
    .register('UpdateImageIndex', updateImageIndex)
    .toReducer();

export const store = createStore(reduce as any, initialState, composeWithDevTools(applyMiddleware(thunk)));