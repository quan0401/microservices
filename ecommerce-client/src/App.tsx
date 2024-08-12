import { FC, ReactElement, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css'; can be used in index.scss

import { AppRouter } from './AppRoutes';
import { socketService } from './sockets/socket.service';
import useBeforeWindowUnload from '~shared/hooks/useBeforeWindowUnload';

const App: FC = (): ReactElement => {
  useBeforeWindowUnload();
  useEffect(() => {
    socketService.setupSocketConnection();
  }, []);
  return (
    <>
      <BrowserRouter>
        <div className="w-screen min-h-screen flex flex-col relative">
          <AppRouter />
          <ToastContainer className={' text-gray-500'} />
        </div>
      </BrowserRouter>
    </>
  );
};

export default App;
