import Sidebar from '../components/Sidebar';
import { Briefcase, MapPin, Clock, ExternalLink } from 'lucide-react';

const jobs = [
  { id: 1, title: 'Frontend Developer Intern', company: 'Infosys', location: 'Hyderabad', type: 'Internship', posted: '2 days ago' },
  { id: 2, title: 'Full Stack Developer', company: 'TCS', location: 'Bangalore', type: 'Full-time', posted: '3 days ago' },
  { id: 3, title: 'Data Science Intern', company: 'Wipro', location: 'Pune', type: 'Internship', posted: '5 days ago' },
  { id: 4, title: 'Backend Engineer', company: 'Zoho', location: 'Chennai', type: 'Full-time', posted: '1 week ago' },
  { id: 5, title: 'UI/UX Design Intern', company: 'Accenture', location: 'Mumbai', type: 'Internship', posted: '1 week ago' },
  { id: 6, title: 'Cloud DevOps Engineer', company: 'Amazon', location: 'Hyderabad', type: 'Full-time', posted: '2 weeks ago' },
  { id: 7, title: 'Mobile App Developer Intern', company: 'Flipkart', location: 'Bangalore', type: 'Internship', posted: '2 weeks ago' },
];

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  'Internship': { bg: '#065f46', text: '#6ee7b7' },
  'Full-time':  { bg: '#1e40af', text: '#93c5fd' },
};

const JobPortal = () => {
  return (
    <div className="niat-layout">
      <Sidebar />
      <main className="niat-main">
        <header className="niat-header">
          <div className="niat-header-left">
            <h1 className="niat-page-title">Jobs Board & Internships</h1>
            <span className="niat-page-subtitle">Explore career opportunities from top companies</span>
          </div>
        </header>

        <div className="niat-article-list">
          {jobs.map(job => {
            const color = TYPE_COLORS[job.type] || { bg: '#334155', text: '#94a3b8' };
            return (
              <div key={job.id} className="niat-article-row" style={{ cursor: 'pointer' }}>
                <div className="niat-article-info">
                  <Briefcase size={16} style={{ color: '#94a3b8', flexShrink: 0 }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                    <span className="niat-article-title">{job.title}</span>
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>{job.company}</span>
                  </div>
                  <div className="niat-article-tags">
                    <span className="niat-tag" style={{ backgroundColor: color.bg, color: color.text }}>{job.type}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#94a3b8', fontSize: 12 }}>
                    <MapPin size={12} /> {job.location}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#94a3b8', fontSize: 12 }}>
                    <Clock size={12} /> {job.posted}
                  </span>
                  <button className="niat-action-btn niat-action-btn--view" title="View Details">
                    <ExternalLink size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default JobPortal;
