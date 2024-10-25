import Main from '../pages/main';
import PetSitter from '../pages/petsitter';
import AnimalInfo from '../pages/main/AnimalInfo';

import LoginPage from '../pages/main/LoginPage';
import LoginSuccessPage from '../pages/main/LoginSuccessPage';
import SignUpForm from '../pages/main/SignUpForm';
import AnimalRegisterSuccessPage from '../pages/main/AnimalRegisterSuccessPage';
import ChargePage from '../pages/main/ChargePage';

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
  AnimalResisterSuccess: {
    path: '/animalRegisterSuccess',
    element: <AnimalRegisterSuccessPage />,
  },
  Main: {
    path: '/main',
    element: <Main />,
  },
  Petsitter: {
    path: '/petsitter',
    element: <PetSitter />,
  },
  AnimalInfo: {
    path: '/animalinfo',
    element: <AnimalInfo />,
  },

  ChargePage: {
    path: '/chargepage',
    element: <ChargePage />,
  },
};

export const AppRouteDef = {
  ...MainScreens,
};
