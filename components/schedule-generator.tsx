'use client';

import { useEffect, useState } from 'react';

type ScheduleResponse = {
  success: boolean;
  assignments: Array<{
    sessionId: string;
    title: string;
    teacherName: string;
    roomName: string;
    slotId: string;
    classGroupId: string;
    isSubstitution?: boolean;
  }>;
  notifications: string[];
  unresolved: string[];
  score: number;
};

export function ScheduleGenerator() {
  const [data, setData] = useState<ScheduleResponse | null>(null);
  const [absent, setAbsent] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async (absentTeacherIds: string[] = []) => {
    setLoading(true);
    const response = await fetch('/api/schedule/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ absentTeacherIds }),
    });
    const json = (await response.json()) as ScheduleResponse;
    setData(json);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const toggleAbsent = async () => {
    const next = absent.length ? [] : ['t-physics'];
    setAbsent(next);
    await load(next);
  };

  return (
    <div className="schedule-grid">
      <div className="card">
        <div className="section-header">
          <div>
            <p className="eyebrow">Smart Schedule</p>
            <h2>Генерация расписания без конфликтов</h2>
            <p className="muted">Поддержка лент, замен, уроков, пар и мероприятий.</p>
          </div>
          <button className="secondary-button" onClick={toggleAbsent} disabled={loading}>
            {absent.length ? 'Вернуть учителя' : 'Отметить болезнь учителя'}
          </button>
        </div>
        <div className="stat-inline-wrap">
          <div className="mini-stat">
            <span>Статус</span>
            <strong>{loading ? 'Перестраиваем…' : data?.success ? 'Успешно' : 'Есть конфликты'}</strong>
          </div>
          <div className="mini-stat">
            <span>Score</span>
            <strong>{data?.score ?? 0}</strong>
          </div>
          <div className="mini-stat">
            <span>Замены</span>
            <strong>{data?.assignments.filter((row) => row.isSubstitution).length ?? 0}</strong>
          </div>
        </div>
        <div className="schedule-table">
          {data?.assignments.map((row) => (
            <div key={row.sessionId} className={`schedule-row ${row.isSubstitution ? 'highlight' : ''}`}>
              <div>
                <strong>{row.slotId}</strong>
                <div className="muted small">{row.classGroupId}</div>
              </div>
              <div>
                <strong>{row.title}</strong>
                <div className="muted small">{row.teacherName} · {row.roomName}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <div className="section-header">
          <div>
            <p className="eyebrow">Push & Alerts</p>
            <h2>Сразу видно, кого уведомлять</h2>
          </div>
        </div>
        <div className="notification-list">
          {(data?.notifications.length ? data.notifications : ['Изменений нет — расписание стабильно.']).map((note) => (
            <div key={note} className="notification-item">{note}</div>
          ))}
          {data?.unresolved.length ? (
            <div className="notification-item warning">
              Нерешённые позиции: {data.unresolved.join(', ')}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
