import React, { useEffect, useRef, useState } from 'react';
import './App.scss';
import { AppIO } from './App.io';
import { connect } from 'react-redux';
import { Image, AppState, currentImage, Face } from './app.state';
import FaceBox from './FaceBox';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

type AppProps = {
  io: AppIO,
  image?: Image,
  faces: Face[]
}

type MenuState = { x?: number, y?: number, face?: Face };

function App({ image, faces, io }: AppProps) {
  useEffect(() => { io.getImages(); }, [io]);
  useEffect(() => { image && io.getFaces(image.id)}, [image, io]);
  const [ menu, setMenu ] = useState<MenuState>({});
  const containerRef = useRef<HTMLDivElement>(null);
  
  const showMenu = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, face: Face) => {
    event.preventDefault();
    setMenu({
      x: event.clientX,
      y: event.clientY,
      face
    });
  };

  const deleteFace = (face?: Face) => {
    io.deleteFace(face?.id ?? '', image?.id ?? '');
    setMenu({});
  };

  return (
    <div className="App">
      {image
        ? <div className="image-container" ref={containerRef}>
            <img src={image.url} alt={image.filename}/>
            {
              faces.map(face => 
                (<div
                  key={face.id}
                  onContextMenu={e => showMenu(e, face)}>
                  <FaceBox 
                    face={face} 
                    container={containerRef} />
                </div>)
              )
            }
          </div>
        : <div>Loading...</div> 
      }

      <Menu
          keepMounted
          open={menu.y != null}
          onClose={() => setMenu({})}
          anchorReference="anchorPosition"
          anchorPosition={
            menu.y != null && menu.x != null
              ? { top: menu.y, left: menu.x }
              : undefined
          }>
          <MenuItem onClick={() => deleteFace(menu.face)}>Delete</MenuItem>
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

export default connect(mapStateToProps)(App);
