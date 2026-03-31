import { TopicMastery } from '@/lib/analytics';

export function ProgressBars({ items }: { items: TopicMastery[] }) {
  return (
    <div className="progress-bars">
      {items.map((item) => (
        <div key={item.topic} className="progress-row">
          <div className="progress-head">
            <span>{item.topic}</span>
            <strong>{item.mastery}%</strong>
          </div>
          <div className="progress-track">
            <div className={`progress-fill ${item.priority}`} style={{ width: `${item.mastery}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
