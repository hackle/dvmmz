import { lensFrom, Lens } from "tsminilens";

export type Face = {
    id: string,
    xmin: number,
    ymin: number,
    xmax: number,
    ymax: number,
}

export type Image = {
    id: string,
    filename: string,
    url: string,
}

export type AppState = {
    images: Image[],
    currentImageId: string,
    faces: Record<string, Face[]>
}

type AppStateLenses = { [K in keyof AppState]: Lens<AppState, AppState[K]> };
const lensMaker = lensFrom<AppState>();
export const appStateTo: AppStateLenses = {
    images: lensMaker.to('images'),
    currentImageId: lensMaker.to('currentImageId'),
    faces: lensMaker.to('faces')
}

export const initialState: AppState = {
    images: [],
    currentImageId: '',
    faces: {}
};

export const currentImage = (st: AppState) => appStateTo.images?.view(st)?.find(img => img.id === st.currentImageId);