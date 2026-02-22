mport { useEffect, useState } from 'react';
import api from '../services/api';
import { Trash2, UserPlus, X, ShieldCheck } from 'lucide-react';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'EDITOR' });

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    const res = await api.get('/users');
    setUsers(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/register', formData);
      setIsModalOpen(false);
      loadUsers();
    } catch (error) {
      alert("Erro ao criar usuário.");
    }
  };

  return (
    <div className="p-4 md:p-8">
      {/* Cabeçalho Responsivo */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Usuários</h1>
          <p className="text-slate-500 text-sm">Gerencie as permissões de acesso</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto bg-slate-900 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition shadow-lg active:scale-95"
        >
          <UserPlus size={20} /> 
          <span className="font-semibold">Convidar Usuário</span>
        </button>
      </div>

      {/* Tabela com Scroll Horizontal no Mobile */}
      <div className="w-full overflow-x-auto bg-white rounded-2xl shadow-sm border border-slate-200">
        <table className="w-full text-left min-w-[700px]">
          <thead className="bg-slate-50 border-b">
            <tr className="text-slate-500 text-xs uppercase font-bold tracking-widest">
              <th className="p-4 text-center w-20"><ShieldCheck size={18} className="inline"/></th>
              <th className="p-4">Nome</th>
              <th className="p-4">Email</th>
              <th className="p-4">Cargo</th>
              <th className="p-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-slate-50 transition">
                <td className="p-4 text-center">
                   <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center font-bold text-white shadow-sm ${user.role === 'ADMIN' ? 'bg-purple-500' : 'bg-blue-500'}`}>
                      {user.name[0]}
                   </div>
                </td>
                <td className="p-4 font-semibold">{user.name}</td>
                <td className="p-4 text-slate-500">{user.email}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <button onClick={() => api.delete(`/users/${user.id}`).then(loadUsers)} className="text-slate-300 hover:text-red-500 p-2 transition active:scale-90">
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Responsivo */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Novo Acesso</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required type="text" placeholder="Nome Completo" className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none"
                onChange={e => setFormData({...formData, name: e.target.value})} />
              
              <input required type="email" placeholder="E-mail" className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none"
                onChange={e => setFormData({...formData, email: e.target.value})} />
              
              <input required type="password" placeholder="Senha Temporária" className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none"
                onChange={e => setFormData({...formData, password: e.target.value})} />

              <select 
                className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50 font-medium text-slate-700"
                onChange={e => setFormData({...formData, role: e.target.value})}
              >
                <option value="EDITOR">Cargo: EDITOR (Acesso Limitado)</option>
                <option value="ADMIN">Cargo: ADMINISTRADOR (Acesso Total)</option>
              </select>

              <button type="submit" className="w-full bg-slate-900 text-white p-4 rounded-xl font-bold shadow-xl hover:bg-slate-800 transition active:scale-95">Criar Usuário</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}