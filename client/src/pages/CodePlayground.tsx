import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Play, RotateCcw } from 'lucide-react';

const LANGUAGES = ['JavaScript', 'Python', 'TypeScript', 'HTML/CSS'];

const STARTER_CODE: Record<string, string> = {
  'JavaScript': `// JavaScript Playground\nconsole.log("Hello from NIAT!");\n\nfunction fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}\n\nconsole.log("Fibonacci(10):", fibonacci(10));`,
  'Python': `# Python Playground\nprint("Hello from NIAT!")\n\ndef fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)\n\nprint("Fibonacci(10):", fibonacci(10))`,
  'TypeScript': `// TypeScript Playground\nconst greet = (name: string): string => {\n  return \`Hello, \${name} from NIAT!\`;\n};\n\nconsole.log(greet("Developer"));`,
  'HTML/CSS': `<!-- HTML/CSS Playground -->\n<div style="font-family: sans-serif; padding: 20px;">\n  <h1 style="color: #3b82f6;">Hello from NIAT!</h1>\n  <p>Start building your web project here.</p>\n</div>`,
};

const CodePlayground = () => {
  const [language, setLanguage] = useState('JavaScript');
  const [code, setCode] = useState(STARTER_CODE['JavaScript']);
  const [output, setOutput] = useState('');

  const handleRun = () => {
    if (language === 'JavaScript') {
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
      setOutput(`[${language}] execution is not available in browser.\nShowing preview only.`);
    }
  };

  const handleReset = () => {
    setCode(STARTER_CODE[language]);
    setOutput('');
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setCode(STARTER_CODE[lang]);
    setOutput('');
  };

  return (
    <div className="niat-layout">
      <Sidebar />
      <main className="niat-main" style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Toolbar */}
        <header className="niat-header">
          <div className="niat-header-left">
            <h1 className="niat-page-title">Code Playground</h1>
            <span className="niat-page-subtitle">Write, test and experiment with code</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleReset} className="niat-btn-outline" style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
              <RotateCcw size={14} /> Reset
            </button>
            <button onClick={handleRun} className="niat-btn-add" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Play size={14} /> Run
            </button>
          </div>
        </header>

        {/* Language tabs */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #e2e8f0', background: '#fff' }}>
          {LANGUAGES.map(lang => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              style={{
                padding: '10px 20px',
                fontSize: 13,
                fontWeight: language === lang ? 600 : 400,
                color: language === lang ? '#3b82f6' : '#64748b',
                background: 'transparent',
                border: 'none',
                borderBottom: language === lang ? '2px solid #3b82f6' : '2px solid transparent',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.15s',
              }}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* Editor + Output */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Code Editor */}
          <div style={{ flex: 1, minHeight: 0 }}>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              style={{
                width: '100%',
                height: '100%',
                padding: 20,
                background: '#1e1e2e',
                color: '#a6e3a1',
                border: 'none',
                outline: 'none',
                fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', monospace",
                fontSize: 14,
                lineHeight: 1.6,
                resize: 'none',
                whiteSpace: 'pre',
                overflowWrap: 'normal',
              }}
            />
          </div>

          {/* Output Panel */}
          <div style={{ 
            borderTop: '1px solid #334155',
            background: '#11111b',
            padding: 16,
            minHeight: 120,
            maxHeight: 200,
            overflowY: 'auto',
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#6c7086', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.05em' }}>
              Output
            </div>
            <pre style={{ 
              fontFamily: "'Fira Code', monospace",
              fontSize: 13,
              color: output.startsWith('Error') ? '#f38ba8' : '#cdd6f4',
              whiteSpace: 'pre-wrap',
              margin: 0,
            }}>
              {output || 'Click "Run" to execute your code...'}
            </pre>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CodePlayground;
