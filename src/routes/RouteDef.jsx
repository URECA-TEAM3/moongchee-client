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
    path: '/petsitter/Reservation',
    element: <PetSitterReservation />,
  },
};

export const AppRouteDef = {
  ...MainScreens,
  ...PetSitterScreens,
};
