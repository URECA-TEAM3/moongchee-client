import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AppRouteDef } from './RouteDef';
import Header from '../components/Header';
import Navbar from '../components/Navbar';

const AppPages = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';

  return (
    <>
      {!isLoginPage && <Header className="fixed top-0" />}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <Routes>
          {Object.entries({ ...AppRouteDef }).map(([name, { path, element }], index) => (
            <Route key={name + index} path={path} element={element} />
          ))}
        </Routes>
      </div>
      {!isLoginPage && <Navbar className="fixed bottom-0" />}
    </>
  );
};

export default AppPages;
