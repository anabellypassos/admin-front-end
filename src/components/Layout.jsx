import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Users, LogOut } from 'lucide-react';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const menuItems = [
    { path: '/dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/products', name: 'Produtos', icon: <Package size={20} /> },
    { path: '/users', name: 'Usuários', icon: <Users size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-slate-800">
          Admin <span className="text-blue-500">Pro</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-lg transition ${
                location.pathname === item.path ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
        <button onClick={handleLogout} className="p-6 flex items-center gap-3 text-slate-400 hover:text-red-400 border-t border-slate-800">
          <LogOut size={20} /> Sair
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}