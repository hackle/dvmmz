import Axios from "axios";
import { Dispatch } from "react";
import { Image } from './cully.types';
import { IAppAction } from "./reducers-lens";
import { makeAction } from "./store";

export const appIOFactory = (dispatch: Dispatch<IAppAction<Image[]>>) => ({
    getImages: () => {
        Axios.get(`https://cully-api.herokuapp.com/images`)
            .then(({ data: str }) => {
                const { data: images } = JSON.parse(str);    
                dispatch(makeAction.UpdateImages(images))
            });
    }
});

export type AppIO = ReturnType<typeof appIOFactory>;