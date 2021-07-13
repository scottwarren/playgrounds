import { Chart } from "chart.js";
import { useRef, useEffect, useMemo } from "react";

import "./App.css";

const generateCumulative = (v) => v && { x: new Date(v.t), y: v.n };

function generateOptions(chartType = "bar") {
  const isCumulative = false;

  let series = [
    {
      label: "community events",
      backgroundColor: "rgb(255, 193, 72)",
      values: [
        { t: 1619816400000, n: 2 },
        { t: 1622494800000, n: 5 },
        {
          t: 1625086800000,
          n: 6,
        },
      ],
    },
    {
      label: "volunteering opportunities",
      backgroundColor: "rgb(54, 190, 223)",
      values: [
        { t: 1619816400000, n: 2 },
        { t: 1622494800000, n: 12 },
        {
          t: 1625086800000,
          n: 14,
        },
      ],
    },
    {
      label: "workshops",
      backgroundColor: "rgb(18, 196, 87)",
      values: [
        { t: 1619816400000, n: 3 },
        { t: 1622494800000, n: 5 },
        {
          t: 1625086800000,
          n: 5,
        },
      ],
    },
  ];

  // console.log({ series });
  // Make sure each series has data points at the beginning and start of the date range or else the chart will be messed up
  series = series.map((serie) => {
    const extractValue = serie.extractValue ?? ((val) => val.n);
    const serieNumbers =
      serie.values.length === 0
        ? ""
        : `(${extractValue(serie.values[0])} → ${extractValue(
            serie.values[serie.values.length - 1]
          )}, Δ ${
            extractValue(serie.values[serie.values.length - 1]) -
            extractValue(serie.values[0])
          })`;
    return {
      ...serie,
      label: `${serie.label} ${serieNumbers}`,
      values: serie.values,
    };
  });

  // console.log({ seriesAfterTransformation: series });

  // Make sure each series item has the same number of data points
  const longestSeries = series.reduce(
    (prev, next) => (next.values.length > prev.values.length ? next : prev),
    { values: [] }
  ).values;

  const datasets = [];
  for (const s of series) {
    const extractValue = s.extractValue || ((val) => val.n);
    const values = s.values.map((value) => ({
      ...value,
      n: extractValue(value),
    }));
    // Ensure all data is as long as the longest series
    const data = values.length === longestSeries.length ? values : [];
    if (data.length === 0) {
      let valuesIndex = 0;
      for (const longestSeriesValue of longestSeries) {
        data.push({
          t: longestSeriesValue.t,
          n:
            values[valuesIndex]?.n ||
            (valuesIndex > 0 ? values[valuesIndex - 1].n : 0),
        });
        if (
          values[valuesIndex] &&
          values[valuesIndex].t <= longestSeriesValue.t
        ) {
          valuesIndex += 1;
        }
      }
    }

    const barChartOptions = {
      barPercentage: 1.0,
      categoryPercentage: 0.9,
    };

    const lineChartOptions = {
      lineTension: 0,
    };

    const newDataSet = {
      label: s.label,
      data: data.map((v) => v && { x: new Date(v.t).getTime(), y: v.n }),
      fill: s.fill || "origin",
      backgroundColor: s.backgroundColor || "rgb(18, 196, 87)",
      ...(chartType === "bar" ? barChartOptions : {}),
      ...(chartType === "line" ? lineChartOptions : {}),
    };

    if (isCumulative) {
      datasets.push({
        ...newDataSet,
        data: data.map(generateCumulative),
      });
    } else {
      datasets.push({
        ...newDataSet,
        data: data.reduce(
          (prev, next) =>
            !next
              ? prev
              : {
                  sum: next.n,
                  array: [
                    ...prev.array,
                    { x: new Date(next.t).getTime(), y: next.n - prev.sum },
                  ],
                },
          {
            sum: 0,
            array: [],
          }
        ).array,
      });
    }
  }
  const min = datasets[0].data.reduce((prev, next) => {
    if (next && next.y && typeof next.y === "number" && next.y < prev)
      return next.y;
    return prev;
  }, Infinity);
  const max = datasets
    .map((dataset) =>
      dataset.data.reduce((prev, next) => {
        if (next && next.y && typeof next.y === "number" && next?.y > prev)
          return next.y;
        return prev;
      }, 0)
    )
    .reduce((prev, next) => prev + next, 0);
  const NUM_LABELS = 8;
  const BUFFER_MULTIPLIER = 1.1;
  // Find smallest Number(max-min) such that
  // We have even spaced steps between the graph rendered min and max, and at least 5 % buffer on top and below of graph
  let newMin = Math.max(Math.floor(min * (1 / BUFFER_MULTIPLIER)), 0);
  let newMax = Math.ceil(max * BUFFER_MULTIPLIER);
  const mod = (newMax - newMin) % NUM_LABELS;
  if (mod !== 0) {
    const toAdd = NUM_LABELS - mod;
    newMin -= Math.ceil(toAdd / 2);
    newMax += Math.floor(toAdd / 2);
    if (newMin < 0) {
      newMax -= newMin;
      newMin = 0;
    }
  }
  const stepSize = (newMax - newMin) / NUM_LABELS;

  if (chartType === "bar") {
    return {
      data: {
        datasets,
      },
      type: chartType,
      options: {
        responsive: true,
        // showLines: true,
        spanGaps: true,
        scales: {
          yAxes: [
            datasets.map(() => ({
              type: "linear",
              stacked: true,
              gridLines: {
                offsetGridLines: true,
              },
              ticks: {
                // For data display 'integrity', on bar charts, the y axis should start at 0
                // see: http://www.chadskelton.com/2018/06/bar-charts-should-always-start-at-zero.html
                min: 0,
                max,
                stepSize,
                maxTicksLimit: NUM_LABELS + 1,
              },
            })),
          ],
          xAxes: [
            datasets.map(() => ({
              type: "time",
              stacked: true,
              gridLines: {
                offsetGridLines: true,
              },
              time: {
                unit: "month",
              },
              distribution: "series",
            })),
          ],
        },
      },
    };
  }

  return {
    data: {
      datasets,
    },
    type: chartType,
    options: {
      responsive: true,
      showLines: true,
      spanGaps: true,
      scales: {
        yAxes: [
          {
            type: "linear",
            stacked: true,
            gridLines: {
              offsetGridLines: true,
            },
            ticks: {
              // For data display 'integrity', on bar charts, the y axis should start at 0
              // see: http://www.chadskelton.com/2018/06/bar-charts-should-always-start-at-zero.html
              min: 0,
              max,
              stepSize,
              maxTicksLimit: NUM_LABELS + 1,
            },
          },
        ],
        xAxes: [
          {
            type: "time",
            stacked: true,
            gridLines: {
              offsetGridLines: true,
            },
            time: {
              unit: "month",
            },
            distribution: "series",
          },
        ],
      },
    },
  };
}

function ChartComponent({ chartType }) {
  const canvasRef = useRef(null);
  const chart = useRef(null);

  const options = useMemo(() => generateOptions(chartType), [chartType]);

  useEffect(() => {
    if (chart.current) {
      // This is required because when we change the data often (e.g. displaying monthly vs daily)
      // The previous hover events for certain labels and sections of the chart appear to remain afterwards
      chart.current.destroy?.();
    }

    chart.current = new Chart(
      canvasRef.current.getContext("2d"),
      generateOptions()
    );
  }, [options]);

  return <canvas ref={canvasRef} id={`${chartType}-chart-component`} />;
}

function App() {
  return (
    <div className="App">
      {/* <ChartComponent chartType="bar" /> */}
      <ChartComponent chartType="line" />
    </div>
  );
}

export default App;
