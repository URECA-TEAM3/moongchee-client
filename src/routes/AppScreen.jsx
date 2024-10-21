import styled from 'styled-components';
import AppPages from './AppPages';

const ViewArea = styled.div`
  width: 600px;
  height: 100vh;
  background: #f9f9f9;
`;

const AppScreen = () => {
  return (
    <ViewArea className="border-x border-divider">
      <AppPages />
    </ViewArea>
  );
};

export default AppScreen;
