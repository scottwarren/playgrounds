const generateCumulative = (v) => v && { x: new Date(v.t), y: v.n };

export function generateChartOptions(
  chartType,
  { useLargeDataSet = false, isCumulative = false }
) {
  let series = [
    {
      label: "some example data 1",
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
      label: "some example data 2",
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
      label: "some example data 3",
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

  if (useLargeDataSet) {
    series = series.map((serie) => {
      const newValues = serie.values.map((value) => {
        return {
          ...value,
          n: value.n * 52,
        };
      });

      return {
        ...serie,
        values: newValues,
      };
    });
  }

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
      data: data.map((v) => v && { x: new Date(v.t), y: v.n }),
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
                    { x: new Date(next.t), y: next.n - prev.sum },
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

  if (chartType === "bar") {
    return {
      data: {
        datasets,
      },
      type: chartType,
      options: {
        responsive: true,
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
                tooltipFormat: "MMM YYYY",
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
      showLines: true,
      scales: {
        yAxes: [
          {
            type: "linear",
            ticks: {
              min,
            },
          },
        ],
        xAxes: [
          {
            type: "time",
            time: {
              unit: "month",
              tooltipFormat: "MMM YYYY",
            },
            distribution: "series",
          },
        ],
      },
    },
  };
}
