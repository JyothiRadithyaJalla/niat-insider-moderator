import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Plus, Edit3, Trash2, X, Check,
  Clock, Calendar, Zap, ArrowRight,
  TrendingUp, ChevronLeft, ChevronRight, Podcast, Trophy, Radio
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useSchedules, ScheduleType } from '../hooks/useSchedules';
import { useTracks } from '../hooks/useTracks';
import { useEvents, EventType } from '../hooks/useEvents';

const SCHEDULE_TYPE_LIST: ScheduleType[] = ['lecture', 'practice', 'lab', 'seminar'];
const SCHEDULE_TYPES: Record<string, { label: string; color: string; bg: string }> = {
  'lecture':  { label: 'LECTURE',  color: '#dc2626', bg: '#fef2f2' },
  'practice': { label: 'PRACTICE', color: '#ea580c', bg: '#fff7ed' },
  'lab':      { label: 'LAB',     color: '#2563eb', bg: '#eff6ff' },
  'seminar':  { label: 'SEMINAR', color: '#7c3aed', bg: '#f5f3ff' },
};

const EVENT_TYPES: EventType[] = ['Upcoming', 'Live', 'Challenge', 'Podcast'];

const DEFAULT_GRADIENTS = [
  'linear-gradient(90deg, #bce4f4, #4b48e5)',
  'linear-gradient(90deg, #67e8f9, #6366f1)',
  'linear-gradient(90deg, #bae6fd, #4f46e5)',
  'linear-gradient(90deg, #67e8f9, #818cf8)',
  'linear-gradient(90deg, #d3eaf5, #483cdc)'
];

const Dashboard = () => {
  const { user } = useAuth();
  const { schedules, addSchedule, editSchedule, deleteSchedule } = useSchedules();
  const { tracks, addTrack, editTrack, deleteTrack } = useTracks();
  const { events, addEvent, deleteEvent } = useEvents();
  
  /* Modal visibility */
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  /* Editing objects */
  const [editingSchedule, setEditingSchedule] = useState<any>(null);
  const [editingTrack, setEditingTrack] = useState<any>(null);

  /* Form states */
  const [scheduleForm, setScheduleForm] = useState({ title: '', type: 'lecture' as ScheduleType, time: '' });
  const [trackForm, setTrackForm] = useState({ title: '', learningStatus: '', learningProgress: 0, practiceStatus: '', practiceProgress: 0, gradient: '' });
  const [eventForm, setEventForm] = useState({ title: '', type: 'Upcoming' as EventType, date: '' });

  /* Schedule scroll */
  const [scheduleScroll, setScheduleScroll] = useState(0);
  const scrollSchedule = (dir: number) => setScheduleScroll(prev => Math.max(0, prev + dir * 200));

  /* Stats */
  const stats = useMemo(() => ({
    schedules: schedules.length,
    tracks: tracks.length,
    events: events.length,
    podcasts: events.filter(e => e.type === 'Podcast').length,
  }), [schedules, tracks, events]);

  /* ── Schedule Handlers ──────────────────────────────────── */
  const openNewSchedule = () => { setEditingSchedule(null); setScheduleForm({ title: '', type: 'lecture', time: '' }); setIsScheduleModalOpen(true); };
  const openEditSchedule = (s: any) => { setEditingSchedule(s); setScheduleForm({ title: s.title, type: s.type, time: s.time }); setIsScheduleModalOpen(true); };
  const handleSaveSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = editingSchedule ? await editSchedule(editingSchedule._id, scheduleForm) : await addSchedule(scheduleForm);
    if (ok) setIsScheduleModalOpen(false);
  };

  /* ── Track Handlers ─────────────────────────────────────── */
  const openNewTrack = () => { 
    setEditingTrack(null); 
    setTrackForm({ title: '', learningStatus: 'Up to Date', learningProgress: 100, practiceStatus: '0 Left', practiceProgress: 0, gradient: DEFAULT_GRADIENTS[tracks.length % DEFAULT_GRADIENTS.length] }); 
    setIsTrackModalOpen(true); 
  };
  const openEditTrack = (t: any) => { setEditingTrack(t); setTrackForm({ title: t.title, learningStatus: t.learningStatus, learningProgress: t.learningProgress, practiceStatus: t.practiceStatus, practiceProgress: t.practiceProgress, gradient: t.gradient }); setIsTrackModalOpen(true); };
  const handleSaveTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = editingTrack ? await editTrack(editingTrack._id, trackForm) : await addTrack(trackForm);
    if (ok) setIsTrackModalOpen(false);
  };

  /* ── Event Handlers ─────────────────────────────────────── */
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await addEvent({ ...eventForm, isLive: eventForm.type === 'Live' });
    if (ok) setIsEventModalOpen(false);
  };

  const getEventIcon = (type: EventType) => {
    switch (type) {
      case 'Live': return <Radio size={13} />;
      case 'Podcast': return <Podcast size={13} />;
      case 'Challenge': return <Trophy size={13} />;
      default: return <Calendar size={13} />;
    }
  };

  const firstName = user?.name?.split(' ')[0] || 'Moderator';
  const liveEvents = events.filter(e => e.isLive);

  return (
    <div className="niat-layout">
      <Sidebar />

      <div className="dash-container">
        <main className="dash-center">
          <section className="dash-welcome">
            <h1 className="dash-welcome-title">Welcome {firstName} 👋</h1>
            <p className="dash-welcome-sub">Manage and moderate student campus content</p>
          </section>

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

          {/* Student Schedule */}
          <section className="dash-schedule-section">
            <div className="dash-section-header">
              <div><h2 className="dash-section-title">Student Schedule</h2><span className="dash-schedule-today">Today · {schedules.length} sessions</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button onClick={openNewSchedule} className="dash-add-inline"><Plus size={14} /> Add</button>
                <button className="dash-scroll-btn" onClick={() => scrollSchedule(-1)}><ChevronLeft size={16} /></button>
                <button className="dash-scroll-btn" onClick={() => scrollSchedule(1)}><ChevronRight size={16} /></button>
              </div>
            </div>
            <div className="dash-schedule-track" style={{ transform: `translateX(-${scheduleScroll}px)` }}>
              {schedules.map(s => {
                const st = SCHEDULE_TYPES[s.type] || SCHEDULE_TYPES['lecture'];
                return (
                  <div key={s._id} className="dash-schedule-card" style={{ borderTopColor: st.color }}>
                    <div className="dash-sched-actions">
                      <button onClick={() => openEditSchedule(s)} className="dash-sched-btn" title="Edit"><Edit3 size={12} /></button>
                      <button onClick={() => deleteSchedule(s._id)} className="dash-sched-btn dash-sched-btn--del" title="Delete"><Trash2 size={12} /></button>
                    </div>
                    <span className="dash-schedule-type" style={{ color: st.color, background: st.bg }}>{st.label}</span>
                    <h4 className="dash-schedule-name">{s.title}</h4>
                    <span className="dash-schedule-time">{s.time}</span>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="dash-tracks-section">
            <div className="dash-section-header">
              <h2 className="dash-section-title">Ongoing Tracks</h2>
              <button onClick={openNewTrack} className="dash-add-inline"><Plus size={14} /> Add Track</button>
            </div>
            <div className="dash-tracks-grid">
              {tracks.map(track => (
                <div key={track._id} className="dash-track-card">
                  <div className="dash-track-header" style={{ background: track.gradient }}>
                    <h3>{track.title}</h3>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => openEditTrack(track)} className="dash-track-edit-btn"><Edit3 size={14} /></button>
                      <button onClick={() => deleteTrack(track._id)} className="dash-track-edit-btn"><Trash2 size={14} /></button>
                    </div>
                  </div>
                  <div className="dash-track-body">
                    <div className="dash-track-stats" style={{ display: 'flex', alignItems: 'center' }}>
                      <div className="dash-track-stat-group">
                        <span className="dash-track-stat-label" style={{ color: '#0d9488' }}>Learning</span>
                        <div className="dash-track-status-line">
                          {track.learningProgress === 100 && <Check size={14} className="text-emerald-500" strokeWidth={3} />}
                          <span>{track.learningStatus}</span>
                        </div>
                      </div>
                      <div className="dash-track-sep" />
                      <div className="dash-track-stat-group">
                        <span className="dash-track-stat-label" style={{ color: '#d97706' }}>Practice</span>
                        <div className="dash-track-status-line">
                          {track.practiceProgress === 100 && <Check size={14} className="text-amber-500" strokeWidth={3} />}
                          <span>{track.practiceStatus}</span>
                        </div>
                      </div>
                    </div>
                    <div className="dash-track-progress">
                      <svg width="60" height="60" viewBox="0 0 60 60">
                        <circle cx="30" cy="30" r="23" fill="none" stroke="#f1f5f9" strokeWidth="6" />
                        <circle cx="30" cy="30" r="23" fill="none" stroke="#10b981" strokeWidth="6" strokeDasharray={`${(track.learningProgress / 100) * 144.5} 144.5`} strokeLinecap="round" transform="rotate(-90 30 30)" />
                        <circle cx="30" cy="30" r="13" fill="none" stroke="#f1f5f9" strokeWidth="6" />
                        <circle cx="30" cy="30" r="13" fill="none" stroke="#f59e0b" strokeWidth="6" strokeDasharray={`${(track.practiceProgress / 100) * 81.6} 81.6`} strokeLinecap="round" transform="rotate(-90 30 30)" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        <aside className="dash-right">
          <div className="dash-profile-card">
            <div className="dash-profile-avatar">{user?.name?.charAt(0) || 'M'}</div>
            <div className="dash-profile-info"><h3 className="dash-profile-name">{user?.name}</h3><p className="dash-profile-role">Campus Moderator</p></div>
          </div>

          <div className="dash-panel-card">
            <div className="dash-panel-head"><h4>Events</h4><button onClick={() => setIsEventModalOpen(true)} className="dash-view-link"><Plus size={13} /> Add</button></div>
            <div className="dash-events-body">
              {liveEvents.length > 0 && <div className="dash-live-banner"><Zap size={14} /><span>{liveEvents.length} Live Now</span><span className="dash-live-dot">●</span></div>}
              {events.map(ev => (
                <div key={ev._id} className="dash-event-item">
                  <div className="dash-event-left"><span className={`dash-event-icon dash-event-icon--${ev.type.toLowerCase()}`}>{getEventIcon(ev.type)}</span><div><span className="dash-event-title">{ev.title}</span><span className="dash-event-meta">{ev.type} · {ev.date}</span></div></div>
                  <button onClick={() => deleteEvent(ev._id)} className="dash-event-remove"><X size={12} /></button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="dash-panel-card">
            <div className="dash-panel-head"><h4>Quick Actions</h4></div>
            <div className="dash-panel-body">
              <button onClick={openNewTrack} className="dash-quick-btn"><Plus size={16} /><span>New Track</span><ArrowRight size={14} /></button>
              <button onClick={openNewSchedule} className="dash-quick-btn"><Clock size={16} /><span>Add Schedule</span><ArrowRight size={14} /></button>
              <button onClick={() => setIsEventModalOpen(true)} className="dash-quick-btn"><Calendar size={16} /><span>Add Event</span><ArrowRight size={14} /></button>
            </div>
          </div>
        </aside>
      </div>

      {/* SCHEDULE MODAL */}
      <AnimatePresence>
        {isScheduleModalOpen && (
          <div className="niat-modal-overlay">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="niat-modal-backdrop" onClick={() => setIsScheduleModalOpen(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="niat-modal" style={{ maxWidth: 460 }}>
              <div className="niat-modal-header"><h2>{editingSchedule ? 'Edit Schedule' : 'Add Schedule'}</h2><button onClick={() => setIsScheduleModalOpen(false)} className="niat-modal-close"><X size={18} /></button></div>
              <form id="schedule-form" onSubmit={handleSaveSchedule} className="niat-modal-body">
                <div className="niat-form-group"><label>Session Title</label><input type="text" value={scheduleForm.title} onChange={e => setScheduleForm({...scheduleForm, title: e.target.value})} required /></div>
                <div className="niat-form-row">
                  <div className="niat-form-group"><label>Type</label><select value={scheduleForm.type} onChange={e => setScheduleForm({...scheduleForm, type: e.target.value as ScheduleType})}>{SCHEDULE_TYPE_LIST.map(t => <option key={t} value={t}>{SCHEDULE_TYPES[t].label}</option>)}</select></div>
                  <div className="niat-form-group"><label>Time</label><input type="text" value={scheduleForm.time} onChange={e => setScheduleForm({...scheduleForm, time: e.target.value})} required /></div>
                </div>
              </form>
              <div className="niat-modal-footer">
                <button onClick={() => setIsScheduleModalOpen(false)} className="niat-btn-outline">Cancel</button>
                <button type="submit" form="schedule-form" className="niat-btn-add"><Check size={16} /><span>Save</span></button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TRACK MODAL */}
      <AnimatePresence>
        {isTrackModalOpen && (
          <div className="niat-modal-overlay">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="niat-modal-backdrop" onClick={() => setIsTrackModalOpen(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="niat-modal" style={{ maxWidth: 480 }}>
              <div className="niat-modal-header"><h2>{editingTrack ? 'Edit Track' : 'Add Track'}</h2><button onClick={() => setIsTrackModalOpen(false)} className="niat-modal-close"><X size={18} /></button></div>
              <form id="track-form" onSubmit={handleSaveTrack} className="niat-modal-body">
                <div className="niat-form-group"><label>Track Title</label><input type="text" value={trackForm.title} onChange={e => setTrackForm({...trackForm, title: e.target.value})} required /></div>
                <div className="niat-form-row">
                  <div className="niat-form-group"><label>Learning Text</label><input type="text" value={trackForm.learningStatus} onChange={e => setTrackForm({...trackForm, learningStatus: e.target.value})} required /></div>
                  <div className="niat-form-group"><label>Learning %</label><input type="number" min="0" max="100" value={trackForm.learningProgress} onChange={e => setTrackForm({...trackForm, learningProgress: parseInt(e.target.value)||0})} required /></div>
                </div>
                <div className="niat-form-row">
                  <div className="niat-form-group"><label>Practice Text</label><input type="text" value={trackForm.practiceStatus} onChange={e => setTrackForm({...trackForm, practiceStatus: e.target.value})} required /></div>
                  <div className="niat-form-group"><label>Practice %</label><input type="number" min="0" max="100" value={trackForm.practiceProgress} onChange={e => setTrackForm({...trackForm, practiceProgress: parseInt(e.target.value)||0})} required /></div>
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

      {/* EVENT MODAL */}
      <AnimatePresence>
        {isEventModalOpen && (
          <div className="niat-modal-overlay">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="niat-modal-backdrop" onClick={() => setIsEventModalOpen(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="niat-modal" style={{ maxWidth: 440 }}>
              <div className="niat-modal-header"><h2>Add Event</h2><button onClick={() => setIsEventModalOpen(false)} className="niat-modal-close"><X size={18} /></button></div>
              <form id="event-form" onSubmit={handleSaveEvent} className="niat-modal-body">
                <div className="niat-form-group"><label>Event Title</label><input type="text" value={eventForm.title} onChange={e => setEventForm({...eventForm, title: e.target.value})} required /></div>
                <div className="niat-form-row">
                  <div className="niat-form-group"><label>Type</label><select value={eventForm.type} onChange={e => setEventForm({...eventForm, type: e.target.value as EventType})}>{EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                  <div className="niat-form-group"><label>Date/Time</label><input type="text" value={eventForm.date} onChange={e => setEventForm({...eventForm, date: e.target.value})} required placeholder="e.g. Apr 20" /></div>
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
    </div>
  );
};

export default Dashboard;
