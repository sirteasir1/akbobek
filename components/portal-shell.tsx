import Link from 'next/link';
import { ReactNode } from 'react';
import { Role } from '@/lib/types';

const navItems: Array<{ href: string; label: string; role?: Role }> = [
  { href: '/', label: 'Главная' },
  { href: '/student', label: 'Ученик', role: 'student' },
  { href: '/teacher', label: 'Учитель', role: 'teacher' },
  { href: '/parent', label: 'Родитель', role: 'parent' },
  { href: '/admin', label: 'Админ', role: 'admin' },
  { href: '/kiosk', label: 'Kiosk Mode' },
];

export function PortalShell({
  role,
  title,
  subtitle,
  children,
}: {
  role?: Role;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="app-shell">
      <aside className="sidebar glass">
        <div>
          <div className="brand-mark">AQ</div>
          <div>
            <p className="eyebrow">Aqbobek Lyceum</p>
            <h1 className="sidebar-title">Unified School Portal</h1>
          </div>
        </div>
        <nav className="sidebar-nav">
          {navItems
            .filter((item) => !item.role || item.role === role)
            .map((item) => (
              <Link key={item.href} href={item.href} className="nav-link">
                {item.label}
              </Link>
            ))}
        </nav>
        <div className="sidebar-foot muted small">
          MVP: AI-аналитика · умное расписание · портфолио · стенгазета
        </div>
      </aside>
      <main className="main-shell">
        <header className="page-hero glass">
          <div>
            <p className="eyebrow">Интерактивный портал</p>
            <h1>{title}</h1>
            <p className="muted hero-copy">{subtitle}</p>
          </div>
          <div className="hero-badge">
            <span className="status-dot" />
            Live MVP
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
