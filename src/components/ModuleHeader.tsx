export function ModuleHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="grid gap-1">
      <h1 className="text-2xl font-bold tracking-tight text-slate-100">{title}</h1>
      <p className="text-sm text-slate-400">{subtitle}</p>
    </header>
  )
}
