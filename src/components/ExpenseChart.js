import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

const ExpenseChart = ({ categories, transactions }) => {
  // Фильтруем категории, у которых есть хотя бы одна транзакция
  const filteredCategories = categories.filter((category) =>
    transactions.some((t) => t.categoryId === category.id)
  );

  // Считаем сумму расходов по каждой из этих категорий
  const categoryExpenses = filteredCategories.map((category) => {
    return transactions
      .filter((transaction) => transaction.categoryId === category.id)
      .reduce((acc, transaction) => acc + parseFloat(transaction.amount), 0);
  });

  const chartData = {
    labels: filteredCategories.map((category) => category.name),
    datasets: [
      {
        data: categoryExpenses,
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF9F40',
          '#FF5733', '#33FF57', '#FF33A1', '#33B5FF', '#FFB533',
        ], // Colors for the chart
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
