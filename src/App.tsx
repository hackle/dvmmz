import React, { useEffect, useRef } from 'react';
import './App.scss';
import { AppIO } from './App.io';
import { connect } from 'react-redux';
import { Image, AppState, currentImage, Face } from './app.state';
import FaceBox from './FaceBox';

type AppProps = {
  io: AppIO,
  image?: Image,
  faces: Face[]
}

function App({ image, faces, io }: AppProps) {
  useEffect(() => { io.getImages(); }, [io]);
  useEffect(() => { image && io.getFaces(image.id)}, [image, io]);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="App">
      {image
        ? <div className="image-container" ref={containerRef}>
            <img src={image.url} alt={image.filename}/>
            {
              faces.map(face => 
                (<FaceBox key={face.id} face={face} container={containerRef} />)
              )
            }
          </div>
        : <div>Loading...</div> 
      }
    </div>
  );
}

const mapStateToProps = (st: AppState) => {
  const image = currentImage(st);
  return {
    image,
    faces: st.faces[image?.id ?? ''] ?? []
  };
}

export default connect(mapStateToProps)(App);
