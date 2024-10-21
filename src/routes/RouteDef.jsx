import Main from '../pages/main';
import PetSitter from '../pages/petsitter';

const MainScreens = {
  Main: {
    path: '/',
    element: <Main />,
  },
  Petsitter: {
    path: '/petsitter',
    element: <PetSitter />,
  },
};

export const AppRouteDef = {
  ...MainScreens,
};
