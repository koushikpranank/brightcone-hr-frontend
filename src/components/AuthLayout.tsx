import type { ReactNode } from 'react'

export function AuthLayout({
  title,
  subtitle = '',
  children,
}: {
  title: string
  subtitle?: string
  children: ReactNode
}) {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-5 py-10 text-white">
      <section className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        <a className="mb-8 block text-lg font-bold tracking-tight text-sky-300" href="/">
          brightcone.ai
        </a>
        <h1 className="text-3xl font-semibold">{title}</h1>
        <p className="mb-7 mt-2 text-sm leading-6 text-slate-300">{subtitle}</p>
        <div className="grid gap-4">{children}</div>
      </section>
    </main>
  )
}
