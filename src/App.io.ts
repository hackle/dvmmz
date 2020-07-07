import Axios from "axios";
import { Dispatch } from "react";
import { IAppAction } from "./store-reducer-registry";
import { makeAction } from "./store-actions";

export const appIOFactory = (dispatch: Dispatch<IAppAction<any>>) => {
    // easy memorization of HTTP calls for faces 
    const imagesWithFaces = new Set<string>();

    return {
        getImages: async () => {
            const { data: str } = await Axios.get(`https://cully-api.herokuapp.com/images`);
            const { data: images } = JSON.parse(str);    
            dispatch(makeAction.UpdateImages(images));
        },
        getFaces: async (imageId: string) => {
            if (imagesWithFaces.has(imageId)) return;

            const { data: str } = await Axios.get(`https://cully-api.herokuapp.com/images/${imageId}/faces`);
            const { data: faces } = JSON.parse(str);
            dispatch(makeAction.UpdateFaces({ imageId, faces }));
            imagesWithFaces.add(imageId);
        },
        deleteFace: (faceId: string, imageId: string) => dispatch(makeAction.DeleteFace({ faceId, imageId })),
        nextImage: () => dispatch(makeAction.UpdateImageIndex(1)),
        prevImage: () => dispatch(makeAction.UpdateImageIndex(-1)),
    };
};

export type AppIO = ReturnType<typeof appIOFactory>;