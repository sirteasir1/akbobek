import { ReactNode } from 'react';
import { Card } from '@/components/card';

export function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint: string;
  icon?: ReactNode;
}) {
  return (
    <Card className="stat-card">
      <div className="stat-card-top">
        <span className="stat-label">{label}</span>
        {icon ? <span className="stat-icon">{icon}</span> : null}
      </div>
      <div className="stat-value">{value}</div>
      <p className="muted small">{hint}</p>
    </Card>
  );
}
