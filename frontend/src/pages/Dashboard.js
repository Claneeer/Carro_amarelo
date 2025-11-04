import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, DollarSign, Users, UserCircle, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

export default function Dashboard({ token }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API}/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(response.data);
    } catch (error) {
      toast.error('Erro ao carregar estatísticas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-pulse text-yellow-400 text-xl">Carregando...</div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total de Carros',
      value: stats?.total_carros || 0,
      icon: Car,
      color: 'from-blue-500 to-blue-700',
      testId: 'total-carros'
    },
    {
      title: 'Carros Disponíveis',
      value: stats?.carros_disponiveis || 0,
      icon: TrendingUp,
      color: 'from-green-500 to-green-700',
      testId: 'carros-disponiveis'
    },
    {
      title: 'Carros Vendidos',
      value: stats?.carros_vendidos || 0,
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-700',
      testId: 'carros-vendidos'
    },
    {
      title: 'Total em Vendas',
      value: `R$ ${(stats?.total_vendas || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'from-yellow-400 to-yellow-600',
      testId: 'total-vendas'
    },
    {
      title: 'Total de Clientes',
      value: stats?.total_clientes || 0,
      icon: Users,
      color: 'from-pink-500 to-pink-700',
      testId: 'total-clientes'
    },
    {
      title: 'Total de Funcionários',
      value: stats?.total_funcionarios || 0,
      icon: UserCircle,
      color: 'from-indigo-500 to-indigo-700',
      testId: 'total-funcionarios'
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn" data-testid="dashboard-page">
      <div>
        <h1 className="text-4xl font-bold text-gradient mb-2">Dashboard</h1>
        <p className="text-gray-400">Visão geral do sistema</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="glass border-gray-700 card-hover" data-testid={stat.testId}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                  </div>
                  <div className={`p-4 rounded-xl bg-gradient-to-br ${stat.color}`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendas por Modelo */}
        <Card className="glass border-gray-700" data-testid="vendas-por-modelo">
          <CardHeader>
            <CardTitle className="text-white">Vendas por Modelo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats?.vendas_por_modelo || {}).map(([modelo, quantidade]) => (
                <div key={modelo} className="flex items-center justify-between">
                  <span className="text-gray-300">{modelo}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600"
                        style={{ width: `${(quantidade / Math.max(...Object.values(stats?.vendas_por_modelo || {}))) * 100}%` }}
                      />
                    </div>
                    <span className="text-yellow-400 font-semibold w-8 text-right">{quantidade}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Vendas por Marca */}
        <Card className="glass border-gray-700" data-testid="vendas-por-marca">
          <CardHeader>
            <CardTitle className="text-white">Vendas por Marca</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats?.vendas_por_marca || {}).map(([marca, quantidade]) => (
                <div key={marca} className="flex items-center justify-between">
                  <span className="text-gray-300">{marca}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600"
                        style={{ width: `${(quantidade / Math.max(...Object.values(stats?.vendas_por_marca || {}))) * 100}%` }}
                      />
                    </div>
                    <span className="text-yellow-400 font-semibold w-8 text-right">{quantidade}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
