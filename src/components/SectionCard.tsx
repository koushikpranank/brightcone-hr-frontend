import type { ReactNode } from 'react'

export function SectionCard({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: ReactNode
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80">
      <header className="border-b border-slate-800 px-5 py-4">
        <h2 className="font-semibold text-slate-100">{title}</h2>
        {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
      </header>
      <div className="p-5">{children}</div>
    </section>
  )
}
