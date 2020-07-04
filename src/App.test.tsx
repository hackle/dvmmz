import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import { appIOFactory } from './App.io';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { reduce } from './store';

test('renders learn react link', () => {
  const store = createStore(reduce, applyMiddleware(thunk));
  
  const testIO: typeof appIOFactory = dispatch => ({
    getCountries: new Promise(res => dispatch({ type: 'countries', payload: [ { id: 1, name: 'Chile' }]}))
  });

  const { getByText } = render(
    <Provider store={store}>
      <App ioFactory={testIO} />
    </Provider>
  );
  const linkElement = getByText(/Chile/i);
  expect(linkElement).toBeInTheDocument();
});
