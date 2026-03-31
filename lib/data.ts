import {
  FeedItem,
  Role,
  Room,
  ScheduleSession,
  StudentProfile,
  Teacher,
  TeacherClassroom,
  Timeslot,
} from '@/lib/types';

export const roleRoutes: Record<Role, string> = {
  student: '/student',
  teacher: '/teacher',
  parent: '/parent',
  admin: '/admin',
};

export const appPalette = {
  primary: '#3b82f6',
  secondary: '#7c3aed',
  accent: '#22c55e',
  warning: '#f59e0b',
};

export const students: StudentProfile[] = [
  {
    id: 'stu-001',
    name: 'Aruzhan Nurgali',
    grade: '10',
    className: '10A',
    streakDays: 12,
    xp: 1840,
    avatar: 'AN',
    parentName: 'Gulnaz Nurgali',
    goalsClosed: 4,
    subjects: [
      {
        subjectId: 'math',
        subjectName: 'Алгебра',
        teacherName: 'Aigerim Saparova',
        attendanceMissed: 0,
        nextExamDate: '2026-04-12',
        scores: [94, 88, 91, 86, 89],
        assessments: [
          { topic: 'Квадратные функции', score: 17, maxScore: 20, date: '2026-02-12' },
          { topic: 'Тригонометрия', score: 16, maxScore: 20, date: '2026-02-27' },
          { topic: 'Логарифмы', score: 19, maxScore: 20, date: '2026-03-08' },
        ],
      },
      {
        subjectId: 'physics',
        subjectName: 'Физика',
        teacherName: 'Ruslan Omarov',
        attendanceMissed: 1,
        nextExamDate: '2026-04-17',
        scores: [78, 72, 69, 71, 67],
        assessments: [
          { topic: 'Кинематика', score: 15, maxScore: 20, date: '2026-02-10' },
          { topic: 'Динамика', score: 13, maxScore: 20, date: '2026-02-24' },
          { topic: 'Законы Ньютона', score: 11, maxScore: 20, date: '2026-03-15' },
        ],
      },
      {
        subjectId: 'history',
        subjectName: 'История Казахстана',
        teacherName: 'Dana Iskakova',
        attendanceMissed: 2,
        nextExamDate: '2026-04-09',
        scores: [85, 82, 79, 90, 88],
        assessments: [
          { topic: 'Алаш Орда', score: 18, maxScore: 20, date: '2026-02-15' },
          { topic: 'Индустриализация', score: 17, maxScore: 20, date: '2026-03-03' },
          { topic: 'Независимость', score: 18, maxScore: 20, date: '2026-03-20' },
        ],
      },
      {
        subjectId: 'informatics',
        subjectName: 'Информатика',
        teacherName: 'Ermek Tulegen',
        attendanceMissed: 0,
        nextExamDate: '2026-04-19',
        scores: [93, 95, 96, 94, 98],
        assessments: [
          { topic: 'Python', score: 20, maxScore: 20, date: '2026-02-11' },
          { topic: 'Алгоритмы', score: 18, maxScore: 20, date: '2026-03-01' },
          { topic: 'Базы данных', score: 19, maxScore: 20, date: '2026-03-22' },
        ],
      },
    ],
    achievements: [
      {
        id: 'ach-01',
        title: '2 место на городской олимпиаде по информатике',
        category: 'olympiad',
        verified: true,
        issuer: 'Городской центр олимпиад',
        date: '2026-03-21',
      },
      {
        id: 'ach-02',
        title: 'Волонтёрская акция “Clean Yard”',
        category: 'volunteering',
        verified: true,
        issuer: 'Aqbobek Lyceum',
        date: '2026-03-15',
      },
    ],
  },
  {
    id: 'stu-002',
    name: 'Dias Serik',
    grade: '10',
    className: '10A',
    streakDays: 4,
    xp: 1120,
    avatar: 'DS',
    parentName: 'Maira Serik',
    goalsClosed: 1,
    subjects: [
      {
        subjectId: 'math',
        subjectName: 'Алгебра',
        teacherName: 'Aigerim Saparova',
        attendanceMissed: 1,
        nextExamDate: '2026-04-12',
        scores: [74, 78, 70, 68, 66],
        assessments: [
          { topic: 'Квадратные функции', score: 11, maxScore: 20, date: '2026-02-12' },
          { topic: 'Тригонометрия', score: 12, maxScore: 20, date: '2026-02-27' },
          { topic: 'Логарифмы', score: 10, maxScore: 20, date: '2026-03-08' },
        ],
      },
      {
        subjectId: 'physics',
        subjectName: 'Физика',
        teacherName: 'Ruslan Omarov',
        attendanceMissed: 3,
        nextExamDate: '2026-04-17',
        scores: [63, 58, 54, 52, 49],
        assessments: [
          { topic: 'Кинематика', score: 10, maxScore: 20, date: '2026-02-10' },
          { topic: 'Динамика', score: 9, maxScore: 20, date: '2026-02-24' },
          { topic: 'Законы Ньютона', score: 7, maxScore: 20, date: '2026-03-15' },
        ],
      },
      {
        subjectId: 'history',
        subjectName: 'История Казахстана',
        teacherName: 'Dana Iskakova',
        attendanceMissed: 2,
        nextExamDate: '2026-04-09',
        scores: [81, 79, 76, 74, 72],
        assessments: [
          { topic: 'Алаш Орда', score: 14, maxScore: 20, date: '2026-02-15' },
          { topic: 'Индустриализация', score: 13, maxScore: 20, date: '2026-03-03' },
          { topic: 'Независимость', score: 12, maxScore: 20, date: '2026-03-20' },
        ],
      },
      {
        subjectId: 'informatics',
        subjectName: 'Информатика',
        teacherName: 'Ermek Tulegen',
        attendanceMissed: 0,
        nextExamDate: '2026-04-19',
        scores: [87, 85, 86, 82, 89],
        assessments: [
          { topic: 'Python', score: 16, maxScore: 20, date: '2026-02-11' },
          { topic: 'Алгоритмы', score: 15, maxScore: 20, date: '2026-03-01' },
          { topic: 'Базы данных', score: 18, maxScore: 20, date: '2026-03-22' },
        ],
      },
    ],
    achievements: [
      {
        id: 'ach-03',
        title: 'Футбольный турнир — капитан команды',
        category: 'sport',
        verified: true,
        issuer: 'Aqbobek Lyceum',
        date: '2026-03-11',
      },
    ],
  },
];

export const teacherClassrooms: TeacherClassroom[] = [
  {
    id: 'cls-10a-physics',
    name: '10A / Физика',
    teacher: 'Ruslan Omarov',
    students: students.map((student) => {
      const physics = student.subjects.find((subject) => subject.subjectId === 'physics');
      return {
        studentId: student.id,
        name: student.name,
        recentScores: physics?.scores ?? [],
        attendanceMissed: physics?.attendanceMissed ?? 0,
      };
    }),
  },
  {
    id: 'cls-10a-math',
    name: '10A / Алгебра',
    teacher: 'Aigerim Saparova',
    students: students.map((student) => {
      const math = student.subjects.find((subject) => subject.subjectId === 'math');
      return {
        studentId: student.id,
        name: student.name,
        recentScores: math?.scores ?? [],
        attendanceMissed: math?.attendanceMissed ?? 0,
      };
    }),
  },
];

export const feed: FeedItem[] = [
  {
    id: 'feed-01',
    title: 'День науки — регистрация открыта',
    description: 'Запишитесь на стендовые проекты до пятницы. Участвуют 8–11 классы.',
    audience: ['8', '9', '10', '11'],
    createdAt: '2026-03-28T09:00:00Z',
    type: 'announcement',
  },
  {
    id: 'feed-02',
    title: 'Замена по физике у 10A',
    description: 'В среду 3 уроком занятие проведёт Aidos Kenzhebek в кабинете Lab-2.',
    audience: ['10'],
    createdAt: '2026-03-30T13:15:00Z',
    type: 'schedule',
  },
  {
    id: 'feed-03',
    title: 'Гордимся победой Aruzhan Nurgali',
    description: '2 место на городской олимпиаде по информатике.',
    audience: ['all'],
    createdAt: '2026-03-25T08:10:00Z',
    type: 'achievement',
  },
];

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const;

export const timeslots: Timeslot[] = days.flatMap((day) =>
  [1, 2, 3, 4, 5, 6].map((slot) => ({
    day,
    slot,
    label:
      slot === 1
        ? '08:00–08:45'
        : slot === 2
          ? '08:55–09:40'
          : slot === 3
            ? '09:55–10:40'
            : slot === 4
              ? '10:50–11:35'
              : slot === 5
                ? '11:50–12:35'
                : '12:45–13:30',
  }))
);

export const teachers: Teacher[] = [
  {
    id: 't-math',
    name: 'Aigerim Saparova',
    subjects: ['math'],
    availableSlots: timeslots
      .filter((slot) => !(slot.day === 'Tue' && slot.slot === 5))
      .map((slot) => `${slot.day}-${slot.slot}`),
  },
  {
    id: 't-physics',
    name: 'Ruslan Omarov',
    subjects: ['physics'],
    availableSlots: timeslots
      .filter((slot) => !(slot.day === 'Wed' && slot.slot === 3))
      .map((slot) => `${slot.day}-${slot.slot}`),
  },
  {
    id: 't-history',
    name: 'Dana Iskakova',
    subjects: ['history'],
    availableSlots: timeslots.map((slot) => `${slot.day}-${slot.slot}`),
  },
  {
    id: 't-biology',
    name: 'Aidos Kenzhebek',
    subjects: ['biology', 'physics'],
    availableSlots: timeslots
      .filter((slot) => !(slot.day === 'Thu' && slot.slot === 2))
      .map((slot) => `${slot.day}-${slot.slot}`),
  },
  {
    id: 't-eng',
    name: 'Madina Bekova',
    subjects: ['english'],
    availableSlots: timeslots.map((slot) => `${slot.day}-${slot.slot}`),
  },
  {
    id: 't-info',
    name: 'Ermek Tulegen',
    subjects: ['informatics'],
    availableSlots: timeslots.map((slot) => `${slot.day}-${slot.slot}`),
  },
];

export const rooms: Room[] = [
  {
    id: 'r-101',
    name: '101',
    capacity: 30,
    availableSlots: timeslots.map((slot) => `${slot.day}-${slot.slot}`),
  },
  {
    id: 'r-102',
    name: '102',
    capacity: 30,
    availableSlots: timeslots.map((slot) => `${slot.day}-${slot.slot}`),
  },
  {
    id: 'r-lab1',
    name: 'Lab-1',
    capacity: 20,
    availableSlots: timeslots.map((slot) => `${slot.day}-${slot.slot}`),
  },
  {
    id: 'r-lab2',
    name: 'Lab-2',
    capacity: 20,
    availableSlots: timeslots.map((slot) => `${slot.day}-${slot.slot}`),
  },
  {
    id: 'r-hall',
    name: 'Assembly Hall',
    capacity: 120,
    availableSlots: timeslots.map((slot) => `${slot.day}-${slot.slot}`),
  },
];

export const defaultSessions: ScheduleSession[] = [
  {
    id: 'sess-10a-math-1',
    title: '10A Алгебра',
    subjectId: 'math',
    teacherId: 't-math',
    classGroupId: '10A',
    duration: 1,
    roomType: 'standard',
    preferredSlots: ['Mon-1', 'Wed-2'],
  },
  {
    id: 'sess-10a-history-1',
    title: '10A История',
    subjectId: 'history',
    teacherId: 't-history',
    classGroupId: '10A',
    duration: 1,
    roomType: 'standard',
  },
  {
    id: 'sess-10a-info-1',
    title: '10A Информатика',
    subjectId: 'informatics',
    teacherId: 't-info',
    classGroupId: '10A',
    duration: 1,
    roomType: 'lab',
    preferredSlots: ['Tue-3'],
  },
  {
    id: 'sess-10-stream-phys',
    title: '10A/10B Лента — Физика профиль',
    subjectId: 'physics',
    teacherId: 't-physics',
    classGroupId: '10-phys-group',
    duration: 1,
    roomType: 'lab',
    bundleKey: 'stream-10-sci',
    allowedSubstituteTeacherIds: ['t-biology'],
  },
  {
    id: 'sess-10-stream-bio',
    title: '10A/10B Лента — Биология профиль',
    subjectId: 'biology',
    teacherId: 't-biology',
    classGroupId: '10-bio-group',
    duration: 1,
    roomType: 'lab',
    bundleKey: 'stream-10-sci',
    allowedSubstituteTeacherIds: ['t-physics'],
  },
  {
    id: 'sess-10a-english-1',
    title: '10A Английский',
    subjectId: 'english',
    teacherId: 't-eng',
    classGroupId: '10A',
    duration: 2,
    roomType: 'standard',
    preferredSlots: ['Thu-4'],
  },
  {
    id: 'evt-science-day',
    title: 'День науки — общая репетиция',
    subjectId: 'informatics',
    teacherId: 't-info',
    classGroupId: '10A',
    duration: 1,
    roomType: 'hall',
    fixedSlot: 'Fri-5',
  },
];
