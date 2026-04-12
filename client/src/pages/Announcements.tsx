import Sidebar from '../components/Sidebar';
import { Megaphone, Bell, Calendar, Pin } from 'lucide-react';

const announcements = [
  { id: 1, title: 'Mid-Semester Examinations Schedule Released', date: 'Apr 10, 2026', type: 'Academic', pinned: true },
  { id: 2, title: 'Campus Wi-Fi Maintenance — Downtime Expected', date: 'Apr 9, 2026', type: 'Infrastructure', pinned: false },
  { id: 3, title: 'Hackathon 2026 — Registrations Open Now', date: 'Apr 8, 2026', type: 'Event', pinned: true },
  { id: 4, title: 'Library Timings Extended During Exam Period', date: 'Apr 7, 2026', type: 'Facility', pinned: false },
  { id: 5, title: 'Guest Lecture: AI & Machine Learning Trends', date: 'Apr 6, 2026', type: 'Academic', pinned: false },
  { id: 6, title: 'Sports Day 2026 — Volunteers Needed', date: 'Apr 5, 2026', type: 'Event', pinned: false },
];

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  'Academic':       { bg: '#1e40af', text: '#93c5fd' },
  'Event':          { bg: '#065f46', text: '#6ee7b7' },
  'Infrastructure': { bg: '#92400e', text: '#fcd34d' },
  'Facility':       { bg: '#4c1d95', text: '#c4b5fd' },
};

const Announcements = () => {
  return (
    <div className="niat-layout">
      <Sidebar />
      <main className="niat-main">
        <header className="niat-header">
          <div className="niat-header-left">
            <h1 className="niat-page-title">Announcements</h1>
            <span className="niat-page-subtitle">Latest campus news and updates</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748b', fontSize: 13 }}>
            <Bell size={16} />
            <span>{announcements.length} updates</span>
          </div>
        </header>

        <div className="niat-article-list">
          {announcements.map(a => {
            const color = TYPE_COLORS[a.type] || { bg: '#334155', text: '#94a3b8' };
            return (
              <div key={a.id} className="niat-article-row">
                <div className="niat-article-info">
                  <Megaphone size={16} style={{ color: '#94a3b8', flexShrink: 0 }} />
                  <span className="niat-article-title">{a.title}</span>
                  <div className="niat-article-tags">
                    <span className="niat-tag" style={{ backgroundColor: color.bg, color: color.text }}>{a.type}</span>
                    {a.pinned && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color: '#f59e0b', fontSize: 11, fontWeight: 600 }}>
                        <Pin size={11} /> Pinned
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', fontSize: 12, flexShrink: 0 }}>
                  <Calendar size={12} />
                  <span>{a.date}</span>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Announcements;
