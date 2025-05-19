import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { getVerifications } from '../lib/azure';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [verifications, setVerifications] = useState([]);
  const userId = localStorage.getItem('user_id') || 'demo_user';
  const role = localStorage.getItem('role') || 'policyholder';

  useEffect(() => {
    async function fetchVerifications() {
      const data = await getVerifications(userId);
      setVerifications(data);
    }
    fetchVerifications();
  }, []);

  const chartData = {
    labels: ['Verified', 'Tampered'],
    datasets: [{
      label: 'Verification Outcomes',
      data: [
        verifications.filter(v => v.status === 'verified').length,
        verifications.filter(v => v.status === 'tampered').length
      ],
      backgroundColor: ['#009933', '#ff3333']
    }]
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl mb-4">{role === 'insurer' ? 'Insurer Analytics' : 'Claim Status'}</h2>
      {role === 'insurer' && (
        <div className="mb-8">
          <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
        </div>
      )}
      <table className="w-full text-left">
        <thead>
          <tr><th>Image</th><th>Status</th><th>Timestamp</th></tr>
        </thead>
        <tbody>
          {verifications.map((v, i) => (
            <tr key={i}>
              <td><img src={v.image_url} alt="Thumbnail" className="w-16" /></td>
              <td>{v.status}</td>
              <td>{new Date(v.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 