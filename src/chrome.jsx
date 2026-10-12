export function ThemeToggle({ onToggle, theme }) {
  const next = theme === 'dark' ? 'claro' : 'oscuro'

  return (
    <button
      aria-label={`Cambiar a modo ${next}`}
      className="terminal-toggle shrink-0 rounded-sm px-2 py-0.5 text-[11px] transition-colors"
      onClick={onToggle}
      type="button"
    >
      <span aria-hidden="true">{theme === 'dark' ? '\u2600' : '\u263e'}</span>
      <span className="hidden sm:inline"> {next}</span>
    </button>
  )
}

const WINDOW_COLORS = {
  close: 'bg-[#ff5f57] hover:bg-[#f5423a]',
  minimize: 'bg-[#febc2e] hover:bg-[#f0ad22]',
  expand: 'bg-[#28c840] hover:bg-[#22b438]',
}

export function WindowButtons({ expanded, minimized, onClose, onExpand, onMinimize }) {
  const press = 'group -m-2 rounded-full p-2'
  const dot = 'block size-3 rounded-full transition-transform group-hover:scale-110'

  return (
    <div className="flex shrink-0 items-center">
      <button
        aria-label="Cerrar la terminal"
        className={press}
        onClick={onClose}
        title="Cerrar"
        type="button"
      >
        <span className={`${dot} ${WINDOW_COLORS.close}`} />
      </button>
      <button
        aria-label={minimized ? 'Restaurar la terminal' : 'Minimizar la terminal'}
        className={press}
        onClick={onMinimize}
        title="Minimizar"
        type="button"
      >
        <span className={`${dot} ${WINDOW_COLORS.minimize}`} />
      </button>
      <button
        aria-label={expanded ? 'Reducir la terminal' : 'Expandir la terminal'}
        className={press}
        onClick={onExpand}
        title="Expandir"
        type="button"
      >
        <span className={`${dot} ${WINDOW_COLORS.expand}`} />
      </button>
    </div>
  )
}

export function ClosedSession({ onReopen }) {
  return (
    <div className="terminal terminal-closed mx-auto w-full max-w-3xl rounded-lg px-6 py-10 text-center">
      <p className="font-mono text-sm">sesión cerrada</p>
      <button
        className="terminal-closed-btn mt-4 rounded-sm px-3 py-1 font-mono text-[11px] transition-colors"
        onClick={onReopen}
        type="button"
      >
        abrir de nuevo
      </button>
    </div>
  )
}
