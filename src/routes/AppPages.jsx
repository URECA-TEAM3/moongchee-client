import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppRouteDef } from './RouteDef';
import Header from '../components/Header';
import Navbar from '../components/Navbar';

const AppPages = () => {
  return (
    <div className="flex flex-col h-screen border-x border-divider text-text">
      <BrowserRouter>
        <Header className="fixed top-0" />

        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <Routes>
            {Object.entries({ ...AppRouteDef }).map(([name, { path, element }], index) => (
              <Route key={name + index} path={path} element={element} />
            ))}
          </Routes>
        </div>

        <Navbar className="fixed bottom-0" />
      </BrowserRouter>
    </div>
  );
};

export default AppPages;
