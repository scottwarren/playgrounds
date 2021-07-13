import { Chart } from "chart.js";
import { useRef, useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import { generateChartOptions } from "./generateChartOptions";

const Button = styled.button.attrs({ type: "button" })`
  background-color: transparent;
  border: 1px solid #dadce0;
  border-radius: 4px;
  box-sizing: border-box;
  height: 36px;

  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.25px;
  text-transform: none;
  opacity: 1;
  color: #3c4043;

  &:hover {
    background-color: #f1f3f4;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 0.5em;
`;

const ChartsContainer = styled.div`
  display: flex;
`;
const ChartContainer = styled.div`
  width: 50%;
`;

const CurrentValueList = styled.ul``;

const CurrentValueListItem = styled.li``;

const Container = styled.div``;

function ChartComponent({
  chartType = "line",
  useLargeDataSet = false,
  isCumulative = false,
}) {
  const canvasRef = useRef(null);
  const chartJsRef = useRef(null);

  const options = useMemo(
    () => generateChartOptions(chartType, { useLargeDataSet, isCumulative }),
    [chartType, useLargeDataSet, isCumulative]
  );

  useEffect(() => {
    if (chartJsRef.current) {
      // This is required because when we change the data often (e.g. displaying monthly vs daily)
      // The previous hover events for certain labels and sections of the chart appear to remain afterwards
      chartJsRef.current.destroy?.();
    }

    chartJsRef.current = new Chart(canvasRef.current.getContext("2d"), options);
  }, [options]);

  return <canvas ref={canvasRef} />;
}

function App() {
  const [useLargeDataSet, setUseLargeDataSet] = useState(false);
  const [isCumulative, setIsCumulative] = useState(false);

  return (
    <Container>
      <ButtonContainer>
        <Button onClick={() => setUseLargeDataSet(true)}>
          use large dataset
        </Button>
        <Button onClick={() => setUseLargeDataSet(false)}>
          use small dataset
        </Button>
        <Button onClick={() => setIsCumulative(!isCumulative)}>
          toggle is cumulative?
        </Button>
      </ButtonContainer>
      <CurrentValueList>
        <CurrentValueListItem>
          isCumulative: {JSON.stringify(isCumulative)}
        </CurrentValueListItem>
        <CurrentValueListItem>
          useLargeDataSet: {JSON.stringify(useLargeDataSet)}
        </CurrentValueListItem>
      </CurrentValueList>

      <ChartsContainer>
        <ChartContainer>
          <ChartComponent
            chartType="line"
            useLargeDataSet={useLargeDataSet}
            isCumulative={isCumulative}
          />
        </ChartContainer>
        <ChartContainer>
          <ChartComponent
            chartType="bar"
            useLargeDataSet={useLargeDataSet}
            isCumulative={isCumulative}
          />
        </ChartContainer>
      </ChartsContainer>
    </Container>
  );
}

export default App;
