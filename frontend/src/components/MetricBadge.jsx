import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

export const MetricBadge = ({ status = 'verde', text }) => {
  const styles = {
    verde: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    amarillo: 'bg-amber-100 text-amber-800 border-amber-300',
    rojo: 'bg-rose-100 text-rose-800 border-rose-300',
  };

  const icons = {
    verde: CheckCircle2,
    amarillo: AlertTriangle,
    rojo: XCircle,
  };

  const Icon = icons[status] || CheckCircle2;

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles[status]}`}>
      <Icon className="w-3.5 h-3.5" />
      {text || status.toUpperCase()}
    </span>
  );
};
