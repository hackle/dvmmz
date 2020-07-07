import React, { useEffect, useRef, useState } from 'react';
import './App.scss';
import { AppIO } from './App.io';
import { connect } from 'react-redux';
import { Image, AppState, currentImage, Face } from './app.state';
import FaceBox from './FaceBox';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Backdrop, CircularProgress } from '@material-ui/core';
import ArrowForward from '@material-ui/icons/ArrowForward';
import ArrowBack from '@material-ui/icons/ArrowBack';
import logo from './logo.png';
import cully from './cully.png';

type AppProps = {
  io: AppIO,
  image?: Image,
  faces: Face[]
}

type MenuState = { x?: number, y?: number, faceId?: string };

function App({ image, faces, io }: AppProps) {
  useEffect(() => { io.getImages(); }, [io]);
  useEffect(() => { image && io.getFaces(image.id); }, [image, io]);
  const [ menu, setMenu ] = useState<MenuState>({});
  const containerRef = useRef<HTMLDivElement>(null);
  
  const showMenu = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, faceId?: string) => {
    event.preventDefault();
    setMenu({
      x: event.clientX,
      y: event.clientY,
      faceId
    });
  };

  const deleteFace = (faceId?: string) => {
    io.deleteFace(faceId ?? '', image?.id ?? '');
    setMenu({});
  };

  return (
    <div className="App">
      {
        !image
        ? <Loader /> 
        : <div className="wrapper">
            <div className="header">
              <img alt="cully" src={cully} />
              <img alt="logo" src={logo} />
            </div>
            <div className="image-container" ref={containerRef}>
              <img src={image.url} alt={image.filename} data-testid="current-image" />
              {
                faces.map(face => 
                  <div
                    key={face.id}
                    data-testid="face-box"
                    onContextMenu={e => showMenu(e, face.id)}>
                    <FaceBox 
                      face={face} 
                      container={containerRef} />
                  </div>
                )
              }
            </div>
            <div className="operations">
              <ArrowBack onClick={io.prevImage} data-testid="btn-backward" />
              <span>{ image.filename }</span>
              <ArrowForward onClick={io.nextImage} data-testid="btn-forward" />
            </div>
          </div>
      }

      <Menu
          keepMounted
          open={menu.faceId != null}
          onClose={() => setMenu({})}
          anchorReference="anchorPosition"
          anchorPosition={
            menu.y != null && menu.x != null
              ? { top: menu.y, left: menu.x }
              : undefined
          }>
          <MenuItem 
            onClick={() => deleteFace(menu.faceId)}>Delete</MenuItem>
        </Menu>
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

function Loader() {
  const [open, setOpen] = React.useState(true);

  return (
    <Backdrop open={open} onClick={() => setOpen(false)}>
      <CircularProgress />
    </Backdrop>
  );
}

export default connect(mapStateToProps)(App);
