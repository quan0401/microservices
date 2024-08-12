import './index.scss';

import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { Persistor } from 'redux-persist';
import persistStore from 'redux-persist/es/persistStore';
import { PersistGate } from 'redux-persist/integration/react';

import App from './App.tsx';
import { store } from './store/store.ts';

const persistor: Persistor = persistStore(store);

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  //   <Provider store={store}>
  //     <PersistGate persistor={persistor}>
  //       <App />
  //     </PersistGate>
  //   </Provider>
  // </React.StrictMode>

  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);
