import { useEffect, useState } from 'react';
import api from '../services/api';
import { Trash2, PackagePlus, X, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ name: '', price: '', stock: '', image: null });
    const [preview, setPreview] = useState(null);

    // Link do seu backend no Render para carregar as fotos
    const BACKEND_URL = 'https://admin-dashboard-backend-uj3j.onrender.com';

    useEffect(() => { loadProducts(); }, []);

    const loadProducts = async () => {
        try {
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (error) {
            console.error("Erro ao carregar produtos");
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Ativa o carregamento
        const data = new FormData();
        data.append('name', formData.name);
        data.append('price', formData.price);
        data.append('stock', formData.stock);
        if (formData.image) data.append('image', formData.image);

        try {
            await api.post('/products', data);
            setIsModalOpen(false);
            setPreview(null); // Limpa o preview
            loadProducts();
            alert("Produto cadastrado com sucesso!");
        } catch (error) {
            if (error.response?.status === 403) {
                alert("ACESSO NEGADO: Apenas ADMINS podem cadastrar produtos.");
            } else {
                alert("Erro ao cadastrar. Verifique os dados.");
            }
        } finally {
            setLoading(false); // Desativa o carregamento
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir este produto?")) {
            try {
                await api.delete(`/products/${id}`);
                loadProducts();
            } catch (error) {
                alert("Erro ao excluir. Apenas ADMINS podem deletar.");
            }
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Estoque</h1>
                    <p className="text-slate-500 text-sm">Gerencie os itens do seu catálogo</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition shadow-md">
                    <PackagePlus size={20} /> Novo Produto
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr className="text-slate-500 text-xs uppercase font-bold tracking-wider">
                            <th className="p-4">Foto</th>
                            <th className="p-4">Nome</th>
                            <th className="p-4">Preço</th>
                            <th className="p-4 text-center">Qtd</th>
                            <th className="p-4 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {products.map(p => (
                            <tr key={p.id} className="hover:bg-slate-50 transition">
                                <td className="p-4">
                                    <img 
                                        src={p.image ? `${BACKEND_URL}${p.image}` : 'https://via.placeholder.com/50'} 
                                        className="w-12 h-12 object-cover rounded-lg border border-slate-200" 
                                        alt=""
                                    />
                                </td>
                                <td className="p-4 font-semibold text-slate-700">{p.name}</td>
                                <td className="p-4 text-slate-600 font-medium">R$ {p.price.toFixed(2)}</td>
                                <td className="p-4 text-center">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${p.stock < 5 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                        {p.stock} un
                                    </span>
                                </td>
                                <td className="p-4 text-center">
                                    <button onClick={() => handleDelete(p.id)} className="text-slate-300 hover:text-red-500 transition p-2">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-slate-800">Novo Produto</h2>
                            <button onClick={() => { setIsModalOpen(false); setPreview(null); }} className="text-slate-400 hover:text-slate-600"><X /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex justify-center mb-4">
                                <label className="w-32 h-32 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer overflow-hidden hover:border-blue-500 transition-colors">
                                    {preview ? <img src={preview} className="w-full h-full object-cover" /> : <div className="flex flex-col items-center text-slate-400"><ImageIcon size={32} /> <span className="text-[10px] mt-1 font-bold">ADD FOTO</span></div>}
                                    <input type="file" className="hidden" onChange={handleImageChange} />
                                </label>
                            </div>
                            <input required type="text" placeholder="Nome do produto" className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            <div className="grid grid-cols-2 gap-4">
                                <input required type="number" step="0.01" placeholder="Preço" className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" onChange={e => setFormData({ ...formData, price: e.target.value })} />
                                <input required type="number" placeholder="Estoque" className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" onChange={e => setFormData({ ...formData, stock: e.target.value })} />
                            </div>
                            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
                                {loading ? <Loader2 className="animate-spin" /> : "Salvar Produto"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}