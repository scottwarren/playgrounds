import { Chart } from "chart.js";
import { useRef, useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import { generateChartOptions } from "./generateChartOptions";

const Button = styled.button``;

const ButtonContainer = styled.div``;

const ChartsContainer = styled.div`
  display: flex;
`;
const ChartContainer = styled.div`
  width: 50%;
`;

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
        <Button type="button" onClick={() => setUseLargeDataSet(true)}>
          use large dataset
        </Button>
        <Button type="button" onClick={() => setUseLargeDataSet(false)}>
          use small dataset
        </Button>
      </ButtonContainer>
      <ButtonContainer>
        isCumulative current value: {JSON.stringify(isCumulative)}
        <button type="button" onClick={() => setIsCumulative(!isCumulative)}>
          toggle is cumulative?
        </button>
      </ButtonContainer>

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
