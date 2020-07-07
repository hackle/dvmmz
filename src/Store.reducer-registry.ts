import { Reducer } from "react";
import { ActionType, PayloadType } from "./Store.actions";

export type IAppAction<TPayload> = { type: string, payload?: TPayload }

export class ReducerRegistry<TState> {
    private reducerFns: Reducer<TState, any>[] = [];

    register<Ty extends ActionType>(ty: Ty, reduce: (_st: TState, _payload: PayloadType<Ty>) => TState): ReducerRegistry<TState> {
        this.reducerFns.push(
            (st: TState, action: IAppAction<PayloadType<Ty>>) => 
                action.type === ty ? reduce(st, action.payload as any) : st);

        return this;
    }

    toReducer(): Reducer<TState, IAppAction<any>> {
        return (state: TState, action: IAppAction<any>) =>
            this.reducerFns.reduce((st, fn) => fn(st, action), state);
    }
}