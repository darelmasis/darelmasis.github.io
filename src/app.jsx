import { profile } from './profile.js'
import { DarelLogo } from './logos.jsx'
import { Terminal } from './terminal.jsx'

export function App() {
  const year = new Date().getFullYear()

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#121212] font-mono text-neutral-200 antialiased">
      <main className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center gap-6 px-4 py-10 sm:px-6">
        <h1 className="sr-only">
          {profile.name} — {profile.role}
        </h1>

        <Terminal />

        <footer className="relative mx-auto flex w-full max-w-4xl flex-col items-center justify-between gap-3 text-[11px] text-neutral-400 sm:flex-row sm:text-xs">
          <p className="flex items-center gap-2.5">
            <DarelLogo className="h-3 w-auto sm:h-3.5" />
            <span>• {year} • Hecho con intención.</span>
          </p>
          <nav aria-label="Redes sociales" className="flex gap-5">
            {profile.socials.map((social) => (
              <a
                className="text-neutral-400 underline underline-offset-2 transition-colors hover:text-neutral-100 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-100"
                href={social.url}
                key={social.id}
                rel="noopener noreferrer"
                target="_blank"
              >
                {social.label}
              </a>
            ))}
          </nav>
        </footer>
      </main>
    </div>
  )
}
