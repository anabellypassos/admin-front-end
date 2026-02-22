import { useEffect, useState } from 'react';
import api from '../services/api';
import { Users, Package, DollarSign } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/stats').then(res => setStats(res.data));
  }, []);

  if (!stats) return <div className="p-8">Carregando...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
  <StatCard icon={<Users />} title="Usuários" value={stats.totalUsers} color="bg-blue-500" />
  <StatCard icon={<Package />} title="Produtos" value={stats.totalProducts} color="bg-green-500" />
  <StatCard icon={<DollarSign />} title="Estoque" value={`R$ ${stats.totalValue.toFixed(2)}`} color="bg-purple-500" />
</div>
    </div>
  );
}

function StatCard({ icon, title, value, color }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow flex items-center space-x-4">
      <div className={`${color} p-4 rounded-full text-white`}>{icon}</div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}