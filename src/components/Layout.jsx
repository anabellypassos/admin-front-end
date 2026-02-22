import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Users, LogOut, Menu, X } from 'lucide-react';

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Estado para o menu mobile
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

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex min-h-screen bg-gray-50 text-slate-900">
      
      {/* BOTÃO HAMBÚRGUER (Aparece apenas no Celular) */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={toggleSidebar}
          className="p-2 bg-slate-900 text-white rounded-lg shadow-lg"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* OVERLAY (Fundo escuro quando o menu abre no celular) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white flex flex-col transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="p-6 text-2xl font-bold border-b border-slate-800 text-center lg:text-left">
          Admin <span className="text-blue-500">Pro</span>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)} // Fecha o menu ao clicar (mobile)
              className={`flex items-center gap-3 p-3 rounded-lg transition ${
                location.pathname === item.path 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                : 'hover:bg-slate-800 text-slate-400'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <button 
          onClick={handleLogout} 
          className="p-6 flex items-center gap-3 text-slate-400 hover:text-red-400 border-t border-slate-800 transition"
        >
          <LogOut size={20} /> 
          <span className="font-medium">Sair</span>
        </button>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 p-4 md:p-8 w-full">
        {/* Espaçamento extra no mobile para o botão não cobrir o título */}
        <div className="lg:hidden h-12" /> 
        {children}
      </main>
    </div>
  );
}