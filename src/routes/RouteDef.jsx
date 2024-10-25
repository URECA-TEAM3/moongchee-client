import Main from '../pages/main';

//Login
import LoginPage from '../pages/main/LoginPage';
import LoginSuccessPage from '../pages/main/LoginSuccessPage';
import SignUpForm from '../pages/main/SignUpForm';
import AnimalInfo from '../pages/main/AnimalInfo';

//PetSitter
import PetSitter from '../pages/petsitter';
import PetSitterDetail from '../pages/petsitterDetail';
import PetSitterReservation from '../pages/petsitterReservation';
import PetSitterReservationList from '../pages/petsitterReservationList';
import PetSitterReservDetail from '../pages/petsitterReservDetail';

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

const PetSitterScreens = {
  Petsitter: {
    path: '/petsitter',
    element: <PetSitter />,
  },
  PetSitterDetail: {
    path: '/petsitter/detail/:name',
    element: <PetSitterDetail />,
  },
  PetSitterReservation: {
    path: '/petsitter/reservation',
    element: <PetSitterReservation />,
  },
  PetSitterReservationList: {
    path: '/petsitter/reservation/list',
    element: <PetSitterReservationList />,
  },
  PetSitterReservDetail: {
    path: '/petsitter/reservation/detail',
    element: <PetSitterReservDetail />,
  },

  ChargePage: {
    path: '/chargepage',
    element: <ChargePage />,
  },

  ChargePage: {
    path: '/chargepage',
    element: <ChargePage />,
  },
};

export const AppRouteDef = {
  ...MainScreens,
  ...PetSitterScreens,
};
