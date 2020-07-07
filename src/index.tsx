import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import { appIOFactory } from './App.io';
import { store } from './store-reducer';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App io={appIOFactory(store.dispatch as any)} />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
