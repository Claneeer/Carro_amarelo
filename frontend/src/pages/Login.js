import React, { useState } from 'react';
import axios from 'axios';
import { API } from '../App';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Car } from 'lucide-react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API}/auth/login`, { email, senha });
      toast.success('Login realizado com sucesso!');
      onLogin(response.data.token, response.data.funcionario);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
      <div className="w-full max-w-md">
        <div className="glass rounded-2xl p-8 shadow-2xl animate-fadeIn">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-4 rounded-full mb-4">
              <Car className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gradient mb-2">Carro Amarelo</h1>
            <p className="text-gray-400 text-center">Sistema de Gerenciamento de Vendas</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" data-testid="login-form">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                data-testid="email-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="senha" className="text-gray-300">Senha</Label>
              <Input
                id="senha"
                type="password"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                data-testid="password-input"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white font-semibold py-6 rounded-xl"
              disabled={loading}
              data-testid="login-button"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700/30 rounded-lg">
            <p className="text-xs text-blue-300 text-center mb-2">Credenciais de teste:</p>
            <p className="text-xs text-gray-400 text-center">Email: joao@carroamarelo.com</p>
            <p className="text-xs text-gray-400 text-center">Senha: senha123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
