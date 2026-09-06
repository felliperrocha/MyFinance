export function formatCurrency(value: number | string | null | undefined, currency: string = 'BRL'): string {
  if (value === null || value === undefined) return 'R$ 0,00';
  const num = typeof value === 'number' ? value : parseFloat(String(value).replace(',', '.'));
  const numericValue = isNaN(num) ? 0 : num;
  
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(numericValue);
  }
  
  if (currency === 'EUR') {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(numericValue);
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(numericValue);
}

export function formatPercent(value: number | string | null | undefined, decimals: number = 0): string {
  if (value === null || value === undefined) return '0%';
  const num = typeof value === 'number' ? value : parseFloat(String(value).replace(',', '.'));
  const numericValue = isNaN(num) ? 0 : num;
  return `${numericValue.toFixed(decimals)}%`;
}

export function formatDate(dateString: string | Date | null | undefined): string {
  if (!dateString) return '';
  if (dateString instanceof Date) {
    return dateString.toLocaleDateString('pt-BR');
  }
  const clean = String(dateString).trim();
  // Strip ISO time part (e.g. 2026-09-06T00:00:00.000Z -> 2026-09-06)
  const dateOnly = clean.split('T')[0];
  const parts = dateOnly.split('-');
  if (parts.length === 3 && parts[0].length === 4) {
    const [year, month, day] = parts;
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
  }
  const date = new Date(clean);
  if (isNaN(date.getTime())) return clean;
  return date.toLocaleDateString('pt-BR');
}

export function getMonthName(monthIndex: number): string {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  return months[monthIndex] || '';
}

export function calculateDaysRemaining(deadlineDateStr: string): number {
  if (!deadlineDateStr) return 0;
  const deadline = new Date(deadlineDateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  deadline.setHours(0, 0, 0, 0);
  const diffTime = deadline.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
