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
      {image
        ? <div className="image-container" ref={containerRef}>
            <img src={image.url} alt={image.filename}/>
            {
              faces.map(face => 
                (<div
                  key={face.id}
                  data-testid="face-box"
                  onContextMenu={e => showMenu(e, face.id)}>
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

export default connect(mapStateToProps)(App);
