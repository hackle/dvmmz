import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import { AppIO } from './App.io';
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
  faces: [{ 
    xmax: 0.5,
    xmin: 0.1, 
    ymin: 0.1, 
    ymax: 0.5, 
    id: 'bar' 
  }] };

test('renders face box', () => {
  const store = createStore(reduce as any, initialState, applyMiddleware(thunk));
  
  const testIO: AppIO = {
    getImages: async () => { store.dispatch(makeAction.UpdateImages(images)); },
    getFaces: async () => { store.dispatch(makeAction.UpdateFaces(faces)) },
    deleteFace: async (faceId, imageId) => { store.dispatch(makeAction.DeleteFace({ faceId, imageId }))}
  };

  const { container }: { container: HTMLElement } = render(
    <Provider store={store}>
      <App io={testIO} />
    </Provider>
  );
  const faceboxes = container.querySelectorAll('.face-box');
  expect(faceboxes.length).toBe(1);
});
