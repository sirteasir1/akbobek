import { StudentProfile, SubjectPerformance, TeacherClassroom } from '@/lib/types';

const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, value));

const average = (values: number[]) =>
  values.length ? values.reduce((sum, current) => sum + current, 0) / values.length : 0;

const trend = (values: number[]) => {
  if (values.length < 2) return 0;
  const first = values[0];
  const last = values[values.length - 1];
  return last - first;
};

export type TopicMastery = {
  topic: string;
  mastery: number;
  priority: 'low' | 'medium' | 'high';
};

export type StudentRiskInsight = {
  studentId: string;
  studentName: string;
  overallMomentum: number;
  riskProbability: number;
  riskLabel: 'low' | 'medium' | 'high';
  subject: string;
  weakTopics: TopicMastery[];
  explanation: string;
  recommendedResources: Array<{ title: string; url: string }>;
  badges: string[];
};

const subjectResourceMap: Record<string, Array<{ title: string; url: string }>> = {
  physics: [
    { title: 'Видеолекция: Законы Ньютона за 20 минут', url: 'https://www.youtube.com/watch?v=physics-newton' },
    { title: 'Практикум: 12 задач по динамике', url: 'https://example.org/physics-dynamics-pack' },
    { title: 'Конспект: Кинематика и графики движения', url: 'https://example.org/physics-kinematics-notes' },
  ],
  math: [
    { title: 'Разбор логарифмов без зубрежки', url: 'https://example.org/math-logarithms' },
    { title: 'Тригонометрия: шпаргалка формул', url: 'https://example.org/trigonometry-sheet' },
    { title: '15 задач по квадратичным функциям', url: 'https://example.org/quadratic-problems' },
  ],
  history: [
    { title: 'Хронология событий: независимость Казахстана', url: 'https://example.org/history-independence' },
    { title: 'Видео: Алаш Орда простыми словами', url: 'https://example.org/history-alash' },
    { title: 'Тест-карточки по индустриализации', url: 'https://example.org/history-industrialization' },
  ],
  informatics: [
    { title: 'Алгоритмы на Python: интенсив', url: 'https://example.org/algorithms-python' },
    { title: 'SQL для школьников', url: 'https://example.org/sql-school' },
    { title: 'Mini-challenges по Python', url: 'https://example.org/python-mini' },
  ],
};

export function buildKnowledgeGraph(subject: SubjectPerformance): TopicMastery[] {
  return subject.assessments.map((assessment) => {
    const mastery = Math.round((assessment.score / assessment.maxScore) * 100);
    return {
      topic: assessment.topic,
      mastery,
      priority: mastery < 60 ? 'high' : mastery < 75 ? 'medium' : 'low',
    };
  });
}

export function evaluateStudentRisk(student: StudentProfile): StudentRiskInsight {
  const ranked = student.subjects
    .map((subject) => {
      const avg = average(subject.scores);
      const downtrend = Math.abs(Math.min(trend(subject.scores), 0));
      const lowTopicPenalty = buildKnowledgeGraph(subject)
        .filter((topic) => topic.mastery < 65)
        .reduce((sum, topic) => sum + (65 - topic.mastery), 0);
      const attendancePenalty = subject.attendanceMissed * 5;
      const riskProbability = clamp(25 + (75 - avg) * 1.2 + downtrend * 3 + lowTopicPenalty * 0.55 + attendancePenalty, 5, 97);
      return { subject, avg, riskProbability };
    })
    .sort((left, right) => right.riskProbability - left.riskProbability);

  const worst = ranked[0];
  const weakTopics = buildKnowledgeGraph(worst.subject)
    .sort((left, right) => left.mastery - right.mastery)
    .slice(0, 3);

  const riskLabel = worst.riskProbability >= 75 ? 'high' : worst.riskProbability >= 45 ? 'medium' : 'low';
  const momentum = Math.round(average(student.subjects.map((subject) => trend(subject.scores))));

  const explanation =
    riskLabel === 'high'
      ? `С вероятностью ${Math.round(worst.riskProbability)}% ученик рискует просесть на следующем СОЧ по предмету «${worst.subject.subjectName}». Основной драйвер риска — пробелы в темах ${weakTopics
          .map((topic) => `«${topic.topic}»`)
          .join(', ')} и негативный тренд оценок ${trend(worst.subject.scores)}.`
      : `Есть умеренный риск по предмету «${worst.subject.subjectName}». Если подтянуть темы ${weakTopics
          .map((topic) => `«${topic.topic}»`)
          .join(', ')}, траектория быстро стабилизируется.`;

  const badges = [
    student.streakDays >= 7 ? 'Серия без пропусков' : 'Возврат в ритм',
    student.goalsClosed >= 3 ? 'Цели закрываются стабильно' : 'Нужна поддержка наставника',
    student.achievements.length ? 'Сильное портфолио вне уроков' : 'Фокус на учебе',
  ];

  return {
    studentId: student.id,
    studentName: student.name,
    overallMomentum: momentum,
    riskProbability: Math.round(worst.riskProbability),
    riskLabel,
    subject: worst.subject.subjectName,
    weakTopics,
    explanation,
    recommendedResources: subjectResourceMap[worst.subject.subjectId] ?? [],
    badges,
  };
}

export type EarlyWarningRow = {
  studentId: string;
  name: string;
  anomalyScore: number;
  flag: 'red' | 'yellow' | 'green';
  summary: string;
};

export function buildEarlyWarnings(classroom: TeacherClassroom): EarlyWarningRow[] {
  return classroom.students
    .map((student) => {
      const avg = average(student.recentScores);
      const slope = trend(student.recentScores);
      const anomalyScore = clamp((70 - avg) * 1.3 + Math.abs(Math.min(slope, 0)) * 7 + student.attendanceMissed * 8, 0, 100);
      const flag: EarlyWarningRow['flag'] = anomalyScore >= 70 ? 'red' : anomalyScore >= 40 ? 'yellow' : 'green';
      const summary =
        flag === 'red'
          ? `Резкое снижение траектории: средний балл ${avg.toFixed(0)}, пропусков ${student.attendanceMissed}, динамика ${slope}.`
          : flag === 'yellow'
            ? `Есть риск отклонения: средний балл ${avg.toFixed(0)}, динамика ${slope}.`
            : `Стабильно: средний балл ${avg.toFixed(0)}, без критических сигналов.`;
      return { studentId: student.studentId, name: student.name, anomalyScore: Math.round(anomalyScore), flag, summary };
    })
    .sort((left, right) => right.anomalyScore - left.anomalyScore);
}

export function buildParentWeeklySummary(student: StudentProfile) {
  const topSubject = [...student.subjects].sort((left, right) => average(right.scores) - average(left.scores))[0];
  const riskySubject = [...student.subjects].sort((left, right) => average(left.scores) - average(right.scores))[0];
  return {
    headline: `${student.name} уверенно держится в «${topSubject.subjectName}», но требует внимания «${riskySubject.subjectName}».`,
    summary: `За неделю замечен прогресс в «${topSubject.subjectName}», а в «${riskySubject.subjectName}» сохраняется нагрузка из-за ${riskySubject.attendanceMissed > 0 ? `пропусков (${riskySubject.attendanceMissed}) и ` : ''}слабого закрепления тем.`,
    actions: [
      `Обсудить с ребенком план повторения тем: ${buildKnowledgeGraph(riskySubject)
        .sort((left, right) => left.mastery - right.mastery)
        .slice(0, 2)
        .map((item) => item.topic)
        .join(', ')}.`,
      `Выделить 2 коротких учебных слота до ${riskySubject.nextExamDate}.`,
      riskySubject.attendanceMissed > 1 ? 'Проверить режим сна и тайм-менеджмент, чтобы снизить пропуски.' : 'Поддержать текущий учебный ритм без перегруза.',
    ],
  };
}

export function buildClassReport(classroom: TeacherClassroom) {
  const warnings = buildEarlyWarnings(classroom);
  const critical = warnings.filter((row) => row.flag === 'red');
  const mid = warnings.filter((row) => row.flag === 'yellow');
  return {
    headline: `По классу ${classroom.name}: ${critical.length} критических, ${mid.length} умеренных риска.`,
    narrative: `Класс показывает ${critical.length > 0 ? 'неоднородную' : 'относительно стабильную'} динамику. Наибольшего внимания требуют ${warnings
      .slice(0, 3)
      .map((row) => row.name)
      .join(', ')}. Рекомендуется короткий доразбор пробельных тем и точечная связь с родителями по ученикам из красной зоны.`,
    bullets: warnings.slice(0, 4).map((row) => `${row.name}: ${row.summary}`),
  };
}
