import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../App';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

export default function Clientes({ token }) {
  const [clientes, setClientes] = useState([]);
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    telefone: '',
    email: '',
    endereco: '',
  });

  useEffect(() => {
    fetchClientes();
  }, []);

  useEffect(() => {
    filterClientes();
  }, [clientes, searchTerm]);

  const fetchClientes = async () => {
    try {
      const response = await axios.get(`${API}/clientes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClientes(response.data);
    } catch (error) {
      toast.error('Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  };

  const filterClientes = () => {
    if (!searchTerm) {
      setFilteredClientes(clientes);
      return;
    }

    const filtered = clientes.filter(
      (c) =>
        c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.cpf.includes(searchTerm)
    );
    setFilteredClientes(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingCliente) {
        await axios.put(`${API}/clientes/${editingCliente.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Cliente atualizado com sucesso!');
      } else {
        await axios.post(`${API}/clientes`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Cliente cadastrado com sucesso!');
      }

      setDialogOpen(false);
      resetForm();
      fetchClientes();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erro ao salvar cliente');
    }
  };

  const handleEdit = (cliente) => {
    setEditingCliente(cliente);
    setFormData({
      nome: cliente.nome,
      cpf: cliente.cpf,
      telefone: cliente.telefone,
      email: cliente.email,
      endereco: cliente.endereco,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este cliente?')) return;

    try {
      await axios.delete(`${API}/clientes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Cliente excluído com sucesso!');
      fetchClientes();
    } catch (error) {
      toast.error('Erro ao excluir cliente');
    }
  };

  const resetForm = () => {
    setFormData({ nome: '', cpf: '', telefone: '', email: '', endereco: '' });
    setEditingCliente(null);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-96"><div className="animate-pulse text-yellow-400 text-xl">Carregando...</div></div>;
  }

  return (
    <div className="space-y-6 animate-fadeIn" data-testid="clientes-page">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gradient mb-2">Clientes</h1>
          <p className="text-gray-400">Gerencie seus clientes</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white" data-testid="add-cliente-button">
              <Plus className="w-4 h-4 mr-2" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md" data-testid="cliente-dialog">
            <DialogHeader>
              <DialogTitle>{editingCliente ? 'Editar Cliente' : 'Novo Cliente'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                  className="bg-gray-800 border-gray-700"
                  data-testid="nome-input"
                />
              </div>

              <div className="space-y-2">
                <Label>CPF</Label>
                <Input
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                  placeholder="000.000.000-00"
                  required
                  className="bg-gray-800 border-gray-700"
                  data-testid="cpf-input"
                />
              </div>

              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  placeholder="(00) 00000-0000"
                  required
                  className="bg-gray-800 border-gray-700"
                  data-testid="telefone-input"
                />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-gray-800 border-gray-700"
                  data-testid="email-input"
                />
              </div>

              <div className="space-y-2">
                <Label>Endereço</Label>
                <Input
                  value={formData.endereco}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                  required
                  className="bg-gray-800 border-gray-700"
                  data-testid="endereco-input"
                />
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white" data-testid="save-cliente-button">
                {editingCliente ? 'Atualizar' : 'Cadastrar'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="glass border-gray-700 rounded-xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Buscar por nome, email ou CPF..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white"
            data-testid="search-input"
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass border-gray-700 rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700 hover:bg-gray-800/50">
              <TableHead className="text-gray-300">Nome</TableHead>
              <TableHead className="text-gray-300">CPF</TableHead>
              <TableHead className="text-gray-300">Telefone</TableHead>
              <TableHead className="text-gray-300">Email</TableHead>
              <TableHead className="text-gray-300">Endereço</TableHead>
              <TableHead className="text-gray-300 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClientes.map((cliente) => (
              <TableRow key={cliente.id} className="border-gray-700 hover:bg-gray-800/50" data-testid={`cliente-row-${cliente.id}`}>
                <TableCell className="text-white font-medium">{cliente.nome}</TableCell>
                <TableCell className="text-gray-300">{cliente.cpf}</TableCell>
                <TableCell className="text-gray-300">{cliente.telefone}</TableCell>
                <TableCell className="text-gray-300">{cliente.email}</TableCell>
                <TableCell className="text-gray-300">{cliente.endereco}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      onClick={() => handleEdit(cliente)}
                      variant="outline"
                      size="sm"
                      className="border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-white"
                      data-testid={`edit-cliente-${cliente.id}`}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(cliente.id)}
                      variant="outline"
                      size="sm"
                      className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                      data-testid={`delete-cliente-${cliente.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredClientes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">Nenhum cliente encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}
