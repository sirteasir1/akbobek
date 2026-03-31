import { feed, students } from '@/lib/data';

export default function KioskPage() {
  const topStudents = [...students].sort((left, right) => right.xp - left.xp).slice(0, 3);
  const scheduleUpdates = feed.filter((item) => item.type === 'schedule');

  return (
    <main className="kiosk-page">
      <div className="ticker">
        <div className="ticker-track">
          {feed.map((item) => (
            <span key={item.id}>{item.title} • </span>
          ))}
        </div>
      </div>

      <section className="kiosk-grid">
        <div className="kiosk-card giant">
          <p className="eyebrow">Сегодня в Aqbobek</p>
          <h1>Интерактивная стенгазета</h1>
          <p className="kiosk-copy">Крупная типографика, автоскролл, актуальные замены и топ-ученики дня — всё для экранов в коридорах.</p>
        </div>

        <div className="kiosk-card">
          <p className="eyebrow">Топ ученики дня</p>
          {topStudents.map((student, index) => (
            <div key={student.id} className="kiosk-row">
              <strong>#{index + 1} {student.name}</strong>
              <span>{student.xp} XP</span>
            </div>
          ))}
        </div>

        <div className="kiosk-card">
          <p className="eyebrow">Актуальные замены</p>
          {scheduleUpdates.map((item) => (
            <div key={item.id} className="kiosk-row stacked">
              <strong>{item.title}</strong>
              <span>{item.description}</span>
            </div>
          ))}
        </div>

        <div className="kiosk-card tall auto-scroll">
          <p className="eyebrow">Анонсы</p>
          <div className="scroll-track">
            {[...feed, ...feed].map((item, index) => (
              <article key={`${item.id}-${index}`} className="kiosk-announcement">
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
