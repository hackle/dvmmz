import Axios from "axios";
import { Dispatch } from "react";
import { IAppAction } from "./reducer-registry";
import { makeAction } from "./store";

export const appIOFactory = (dispatch: Dispatch<IAppAction<any>>) => ({
    getImages: async () => {
        const { data: str } = await Axios.get(`https://cully-api.herokuapp.com/images`);
        const { data: images } = JSON.parse(str);    
        dispatch(makeAction.UpdateImages(images));
    },
    getFaces: async (imageId: string) => {
        const { data: str } = await Axios.get(`https://cully-api.herokuapp.com/images/${imageId}/faces`);
        const { data: faces } = JSON.parse(str);
        dispatch(makeAction.UpdateFaces({ imageId, faces }));
    },
    deleteFace: async (faceId: string, imageId: string) => dispatch(makeAction.DeleteFace({ faceId, imageId }))
});

export type AppIO = ReturnType<typeof appIOFactory>;