import { Award, BookOpenText, Flame, Target } from 'lucide-react';
import { Card, SectionHeader } from '@/components/card';
import { FeedList } from '@/components/feed-list';
import { PortalShell } from '@/components/portal-shell';
import { ProgressBars } from '@/components/progress-bars';
import { Sparkline } from '@/components/sparkline';
import { StatCard } from '@/components/stat-card';
import { StudentAiPanel } from '@/components/ai-panels';
import { evaluateStudentRisk } from '@/lib/analytics';
import { getSession, requireRole } from '@/lib/auth';
import { getFeedFromDb, getStudentFromDb } from '@/lib/db';

export default async function StudentPage() {
  await requireRole('student');
  const session = await getSession();
  const student = await getStudentFromDb(session.userId || 'stu-001');
  const feed = await getFeedFromDb();
  const insight = evaluateStudentRisk(student);
  const topAchievements = student.achievements.slice(0, 3);

  return (
    <PortalShell
      role="student"
      title={`Привет, ${student.name.split(' ')[0]} ✨`}
      subtitle="Здесь твои оценки, AI-подсказки, достижения и ближайшие шаги, чтобы не просто учиться, а выигрывать траекторию."
    >
      <div className="grid cols-4">
        <StatCard label="XP" value={`${student.xp}`} hint="Общий прогресс и очки геймификации" icon={<Award size={18} />} />
        <StatCard label="Серия" value={`${student.streakDays} дней`} hint="Без пропусков дедлайнов" icon={<Flame size={18} />} />
        <StatCard label="Цели" value={`${student.goalsClosed}`} hint="Закрыто за месяц" icon={<Target size={18} />} />
        <StatCard label="Портфолио" value={`${student.achievements.length}`} hint="Подтвержденных достижений" icon={<BookOpenText size={18} />} />
      </div>

      <div className="grid cols-2">
        <StudentAiPanel studentId={student.id} initial={insight} />
        <Card>
          <SectionHeader
            eyebrow="Граф знаний"
            title={`Пробельные темы по предмету «${insight.subject}»`}
            description="Приоритет строится по mastery score из локального алгоритма оценки тем."
          />
          <ProgressBars items={insight.weakTopics} />
          <div className="tag-row">
            {insight.badges.map((badge) => (
              <span key={badge} className="tag">{badge}</span>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid cols-2">
        <Card>
          <SectionHeader
            eyebrow="Успеваемость"
            title="Интеграция оценок из BilimClass"
            description="Сейчас подключен mock-сервер, но структура готова под реальный API."
          />
          <div className="subject-list">
            {student.subjects.map((subject: typeof student.subjects[number]) => (
              <div key={subject.subjectId} className="subject-card">
                <div>
                  <strong>{subject.subjectName}</strong>
                  <div className="muted small">{subject.teacherName}</div>
                </div>
                <div className="subject-right">
                  <Sparkline values={subject.scores} />
                  <div className="muted small">Следующий СОЧ: {subject.nextExamDate}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <SectionHeader
            eyebrow="Портфолио"
            title="Цифровой профиль достижений"
            description="Все достижения в одном месте, с меткой верификации."
          />
          <div className="achievement-list">
            {topAchievements.map((item: typeof topAchievements[number]) => (
              <div key={item.id} className="achievement-card">
                <div className="pill achievement">{item.category}</div>
                <strong>{item.title}</strong>
                <p className="muted small">{item.issuer} · {item.date}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <SectionHeader
          eyebrow="Школьная лента"
          title="События и анонсы"
          description="Таргетинг по ролям и параллелям можно включить на уровне БД и UI-фильтров."
        />
        <FeedList items={feed} />
      </Card>
    </PortalShell>
  );
}
