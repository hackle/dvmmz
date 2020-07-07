import { Face, Image } from "./AppState";

type Parameter<T> = T extends (p: infer P) => any ? P : never;

export type UpdateFacesPayload = { imageId: string, faces: Face[] };
export type DeleteFacePayload = { imageId: string, faceId: string };

// Note: return values of lambdas are not really used, see "makeAction"
const actions = {
    UpdateImages: (images: Image[]) => images,
    UpdateFaces: (payload: UpdateFacesPayload) => payload,
    DeleteFace: (payload: DeleteFacePayload) => payload,
    UpdateImageIndex: (offset: number) => offset,
    AppError: (error: string) => error,
};

// below typing removes the need of passing and matching against in action types
// see how it's used in "reducer"
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
