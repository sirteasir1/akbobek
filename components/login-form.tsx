'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

const options = [
  { role: 'student', label: 'Ученик', userId: 'stu-001' },
  { role: 'teacher', label: 'Учитель', userId: 't-physics' },
  { role: 'parent', label: 'Родитель', userId: 'parent-stu-001' },
  { role: 'admin', label: 'Администрация', userId: 'admin-001' },
] as const;

export function LoginForm({ initialRole = 'student' }: { initialRole?: (typeof options)[number]['role'] }) {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const option = options.find((item) => item.role === selectedRole) ?? options[0];

    await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(option),
    });

    router.push(`/${selectedRole}`);
    router.refresh();
  };

  return (
    <form onSubmit={submit} className="login-card glass">
      <div>
        <p className="eyebrow">Демо-вход</p>
        <h2>Выберите роль и войдите в MVP</h2>
        <p className="muted">В реальном режиме сюда легко подключается Supabase Auth.</p>
      </div>

      <div className="role-grid">
        {options.map((option) => (
          <button
            type="button"
            key={option.role}
            className={`role-option ${selectedRole === option.role ? 'active' : ''}`}
            onClick={() => setSelectedRole(option.role)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <button type="submit" className="primary-button" disabled={loading}>
        {loading ? 'Входим...' : 'Открыть портал'}
      </button>
    </form>
  );
}
