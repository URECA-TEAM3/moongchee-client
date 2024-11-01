import React from 'react';
import PrivateRoute from './PrivateRoute';

import LoginPage from '../pages/main/LoginPage';
import LoginSuccessPage from '../pages/main/LoginSuccessPage';
import SignUpForm from '../pages/main/SignUpForm';

import Main from '../pages/main';
import AnimalInfo from '../pages/main/AnimalInfo';
import AnimalRegisterSuccessPage from '../pages/main/AnimalRegisterSuccessPage';

import ShopMain from '../pages/shoppingMall/ShopMain';
import ShopDetail from '../pages/shoppingMall/ShopDetail';

import PetSitter from '../pages/petsitter';
import PetSitterApply from '../pages/petsitterApply';
import PetSitterDetail from '../pages/petsitterDetail';
import PetSitterReservation from '../pages/petsitterReservation';
import PetSitterReservationList from '../pages/petsitterReservationList';
import PetSitterReservDetail from '../pages/petsitterReservDetail';

import ShoppingCart from '../pages/shoppingcart/ShoppingCart';
import Chat from '../pages/chat/Chat';
import ChargePage from '../pages/mypage/ChargePage';
import CheckoutPage from '../pages/mypage/Checkout';
import SuccessPage from '../pages/mypage/Success';
import FailPage from '../pages/mypage/Fail';

import Mypage from '../pages/mypage/Mypage';
import Pay from '../pages/shoppingcart/Pay';
import ChangeAddress from '../pages/shoppingcart/ChangeAddress';
import EditUserInfo from '../pages/mypage/EditUserInfo';
import EditPetInfo from '../pages/mypage/EditPetInfo';
import ShopHistory from '../pages/mypage/ShopHistory';

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
    element: (
      <PrivateRoute>
        <Main />
      </PrivateRoute>
    ),
  },
  AnimalInfo: {
    path: '/animalinfo',
    element: (
      <PrivateRoute>
        <AnimalInfo />
      </PrivateRoute>
    ),
  },
  ShoppingCart: {
    path: '/shoppingcart',
    element: (
      <PrivateRoute>
        <ShoppingCart />
      </PrivateRoute>
    ),
  },
  Chat: {
    path: '/chat',
    element: (
      <PrivateRoute>
        <Chat />
      </PrivateRoute>
    ),
  },
  Chargepage: {
    path: '/chargepage',
    element: (
      <PrivateRoute>
        <ChargePage />
      </PrivateRoute>
    ),
  },
  Checkout: {
    path: '/checkout',
    element: (
      <PrivateRoute>
        <CheckoutPage />
      </PrivateRoute>
    ),
  },
  Success: {
    path: '/success',
    element: (
      <PrivateRoute>
        <SuccessPage />
      </PrivateRoute>
    ),
  },
  Fail: {
    path: '/fail',
    element: (
      <PrivateRoute>
        <FailPage />
      </PrivateRoute>
    ),
  },
};

const PetSitterScreens = {
  Petsitter: {
    path: '/petsitter',
    element: (
      <PrivateRoute>
        <PetSitter />
      </PrivateRoute>
    ),
  },
  PetSitterApply: {
    path: '/petsitter/apply',
    element: (
      <PrivateRoute>
        <PetSitterApply />
      </PrivateRoute>
    ),
  },
  PetSitterDetail: {
    path: '/petsitter/detail/:name',
    element: (
      <PrivateRoute>
        <PetSitterDetail />
      </PrivateRoute>
    ),
  },
  PetSitterReservation: {
    path: '/petsitter/reservation',
    element: (
      <PrivateRoute>
        <PetSitterReservation />
      </PrivateRoute>
    ),
  },
  PetSitterReservationList: {
    path: '/petsitter/reservation/list',
    element: (
      <PrivateRoute>
        <PetSitterReservationList />
      </PrivateRoute>
    ),
  },
  PetSitterReservDetail: {
    path: '/petsitter/reservation/detail',
    element: (
      <PrivateRoute>
        <PetSitterReservDetail />
      </PrivateRoute>
    ),
  },
};

const ShoppingMallScreens = {
  ShopMain: {
    path: '/shoppingmall',
    element: (
      <PrivateRoute>
        <ShopMain />
      </PrivateRoute>
    ),
  },
  ShopDetail: {
    path: '/shoppingmall/:id',
    element: (
      <PrivateRoute>
        <ShopDetail />
      </PrivateRoute>
    ),
  },
  Pay: {
    path: '/payment',
    element: <Pay />,
  },
  ChangeAddress: {
    path: 'changeAddress',
    element: <ChangeAddress />,
  },
  ShopCategory: {
    path: '/shoppingmall/category',
    element: (
      <PrivateRoute>
        <ShopMain />
      </PrivateRoute>
    ),
  },
};

const MypageScreens = {
  Mypage: {
    path: '/mypage',
    element: (
      <PrivateRoute>
        <Mypage />
      </PrivateRoute>
    ),
  },
  EditUserInfo: {
    path: '/mypage/edituser',
    element: (
      <PrivateRoute>
        <EditUserInfo />
      </PrivateRoute>
    ),
  },
  EditPetInfo: {
    path: '/mypage/editpet/:id',
    element: (
      <PrivateRoute>
        <EditPetInfo />
      </PrivateRoute>
    ),
  },
  ShopHistory: {
    path: 'mypage/shophistory/:id',
    element: (
      <PrivateRoute>
        <ShopHistory />
      </PrivateRoute>
    ),
  },
};

export const AppRouteDef = {
  ...MainScreens,
  ...PetSitterScreens,
  ...ShoppingMallScreens,
  ...MypageScreens,
};
