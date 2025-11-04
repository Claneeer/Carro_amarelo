import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../App';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Car as CarIcon } from 'lucide-react';

export default function Carros({ token }) {
  const [carros, setCarros] = useState([]);
  const [filteredCarros, setFilteredCarros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCarro, setEditingCarro] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');

  const [formData, setFormData] = useState({
    modelo: '',
    marca: '',
    cor: '',
    preco: '',
    portas: '4',
  });

  const modelos = ['Coupe', 'Compacto', 'SUV', 'Esportivo'];
  const marcas = ['Ford', 'GMC', 'Toyota', 'Volkswagen'];
  const cores = ['Vermelho', 'Preto', 'Branco', 'Cinza'];

  useEffect(() => {
    fetchCarros();
  }, []);

  useEffect(() => {
    filterCarros();
  }, [carros, searchTerm, filterStatus]);

  const fetchCarros = async () => {
    try {
      const response = await axios.get(`${API}/carros`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCarros(response.data);
    } catch (error) {
      toast.error('Erro ao carregar carros');
    } finally {
      setLoading(false);
    }
  };

  const filterCarros = () => {
    let filtered = carros;

    if (searchTerm) {
      filtered = filtered.filter(
        (c) =>
          c.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.cor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'todos') {
      filtered = filtered.filter((c) => c.status === filterStatus);
    }

    setFilteredCarros(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingCarro) {
        await axios.put(`${API}/carros/${editingCarro.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Carro atualizado com sucesso!');
      } else {
        await axios.post(`${API}/carros`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Carro cadastrado com sucesso!');
      }

      setDialogOpen(false);
      resetForm();
      fetchCarros();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erro ao salvar carro');
    }
  };

  const handleEdit = (carro) => {
    setEditingCarro(carro);
    setFormData({
      modelo: carro.modelo,
      marca: carro.marca,
      cor: carro.cor,
      preco: carro.preco.toString(),
      portas: carro.portas.toString(),
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este carro?')) return;

    try {
      await axios.delete(`${API}/carros/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Carro excluído com sucesso!');
      fetchCarros();
    } catch (error) {
      toast.error('Erro ao excluir carro');
    }
  };

  const resetForm = () => {
    setFormData({ modelo: '', marca: '', cor: '', preco: '', portas: '4' });
    setEditingCarro(null);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-96"><div className="animate-pulse text-yellow-400 text-xl">Carregando...</div></div>;
  }

  return (
    <div className="space-y-6 animate-fadeIn" data-testid="carros-page">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gradient mb-2">Carros</h1>
          <p className="text-gray-400">Gerencie o estoque de veículos</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white" data-testid="add-carro-button">
              <Plus className="w-4 h-4 mr-2" />
              Novo Carro
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md" data-testid="carro-dialog">
            <DialogHeader>
              <DialogTitle>{editingCarro ? 'Editar Carro' : 'Novo Carro'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Modelo</Label>
                <Select value={formData.modelo} onValueChange={(v) => setFormData({ ...formData, modelo: v })} required>
                  <SelectTrigger className="bg-gray-800 border-gray-700" data-testid="modelo-select">
                    <SelectValue placeholder="Selecione o modelo" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {modelos.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Marca</Label>
                <Select value={formData.marca} onValueChange={(v) => setFormData({ ...formData, marca: v })} required>
                  <SelectTrigger className="bg-gray-800 border-gray-700" data-testid="marca-select">
                    <SelectValue placeholder="Selecione a marca" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {marcas.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Cor</Label>
                <Select value={formData.cor} onValueChange={(v) => setFormData({ ...formData, cor: v })} required>
                  <SelectTrigger className="bg-gray-800 border-gray-700" data-testid="cor-select">
                    <SelectValue placeholder="Selecione a cor" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {cores.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Preço (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.preco}
                  onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                  required
                  className="bg-gray-800 border-gray-700"
                  data-testid="preco-input"
                />
              </div>

              <div className="space-y-2">
                <Label>Portas</Label>
                <Select value={formData.portas} onValueChange={(v) => setFormData({ ...formData, portas: v })} required>
                  <SelectTrigger className="bg-gray-800 border-gray-700" data-testid="portas-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="2">2 portas</SelectItem>
                    <SelectItem value="4">4 portas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white" data-testid="save-carro-button">
                {editingCarro ? 'Atualizar' : 'Cadastrar'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="glass border-gray-700 rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-300 mb-2 block">Buscar</Label>
            <Input
              placeholder="Buscar por modelo, marca ou cor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
              data-testid="search-input"
            />
          </div>
          <div>
            <Label className="text-gray-300 mb-2 block">Status</Label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white" data-testid="status-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="disponível">Disponível</SelectItem>
                <SelectItem value="vendido">Vendido</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Carros Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCarros.map((carro) => (
          <Card key={carro.id} className="glass border-gray-700 card-hover" data-testid={`carro-card-${carro.id}`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-3 rounded-lg">
                  <CarIcon className="w-8 h-8 text-white" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  carro.status === 'disponível'
                    ? 'bg-green-900/50 text-green-400 border border-green-700'
                    : 'bg-red-900/50 text-red-400 border border-red-700'
                }`} data-testid={`carro-status-${carro.id}`}>
                  {carro.status}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-1">{carro.marca} {carro.modelo}</h3>
              <p className="text-gray-400 text-sm mb-3">{carro.cor} | {carro.portas} portas</p>

              <div className="mb-4">
                <span className="text-2xl font-bold text-gradient">
                  R$ {carro.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={() => handleEdit(carro)}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-white"
                  data-testid={`edit-carro-${carro.id}`}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <Button
                  onClick={() => handleDelete(carro.id)}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                  data-testid={`delete-carro-${carro.id}`}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCarros.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">Nenhum carro encontrado</p>
        </div>
      )}
    </div>
  );
}
