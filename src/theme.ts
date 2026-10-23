export type ThemeMode = 'light' | 'dark'

export function currentTheme(): ThemeMode {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

export function toggleTheme(): ThemeMode {
  const next = currentTheme() === 'dark' ? 'light' : 'dark'
  document.documentElement.dataset.theme = next
  window.localStorage.setItem('brightcone-theme', next)
  return next
}

const savedTheme = window.localStorage.getItem('brightcone-theme')
if (savedTheme === 'light' || savedTheme === 'dark') {
  document.documentElement.dataset.theme = savedTheme
}
