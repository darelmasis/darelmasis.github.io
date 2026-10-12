import { useEffect, useState } from 'react'

/**
 * Tema claro/oscuro.
 *
 * El primer pintado lo decide un script inline en index.html (para que no haya
 * destello); aquí sólo se lee lo que ya está aplicado y se mantiene en sincronía.
 * La clase `dark` vive en <html> y es la que activa los `dark:` de Tailwind.
 */

const STORAGE_KEY = 'theme'
const THEMES = ['light', 'dark']

const rootElement = () => document.documentElement

export function storedTheme() {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return THEMES.includes(value) ? value : null
  } catch {
    return null
  }
}

export function systemTheme() {
  return window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light'
}

export function currentTheme() {
  return rootElement().classList.contains('dark') ? 'dark' : 'light'
}

function paint(theme) {
  const dark = theme === 'dark'
  rootElement().classList.toggle('dark', dark)
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', dark ? '#121212' : '#f5f5f5')
}

export function useTheme() {
  const [theme, setTheme] = useState(currentTheme)

  // Si no hay elección guardada, el tema sigue al sistema mientras la página está abierta.
  useEffect(() => {
    if (storedTheme()) return

    const media = window.matchMedia?.('(prefers-color-scheme: dark)')
    if (!media) return

    const onChange = () => setTheme(systemTheme())
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    paint(theme)
  }, [theme])

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Modo privado o almacenamiento bloqueado: el tema se aplica igual, sin recordar.
    }
    setTheme(next)
  }

  return { theme, toggle }
}
