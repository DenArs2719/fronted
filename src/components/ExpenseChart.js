import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// 👇 обязательно регистрируем элементы
ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseChart = ({ expenseSummary }) => {
  const chartData = {
    labels: expenseSummary.map((item) => item.categoryName),
    datasets: [
      {
        data: expenseSummary.map((item) => item.totalAmount),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF9F40',
          '#FF5733', '#33FF57', '#FF33A1', '#33B5FF', '#FFB533',
        ],
      },
    ],
  };

  return (
    <div style={styles.chartContainer}>
      <Pie data={chartData} />
    </div>
  );
};

const styles = {
  chartContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: '600px',
    margin: '0 auto',
    width: '100%',
  },
};

export default ExpenseChart;
