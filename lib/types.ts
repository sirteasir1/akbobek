export type Role = 'student' | 'teacher' | 'parent' | 'admin';

export type SubjectId =
  | 'math'
  | 'physics'
  | 'history'
  | 'biology'
  | 'informatics'
  | 'english';

export type TopicAssessment = {
  topic: string;
  score: number;
  maxScore: number;
  date: string;
};

export type SubjectPerformance = {
  subjectId: SubjectId;
  subjectName: string;
  scores: number[];
  attendanceMissed: number;
  teacherName: string;
  assessments: TopicAssessment[];
  nextExamDate: string;
};

export type Achievement = {
  id: string;
  title: string;
  category: 'olympiad' | 'sport' | 'volunteering' | 'art';
  verified: boolean;
  date: string;
  issuer: string;
};

export type StudentProfile = {
  id: string;
  name: string;
  grade: string;
  className: string;
  streakDays: number;
  xp: number;
  avatar: string;
  parentName: string;
  goalsClosed: number;
  subjects: SubjectPerformance[];
  achievements: Achievement[];
};

export type TeacherClassroom = {
  id: string;
  name: string;
  teacher: string;
  students: Array<{
    studentId: string;
    name: string;
    recentScores: number[];
    attendanceMissed: number;
  }>;
};

export type FeedItem = {
  id: string;
  title: string;
  description: string;
  audience: string[];
  createdAt: string;
  type: 'announcement' | 'schedule' | 'achievement';
};

export type Timeslot = {
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';
  slot: number;
  label: string;
};

export type Teacher = {
  id: string;
  name: string;
  availableSlots: string[];
  subjects: SubjectId[];
};

export type Room = {
  id: string;
  name: string;
  capacity: number;
  availableSlots: string[];
};

export type ScheduleSession = {
  id: string;
  title: string;
  subjectId: SubjectId;
  teacherId: string;
  classGroupId: string;
  duration: number;
  roomType: 'lab' | 'standard' | 'hall';
  preferredSlots?: string[];
  forbiddenSlots?: string[];
  bundleKey?: string;
  allowedSubstituteTeacherIds?: string[];
  fixedSlot?: string;
};

export type ScheduleAssignment = {
  sessionId: string;
  title: string;
  classGroupId: string;
  teacherId: string;
  teacherName: string;
  roomId: string;
  roomName: string;
  slotId: string;
  label: string;
  bundleKey?: string;
  isSubstitution?: boolean;
};

export type ScheduleResult = {
  success: boolean;
  assignments: ScheduleAssignment[];
  notifications: string[];
  unresolved: string[];
  score: number;
};
