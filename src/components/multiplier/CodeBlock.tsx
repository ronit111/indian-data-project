import { useState } from 'react';

interface CodeBlockProps {
  code: string;
  language: string;
  copyable?: boolean;
}

export function CodeBlock({ code, language, copyable = true }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative rounded-xl overflow-hidden" style={{ background: 'var(--bg-raised)' }}>
      <div
        className="flex items-center justify-between px-4 py-2 text-xs"
        style={{ background: 'var(--bg-hover)', color: 'var(--text-muted)' }}
      >
        <span className="font-mono uppercase tracking-wider">{language}</span>
        {copyable && (
          <button
            onClick={handleCopy}
            className="px-2 py-0.5 rounded text-xs transition-colors cursor-pointer"
            style={{
              color: copied ? 'var(--positive)' : 'var(--text-secondary)',
              background: 'transparent',
              border: 'none',
            }}
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>
      <pre className="p-4 overflow-x-auto text-sm leading-relaxed" style={{ margin: 0 }}>
        <code className="font-mono" style={{ color: 'var(--text-secondary)' }}>
          {code}
        </code>
      </pre>
    </div>
  );
}
