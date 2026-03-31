'use client';

import { useState } from 'react';

export function StudentAiPanel({ studentId, initial }: { studentId: string; initial: any }) {
  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    const response = await fetch('/api/ai/student-insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId }),
    });
    setData(await response.json());
    setLoading(false);
  };

  return (
    <div className="card">
      <div className="section-header">
        <div>
          <p className="eyebrow">AI Tutor</p>
          <h2>Предиктивная аналитика ученика</h2>
          <p className="muted">Алгоритм + LLM-перефразирование при наличии API-ключа.</p>
        </div>
        <button className="secondary-button" onClick={refresh} disabled={loading}>
          {loading ? 'Обновляем…' : 'Пересчитать'}
        </button>
      </div>
      <div className="ai-callout">
        <div className={`risk-badge ${data.riskLabel}`}>Риск: {data.riskProbability}%</div>
        <p>{data.explanation}</p>
      </div>
      <div className="resource-list">
        {data.recommendedResources.map((item: { title: string; url: string }) => (
          <a key={item.title} href={item.url} className="resource-item" target="_blank" rel="noreferrer">
            {item.title}
          </a>
        ))}
      </div>
    </div>
  );
}

export function TeacherAiPanel({ classroomId, initial }: { classroomId: string; initial: any }) {
  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    const response = await fetch('/api/ai/class-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ classroomId }),
    });
    setData(await response.json());
    setLoading(false);
  };

  return (
    <div className="card">
      <div className="section-header">
        <div>
          <p className="eyebrow">1-click report</p>
          <h2>AI-отчёт для классного руководителя</h2>
        </div>
        <button className="secondary-button" onClick={generate} disabled={loading}>
          {loading ? 'Генерируем…' : 'Сгенерировать'}
        </button>
      </div>
      <p><strong>{data.headline}</strong></p>
      <p className="muted">{data.narrative}</p>
      <ul className="bullet-list">
        {data.bullets.map((item: string) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}

export function ParentAiPanel({ studentId, initial }: { studentId: string; initial: any }) {
  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    const response = await fetch('/api/ai/parent-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId }),
    });
    setData(await response.json());
    setLoading(false);
  };

  return (
    <div className="card">
      <div className="section-header">
        <div>
          <p className="eyebrow">Weekly digest</p>
          <h2>AI-выжимка для родителя</h2>
        </div>
        <button className="secondary-button" onClick={refresh} disabled={loading}>
          {loading ? 'Обновляем…' : 'Освежить'}
        </button>
      </div>
      <p><strong>{data.headline}</strong></p>
      <p className="muted">{data.summary}</p>
      <ul className="bullet-list">
        {data.actions.map((item: string) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}
