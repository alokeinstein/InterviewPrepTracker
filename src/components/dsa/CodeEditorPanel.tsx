'use client';

import React, { useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';

interface CodeEditorPanelProps {
  code: string;
  onChange: (value: string) => void;
  language: 'javascript' | 'typescript' | 'python';
  readOnly?: boolean;
  onRun?: () => void;
  onSubmit?: () => void;
}

export function CodeEditorPanel({
  code,
  onChange,
  language,
  readOnly = false,
  onRun,
  onSubmit,
}: CodeEditorPanelProps) {
  const editorRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Instant layout update whenever container resizes from splitter dragging or window changes
  React.useEffect(() => {
    if (!containerRef.current || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => {
      if (editorRef.current) {
        editorRef.current.layout();
      }
    });
    observer.observe(containerRef.current);
    return () => {
      observer.disconnect();
    };
  }, []);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Keybindings:
    // Ctrl+Enter / Cmd+Enter: Run Tests
    // Ctrl+Shift+Enter / Cmd+Shift+Enter: Submit
    if (onRun) {
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
        onRun();
      });
    }

    if (onSubmit) {
      editor.addCommand(
        monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter,
        () => {
          onSubmit();
        }
      );
    }
  };

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-[#1e1e1e]">
      <Editor
        height="100%"
        width="100%"
        theme="vs-dark"
        language={language === 'typescript' ? 'typescript' : language === 'python' ? 'python' : 'javascript'}
        value={code}
        onChange={(val) => onChange(val || '')}
        onMount={handleEditorDidMount}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 13,
          fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, Monaco, Consolas, monospace",
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          bracketPairColorization: { enabled: true },
          cursorBlinking: 'smooth',
          smoothScrolling: true,
          padding: { top: 12, bottom: 12 },
          lineDecorationsWidth: 6,
          lineNumbersMinChars: 3,
          renderLineHighlight: 'all',
        }}
        loading={
          <div className="flex items-center justify-center h-full text-muted-foreground font-mono text-xs">
            Loading Code Editor...
          </div>
        }
      />
    </div>
  );
}
