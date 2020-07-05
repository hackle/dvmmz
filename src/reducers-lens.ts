import { Reducer } from "react";
import { ActionType, PayloadType } from "./store";

export type IAppAction<TPayload> = { type: string, payload?: TPayload }

export class ReducerRegistry<TState> {
    private reducerFns: Reducer<TState, any>[] = [];

    register(ty: ActionType, reduce: (_st: TState, _payload: PayloadType<ActionType>) => TState): ReducerRegistry<TState> {
        this.reducerFns.push(
            (st: TState, action: IAppAction<PayloadType<ActionType>>) => 
                action.type === ty ? reduce(st, action.payload as any) : st);

        return this;
    }

    toReducer(): Reducer<TState, IAppAction<any>> {
        return (state: TState, action: IAppAction<any>) =>
            this.reducerFns.reduce((st, fn) => fn(st, action), state);
    }
}