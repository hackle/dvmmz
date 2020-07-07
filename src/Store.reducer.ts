import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { ReducerRegistry } from "./Store.reducer-registry";
import { composeWithDevTools } from 'redux-devtools-extension';
import { setSequentially } from 'tsminilens';
import { Image, AppState, appStateTo, initialState } from './AppState'
import { UpdateFacesPayload, DeleteFacePayload } from "./Store.actions";

const updateImages = (st: AppState, images: Image[]) => 
    setSequentially(appStateTo.images, images)
        .thenWith(appStateTo.currentImageId, images[0]?.id)
        .apply(st);

function updateFaces(st: AppState, { imageId, faces }: UpdateFacesPayload) {
    return appStateTo.faces.then.to(imageId).set(st, faces);
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
    .register('AppError', (s, p) => appStateTo.error.set(s, p))
    .toReducer();

export const store = createStore(reduce as any, initialState, composeWithDevTools(applyMiddleware(thunk)));