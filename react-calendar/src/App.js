import Calendar from 'react-calendar';
import styled from 'styled-components';
import { useState } from 'react';

const DataDisplayContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

function App() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());



  return (
    <div>
      <DataDisplayContainer>
        <h3>Selected Dates</h3>
        <div>Start: {startDate.toISOString()}</div>
        <div>End: {endDate.toISOString()}</div>
      </DataDisplayContainer>
      <Calendar onChange={([start, end]) => { setStartDate(start); setEndDate(end); }} maxDetail='year' minDetail="year" view="year" returnValue="range" />

    </div>
  );
}

export default App;
