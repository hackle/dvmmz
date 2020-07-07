import Axios from "axios";
import { Dispatch } from "react";
import { IAppAction } from "./Store.reducer-registry";
import { makeAction } from "./Store.actions";

export const appIOFactory = (dispatch: Dispatch<IAppAction<any>>) => {
    // easy memorization of HTTP calls for faces 
    const imagesWithFaces = new Set<string>();

    return {
        getImages: async () => handleApiError(async () => {
            const { data: str } = await Axios.get(`https://cully-api.herokuapp.com/images`);
            const { data: images } = JSON.parse(str);    
            dispatch(makeAction.UpdateImages(images));
        }),
        getFaces: async (imageId: string) => handleApiError(async () => {
            if (imagesWithFaces.has(imageId)) return;

            const { data: str } = await Axios.get(`https://cully-api.herokuapp.com/images/${imageId}/faces`);
            const { data: faces } = JSON.parse(str);
            dispatch(makeAction.UpdateFaces({ imageId, faces }));
            imagesWithFaces.add(imageId);
        }),
        deleteFace: (faceId: string, imageId: string) => dispatch(makeAction.DeleteFace({ faceId, imageId })),
        nextImage: () => dispatch(makeAction.UpdateImageIndex(1)),
        prevImage: () => dispatch(makeAction.UpdateImageIndex(-1)),
    };

    async function handleApiError(func: () => Promise<void>) {
        try {
            await func();
        } catch (err) {
            dispatch(makeAction.AppError(err?.response?.data ?? `There was an error: ${err}`));
        }
    }
};

export type AppIO = ReturnType<typeof appIOFactory>;