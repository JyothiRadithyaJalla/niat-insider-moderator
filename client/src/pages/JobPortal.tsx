import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { 
  Briefcase, MapPin, Clock, ExternalLink, Plus, Search, 
  Building2, Users, DollarSign, Calendar, ChevronRight,
  Edit3, Trash2, X, Check, AlertTriangle, Building
} from 'lucide-react';
import { useJobs } from '../hooks/useJobs';
import { Job, JobType, JobStatus } from '../types/job.types';
import { AnimatePresence, motion } from 'framer-motion';
import { format } from 'date-fns';

const TABS = [
  { id: 'all', label: 'All Listings' },
  { id: JobStatus.OPEN, label: 'Open To Apply' },
  { id: JobStatus.HIRING_DONE, label: 'Hiring Done' },
  { id: JobStatus.CLOSED, label: 'Previous Internships' }
];

const JobPortal = () => {
  const { jobs, loading, addJob, editJob, deleteJob } = useJobs();
  
  /* State */
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  /* Form State */
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    stipend: '',
    openings: 1,
    applyBy: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    type: JobType.INTERNSHIP,
    status: JobStatus.OPEN
  });

  const filteredJobs = jobs.filter(j => {
    const matchesTab = activeTab === 'all' || j.status === activeTab;
    const matchesSearch = j.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         j.company.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleOpenAdd = () => {
    setSelectedJob(null);
    setFormData({
      title: '',
      company: '',
      location: '',
      stipend: '',
      openings: 1,
      applyBy: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      type: JobType.INTERNSHIP,
      status: JobStatus.OPEN
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (j: Job) => {
    setSelectedJob(j);
    setFormData({
      title: j.title,
      company: j.company,
      location: j.location,
      stipend: j.stipend,
      openings: j.openings,
      applyBy: format(new Date(j.applyBy), "yyyy-MM-dd'T'HH:mm"),
      type: j.type,
      status: j.status
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = selectedJob 
      ? await editJob(selectedJob._id, formData)
      : await addJob(formData);
    if (success) setIsModalOpen(false);
  };

  const confirmDelete = async () => {
    if (selectedJob && await deleteJob(selectedJob._id)) {
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="niat-layout">
      <Sidebar />
      <main className="niat-main" style={{ backgroundColor: '#fcfcfe' }}>
        
        {/* Header Section */}
        <header className="niat-jobs-header">
          <h1 className="niat-page-title" style={{ fontSize: 22, color: '#161e38' }}>Jobs Board</h1>
          <div className="niat-jobs-subtitle">
            <Building size={18} />
            <span>2000+ Companies Hired CCBPians</span>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="niat-tabs">
          {TABS.map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`niat-tab ${activeTab === tab.id ? 'niat-tab--active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <button onClick={handleOpenAdd} className="niat-btn-add" style={{ marginBottom: 8 }}>
            <Plus size={16} />
            <span>Add Listing</span>
          </button>
        </div>

        {/* Search Bar Area */}
        <div className="niat-controls" style={{ background: 'transparent', borderBottom: 'none' }}>
          <div className="niat-search-box" style={{ maxWidth: '100%', borderRadius: 10 }}>
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search by role or company..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Content Grid */}
        <div className="niat-jobs-grid">
          {loading ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '100px 0' }}>
              <div className="niat-spinner" style={{ margin: '0 auto 16px' }}></div>
              <p style={{ color: '#64748b' }}>Fetching career opportunities...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '100px 0' }}>
              <Briefcase size={48} color="#cbd5e1" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ color: '#1e293b' }}>No opportunities found</h3>
              <p style={{ color: '#64748b' }}>Try changing the filters or search term.</p>
            </div>
          ) : (
            filteredJobs.map(job => (
              <motion.div 
                layout
                key={job._id}
                className="niat-job-card"
              >
                {/* Actions Overlay */}
                <div className="niat-job-actions">
                  <button onClick={() => handleOpenEdit(job)} className="niat-action-btn edit" title="Edit"><Edit3 size={14} /></button>
                  <button onClick={() => { setSelectedJob(job); setIsDeleteModalOpen(true); }} className="niat-action-btn delete" title="Delete"><Trash2 size={14} /></button>
                </div>

                <div className="niat-job-card-header">
                  <div>
                    <div className="niat-job-company">{job.company}</div>
                    <h3 className="niat-job-title">{job.title}</h3>
                  </div>
                  <div className="niat-job-logo">
                    <Building2 size={24} color="#6366f1" />
                  </div>
                </div>

                <div className="niat-job-details">
                  <div className="niat-job-detail-item">
                    <div className="niat-detail-label"><MapPin size={12} /> Location</div>
                    <div className="niat-detail-value">{job.location}</div>
                  </div>
                  <div className="niat-job-detail-item">
                    <div className="niat-detail-label"><DollarSign size={12} /> Stipend</div>
                    <div className="niat-detail-value">{job.stipend}</div>
                  </div>
                  <div className="niat-job-detail-item">
                    <div className="niat-detail-label"><Users size={12} /> Openings</div>
                    <div className="niat-detail-value">{job.openings}</div>
                  </div>
                </div>

                <div className="niat-job-detail-item">
                  <div className="niat-detail-label"><Clock size={12} /> Apply By</div>
                  <div className="niat-detail-value">{format(new Date(job.applyBy), "d MMM yy, hh:mm a")}</div>
                </div>

                <div className="niat-job-footer">
                  <div className={`niat-job-status niat-status--${job.status.toLowerCase().replace(' ', '-')}`}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'currentColor' }}></span>
                    {job.status}
                  </div>
                  <button className="niat-job-view-btn">
                    View Details <ChevronRight size={16} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>

      {/* ══════════════ MODALS ══════════════ */}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="niat-modal-overlay">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="niat-modal-backdrop" onClick={() => setIsModalOpen(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="niat-modal">
              <div className="niat-modal-header">
                <h2>{selectedJob ? 'Edit Job Listing' : 'New Job Listing'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="niat-modal-close"><X size={18} /></button>
              </div>
              <form id="job-form" onSubmit={handleSave} className="niat-modal-body">
                <div className="niat-form-row">
                  <div className="niat-form-group"><label>Role / Title</label><input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required placeholder="e.g. MERN Intern" /></div>
                  <div className="niat-form-group"><label>Company</label><input type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} required placeholder="e.g. Nxtwave" /></div>
                </div>
                <div className="niat-form-row">
                  <div className="niat-form-group"><label>Location</label><input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required placeholder="e.g. Hyderabad" /></div>
                  <div className="niat-form-group"><label>Stipend</label><input type="text" value={formData.stipend} onChange={e => setFormData({...formData, stipend: e.target.value})} required placeholder="e.g. Up to 15K/month" /></div>
                </div>
                <div className="niat-form-row">
                  <div className="niat-form-group"><label>Openings</label><input type="number" value={formData.openings} onChange={e => setFormData({...formData, openings: parseInt(e.target.value)||1})} required min="1" /></div>
                  <div className="niat-form-group"><label>Apply By</label><input type="datetime-local" value={formData.applyBy} onChange={e => setFormData({...formData, applyBy: e.target.value})} required /></div>
                </div>
                <div className="niat-form-row">
                  <div className="niat-form-group">
                    <label>Type</label>
                    <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as JobType})}>
                      {Object.values(JobType).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="niat-form-group">
                    <label>Status</label>
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as JobStatus})}>
                      {Object.values(JobStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </form>
              <div className="niat-modal-footer">
                <button onClick={() => setIsModalOpen(false)} className="niat-btn-outline">Cancel</button>
                <button type="submit" form="job-form" className="niat-btn-add"><Check size={16} /><span>{selectedJob ? 'Update Listing' : 'Post Listing'}</span></button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="niat-modal-overlay">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="niat-modal-backdrop" onClick={() => setIsDeleteModalOpen(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="niat-modal niat-modal--sm">
              <div className="niat-delete-icon"><AlertTriangle size={24} /></div>
              <h2 className="niat-delete-title">Remove Listing?</h2>
              <p className="niat-delete-desc">Are you sure you want to delete <strong>"{selectedJob?.title}"</strong> at <strong>{selectedJob?.company}</strong>?</p>
              <div className="niat-delete-actions">
                <button onClick={() => setIsDeleteModalOpen(false)} className="niat-btn-outline">Cancel</button>
                <button onClick={confirmDelete} className="niat-btn-delete"><Trash2 size={15} /><span>Remove</span></button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default JobPortal;
