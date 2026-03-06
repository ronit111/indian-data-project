import { usePersonalizationStore } from '../../store/personalizationStore.ts';

export function ClassroomModeToggle() {
  const classroomMode = usePersonalizationStore((s) => s.classroomMode);
  const setClassroomMode = usePersonalizationStore((s) => s.setClassroomMode);

  return (
    <div
      className="rounded-xl p-6"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-raised)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            Classroom Mode
          </h3>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
            Larger fonts and higher contrast for classroom projection
          </p>
        </div>
        <button
          role="switch"
          aria-checked={classroomMode}
          aria-label="Toggle classroom mode"
          onClick={() => setClassroomMode(!classroomMode)}
          className="relative w-12 h-7 rounded-full cursor-pointer transition-colors duration-200"
          style={{
            background: classroomMode ? 'var(--positive)' : 'var(--bg-raised)',
            border: 'none',
          }}
        >
          <span
            className="absolute top-1 left-1 w-5 h-5 rounded-full transition-transform duration-200"
            style={{
              background: 'var(--text-primary)',
              transform: classroomMode ? 'translateX(20px)' : 'translateX(0)',
            }}
          />
        </button>
      </div>
      {classroomMode && (
        <div
          className="rounded-lg px-3 py-2 text-xs"
          style={{ background: 'rgba(52,211,153,0.1)', color: 'var(--positive)' }}
        >
          Classroom mode is active. All pages now use larger fonts. You can also add
          {' '}<code className="font-mono">?classroom=true</code> to any URL.
        </div>
      )}
    </div>
  );
}
