import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styled from 'styled-components';
import { useState } from 'react';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const DataDisplayContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

function App() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  return (
    <Container>
      <div>
        <DataDisplayContainer>
          <h3>Selected Dates</h3>
          <div>Start: {startDate.toDateString()}</div>
          <div>End: {endDate.toDateString()}</div>
        </DataDisplayContainer>
        <Calendar onChange={([start, end]) => { setStartDate(start); setEndDate(end); }} maxDetail='year' view="year" returnValue="range" />
      </div>
    </Container>
  );
}

export default App;
