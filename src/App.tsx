import React, { useEffect } from 'react';
import './App.scss';
import { AppIO } from './App.io';
import { connect } from 'react-redux';
import { Image } from './cully.types';
import { AppState } from './store';

type AppProps = {
  io: AppIO,
  image?: Image
}

function App({ image, io }: AppProps) {
  useEffect(() => { io.getImages(); }, [io]);

  return (
    <div className="App">
      {image
        ? <div className="image-container">
            <img src={image.url} alt={image.filename}/>
          </div>
        : <div>Loading...</div> 
      }
    </div>
  );
}

export default connect((st: AppState) => ({
    image: (st || {}).currentImage
  })
)(App);
