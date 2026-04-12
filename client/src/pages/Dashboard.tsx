import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { Article, ArticleStatus } from '../types/article.types';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Plus, Eye, Edit3, Trash2, X, Check, AlertTriangle,
  FileText, CheckCircle, Clock, Calendar, Zap, ArrowRight,
  TrendingUp, ChevronLeft, ChevronRight, Podcast, Trophy, Radio
} from 'lucide-react';
import { useArticles } from '../hooks/useArticles';
import Sidebar from '../components/Sidebar';

/* ── Category tag colors ──────────────────────────────────── */
const TAG_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Guide':        { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' },
  'Event':        { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' },
  'Announcement': { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' },
  'News':         { bg: '#ffedd5', text: '#9a3412', border: '#fdba74' },
  'Tech':         { bg: '#ede9fe', text: '#5b21b6', border: '#c4b5fd' },
  'Sports':       { bg: '#fce7f3', text: '#9d174d', border: '#f9a8d4' },
};
const DEFAULT_TAG = { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1' };
const getTagColor = (cat: string) => TAG_COLORS[cat] || DEFAULT_TAG;

/* ── Schedule types ───────────────────────────────────────── */
const SCHEDULE_TYPE_LIST = ['lecture', 'practice', 'lab', 'seminar'] as const;
type ScheduleType = typeof SCHEDULE_TYPE_LIST[number];

const SCHEDULE_TYPES: Record<string, { label: string; color: string; bg: string }> = {
  'lecture':  { label: 'LECTURE',  color: '#dc2626', bg: '#fef2f2' },
  'practice': { label: 'PRACTICE', color: '#ea580c', bg: '#fff7ed' },
  'lab':      { label: 'LAB',     color: '#2563eb', bg: '#eff6ff' },
  'seminar':  { label: 'SEMINAR', color: '#7c3aed', bg: '#f5f3ff' },
};

interface ScheduleItem {
  id: number;
  type: ScheduleType;
  title: string;
  time: string;
}

/* ── Event types ──────────────────────────────────────────── */
const EVENT_TYPES = ['Upcoming', 'Live', 'Challenge', 'Podcast'] as const;
type EventType = typeof EVENT_TYPES[number];

interface CampusEvent {
  id: number;
  title: string;
  type: EventType;
  date: string;
  isLive: boolean;
}

export interface TrackItem {
  id: number;
  title: string;
  learning: { status: string; isComplete: boolean; prog: number };
  practice: { status: string; isComplete: boolean; prog: number };
  grad: string;
}

const DEFAULT_GRADIENTS = [
  'linear-gradient(90deg, #bce4f4, #4b48e5)',
  'linear-gradient(90deg, #67e8f9, #6366f1)',
  'linear-gradient(90deg, #bae6fd, #4f46e5)',
  'linear-gradient(90deg, #67e8f9, #818cf8)',
  'linear-gradient(90deg, #d3eaf5, #483cdc)'
];

const INITIAL_TRACKS: TrackItem[] = [
  { id: 1, title: 'Introduction sessions', learning: { status: 'Up to Date', isComplete: true, prog: 100 }, practice: { status: '9 Left', isComplete: false, prog: 80 }, grad: 'linear-gradient(90deg, #bce4f4, #4b48e5)' },
  { id: 2, title: 'Frontend Development', learning: { status: 'Up to Date', isComplete: true, prog: 100 }, practice: { status: '1 Left', isComplete: false, prog: 90 }, grad: 'linear-gradient(90deg, #67e8f9, #6366f1)' },
  { id: 3, title: 'Tech Foundations', learning: { status: '3 Left', isComplete: false, prog: 65 }, practice: { status: '4 Left', isComplete: false, prog: 50 }, grad: 'linear-gradient(90deg, #bae6fd, #4f46e5)' },
  { id: 4, title: 'English Language & Communication Skills', learning: { status: 'Up to Date', isComplete: true, prog: 100 }, practice: { status: 'Up to Date', isComplete: true, prog: 100 }, grad: 'linear-gradient(90deg, #67e8f9, #818cf8)' },
  { id: 5, title: 'Quantitative Aptitude', learning: { status: 'Up to Date', isComplete: true, prog: 100 }, practice: { status: '2 Left', isComplete: false, prog: 75 }, grad: 'linear-gradient(90deg, #bae6fd, #6366f1)' }
];

const Dashboard = () => {
  const { user } = useAuth();
  const { articles, loading, addArticle, editArticle, deleteArticle } = useArticles();

  /* Article modals */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState({ title: '', body: '', category: '', status: ArticleStatus.DRAFT });

  /* Schedule state */
  const [schedules, setSchedules] = useState<ScheduleItem[]>([
    { id: 1, type: 'practice', title: 'Practice Session', time: '08:30 AM - 09:30 AM' },
    { id: 2, type: 'lecture',  title: 'DSA/Practice Session', time: '09:30 AM - 10:30 AM' },
    { id: 3, type: 'lecture',  title: 'Advance Aptitude/Design', time: '10:30 AM - 11:30 AM' },
    { id: 4, type: 'lecture',  title: 'Practice Session/English', time: '11:30 AM - 12:30 PM' },
    { id: 5, type: 'lab',     title: 'Web Dev Lab Session', time: '02:00 PM - 03:30 PM' },
  ]);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScheduleItem | null>(null);
  const [scheduleForm, setScheduleForm] = useState<{ title: string; type: ScheduleType; time: string }>({ title: '', type: 'lecture', time: '' });

  /* Tracks state */
  const [tracks, setTracks] = useState<TrackItem[]>(INITIAL_TRACKS);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [editingTrack, setEditingTrack] = useState<TrackItem | null>(null);
  const [trackForm, setTrackForm] = useState<TrackItem>({ id: 0, title: '', learning: { status: '', isComplete: false, prog: 0 }, practice: { status: '', isComplete: false, prog: 0 }, grad: '' });

  const openNewTrack = () => {
    setEditingTrack(null);
    setTrackForm({ id: 0, title: '', learning: { status: 'Up to Date', isComplete: true, prog: 100 }, practice: { status: '0 Left', isComplete: false, prog: 0 }, grad: DEFAULT_GRADIENTS[tracks.length % DEFAULT_GRADIENTS.length] });
    setIsTrackModalOpen(true);
  };
  const openEditTrack = (t: TrackItem) => { setEditingTrack(t); setTrackForm(t); setIsTrackModalOpen(true); };
  const removeTrack = (id: number) => setTracks(tracks.filter(t => t.id !== id));
  const saveTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTrack) {
      setTracks(tracks.map(t => t.id === editingTrack.id ? { ...trackForm, id: t.id } : t));
    } else {
      setTracks([...tracks, { ...trackForm, id: Date.now() }]);
    }
    setIsTrackModalOpen(false);
  };

  /* Events state */
  const [events, setEvents] = useState<CampusEvent[]>([
    { id: 1, title: 'Tech Talk: Cloud Computing', type: 'Upcoming', date: 'Apr 15', isLive: false },
    { id: 2, title: 'Code Sprint Challenge', type: 'Challenge', date: 'Apr 18', isLive: false },
    { id: 3, title: 'Campus Radio Show', type: 'Podcast', date: 'Today', isLive: true },
    { id: 4, title: 'AI Workshop Series', type: 'Upcoming', date: 'Apr 20', isLive: false },
  ]);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [eventForm, setEventForm] = useState<{ title: string; type: EventType; date: string }>({ title: '', type: 'Upcoming', date: '' });

  /* Schedule scroll */
  const [scheduleScroll, setScheduleScroll] = useState(0);
  const scrollSchedule = (dir: number) => setScheduleScroll(prev => Math.max(0, prev + dir * 200));

  /* Computed stats */
  const stats = useMemo(() => ({
    schedules: schedules.length,
    tracks: tracks.length,
    events: events.length,
    podcasts: events.filter(e => e.type === 'Podcast').length,
  }), [schedules, tracks, events]);

  /* ── Article handlers ───────────────────────────────────── */
  const handleEditClick = (a: Article) => { setSelectedArticle(a); setFormData({ title: a.title, body: a.body, category: a.category, status: a.status }); setIsModalOpen(true); };
  const handleViewClick = (a: Article) => { setSelectedArticle(a); setIsViewModalOpen(true); };
  const handleDeleteClick = (a: Article) => { setSelectedArticle(a); setIsDeleteModalOpen(true); };
  const handleSave = async (e: React.FormEvent) => { e.preventDefault(); const ok = selectedArticle ? await editArticle(selectedArticle._id, formData) : await addArticle(formData); if (ok) setIsModalOpen(false); };
  const confirmDelete = async () => { if (!selectedArticle) return; if (await deleteArticle(selectedArticle._id)) setIsDeleteModalOpen(false); };
  const openNew = () => { setSelectedArticle(null); setFormData({ title: '', body: '', category: '', status: ArticleStatus.DRAFT }); setIsModalOpen(true); };

  /* ── Schedule handlers ──────────────────────────────────── */
  const openNewSchedule = () => {
    setEditingSchedule(null);
    setScheduleForm({ title: '', type: 'lecture', time: '' });
    setIsScheduleModalOpen(true);
  };

  const openEditSchedule = (s: ScheduleItem) => {
    setEditingSchedule(s);
    setScheduleForm({ title: s.title, type: s.type, time: s.time });
    setIsScheduleModalOpen(true);
  };

  const saveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSchedule) {
      setSchedules(schedules.map(s => s.id === editingSchedule.id ? { ...s, ...scheduleForm } : s));
    } else {
      setSchedules([...schedules, { id: Date.now(), ...scheduleForm }]);
    }
    setIsScheduleModalOpen(false);
  };

  const removeSchedule = (id: number) => {
    setSchedules(schedules.filter(s => s.id !== id));
  };

  /* ── Event handlers ─────────────────────────────────────── */
  const addEvent = (e: React.FormEvent) => {
    e.preventDefault();
    setEvents([...events, { id: Date.now(), title: eventForm.title, type: eventForm.type, date: eventForm.date, isLive: eventForm.type === 'Live' }]);
    setEventForm({ title: '', type: 'Upcoming', date: '' });
    setIsEventModalOpen(false);
  };
  const removeEvent = (id: number) => setEvents(events.filter(ev => ev.id !== id));

  const firstName = user?.name?.split(' ')[0] || 'Moderator';
  const liveEvents = events.filter(e => e.isLive);

  const getEventIcon = (type: EventType) => {
    switch (type) {
      case 'Live': return <Radio size={13} />;
      case 'Podcast': return <Podcast size={13} />;
      case 'Challenge': return <Trophy size={13} />;
      default: return <Calendar size={13} />;
    }
  };

  return (
    <div className="niat-layout">
      <Sidebar />

      <div className="dash-container">
        {/* ═══════ CENTER COLUMN ═══════ */}
        <main className="dash-center">
          {/* Welcome */}
          <section className="dash-welcome">
            <h1 className="dash-welcome-title">Welcome {firstName} 👋</h1>
            <p className="dash-welcome-sub">Manage and moderate student campus content</p>
          </section>

          {/* Quick Stats */}
          <section className="dash-stats">
            <div className="dash-stat-card">
              <div className="dash-stat-icon" style={{ background: '#dbeafe', color: '#2563eb' }}><Clock size={20} /></div>
              <div className="dash-stat-info"><span className="dash-stat-value">{stats.schedules}</span><span className="dash-stat-label">Schedules</span></div>
            </div>
            <div className="dash-stat-card">
              <div className="dash-stat-icon" style={{ background: '#d1fae5', color: '#16a34a' }}><TrendingUp size={20} /></div>
              <div className="dash-stat-info"><span className="dash-stat-value">{stats.tracks}</span><span className="dash-stat-label">Ongoing Tracks</span></div>
            </div>
            <div className="dash-stat-card">
              <div className="dash-stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}><Calendar size={20} /></div>
              <div className="dash-stat-info"><span className="dash-stat-value">{stats.events}</span><span className="dash-stat-label">Events</span></div>
            </div>
            <div className="dash-stat-card">
              <div className="dash-stat-icon" style={{ background: '#ede9fe', color: '#7c3aed' }}><Podcast size={20} /></div>
              <div className="dash-stat-info"><span className="dash-stat-value">{stats.podcasts}</span><span className="dash-stat-label">Podcasts</span></div>
            </div>
          </section>

          {/* ── Student Schedule ─────────────────────────────────── */}
          <section className="dash-schedule-section">
            <div className="dash-section-header">
              <div>
                <h2 className="dash-section-title">Student Schedule</h2>
                <span className="dash-schedule-today">Today · {schedules.length} sessions</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button onClick={openNewSchedule} className="dash-add-inline"><Plus size={14} /> Add</button>
                <button className="dash-scroll-btn" onClick={() => scrollSchedule(-1)}><ChevronLeft size={16} /></button>
                <button className="dash-scroll-btn" onClick={() => scrollSchedule(1)}><ChevronRight size={16} /></button>
              </div>
            </div>
            <div className="dash-schedule-track" style={{ transform: `translateX(-${scheduleScroll}px)` }}>
              {schedules.length === 0 ? (
                <div style={{ padding: '30px 0', textAlign: 'center', width: '100%', color: '#94a3b8', fontSize: 14 }}>
                  No sessions scheduled. Click <strong>+ Add</strong> to create one.
                </div>
              ) : (
                schedules.map(s => {
                  const st = SCHEDULE_TYPES[s.type] || SCHEDULE_TYPES['lecture'];
                  return (
                    <div key={s.id} className="dash-schedule-card" style={{ borderTopColor: st.color }}>
                      <div className="dash-sched-actions">
                        <button onClick={() => openEditSchedule(s)} className="dash-sched-btn" title="Edit"><Edit3 size={12} /></button>
                        <button onClick={() => removeSchedule(s.id)} className="dash-sched-btn dash-sched-btn--del" title="Delete"><Trash2 size={12} /></button>
                      </div>
                      <span className="dash-schedule-type" style={{ color: st.color, background: st.bg }}>{st.label}</span>
                      <h4 className="dash-schedule-name">{s.title}</h4>
                      <span className="dash-schedule-time">{s.time}</span>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* ── Ongoing Tracks ──────────────────────────────────────── */}
          <section className="dash-tracks-section" style={{ marginBottom: 28 }}>
            <div className="dash-section-header">
              <h2 className="dash-section-title" style={{ color: '#0f172a' }}>Ongoing Tracks</h2>
              <button onClick={openNewTrack} className="dash-add-inline"><Plus size={14} /> Add Track</button>
            </div>
            <div className="dash-tracks-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              {tracks.map(track => (
                <div key={track.id} className="dash-track-card" style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <div className="dash-track-header" style={{ background: track.grad, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#1e293b' }}>{track.title}</h3>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => openEditTrack(track)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#1e293b' }} title="Edit"><Edit3 size={14} /></button>
                      <button onClick={() => removeTrack(track.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#1e293b' }} title="Delete"><Trash2 size={14} /></button>
                    </div>
                  </div>
                  <div className="dash-track-body" style={{ padding: '16px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    
                    <div className="dash-track-stats" style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#0d9488' }}>Learning</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600, color: '#334155' }}>
                          {track.learning.isComplete && <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={10} color="#fff" strokeWidth={3} /></div>}
                          <span>{track.learning.status}</span>
                        </div>
                      </div>
                      <div style={{ width: 1, height: 32, background: '#e2e8f0', margin: '0 16px' }} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#d97706' }}>Practice</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600, color: '#334155' }}>
                          {track.practice.isComplete && <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={10} color="#fff" strokeWidth={3} /></div>}
                          <span>{track.practice.status}</span>
                        </div>
                      </div>
                    </div>

                    <div className="dash-track-progress">
                      <svg width="60" height="60" viewBox="0 0 60 60">
                        <circle cx="30" cy="30" r="23" fill="none" stroke="#ccfbf1" strokeWidth="8" />
                        <circle cx="30" cy="30" r="23" fill="none" stroke="#14b8a6" strokeWidth="8" strokeDasharray={`${(track.learning.prog / 100) * 144.5} 144.5`} strokeLinecap="round" transform="rotate(-90 30 30)" />
                        <circle cx="30" cy="30" r="11" fill="none" stroke="#fef3c7" strokeWidth="8" />
                        <circle cx="30" cy="30" r="11" fill="none" stroke="#f59e0b" strokeWidth="8" strokeDasharray={`${(track.practice.prog / 100) * 69.1} 69.1`} strokeLinecap="round" transform="rotate(-90 30 30)" />
                      </svg>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* ═══════ RIGHT PANEL ═══════ */}
        <aside className="dash-right">
          {/* Profile */}
          <div className="dash-profile-card">
            <div className="dash-profile-avatar">{user?.name?.charAt(0) || 'M'}</div>
            <div className="dash-profile-info">
              <h3 className="dash-profile-name">{user?.name}</h3>
              <p className="dash-profile-role">Campus Moderator</p>
            </div>
          </div>

          {/* Events Panel */}
          <div className="dash-panel-card">
            <div className="dash-panel-head" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h4>Events</h4>
              <button onClick={() => setIsEventModalOpen(true)} className="dash-view-link"><Plus size={13} /> Add</button>
            </div>
            <div className="dash-events-body">
              {liveEvents.length > 0 && (
                <div className="dash-live-banner">
                  <Zap size={14} />
                  <span>{liveEvents.length} Live Event{liveEvents.length > 1 ? 's' : ''}</span>
                  <span className="dash-live-dot">● Live Now</span>
                </div>
              )}
              {events.map(ev => (
                <div key={ev.id} className="dash-event-item">
                  <div className="dash-event-left">
                    <span className={`dash-event-icon dash-event-icon--${ev.type.toLowerCase()}`}>
                      {getEventIcon(ev.type)}
                    </span>
                    <div>
                      <span className="dash-event-title">{ev.title}</span>
                      <span className="dash-event-meta">
                        {ev.type} · {ev.date}
                        {ev.isLive && <span className="dash-live-badge">LIVE</span>}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => removeEvent(ev.id)} className="dash-event-remove" title="Remove"><X size={12} /></button>
                </div>
              ))}
              {events.length === 0 && (
                <p style={{ padding: '16px 18px', fontSize: 13, color: '#94a3b8' }}>No events yet.</p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dash-panel-card">
            <div className="dash-panel-head"><h4>Quick Actions</h4></div>
            <div className="dash-panel-body">
              <button onClick={openNewTrack} className="dash-quick-btn"><Plus size={16} /><span>New Track</span><ArrowRight size={14} className="dash-quick-arrow" /></button>
              <button onClick={openNewSchedule} className="dash-quick-btn"><Clock size={16} /><span>Add Schedule</span><ArrowRight size={14} className="dash-quick-arrow" /></button>
              <button onClick={() => setIsEventModalOpen(true)} className="dash-quick-btn"><Calendar size={16} /><span>Add Event</span><ArrowRight size={14} className="dash-quick-arrow" /></button>
              <button onClick={() => window.location.href = '/leaderboard'} className="dash-quick-btn"><TrendingUp size={16} /><span>View Analytics</span><ArrowRight size={14} className="dash-quick-arrow" /></button>
            </div>
          </div>

          {/* Tip */}
          <div className="dash-tip-card">
            <Zap size={16} />
            <div>
              <strong>Moderation Tip</strong>
              <p>Keep the student schedule and events updated to help students stay on track.</p>
            </div>
          </div>
        </aside>
      </div>

      {/* ═══════ SCHEDULE MODAL (Add / Edit) ═══════ */}
      <AnimatePresence>
        {isScheduleModalOpen && (
          <div className="niat-modal-overlay">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="niat-modal-backdrop" onClick={() => setIsScheduleModalOpen(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="niat-modal" style={{ maxWidth: 460 }}>
              <div className="niat-modal-header">
                <h2>{editingSchedule ? 'Edit Schedule' : 'Add Schedule'}</h2>
                <button onClick={() => setIsScheduleModalOpen(false)} className="niat-modal-close"><X size={18} /></button>
              </div>
              <form id="schedule-form" onSubmit={saveSchedule} className="niat-modal-body">
                <div className="niat-form-group">
                  <label>Session Title</label>
                  <input type="text" value={scheduleForm.title} onChange={e => setScheduleForm({...scheduleForm, title: e.target.value})} required placeholder="e.g. DSA Practice Session" />
                </div>
                <div className="niat-form-row">
                  <div className="niat-form-group">
                    <label>Type</label>
                    <select value={scheduleForm.type} onChange={e => setScheduleForm({...scheduleForm, type: e.target.value as ScheduleType})}>
                      {SCHEDULE_TYPE_LIST.map(t => <option key={t} value={t}>{SCHEDULE_TYPES[t].label}</option>)}
                    </select>
                  </div>
                  <div className="niat-form-group">
                    <label>Time</label>
                    <input type="text" value={scheduleForm.time} onChange={e => setScheduleForm({...scheduleForm, time: e.target.value})} required placeholder="e.g. 09:30 AM - 10:30 AM" />
                  </div>
                </div>
              </form>
              <div className="niat-modal-footer">
                <button onClick={() => setIsScheduleModalOpen(false)} className="niat-btn-outline">Cancel</button>
                <button type="submit" form="schedule-form" className="niat-btn-add"><Check size={16} /><span>{editingSchedule ? 'Update' : 'Add'}</span></button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══════ TRACK MODAL ═══════ */}
      <AnimatePresence>
        {isTrackModalOpen && (
          <div className="niat-modal-overlay">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="niat-modal-backdrop" onClick={() => setIsTrackModalOpen(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="niat-modal" style={{ maxWidth: 480 }}>
              <div className="niat-modal-header"><h2>{editingTrack ? 'Edit Track' : 'Add Track'}</h2><button onClick={() => setIsTrackModalOpen(false)} className="niat-modal-close"><X size={18} /></button></div>
              <form id="track-form" onSubmit={saveTrack} className="niat-modal-body">
                <div className="niat-form-group"><label>Track Title</label><input type="text" value={trackForm.title} onChange={e => setTrackForm({...trackForm, title: e.target.value})} required placeholder="e.g. React Basics" /></div>
                
                <div className="niat-form-row">
                  <div className="niat-form-group"><label>Learning Text</label><input type="text" value={trackForm.learning.status} onChange={e => setTrackForm({...trackForm, learning: {...trackForm.learning, status: e.target.value}})} required placeholder="e.g. Up to Date" /></div>
                  <div className="niat-form-group"><label>Learning Progress %</label><input type="number" min="0" max="100" value={trackForm.learning.prog} onChange={e => setTrackForm({...trackForm, learning: {...trackForm.learning, prog: parseInt(e.target.value)||0, isComplete: parseInt(e.target.value) === 100}})} required /></div>
                </div>

                <div className="niat-form-row">
                  <div className="niat-form-group"><label>Practice Text</label><input type="text" value={trackForm.practice.status} onChange={e => setTrackForm({...trackForm, practice: {...trackForm.practice, status: e.target.value}})} required placeholder="e.g. 5 Left" /></div>
                  <div className="niat-form-group"><label>Practice Progress %</label><input type="number" min="0" max="100" value={trackForm.practice.prog} onChange={e => setTrackForm({...trackForm, practice: {...trackForm.practice, prog: parseInt(e.target.value)||0, isComplete: parseInt(e.target.value) === 100}})} required /></div>
                </div>
              </form>
              <div className="niat-modal-footer">
                <button onClick={() => setIsTrackModalOpen(false)} className="niat-btn-outline">Cancel</button>
                <button type="submit" form="track-form" className="niat-btn-add"><Check size={16} /><span>Save Track</span></button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══════ EVENT MODAL ═══════ */}
      <AnimatePresence>
        {isEventModalOpen && (
          <div className="niat-modal-overlay">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="niat-modal-backdrop" onClick={() => setIsEventModalOpen(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="niat-modal" style={{ maxWidth: 440 }}>
              <div className="niat-modal-header"><h2>Add Event</h2><button onClick={() => setIsEventModalOpen(false)} className="niat-modal-close"><X size={18} /></button></div>
              <form id="event-form" onSubmit={addEvent} className="niat-modal-body">
                <div className="niat-form-group"><label>Event Title</label><input type="text" value={eventForm.title} onChange={e => setEventForm({...eventForm, title: e.target.value})} required placeholder="e.g. Tech Talk: AI Trends" /></div>
                <div className="niat-form-row">
                  <div className="niat-form-group">
                    <label>Type</label>
                    <select value={eventForm.type} onChange={e => setEventForm({...eventForm, type: e.target.value as EventType})}>
                      {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="niat-form-group"><label>Date</label><input type="text" value={eventForm.date} onChange={e => setEventForm({...eventForm, date: e.target.value})} required placeholder="e.g. Apr 20" /></div>
                </div>
              </form>
              <div className="niat-modal-footer">
                <button onClick={() => setIsEventModalOpen(false)} className="niat-btn-outline">Cancel</button>
                <button type="submit" form="event-form" className="niat-btn-add"><Check size={16} /><span>Add Event</span></button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══════ ARTICLE MODALS ═══════ */}
      {/* View */}
      <AnimatePresence>
        {isViewModalOpen && selectedArticle && (
          <div className="niat-modal-overlay">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="niat-modal-backdrop" onClick={() => setIsViewModalOpen(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="niat-modal">
              <div className="niat-modal-header"><h2>View Article</h2><button onClick={() => setIsViewModalOpen(false)} className="niat-modal-close"><X size={18} /></button></div>
              <div className="niat-modal-body">
                <div className="niat-view-field"><label>Title</label><p>{selectedArticle.title}</p></div>
                <div className="niat-view-row">
                  <div className="niat-view-field"><label>Category</label><p>{selectedArticle.category}</p></div>
                  <div className="niat-view-field"><label>Status</label><p>{selectedArticle.status}</p></div>
                  <div className="niat-view-field"><label>Campus</label><p>{selectedArticle.campus}</p></div>
                </div>
                <div className="niat-view-field"><label>Content</label><p className="niat-view-body">{selectedArticle.body}</p></div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit/New */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="niat-modal-overlay">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="niat-modal-backdrop" onClick={() => setIsModalOpen(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="niat-modal">
              <div className="niat-modal-header"><h2>{selectedArticle ? 'Edit Article' : 'New Article'}</h2><button onClick={() => setIsModalOpen(false)} className="niat-modal-close"><X size={18} /></button></div>
              <form id="edit-form" onSubmit={handleSave} className="niat-modal-body">
                <div className="niat-form-group"><label>Title</label><input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required placeholder="Article title" /></div>
                <div className="niat-form-row">
                  <div className="niat-form-group"><label>Category</label><input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required placeholder="e.g. Guide, Event" /></div>
                  <div className="niat-form-group"><label>Status</label><select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as ArticleStatus})}><option value={ArticleStatus.DRAFT}>Draft</option><option value={ArticleStatus.PUBLISHED}>Published</option></select></div>
                </div>
                <div className="niat-form-group"><label>Content</label><textarea value={formData.body} onChange={e => setFormData({...formData, body: e.target.value})} required placeholder="Write article content..." rows={6}></textarea></div>
              </form>
              <div className="niat-modal-footer">
                <button onClick={() => setIsModalOpen(false)} className="niat-btn-outline">Cancel</button>
                <button type="submit" form="edit-form" className="niat-btn-add"><Check size={16} /><span>Save</span></button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="niat-modal-overlay">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="niat-modal-backdrop" onClick={() => setIsDeleteModalOpen(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="niat-modal niat-modal--sm">
              <div className="niat-delete-icon"><AlertTriangle size={24} /></div>
              <h2 className="niat-delete-title">Delete permanently?</h2>
              <p className="niat-delete-desc">Are you sure you want to delete <strong>"{selectedArticle?.title}"</strong>? This cannot be undone.</p>
              <div className="niat-delete-actions">
                <button onClick={() => setIsDeleteModalOpen(false)} className="niat-btn-outline">Cancel</button>
                <button onClick={confirmDelete} className="niat-btn-delete"><Trash2 size={15} /><span>Delete</span></button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
