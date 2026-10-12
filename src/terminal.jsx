import { useCallback, useEffect, useRef, useState } from 'react'
import { ClosedSession, WindowButtons } from './chrome.jsx'
import { COMMANDS, out, runCommand } from './commands.js'
import { highlightShell } from './highlight.js'
import { Line, Prompt, Tokens } from './line.jsx'
import { DmLogo } from './logos.jsx'

const BOOT_COMMANDS = ['whoami', 'links']
const TYPE_SPEED = 55
const SKIP = Symbol('skip')
const CANCELLED = Symbol('cancelled')

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

let lineId = 0
const withIds = (lines) => lines.map((line) => ({ ...line, id: ++lineId }))

function bootRecords() {
  const stamp = new Date().toLocaleString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  })

  return [
    { intro: [out.muted(`Último acceso: ${stamp} en ttys001`), out.blank()] },
    ...BOOT_COMMANDS.map((input) => ({
      input,
      output: runCommand(input).output,
    })),
    {
      intro: [out.blank(), out.muted('Escribe "help" y pulsa Enter para explorar.')],
    },
  ]
}

const bootLines = () =>
  bootRecords().flatMap((record) =>
    record.intro ? record.intro : [out.command(record.input), ...record.output],
  )

export function Terminal() {
  const reduced = prefersReducedMotion()
  const [lines, setLines] = useState(() => (reduced ? withIds(bootLines()) : []))
  const [typing, setTyping] = useState('')
  const [booted, setBooted] = useState(reduced)
  const [value, setValue] = useState('')
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [view, setView] = useState('open')

  const inputRef = useRef(null)
  const screenRef = useRef(null)
  const skipRef = useRef(false)

  useEffect(() => {
    if (booted) return

    let cancelled = false
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
    const wait = async (ms) => {
      if (skipRef.current) throw SKIP
      await sleep(ms)
      if (cancelled) throw CANCELLED
    }

    const run = async () => {
      await wait(500)

      for (const record of bootRecords()) {
        if (record.intro) {
          setLines((previous) => [...previous, ...withIds(record.intro)])
          await wait(320)
          continue
        }

        for (let index = 1; index <= record.input.length; index += 1) {
          setTyping(record.input.slice(0, index))
          await wait(TYPE_SPEED)
        }

        await wait(220)
        setTyping('')
        setLines((previous) => [
          ...previous,
          ...withIds([out.command(record.input), ...record.output]),
        ])
        await wait(420)
      }
    }

    run()
      .catch((error) => {
        if (error === CANCELLED) return
        if (error !== SKIP) throw error
        if (!cancelled) {
          setTyping('')
          setLines(withIds(bootLines()))
        }
      })
      .finally(() => {
        if (cancelled) return
        setTyping('')
        setBooted(true)
      })

    return () => {
      cancelled = true
    }
  }, [booted])

  useEffect(() => {
    if (booted) return
    const skip = () => {
      skipRef.current = true
    }
    window.addEventListener('keydown', skip)
    window.addEventListener('pointerdown', skip)
    return () => {
      window.removeEventListener('keydown', skip)
      window.removeEventListener('pointerdown', skip)
    }
  }, [booted])

  useEffect(() => {
    if (!booted) return
    if (!window.matchMedia?.('(pointer: fine)').matches) return
    inputRef.current?.focus()
  }, [booted])

  useEffect(() => {
    const screen = screenRef.current
    if (!screen) return
    screen.scrollTop = screen.scrollHeight
  }, [lines, typing, booted])

  const submit = useCallback((raw) => {
    setValue('')
    setHistoryIndex(-1)

    const trimmed = raw.trim()
    if (!trimmed) return

    setHistory((previous) => [...previous, trimmed])

    const result = runCommand(trimmed)
    if (result.clear) {
      setLines([])
      return
    }
    if (result.close) {
      setView('closed')
      return
    }

    setLines((previous) => [...previous, ...withIds([out.command(raw), ...result.output])])
  }, [])

  const onKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      submit(value)
      return
    }

    if (event.key === 'l' && event.ctrlKey) {
      event.preventDefault()
      setLines([])
      return
    }

    if (event.key === 'Tab') {
      if (event.shiftKey) return
      const partial = value.trim().toLowerCase()
      if (!partial) return

      event.preventDefault()
      const matches = COMMANDS.filter((command) => command.startsWith(partial))
      if (matches.length === 1) setValue(`${matches[0]} `)
      else if (matches.length > 1) {
        setLines((previous) => [
          ...previous,
          ...withIds([out.command(value), out.muted(matches.join('   '))]),
        ])
      }
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (!history.length) return
      const next = historyIndex < 0 ? history.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(next)
      setValue(history[next])
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (historyIndex < 0) return
      const next = historyIndex + 1
      if (next >= history.length) {
        setHistoryIndex(-1)
        setValue('')
        return
      }
      setHistoryIndex(next)
      setValue(history[next])
    }
  }

  const focusInput = (event) => {
    if (!booted) return
    if (event.target.closest('a, button')) return
    inputRef.current?.focus()
  }

  const reopen = () => {
    setView('open')
    inputRef.current?.focus()
  }

  if (view === 'closed') {
    return <ClosedSession onReopen={reopen} />
  }

  return (
    <div
      aria-label="Terminal interactiva"
      className="terminal relative mx-auto w-full max-w-3xl overflow-hidden rounded-lg border"
      role="region"
    >
      <div className="terminal-bar flex h-10 items-center gap-4 px-4">
        <WindowButtons />
        <p className="terminal-status min-w-0 flex-1 truncate text-center text-[11px] sm:text-xs">
          <DmLogo className="mr-2 inline-block h-3.5 w-auto align-[-0.12em] text-[var(--term-fg-strong)] sm:h-4" />
          {/* <span className="terminal-title">{promptUser}</span> — zsh */}
        </p>
        <p className="terminal-status hidden shrink-0 text-[11px] sm:block">
          {booted ? 'listo' : 'pulsa cualquier tecla para saltar'}
        </p>
      </div>

      <div
        className="terminal-screen h-[58vh] max-h-[560px] min-h-[360px] overflow-y-auto px-4 py-4 text-[12.5px] leading-6 sm:px-6 sm:text-[13.5px]"
        onClick={focusInput}
        ref={screenRef}
      >
        <div aria-live="polite" className="space-y-0.5 [overflow-wrap:anywhere]">
          {lines.map((line) => (
            <Line key={line.id} line={line} />
          ))}
        </div>

        {typing ? (
          <div aria-hidden="true" className="flex flex-wrap items-center [overflow-wrap:anywhere]">
            <Prompt />
            <span className="min-w-0">
              <Tokens tokens={highlightShell(typing, COMMANDS)} />
              <span className="terminal-caret">▌</span>
            </span>
          </div>
        ) : null}

        {booted ? (
          <form
            className="flex items-center"
            onSubmit={(event) => {
              event.preventDefault()
              submit(value)
            }}
          >
            <Prompt />
            <span className="relative min-w-0 flex-1">
              <input
                aria-label="Escribe un comando y pulsa Enter"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
                className="absolute inset-0 h-full w-full bg-transparent text-transparent caret-transparent outline-none"
                onChange={(event) => {
                  setValue(event.target.value)
                  setHistoryIndex(-1)
                }}
                onKeyDown={onKeyDown}
                ref={inputRef}
                spellCheck={false}
                type="text"
                value={value}
              />
              <span aria-hidden="true" className="block break-all whitespace-pre-wrap">
                <Tokens tokens={highlightShell(value, COMMANDS)} />
                <span className="terminal-caret">█ </span>
              </span>
            </span>
          </form>
        ) : null}
      </div>
    </div>
  )
}
