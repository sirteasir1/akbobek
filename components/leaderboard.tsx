import { students } from '@/lib/data';

export function Leaderboard() {
  const top = [...students].sort((left, right) => right.xp - left.xp);

  return (
    <div className="leaderboard">
      {top.map((student, index) => (
        <div key={student.id} className="leader-row">
          <div className="avatar">{student.avatar}</div>
          <div>
            <strong>{student.name}</strong>
            <div className="muted small">{student.className} · {student.goalsClosed} закрытых целей</div>
          </div>
          <div className="leader-score">#{index + 1} · {student.xp} XP</div>
        </div>
      ))}
    </div>
  );
}
