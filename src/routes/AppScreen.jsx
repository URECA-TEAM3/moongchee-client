import styled from 'styled-components';
import AppPages from './AppPages';

const ViewArea = styled.div`
  width: 600px;
  height: 100vh;
  background: #f9f9f9;
`;

const AppScreen = () => {
  return (
    <ViewArea className="border border-divider container px-4 py-5 gap-y-5 h-full overflow-y-scroll">
      <AppPages />
    </ViewArea>
  );
};

export default AppScreen;
