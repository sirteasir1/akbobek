import { Eye, HeartHandshake, NotebookTabs } from 'lucide-react';
import { ParentAiPanel } from '@/components/ai-panels';
import { Card, SectionHeader } from '@/components/card';
import { PortalShell } from '@/components/portal-shell';
import { StatCard } from '@/components/stat-card';
import { buildParentWeeklySummary } from '@/lib/analytics';
import { getSession, requireRole } from '@/lib/auth';
import { getStudentFromDb } from '@/lib/db';

export default async function ParentPage() {
  await requireRole('parent');
  const session = await getSession();
  const student = await getStudentFromDb(session.userId?.includes('stu-') ? session.userId : 'stu-001');
  const summary = buildParentWeeklySummary(student);

  return (
    <PortalShell
      role="parent"
      title="Режим наблюдателя для родителя"
      subtitle="Понятная картина по ребенку: сильные стороны, риски, пропуски и конкретные рекомендации на неделю."
    >
      <div className="grid cols-3">
        <StatCard label="Ребёнок" value={student.name} hint={`${student.className} · ${student.grade} класс`} icon={<HeartHandshake size={18} />} />
        <StatCard label="Пропуски" value={`${student.subjects.reduce((sum: number, item: typeof student.subjects[number]) => sum + item.attendanceMissed, 0)}`} hint="По всем предметам" icon={<Eye size={18} />} />
        <StatCard label="Достижения" value={`${student.achievements.length}`} hint="Верифицировано в портфолио" icon={<NotebookTabs size={18} />} />
      </div>

      <div className="grid cols-2">
        <ParentAiPanel studentId={student.id} initial={summary} />
        <Card>
          <SectionHeader
            eyebrow="Прозрачность"
            title="Что видно родителю"
            description="Оценки, динамика, пропуски, успехи и AI-объяснение без перегруза цифрами."
          />
          <div className="parent-checklist">
            {student.subjects.map((subject: typeof student.subjects[number]) => (
              <div key={subject.subjectId} className="check-row">
                <strong>{subject.subjectName}</strong>
                <span className="muted small">Пропуски: {subject.attendanceMissed}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PortalShell>
  );
}
