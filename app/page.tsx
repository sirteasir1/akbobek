import Link from 'next/link';
import { BrainCircuit, CalendarSync, ChartNoAxesCombined, Trophy } from 'lucide-react';
import { Card, SectionHeader } from '@/components/card';
import { Leaderboard } from '@/components/leaderboard';
import { PortalShell } from '@/components/portal-shell';

const features = [
  {
    title: 'AI Tutor + Early Warning',
    description: 'Алгоритмы оценки риска, граф знаний и персональные рекомендации по подготовке.',
    icon: BrainCircuit,
  },
  {
    title: 'Smart Schedule',
    description: 'Автогенерация расписания с лентами, заменами, мероприятиями и пуш-уведомлениями.',
    icon: CalendarSync,
  },
  {
    title: 'Global Radar',
    description: 'Дашборды по качеству образования, классам, предметам и тенденциям.',
    icon: ChartNoAxesCombined,
  },
  {
    title: 'Digital Portfolio',
    description: 'Сертификаты, олимпиады, ачивки и геймификация в едином профиле.',
    icon: Trophy,
  },
];

export default function HomePage() {
  return (
    <PortalShell
      title="Единый школьный портал Aqbobek Lyceum"
      subtitle="Красивый MVP, который объединяет оценки, AI-аналитику, достижения, школьную ленту и интеллектуальное управление расписанием."
    >
      <div className="grid cols-2">
        <Card className="hero-card">
          <SectionHeader
            eyebrow="Что уже готово"
            title="Сценарий под жюри закрыт end-to-end"
            description="Есть роли, авторизация, mock BilimClass API, AI API-роуты, Kiosk Mode и генератор расписания."
          />
          <div className="hero-actions">
            <Link href="/login" className="primary-button">Войти в демо</Link>
            <Link href="/kiosk" className="secondary-button">Открыть стенгазету</Link>
          </div>
        </Card>
        <Card>
          <SectionHeader
            eyebrow="Геймификация"
            title="Лидерборд дня"
            description="Подходит и для портала ученика, и для интерактивной панели в коридоре."
          />
          <Leaderboard />
        </Card>
      </div>

      <div className="feature-grid">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.title}>
              <div className="feature-icon"><Icon size={18} /></div>
              <h3>{feature.title}</h3>
              <p className="muted">{feature.description}</p>
            </Card>
          );
        })}
      </div>
    </PortalShell>
  );
}
