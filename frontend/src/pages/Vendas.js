import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../App';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Plus, Trash2, ShoppingCart } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Vendas({ token }) {
  const [vendas, setVendas] = useState([]);
  const [carros, setCarros] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    carro_id: '',
    cliente_id: '',
    funcionario_id: '',
    valor_venda: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [vendasRes, carrosRes, clientesRes, funcionariosRes] = await Promise.all([
        axios.get(`${API}/vendas`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/carros`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/clientes`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/funcionarios`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      setVendas(vendasRes.data);
      setCarros(carrosRes.data);
      setClientes(clientesRes.data);
      setFuncionarios(funcionariosRes.data);
    } catch (error) {
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API}/vendas`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Venda registrada com sucesso!');
      setDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erro ao registrar venda');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta venda?')) return;

    try {
      await axios.delete(`${API}/vendas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Venda excluída com sucesso!');
      fetchData();
    } catch (error) {
      toast.error('Erro ao excluir venda');
    }
  };

  const resetForm = () => {
    setFormData({ carro_id: '', cliente_id: '', funcionario_id: '', valor_venda: '' });
  };

  const getCarroInfo = (carroId) => {
    const carro = carros.find((c) => c.id === carroId);
    return carro ? `${carro.marca} ${carro.modelo} ${carro.cor}` : 'N/A';
  };

  const getClienteNome = (clienteId) => {
    const cliente = clientes.find((c) => c.id === clienteId);
    return cliente?.nome || 'N/A';
  };

  const getFuncionarioNome = (funcionarioId) => {
    const funcionario = funcionarios.find((f) => f.id === funcionarioId);
    return funcionario?.nome || 'N/A';
  };

  const carrosDisponiveis = carros.filter((c) => c.status === 'disponível');

  if (loading) {
    return <div className="flex items-center justify-center h-96"><div className="animate-pulse text-yellow-400 text-xl">Carregando...</div></div>;
  }

  return (
    <div className="space-y-6 animate-fadeIn" data-testid="vendas-page">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gradient mb-2">Vendas</h1>
          <p className="text-gray-400">Registre e gerencie as vendas</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white" data-testid="add-venda-button">
              <Plus className="w-4 h-4 mr-2" />
              Nova Venda
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md" data-testid="venda-dialog">
            <DialogHeader>
              <DialogTitle>Nova Venda</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Carro</Label>
                <Select
                  value={formData.carro_id}
                  onValueChange={(v) => {
                    const carro = carros.find((c) => c.id === v);
                    setFormData({ ...formData, carro_id: v, valor_venda: carro?.preco.toString() || '' });
                  }}
                  required
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700" data-testid="carro-select">
                    <SelectValue placeholder="Selecione o carro" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {carrosDisponiveis.map((carro) => (
                      <SelectItem key={carro.id} value={carro.id}>
                        {carro.marca} {carro.modelo} - {carro.cor} (R$ {carro.preco.toLocaleString('pt-BR')})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {carrosDisponiveis.length === 0 && (
                  <p className="text-xs text-red-400">Nenhum carro disponível para venda</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Cliente</Label>
                <Select value={formData.cliente_id} onValueChange={(v) => setFormData({ ...formData, cliente_id: v })} required>
                  <SelectTrigger className="bg-gray-800 border-gray-700" data-testid="cliente-select">
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {clientes.map((cliente) => (
                      <SelectItem key={cliente.id} value={cliente.id}>
                        {cliente.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Funcionário (Vendedor)</Label>
                <Select value={formData.funcionario_id} onValueChange={(v) => setFormData({ ...formData, funcionario_id: v })} required>
                  <SelectTrigger className="bg-gray-800 border-gray-700" data-testid="funcionario-select">
                    <SelectValue placeholder="Selecione o funcionário" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {funcionarios.map((funcionario) => (
                      <SelectItem key={funcionario.id} value={funcionario.id}>
                        {funcionario.nome} - {funcionario.cargo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Valor da Venda (R$)</Label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.valor_venda}
                  onChange={(e) => setFormData({ ...formData, valor_venda: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  data-testid="valor-venda-input"
                />
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white" data-testid="save-venda-button">
                Registrar Venda
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Vendas Table */}
      <div className="glass border-gray-700 rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700 hover:bg-gray-800/50">
              <TableHead className="text-gray-300">Data</TableHead>
              <TableHead className="text-gray-300">Carro</TableHead>
              <TableHead className="text-gray-300">Cliente</TableHead>
              <TableHead className="text-gray-300">Vendedor</TableHead>
              <TableHead className="text-gray-300">Valor</TableHead>
              <TableHead className="text-gray-300 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendas.map((venda) => (
              <TableRow key={venda.id} className="border-gray-700 hover:bg-gray-800/50" data-testid={`venda-row-${venda.id}`}>
                <TableCell className="text-white">
                  {format(new Date(venda.data_venda), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                </TableCell>
                <TableCell className="text-gray-300">{getCarroInfo(venda.carro_id)}</TableCell>
                <TableCell className="text-gray-300">{getClienteNome(venda.cliente_id)}</TableCell>
                <TableCell className="text-gray-300">{getFuncionarioNome(venda.funcionario_id)}</TableCell>
                <TableCell className="text-yellow-400 font-semibold">
                  R$ {venda.valor_venda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    onClick={() => handleDelete(venda.id)}
                    variant="outline"
                    size="sm"
                    className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                    data-testid={`delete-venda-${venda.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {vendas.length === 0 && (
          <div className="text-center py-12">
            <ShoppingCart className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Nenhuma venda registrada ainda</p>
          </div>
        )}
      </div>

      {/* Total vendas */}
      {vendas.length > 0 && (
        <div className="glass border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total de Vendas</p>
              <p className="text-3xl font-bold text-gradient">
                R$ {vendas.reduce((sum, v) => sum + v.valor_venda, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-4 rounded-xl">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
