import { defaultSessions, rooms, teachers, timeslots } from '@/lib/data';
import { Room, ScheduleAssignment, ScheduleResult, ScheduleSession, Teacher, Timeslot } from '@/lib/types';

const slotKey = (timeslot: Pick<Timeslot, 'day' | 'slot'>) => `${timeslot.day}-${timeslot.slot}`;

const roomTypeMatches = (room: Room, type: ScheduleSession['roomType']) => {
  if (type === 'hall') return room.id === 'r-hall';
  if (type === 'lab') return room.id.startsWith('r-lab');
  return room.id.startsWith('r-10') || room.id === 'r-101' || room.id === 'r-102';
};

const teacherMap = new Map(teachers.map((teacher) => [teacher.id, teacher]));
const roomMap = new Map(rooms.map((room) => [room.id, room]));
const allSlots = timeslots.map(slotKey);

function scoreSlotPreference(session: ScheduleSession, slotId: string) {
  let score = 0;
  if (session.preferredSlots?.includes(slotId)) score += 14;
  if (session.forbiddenSlots?.includes(slotId)) score -= 50;
  const slotNumber = Number(slotId.split('-')[1]);
  if (slotNumber === 1 || slotNumber === 6) score -= 4;
  if (slotNumber === 3 || slotNumber === 4) score += 3;
  return score;
}

function teacherForSession(session: ScheduleSession, absentTeacherIds: string[]) {
  const primaryTeacher = teacherMap.get(session.teacherId);
  if (!primaryTeacher) return null;
  if (!absentTeacherIds.includes(primaryTeacher.id)) return primaryTeacher;
  const substitute = (session.allowedSubstituteTeacherIds ?? [])
    .map((teacherId) => teacherMap.get(teacherId))
    .find((teacher): teacher is Teacher => !!teacher && !absentTeacherIds.includes(teacher.id));
  return substitute ?? null;
}

function groupSessionsByBundle(sessions: ScheduleSession[]) {
  const bundled = new Map<string, ScheduleSession[]>();
  const singles: ScheduleSession[][] = [];

  sessions.forEach((session) => {
    if (session.bundleKey) {
      const current = bundled.get(session.bundleKey) ?? [];
      current.push(session);
      bundled.set(session.bundleKey, current);
    } else {
      singles.push([session]);
    }
  });

  return [...singles, ...bundled.values()].sort((left, right) => right.length - left.length);
}

export function generateSchedule(options?: { absentTeacherIds?: string[]; sessions?: ScheduleSession[] }): ScheduleResult {
  const absentTeacherIds = options?.absentTeacherIds ?? [];
  const sessions = options?.sessions ?? defaultSessions;
  const groups = groupSessionsByBundle(sessions);

  const teacherOccupancy = new Set<string>();
  const roomOccupancy = new Set<string>();
  const classOccupancy = new Set<string>();
  const assignments: ScheduleAssignment[] = [];
  const notifications: string[] = [];
  const unresolved: string[] = [];

  const placeGroup = (index: number): boolean => {
    if (index >= groups.length) return true;
    const group = groups[index];
    const candidateSlots = group[0].fixedSlot ? [group[0].fixedSlot] : allSlots;

    const sortedSlots = candidateSlots
      .filter((candidate) => !group.some((session) => session.forbiddenSlots?.includes(candidate)))
      .sort((left, right) => {
        const leftScore = group.reduce((sum, session) => sum + scoreSlotPreference(session, left), 0);
        const rightScore = group.reduce((sum, session) => sum + scoreSlotPreference(session, right), 0);
        return rightScore - leftScore;
      });

    for (const candidateSlot of sortedSlots) {
      const provisional: ScheduleAssignment[] = [];
      let canPlace = true;

      for (const session of group) {
        const teacher = teacherForSession(session, absentTeacherIds);
        if (!teacher || !teacher.availableSlots.includes(candidateSlot)) {
          canPlace = false;
          break;
        }

        if (teacherOccupancy.has(`${teacher.id}-${candidateSlot}`) || classOccupancy.has(`${session.classGroupId}-${candidateSlot}`)) {
          canPlace = false;
          break;
        }

        const room = rooms.find(
          (candidateRoom) =>
            roomTypeMatches(candidateRoom, session.roomType) &&
            candidateRoom.availableSlots.includes(candidateSlot) &&
            !roomOccupancy.has(`${candidateRoom.id}-${candidateSlot}`)
        );

        if (!room) {
          canPlace = false;
          break;
        }

        provisional.push({
          sessionId: session.id,
          title: session.title,
          classGroupId: session.classGroupId,
          teacherId: teacher.id,
          teacherName: teacher.name,
          roomId: room.id,
          roomName: room.name,
          slotId: candidateSlot,
          label: `${candidateSlot} / ${timeslots.find((slot) => slotKey(slot) === candidateSlot)?.label ?? ''}`,
          bundleKey: session.bundleKey,
          isSubstitution: teacher.id !== session.teacherId,
        });
      }

      if (!canPlace) continue;

      provisional.forEach((assignment) => {
        teacherOccupancy.add(`${assignment.teacherId}-${assignment.slotId}`);
        classOccupancy.add(`${assignment.classGroupId}-${assignment.slotId}`);
        roomOccupancy.add(`${assignment.roomId}-${assignment.slotId}`);
        assignments.push(assignment);

        const originSession = sessions.find((session) => session.id === assignment.sessionId);
        if (assignment.isSubstitution && originSession) {
          const originalTeacher = teacherMap.get(originSession.teacherId)?.name ?? 'Учитель';
          notifications.push(
            `Замена: ${assignment.title} переназначен с ${originalTeacher} на ${assignment.teacherName} в слот ${assignment.slotId}.`
          );
        }
      });

      if (placeGroup(index + 1)) return true;

      provisional.forEach((assignment) => {
        teacherOccupancy.delete(`${assignment.teacherId}-${assignment.slotId}`);
        classOccupancy.delete(`${assignment.classGroupId}-${assignment.slotId}`);
        roomOccupancy.delete(`${assignment.roomId}-${assignment.slotId}`);
        const assignmentIndex = assignments.findIndex((item) => item.sessionId === assignment.sessionId);
        if (assignmentIndex >= 0) assignments.splice(assignmentIndex, 1);
      });
    }

    unresolved.push(...group.map((session) => session.title));
    return false;
  };

  const success = placeGroup(0);
  const score = assignments.reduce((sum, assignment) => {
    const session = sessions.find((item) => item.id === assignment.sessionId);
    if (!session) return sum;
    return sum + scoreSlotPreference(session, assignment.slotId) + (assignment.isSubstitution ? -5 : 5);
  }, 0);

  return {
    success,
    assignments: [...assignments].sort((left, right) => left.slotId.localeCompare(right.slotId)),
    notifications,
    unresolved: success ? [] : unresolved,
    score,
  };
}

export function buildScheduleDigest(result: ScheduleResult) {
  const byDay = result.assignments.reduce<Record<string, ScheduleAssignment[]>>((accumulator, assignment) => {
    const [day] = assignment.slotId.split('-');
    accumulator[day] = accumulator[day] ?? [];
    accumulator[day].push(assignment);
    return accumulator;
  }, {});

  Object.values(byDay).forEach((items) => items.sort((left, right) => left.slotId.localeCompare(right.slotId)));

  return byDay;
}
