import React, { useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import exchangeData from '../data/currency-historical.json';

export const ExchangeRateChart = () => {
  const chartRef = useRef(null);

  // Convert to Highcharts [timestamp, value] format
  const formattedData = exchangeData
    .map(item => [new Date(item.date).getTime(), item.USDtoPKR])
    .sort((a, b) => a[0] - b[0]);

  // Highcharts configuration
  const options = {
    chart: {
      type: 'line',
      zooming: { type: 'x' },
      scrollablePlotArea: { minWidth: 600, scrollPositionX: 1 },
    },
    title: {
      text: null
    },
    // subtitle: {
    //   text: 'Source: Bank Floating Average Exchange Rates (SBP)',
    //   align: 'left',
    // },
    xAxis: {
      type: 'datetime',
      title: { text: 'Date' },
      labels: {
        format: '{value:%Y}', // Default to showing only year
      },
      events: {
        afterSetExtremes: function (e) {
          const range = e.max - e.min;
          const chart = chartRef.current?.chart;
          if (!chart) return;

          // Switch to monthly labels if zoomed to < 2 years
          if (range < 1000 * 60 * 60 * 24 * 365 * 2) {
            chart.xAxis[0].update({
              labels: { format: '{value:%b %Y}' }, // Month + Year
            });
          } else {
            chart.xAxis[0].update({
              labels: { format: '{value:%Y}' }, // Year only
            });
          }
        },
      },
    },
    yAxis: {
      title: { text: 'Exchange Rate (PKR per USD)' },
    },
    tooltip: {
      shared: true,
      crosshairs: true,
      xDateFormat: '%A, %b %e, %Y',
      valueDecimals: 2,
      valueSuffix: ' PKR',
    },
    legend: { enabled: false },
    series: [
      {
        name: 'USD to PKR',
        data: formattedData,
        color: '#0071A7',
        lineWidth: 2,
        marker: { enabled: true, radius: 3 },
      },
    ],
    credits: {
      enabled: false,
    },
  };

  return (
    <div>
      <HighchartsReact ref={chartRef} highcharts={Highcharts} options={options} />
    </div>
  );
};
