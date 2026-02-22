import { useEffect, useState } from 'react';
import api from '../services/api';
import { Trash2, PackagePlus, X, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ name: '', price: '', stock: '', image: null });
    const [preview, setPreview] = useState(null);

    useEffect(() => { loadProducts(); }, []);

    const loadProducts = async () => {
        const res = await api.get('/products');
        setProducts(res.data);
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
        const data = new FormData();
        data.append('name', formData.name);
        data.append('price', formData.price);
        data.append('stock', formData.stock);
        if (formData.image) data.append('image', formData.image);

        try {
            await api.post('/products', data);
            setIsModalOpen(false);
            loadProducts();
            alert("Produto cadastrado!");
        } catch (error) {
            if (error.response?.status === 403) {
                alert("ACESSO NEGADO: Seu usuário é um EDITOR. Apenas ADMINS podem cadastrar produtos.");
            } else {
                alert("Erro ao cadastrar. Verifique os dados.");
            }
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Estoque</h1>
                <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-5 py-2 rounded-lg flex items-center gap-2">
                    <PackagePlus size={20} /> Novo Produto
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4">Foto</th>
                            <th className="p-4">Nome</th>
                            <th className="p-4">Preço</th>
                            <th className="p-4">Qtd</th>
                            <th className="p-4 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.id} className="border-b hover:bg-gray-50 transition">
                                <td className="p-4">
                                    <img src={p.image ? `http://localhost:5000${p.image}` : 'https://via.placeholder.com/50'} className="w-10 h-10 object-cover rounded" />
                                </td>
                                <td className="p-4 font-medium">{p.name}</td>
                                <td className="p-4">R$ {p.price.toFixed(2)}</td>
                                <td className="p-4">{p.stock} un</td>
                                <td className="p-4 text-center">
                                    <button onClick={() => api.delete(`/products/${p.id}`).then(loadProducts)} className="text-red-500 p-2">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Novo Produto</h2>
                            <button onClick={() => setIsModalOpen(false)}><X /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex justify-center">
                                <label className="w-24 h-24 bg-gray-100 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden">
                                    {preview ? <img src={preview} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-400" />}
                                    <input type="file" className="hidden" onChange={handleImageChange} />
                                </label>
                            </div>
                            <input required type="text" placeholder="Nome" className="w-full p-3 border rounded-lg" onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            <div className="grid grid-cols-2 gap-4">
                                <input required type="number" step="0.01" placeholder="Preço" className="w-full p-3 border rounded-lg" onChange={e => setFormData({ ...formData, price: e.target.value })} />
                                <input required type="number" placeholder="Estoque" className="w-full p-3 border rounded-lg" onChange={e => setFormData({ ...formData, stock: e.target.value })} />
                            </div>
                            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold">
                                {loading ? "Salvando..." : "Salvar Produto"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}