import { Bell, CalendarDays, ShieldCheck } from 'lucide-react';
import { Card, SectionHeader } from '@/components/card';
import { FeedList } from '@/components/feed-list';
import { PortalShell } from '@/components/portal-shell';
import { ScheduleGenerator } from '@/components/schedule-generator';
import { StatCard } from '@/components/stat-card';
import { requireRole } from '@/lib/auth';
import { getFeedFromDb } from '@/lib/db';

export default async function AdminPage() {
  await requireRole('admin');
  const feed = await getFeedFromDb();

  return (
    <PortalShell
      role="admin"
      title="Панель администрации"
      subtitle="Управление школьной лентой, глобальными метриками и динамическим расписанием в одном центре."
    >
      <div className="grid cols-3">
        <StatCard label="Quality Radar" value="92%" hint="Условный индекс качества по параллелям" icon={<ShieldCheck size={18} />} />
        <StatCard label="Уведомления" value="Targeted" hint="Посты видны нужным классам" icon={<Bell size={18} />} />
        <StatCard label="Расписание" value="Smart" hint="Генерация без конфликтов" icon={<CalendarDays size={18} />} />
      </div>

      <ScheduleGenerator />

      <Card>
        <SectionHeader
          eyebrow="Notification Center"
          title="Лента публикаций и объявлений"
          description="Здесь администратор может публиковать события с таргетингом по ролям и параллелям."
        />
        <FeedList items={feed} />
      </Card>
    </PortalShell>
  );
}
