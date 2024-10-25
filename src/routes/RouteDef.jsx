import Main from '../pages/main';
import PetSitter from '../pages/petsitter';
import AnimalInfo from '../pages/main/AnimalInfo';

import LoginPage from '../pages/main/LoginPage';
import LoginSuccessPage from '../pages/main/LoginSuccessPage';
import SignUpForm from '../pages/main/SignUpForm';
import AnimalRegisterSuccessPage from '../pages/main/AnimalRegisterSuccessPage';

import ShoppingCart from '../pages/shoppingcart/ShoppingCart';
import Chat from '../pages/chat/Chat';
import Mypage from '../pages/mypage/Mypage';

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
  ShoppingCart: {
    path: '/shoppingcart',
    element: <ShoppingCart />,
  },
  Chat: {
    path: '/chat',
    element: <Chat />,
  },
  Mypage: {
    path: '/mypage',
    element: <Mypage />,
  },
};

export const AppRouteDef = {
  ...MainScreens,
};
