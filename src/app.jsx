import { profile } from './profile.js'
import { Terminal } from './terminal.jsx'

export function App() {
  const year = new Date().getFullYear()

  return (
    <div className="relative min-h-screen overflow-hidden bg-neutral-100 font-mono text-neutral-800 antialiased dark:bg-[#121212] dark:text-neutral-200">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.95),transparent_60%),radial-gradient(circle_at_50%_100%,rgba(255,255,255,0.55),transparent_55%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.07),transparent_60%),radial-gradient(circle_at_50%_100%,rgba(255,255,255,0.04),transparent_55%)]"
      />

      <main className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center gap-6 px-4 py-10 sm:px-6">
        <h1 className="sr-only">
          {profile.name} — {profile.role}
        </h1>

        <Terminal />

        <footer className="relative mx-auto flex w-full max-w-3xl flex-col items-center justify-between gap-3 text-[11px] text-neutral-500 sm:flex-row sm:text-xs dark:text-neutral-400">
          <p>
            © {year} {profile.name}. Hecho con intención.
          </p>
          <nav aria-label="Redes sociales" className="flex gap-5">
            {profile.socials.map((social) => (
              <a
                className="text-neutral-600 underline-offset-4 transition-colors hover:text-neutral-900 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 dark:focus-visible:outline-neutral-100"
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
