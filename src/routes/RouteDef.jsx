import Main from '../pages/main';

//Login
import LoginPage from '../pages/main/LoginPage';
import LoginSuccessPage from '../pages/main/LoginSuccessPage';
import SignUpForm from '../pages/main/SignUpForm';
import ShopMain from '../pages/shoppingMall/ShopMain';
import ShopDetail from '../pages/shoppingMall/ShopDetail';
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
import ChargePage from '../pages/mypage/ChargePage';
import CheckoutPage from '../pages/mypage/Checkout';
import SuccessPage from '../pages/mypage/Success';
import FailPage from '../pages/mypage/Fail';

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
  Chargepage: {
    path: '/chargepage',
    element: <ChargePage />,
  },
  Checkout: {
    path: '/checkout',
    element: <CheckoutPage />,
  },
  Success: {
    path: '/success',
    element: <SuccessPage />,
  },
  Fail: {
    path: '/fail',
    element: <FailPage />,
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
};

const ShoppingMallScreens = {
  ShopMain: {
    path: '/shoppingmall',
    element: <ShopMain />,
  },
  ShopDetail: {
    path: '/shoppingmall/:id',
    element: <ShopDetail />,
  },
  ShopCategory: {
    path: '/shoppingmall/category',
    element: <ShopMain />,
  },
};

export const AppRouteDef = {
  ...MainScreens,
  ...PetSitterScreens,
  ...ShoppingMallScreens,
};
