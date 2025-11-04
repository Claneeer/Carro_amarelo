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

export default function Funcionarios({ token }) {
  const [funcionarios, setFuncionarios] = useState([]);
  const [filteredFuncionarios, setFilteredFuncionarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFuncionario, setEditingFuncionario] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    nome: '',
    cargo: '',
    email: '',
    salario: '',
    senha: '',
  });

  useEffect(() => {
    fetchFuncionarios();
  }, []);

  useEffect(() => {
    filterFuncionarios();
  }, [funcionarios, searchTerm]);

  const fetchFuncionarios = async () => {
    try {
      const response = await axios.get(`${API}/funcionarios`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFuncionarios(response.data);
    } catch (error) {
      toast.error('Erro ao carregar funcionários');
    } finally {
      setLoading(false);
    }
  };

  const filterFuncionarios = () => {
    if (!searchTerm) {
      setFilteredFuncionarios(funcionarios);
      return;
    }

    const filtered = funcionarios.filter(
      (f) =>
        f.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.cargo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFuncionarios(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingFuncionario) {
        const updateData = { ...formData };
        if (!updateData.senha) {
          delete updateData.senha;
        }
        await axios.put(`${API}/funcionarios/${editingFuncionario.id}`, updateData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Funcionário atualizado com sucesso!');
      } else {
        await axios.post(`${API}/funcionarios`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Funcionário cadastrado com sucesso!');
      }

      setDialogOpen(false);
      resetForm();
      fetchFuncionarios();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erro ao salvar funcionário');
    }
  };

  const handleEdit = (funcionario) => {
    setEditingFuncionario(funcionario);
    setFormData({
      nome: funcionario.nome,
      cargo: funcionario.cargo,
      email: funcionario.email,
      salario: funcionario.salario.toString(),
      senha: '',
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este funcionário?')) return;

    try {
      await axios.delete(`${API}/funcionarios/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Funcionário excluído com sucesso!');
      fetchFuncionarios();
    } catch (error) {
      toast.error('Erro ao excluir funcionário');
    }
  };

  const resetForm = () => {
    setFormData({ nome: '', cargo: '', email: '', salario: '', senha: '' });
    setEditingFuncionario(null);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-96"><div className="animate-pulse text-yellow-400 text-xl">Carregando...</div></div>;
  }

  return (
    <div className="space-y-6 animate-fadeIn" data-testid="funcionarios-page">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gradient mb-2">Funcionários</h1>
          <p className="text-gray-400">Gerencie sua equipe</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white" data-testid="add-funcionario-button">
              <Plus className="w-4 h-4 mr-2" />
              Novo Funcionário
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md" data-testid="funcionario-dialog">
            <DialogHeader>
              <DialogTitle>{editingFuncionario ? 'Editar Funcionário' : 'Novo Funcionário'}</DialogTitle>
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
                <Label>Cargo</Label>
                <Input
                  value={formData.cargo}
                  onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                  required
                  className="bg-gray-800 border-gray-700"
                  data-testid="cargo-input"
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
                <Label>Salário (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.salario}
                  onChange={(e) => setFormData({ ...formData, salario: e.target.value })}
                  required
                  className="bg-gray-800 border-gray-700"
                  data-testid="salario-input"
                />
              </div>

              <div className="space-y-2">
                <Label>Senha {editingFuncionario && '(deixe em branco para não alterar)'}</Label>
                <Input
                  type="password"
                  value={formData.senha}
                  onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                  required={!editingFuncionario}
                  className="bg-gray-800 border-gray-700"
                  data-testid="senha-input"
                />
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white" data-testid="save-funcionario-button">
                {editingFuncionario ? 'Atualizar' : 'Cadastrar'}
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
            placeholder="Buscar por nome, email ou cargo..."
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
              <TableHead className="text-gray-300">Cargo</TableHead>
              <TableHead className="text-gray-300">Email</TableHead>
              <TableHead className="text-gray-300">Salário</TableHead>
              <TableHead className="text-gray-300 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFuncionarios.map((funcionario) => (
              <TableRow key={funcionario.id} className="border-gray-700 hover:bg-gray-800/50" data-testid={`funcionario-row-${funcionario.id}`}>
                <TableCell className="text-white font-medium">{funcionario.nome}</TableCell>
                <TableCell className="text-gray-300">{funcionario.cargo}</TableCell>
                <TableCell className="text-gray-300">{funcionario.email}</TableCell>
                <TableCell className="text-gray-300">
                  R$ {funcionario.salario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      onClick={() => handleEdit(funcionario)}
                      variant="outline"
                      size="sm"
                      className="border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-white"
                      data-testid={`edit-funcionario-${funcionario.id}`}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(funcionario.id)}
                      variant="outline"
                      size="sm"
                      className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                      data-testid={`delete-funcionario-${funcionario.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredFuncionarios.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">Nenhum funcionário encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}
