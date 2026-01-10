export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 h-16 flex items-center justify-between px-8 glass-panel border-b border-[var(--border-subtle)]">
      <div className="flex items-center gap-3">
        <div className="w-2 h-8 bg-blue-600 rounded-full" />
        <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
          Human State<span className="font-light text-[var(--text-secondary)]">Exploitation Scoring</span>
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-[var(--text-secondary)]">Powered by</span>
        <span className="text-lg font-bold text-black tracking-wide">ZERON</span>
      </div>
    </nav>
  );
}
