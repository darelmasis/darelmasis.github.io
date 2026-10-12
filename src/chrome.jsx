import { DmLogo } from './logos.jsx'

const WINDOW_COLORS = {
  close: 'bg-[#ff5f57] hover:bg-[#f5423a]',
  minimize: 'bg-[#febc2e] hover:bg-[#f0ad22]',
  expand: 'bg-[#28c840] hover:bg-[#22b438]',
}

export function WindowButtons() {
  const dot = 'block size-3 rounded-full transition-transform group-hover:scale-110'
  const colors = [WINDOW_COLORS.close, WINDOW_COLORS.minimize, WINDOW_COLORS.expand]

  return (
    <div aria-hidden="true" className="flex shrink-0 items-center gap-1">
      {colors.map((color) => (
        <span className="group rounded-full p-1" key={color}>
          <span className={`${dot} ${color}`} />
        </span>
      ))}
    </div>
  )
}

export function ClosedSession({ onReopen }) {
  return (
    <div className="terminal terminal-closed mx-auto w-full max-w-3xl rounded-lg px-6 py-10 text-center">
      <DmLogo className="mx-auto h-8 w-auto" />
      <p className="mt-4 font-mono text-sm">sesión cerrada</p>
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
