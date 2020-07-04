import Axios from "axios";
import { Dispatch } from "react";
import { AnyAction, Action } from "redux";

export type Country = {
    id: number,
    name: string,
    capitalCity: string
};

export type AppState = {
    countries: Country[]
}

export const appIOFactory = (dispatch: Dispatch<any>) => ({
    getCountries: () => Axios.get(`http://api.worldbank.org/v2/country?format=json`)
            .then(({ data: [ , countries ] }) => dispatch({ type: 'abc', payload: countries }))
});

export type AppIO = ReturnType<typeof appIOFactory>;