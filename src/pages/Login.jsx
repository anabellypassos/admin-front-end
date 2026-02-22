import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Lock, Mail, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (error) {
      alert("Credenciais inválidas! Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
        
        {/* Aviso para o Recrutador */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg">
          <div className="flex items-start">
            <AlertCircle className="text-blue-500 mr-3 flex-shrink-0" size={20} />
            <div>
              <p className="text-xs text-blue-800 font-bold uppercase tracking-wider mb-1">Modo de Demonstração</p>
              <p className="text-sm text-blue-700 leading-relaxed">
                O registro está aberto para testes. Novos usuários recebem permissão de <strong>EDITOR</strong>.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800">Admin Panel</h2>
          <p className="text-slate-500 italic">Bem-vindo ao Dashboard Pro</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
            <input 
              required
              type="email" 
              placeholder="E-mail do administrador" 
              className="w-full pl-10 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              onChange={e => setEmail(e.target.value)} 
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
            <input 
              required
              type="password" 
              placeholder="Senha" 
              className="w-full pl-10 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              onChange={e => setPassword(e.target.value)} 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-slate-900 text-white p-3 rounded-lg font-bold hover:bg-slate-800 transition shadow-lg disabled:bg-slate-400"
          >
            {loading ? "Autenticando..." : "Entrar no Sistema"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-slate-500 text-sm mb-3 font-medium text-center">Teste o sistema agora mesmo:</p>
          <Link 
            to="/register" 
            className="inline-block w-full py-2 px-4 border-2 border-blue-600 text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition"
          >
            Criar Minha Conta de Teste
          </Link>
        </div>
      </div>
    </div>
  );
}