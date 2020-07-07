import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import App from './App';
import { AppIO, appIOFactory } from './App.io';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { makeAction, reduce, UpdateFacesPayload } from './store';
import { initialState } from './app.state';
import { Image } from './app.state';

const images: Image[] = [{ 
  id: 'foo', 
  url: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/01/Radiogaga.jpg/220px-Radiogaga.jpg', 
  filename: 'foo' 
}];
const faces: UpdateFacesPayload = { 
  imageId: 'foo', 
  faces: [
    { 
      xmax: 0.5,
      xmin: 0.1, 
      ymin: 0.1, 
      ymax: 0.5, 
      id: 'bar' 
    },
    { 
      xmax: 0.1,
      xmin: 0.2, 
      ymin: 0.3, 
      ymax: 0.4, 
      id: 'baz' 
    },
  ]
};

test('renders face box', async () => {
  const store = createStore(reduce as any, initialState, applyMiddleware(thunk));
  
  const testIO: AppIO = {
    getImages: async () => { store.dispatch(makeAction.UpdateImages(images)); },
    getFaces: async () => { store.dispatch(makeAction.UpdateFaces(faces)) },
    deleteFace: async (faceId, imageId) => { 
      console.log(`Deleting ${faceId} ${imageId}`);
      appIOFactory(store.dispatch).deleteFace(faceId, imageId); 
    }
  };

  render(
    <Provider store={store}>
      <App io={testIO} />
    </Provider>
  );

  // all face boxes are displayed
  const faceboxes = screen.getAllByTestId('face-box');
  expect(faceboxes).toHaveLength(2);

  // Delete the first face box
  fireEvent.contextMenu(faceboxes[0]);

  const menuItem = await screen.findByRole('menuitem');  
  fireEvent.click(menuItem);

  expect(screen.getAllByTestId('face-box')).toHaveLength(1);
});
