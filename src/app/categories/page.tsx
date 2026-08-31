'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Modal from '@/components/ui/Modal';
import { Category } from '@/lib/types';
import {
  Plus,
  Tag,
  Home,
  Utensils,
  Car,
  Activity,
  GraduationCap,
  Film,
  ShoppingBag,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const iconMap: Record<string, any> = {
  Tag,
  Home,
  Utensils,
  Car,
  Activity,
  GraduationCap,
  Film,
  ShoppingBag,
  TrendingUp,
};

export default function CategoriesPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('Tag');
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, icon, color: '#0F0F0F' }),
      });
      if (res.ok) {
        setName('');
        setIcon('Tag');
        setIsModalOpen(false);
        fetchCategories();
      }
    } catch (err) {
      console.error('Error creating category:', err);
    }
  };

  return (
    <>
      <Header />

      <main className="page-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary-black)' }}>
              Categorias de Despesas e Receitas
            </h1>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-medium-gray)', marginTop: '0.2rem' }}>
              Organize seus lançamentos financeiros através de classificações claras e personalizadas.
            </p>
          </div>

          <button onClick={() => setIsModalOpen(true)} className="mf-btn mf-btn-primary">
            <Plus size={16} />
            <span>Nova Categoria</span>
          </button>
        </div>

        {/* Categories Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '1rem',
          }}
        >
          {categories.map((c) => {
            const IconComponent = iconMap[c.icon] || Tag;
            return (
              <div
                key={c.id}
                className="mf-card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.875rem',
                  padding: '1rem 1.25rem',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--color-surface-hover)',
                    border: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-primary-black)',
                  }}
                >
                  <IconComponent size={18} strokeWidth={1.8} />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-primary-black)' }}>
                    {c.name}
                  </h3>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--color-medium-gray)', textTransform: 'capitalize' }}>
                    Categoria de Despesa
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Criar Nova Categoria"
        subtitle="Defina o nome e o ícone minimalista da categoria."
      >
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label className="mf-label">Nome da Categoria</label>
            <input
              type="text"
              className="mf-input"
              placeholder="Ex: Assinaturas, Animais de Estimação, Academia..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div>
            <label className="mf-label">Ícone</label>
            <select
              className="mf-select"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
            >
              <option value="Tag">Etiqueta (Geral)</option>
              <option value="Home">Moradia / Casa</option>
              <option value="Utensils">Alimentação / Restaurante</option>
              <option value="Car">Transporte / Carro</option>
              <option value="Activity">Saúde / Bem-estar</option>
              <option value="GraduationCap">Educação / Cursos</option>
              <option value="Film">Lazer / Entretenimento</option>
              <option value="ShoppingBag">Compras / Vestuário</option>
              <option value="TrendingUp">Investimentos / Finanças</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="mf-btn mf-btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="mf-btn mf-btn-primary">
              Salvar Categoria
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
