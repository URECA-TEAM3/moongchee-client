import styled from 'styled-components';
import AppPages from './AppPages';
import { BrowserRouter } from 'react-router-dom';

const ViewArea = styled.div`
  width: 600px;
  height: 100vh;
  background: #f5faff;
`;

const AppScreen = () => {
  return (
    <ViewArea>
      <div className="flex flex-col h-screen border-x border-divider text-text">
        <BrowserRouter>
          <AppPages />
        </BrowserRouter>
      </div>
    </ViewArea>
  );
};

export default AppScreen;
