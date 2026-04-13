import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Play, Save, Trash2, Plus, Terminal, Settings, X, Check } from 'lucide-react';
import { useSnippets, Snippet } from '../hooks/useSnippets';

const CodePlayground = () => {
  const { snippets, addSnippet, updateSnippet, deleteSnippet, loading } = useSnippets();
  const [activeSnippet, setActiveSnippet] = useState<Snippet | null>(null);
  const [code, setCode] = useState('// Select or create a language to start coding');
  const [output, setOutput] = useState('');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [formData, setFormData] = useState({ title: '', color: '#3b82f6', language: 'javascript' });

  // Auto-select first snippet
  useEffect(() => {
    if (snippets.length > 0 && !activeSnippet) {
      setActiveSnippet(snippets[0]);
      setCode(snippets[0].code);
    }
  }, [snippets, activeSnippet]);

  const handleTabClick = (s: Snippet) => {
    setActiveSnippet(s);
    setCode(s.code);
    setOutput('');
  };

  const handleSaveCode = async () => {
    if (activeSnippet) {
      await updateSnippet(activeSnippet._id, { code });
    }
  };

  const handleRun = () => {
    if (!activeSnippet) return;
    
    if (activeSnippet.language === 'javascript') {
      try {
        const logs: string[] = [];
        const fakeConsole = { log: (...args: unknown[]) => logs.push(args.map(String).join(' ')) };
        const fn = new Function('console', code);
        fn(fakeConsole);
        setOutput(logs.join('\n'));
      } catch (err) {
        setOutput(`Error: ${err instanceof Error ? err.message : String(err)}`);
      }
    } else {
      setOutput(`[${activeSnippet.title}] execution is not available directly in browser.\nShowing preview only.`);
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    setFormData({ title: '', color: '#3b82f6', language: 'javascript' });
    setShowModal(true);
  };

  const openEditModal = (s: Snippet) => {
    setActiveSnippet(s);
    setModalMode('edit');
    setFormData({ title: s.title, color: s.color, language: s.language });
    setShowModal(true);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'add') {
      const newSnippet = await addSnippet({ 
        ...formData, 
        code: `// Welcome to ${formData.title}\nconsole.log("Hello NIAT!");` 
      });
      if (newSnippet) setActiveSnippet(newSnippet);
    } else if (activeSnippet) {
      await updateSnippet(activeSnippet._id, formData);
    }
    setShowModal(false);
  };

  return (
    <div className="niat-layout">
      <Sidebar />
      <main className="niat-main" style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Header Toolbar */}
        <header className="niat-header">
          <div className="niat-header-left">
            <h1 className="niat-page-title">Code Playground</h1>
            <span className="niat-page-subtitle">Dynamic Multi-Language IDE</span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleSaveCode} className="niat-btn-outline" style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Save size={14} /> Save Code
            </button>
            <button onClick={handleRun} className="niat-btn-add" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Play size={14} /> Run
            </button>
          </div>
        </header>

        {/* Dynamic Tabs Management */}
        <div style={{ display: 'flex', alignItems: 'center', background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 20px' }}>
          <div style={{ display: 'flex', flex: 1, overflowX: 'auto', gap: 2, scrollbarWidth: 'none' }}>
            {snippets.map(s => (
              <div 
                key={s._id}
                style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
              >
                <button
                  onClick={() => handleTabClick(s)}
                  style={{
                    padding: '14px 24px',
                    fontSize: 13,
                    fontWeight: activeSnippet?._id === s._id ? 700 : 500,
                    color: activeSnippet?._id === s._id ? s.color : '#64748b',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: activeSnippet?._id === s._id ? `3px solid ${s.color}` : '3px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {s.title}
                </button>
                {activeSnippet?._id === s._id && (
                  <div style={{ display: 'flex', gap: 4, paddingRight: 10 }}>
                    <button onClick={() => openEditModal(s)} style={{ border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer', padding: 4 }}>
                      <Settings size={12} />
                    </button>
                    <button onClick={() => deleteSnippet(s._id)} style={{ border: 'none', background: 'transparent', color: '#f87171', cursor: 'pointer', padding: 4 }}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <button 
            onClick={openAddModal}
            className="hover:bg-blue-50"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 6, 
              padding: '8px 16px', 
              border: '1px dashed #3b82f6', 
              borderRadius: 8, 
              color: '#3b82f6', 
              fontSize: 12, 
              fontWeight: 700,
              marginLeft: 16,
              cursor: 'pointer',
              background: 'transparent'
            }}
          >
            <Plus size={14} /> Add Language
          </button>
        </div>

        {/* Editor Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            style={{
              flex: 1,
              padding: 24,
              background: '#0d1117',
              color: '#e6edf3',
              border: 'none',
              outline: 'none',
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              fontSize: 15,
              lineHeight: 1.6,
              resize: 'none',
              whiteSpace: 'pre'
            }}
          />
          
          {/* Console */}
          <div style={{ height: 160, background: '#161b22', borderTop: '1px solid #30363d', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '6px 16px', display: 'flex', alignItems: 'center', gap: 8, background: '#0d1117' }}>
              <Terminal size={12} color="#8b949e" />
              <span style={{ fontSize: 10, fontWeight: 700, color: '#8b949e', textTransform: 'uppercase' }}>Console Output</span>
            </div>
            <div style={{ flex: 1, padding: 12, overflowY: 'auto' }}>
              <pre style={{ margin: 0, color: output.startsWith('Error') ? '#ff7b72' : '#79c0ff', fontSize: 13 }}>
                {output || 'No output generated yet.'}
              </pre>
            </div>
          </div>
        </div>

        {/* Management Modal */}
        {showModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyCenter: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', padding: 20 }}>
            <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 400, margin: 'auto', padding: 24, boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700 }}>{modalMode === 'add' ? 'New Language Profile' : 'Edit Language Profile'}</h2>
                <button onClick={() => setShowModal(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><X size={20} /></button>
              </div>
              <form onSubmit={handleModalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 6 }}>LANGUAGE NAME</label>
                  <input 
                    required 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g. C++, Java, Node.js"
                    style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 6 }}>UI COLOR</label>
                  <input 
                    type="color" 
                    value={formData.color} 
                    onChange={e => setFormData({...formData, color: e.target.value})}
                    style={{ width: '100%', height: 40, padding: 2, borderRadius: 8, border: '1px solid #e2e8f0' }}
                  />
                </div>
                <button type="submit" style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: 12, borderRadius: 10, fontWeight: 700, cursor: 'pointer', marginTop: 8 }}>
                  {modalMode === 'add' ? 'Create Language' : 'Update Settings'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CodePlayground;
