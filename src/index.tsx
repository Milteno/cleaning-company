import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { store } from './app/store';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import "./app/utils/faIconsLibrary";
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserProvider } from './context/UserContext';
import { RefreshProvider } from './context/RefreshContext';

const initialState = {};

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <UserProvider initialState={initialState}>
        <RefreshProvider>
          <App />
        </RefreshProvider>
      </UserProvider>
    </Provider>
  </React.StrictMode >,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
