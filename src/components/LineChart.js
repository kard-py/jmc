import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

export const options = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: "bottom",
    },
    title: {
      display: false,
      text: "Rendimento",
    },
  },
};

const labels = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

// const numbers= [{"id":987},{"id":270},{"id":1000},{"id":800},{"id":200},{"id":300},{"id":400},{"id":987},{"id":270},{"id":1000},{"id":800},{"id":200},]

export const data = {
  labels,
  datasets: [
    {
      label: "Tarefas Concluidas",
      data: labels.map((n) => Math.floor(Math.random() * 100) + 1),
      borderColor: "RGB(17, 145, 146)",
      backgroundColor: "RGB(17, 145, 146)",
    },
    {
      label: "Tarefas em Andamento",
      data: labels.map((n) => Math.floor(Math.random() * 100) + 1),
      borderColor: "RGB(247, 194, 12)",
      backgroundColor: "RGB(247, 194, 12)",
    },
  ],
};

const LineChart = () => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  return <Line options={options} data={data} />;
};

export default LineChart;
