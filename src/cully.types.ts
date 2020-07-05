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
    faces?: Face[]
}