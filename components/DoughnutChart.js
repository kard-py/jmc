import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: "bottom",
    },
    title: {
      display: true,
      text: "Projetos",
    },
  },
};

const DoughnutChart = ({ dataChart }) => {
  const data = {
    labels: dataChart.labels,
    datasets: [
      {
        data: dataChart.values,
        backgroundColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
        borderWidth: 0,
      },
    ],
  };

  return <Doughnut data={data} options={options} />;
};

export { DoughnutChart };
