import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import App from './App';
import { AppIO, appIOFactory } from './App.io';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { makeAction, UpdateFacesPayload } from './Store.actions';
import { initialState } from './App.state';
import { Image } from './App.state';
import _ from 'lodash';
import { reduce } from './Store.reducer';

const images: Image[] = [
  { 
    id: 'foo', 
    url: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/01/Radiogaga.jpg/220px-Radiogaga.jpg', 
    filename: 'foo' 
  }, 
  {
    id: 'bar', 
    url: 'https://i.ytimg.com/vi/a-CZsAm7jMk/maxresdefault.jpg', 
    filename: 'bar' 
  }
];

const faces: Record<string, UpdateFacesPayload> = {
  'foo': {
    imageId: 'foo', 
    faces: [
      { 
        xmax: 0.5,
        xmin: 0.1, 
        ymin: 0.1, 
        ymax: 0.5, 
        id: 'face1' 
      },
      { 
        xmax: 0.1,
        xmin: 0.2, 
        ymin: 0.3, 
        ymax: 0.4, 
        id: 'face2' 
      },
    ]
  },
  'bar': {
    imageId: 'bar', 
    faces: [
      { 
        xmax: 0.5,
        xmin: 0.1, 
        ymin: 0.1, 
        ymax: 0.5, 
        id: 'face1' 
      }
    ]
  }
};
  
const store = createStore(reduce as any, initialState, applyMiddleware(thunk));

const testIO: AppIO = {
  ...appIOFactory(store.dispatch),
  getImages: async () => { store.dispatch(makeAction.UpdateImages(images)); },
  getFaces: async (imageId: string) => { store.dispatch(makeAction.UpdateFaces(faces[imageId])) }
};

test('renders face boxes and can delete', async () => {
  render(
    <Provider store={store}>
      <App io={testIO} />
    </Provider>
  );

  const expectedImage = images[0];
  const expectedFaceCount = faces[expectedImage.id].faces.length;

  const image = screen.getByTestId('current-image');
  expect(image).toHaveAttribute('src', expectedImage.url);

  // all face boxes are displayed
  const faceboxes = screen.getAllByTestId('face-box');
  expect(faceboxes).toHaveLength(expectedFaceCount);

  // Delete the first face box
  fireEvent.contextMenu(faceboxes[0]);
  const menuItem = await screen.findByRole('menuitem');  
  fireEvent.click(menuItem);

  expect(screen.getAllByTestId('face-box')).toHaveLength(expectedFaceCount - 1);
});

test('Forward button ends at last image, and backward at first', async () => {
  render(
    <Provider store={store}>
      <App io={testIO} />
    </Provider>
  );

  const forwardButton = await screen.getByTestId('btn-forward');  
  const backButton = await screen.getByTestId('btn-backward');  

  // click forward many times, more than number of images 
  _.range(0, images.length * 2).forEach(_ => fireEvent.click(forwardButton));
  let currentImage = screen.getByTestId('current-image');
  expect(currentImage).toHaveAttribute('src', _(images).last()?.url);

  // click backward even more times
  _.range(0, images.length * 4).forEach(_ => fireEvent.click(backButton));
  currentImage = screen.getByTestId('current-image');
  expect(currentImage).toHaveAttribute('src', _(images).first()?.url);
});

test('deletion of face boxes are persisted through navigation', async () => {
  render(
    <Provider store={store}>
      <App io={testIO} />
    </Provider>
  );

  const faceboxes = screen.getAllByTestId('face-box');
  expect(faceboxes.length).not.toBe(0);

  // Delete all face boxes
  for (let fb of faceboxes) {
    fireEvent.contextMenu(fb);
    const menuItem = await screen.findByRole('menuitem');
    fireEvent.click(menuItem);
  } 
  expect(screen.queryByTestId('face-box')).toBeNull();

  // go to another image that has face boxes
  const forwardButton = await screen.getByTestId('btn-forward'); 
  fireEvent.click(forwardButton);
  expect(screen.queryByTestId('face-box')).not.toBeNull();

  // go back to the original image - face boxes remain deleted
  const backButton = await screen.getByTestId('btn-backward'); 
  fireEvent.click(backButton);
  expect(screen.queryByTestId('face-box')).toBeNull();
});
