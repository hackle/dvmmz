import React, { CSSProperties, useState, RefObject, useLayoutEffect } from "react";
import { Face } from "./app.state";

type Viewport = { x: number, y: number, width: number, height: number };
const emptyViewport: Viewport = { x: 0, y: 0, width: 0, height: 0};

export type FaceProps = {
    face: Face,
    container: RefObject<HTMLDivElement>
};

export function FaceBox({ face, container }: FaceProps) {
    const [ viewport, setViewport] = useState<Viewport>(emptyViewport);

    useLayoutEffect(() => {
        window.addEventListener('resize', updateViewport);
        updateViewport();
        return () => window.removeEventListener('resize', updateViewport);

        function updateViewport() {
            setViewport(container.current?.getBoundingClientRect() ?? emptyViewport);
        }
      }, [ container ]);

    const styles: CSSProperties = {
        position: 'absolute',
        display: 'block',
        border: '1px solid green',
        left: viewport.width * face.xmin,
        top: viewport.height * face.ymin,
        height: viewport.height * (face.ymax - face.ymin),
        width: viewport.width * (face.xmax - face.xmin),
    };

    return <div style={styles}>
    </div>
}

export default FaceBox;