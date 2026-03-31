import { students } from '@/lib/data';

export function getBilimClassGrades(studentId: string) {
  const student = students.find((item) => item.id === studentId) ?? students[0];
  return {
    studentId: student.id,
    studentName: student.name,
    source: 'mock-bilimclass',
    syncedAt: new Date().toISOString(),
    grades: student.subjects.map((subject) => ({
      subjectId: subject.subjectId,
      subjectName: subject.subjectName,
      scores: subject.scores,
      attendanceMissed: subject.attendanceMissed,
      teacherName: subject.teacherName,
    })),
  };
}
