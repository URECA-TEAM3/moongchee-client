import Main from '../pages/main';
import PetSitter from '../pages/petsitter';
import AnimalInfo from '../pages/main/AnimalInfo';

import LoginPage from '../pages/main/LoginPage';
import LoginSuccessPage from '../pages/main/LoginSuccessPage';
import SignUpForm from '../pages/main/SignUpForm';
import ShopMain from '../pages/shoppingMall/ShopMain';

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
  Petsitter: {
    path: '/petsitter',
    element: <PetSitter />,
  },
  AnimalInfo: {
    path: '/animalinfo',
    element: <AnimalInfo />,
  },
  ShopMain: {
    path: '/shopMain',
    element: <ShopMain />,
  },
};

export const AppRouteDef = {
  ...MainScreens,
};
