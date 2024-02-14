import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { 
  MDBCard, 
  MDBCardBody, 
  MDBContainer 
} from 'mdb-react-ui-kit';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[];
}

export default function SensorDisplay() {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [waterStatus, setWaterStatus] = useState<string>('');
  const [lastChecked, setLastChecked] = useState<string>('');

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Soil Moisture',
      },
    },
  };

  async function fetchData() {
    try {
      const response = await fetch('https://loxs1vvtc3.execute-api.eu-west-1.amazonaws.com/v1/SoilMoisture');
      const responseData = await response.json();

      const parsedData = JSON.parse(responseData.body);

      const labels = parsedData.map((entry: { reading_timestamp: string }) => {
        const date = new Date(entry.reading_timestamp);
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
        return formattedDate;
      });
      const dataValues = parsedData.map((entry: { reading_value: string }) => parseFloat(entry.reading_value));

      const latestReading = dataValues[dataValues.length - 1];
      const latestTimestamp = labels[labels.length - 1];
      setWaterStatus(latestReading === 0 ? '⚠️ The plant has no water' : '💦 The plant has water');
      setLastChecked(`Last checked: ${latestTimestamp}`);

      setChartData({
        labels,
        datasets: [
          {
            label: 'Soil Moisture',
            data: dataValues,
            borderColor: 'rgb(122,180,71)',
            backgroundColor: 'rgb(122,180,71)',
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <MDBContainer className="py-5">
      <div className="text-center mb-4">
        <span className="h3">Sensor Readings</span>
        {waterStatus && (
          <div className="h5 mt-3">
            {waterStatus} - <span>{lastChecked}</span>
          </div>
        )}
      </div>
      <MDBCard className="mb-4">
        <MDBCardBody>
        {chartData && <Line options={options} data={chartData} />}
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}
