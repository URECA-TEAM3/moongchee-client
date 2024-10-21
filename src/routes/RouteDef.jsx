import Main from '../pages/Main';
import AnimalInfo from '../pages/main/AnimalInfo';

import LoginPage from '../pages/main/LoginPage';
import LoginSuccessPage from '../pages/main/LoginSuccessPage';
import SignUpForm from '../pages/main/SignUpForm';

const MainScreens = {
  LoginPage: {
    path: '/',
    element: <LoginPage />,
  },
  SignUp: {
    path: '/signup',
    element: <SignUpForm />,
  },
  LoginSuccess: {
    path: '/loginsuccess',
    element: <LoginSuccessPage />,
  },
  Main: {
    path: '/main',
    element: <Main />,
  },
  AnimalInfo: {
    path: '/animalinfo',
    element: <AnimalInfo />,
  },
};

export const AppRouteDef = {
  ...MainScreens,
};
