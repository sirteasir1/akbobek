import { AlertTriangle, FileText, Users } from 'lucide-react';
import { TeacherAiPanel } from '@/components/ai-panels';
import { Card, SectionHeader } from '@/components/card';
import { PortalShell } from '@/components/portal-shell';
import { StatCard } from '@/components/stat-card';
import { buildClassReport, buildEarlyWarnings } from '@/lib/analytics';
import { requireRole } from '@/lib/auth';
import { teacherClassrooms } from '@/lib/data';

export default async function TeacherPage() {
  await requireRole('teacher');
  const classroom = teacherClassrooms[0];
  const warnings = buildEarlyWarnings(classroom);
  const report = buildClassReport(classroom);

  return (
    <PortalShell
      role="teacher"
      title="Панель учителя"
      subtitle="Риск-аналитика, аномалии и генерация отчётов для классового сопровождения — без ручной рутины."
    >
      <div className="grid cols-3">
        <StatCard label="Класс" value={classroom.name} hint="Текущий фокус" icon={<Users size={18} />} />
        <StatCard label="Красная зона" value={`${warnings.filter((row) => row.flag === 'red').length}`} hint="Нужно срочное внимание" icon={<AlertTriangle size={18} />} />
        <StatCard label="AI-отчёт" value="1 клик" hint="Готов для классного руководителя" icon={<FileText size={18} />} />
      </div>

      <div className="grid cols-2">
        <Card>
          <SectionHeader
            eyebrow="Early Warning System"
            title="Ученики с аномальным падением успеваемости"
            description="Система учитывает средний балл, негативный тренд и пропуски."
          />
          <div className="warning-list">
            {warnings.map((item) => (
              <div key={item.studentId} className={`warning-row ${item.flag}`}>
                <div>
                  <strong>{item.name}</strong>
                  <p className="muted small">{item.summary}</p>
                </div>
                <div className="warning-score">{item.anomalyScore}</div>
              </div>
            ))}
          </div>
        </Card>
        <TeacherAiPanel classroomId={classroom.id} initial={report} />
      </div>
    </PortalShell>
  );
}
