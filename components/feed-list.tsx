import { FeedItem } from '@/lib/types';

export function FeedList({ items }: { items: FeedItem[] }) {
  return (
    <div className="feed-list">
      {items.map((item) => (
        <article key={item.id} className="feed-item">
          <div className={`pill ${item.type}`}>{item.type}</div>
          <h3>{item.title}</h3>
          <p className="muted">{item.description}</p>
          <small>{new Date(item.createdAt).toLocaleDateString('ru-RU')}</small>
        </article>
      ))}
    </div>
  );
}
