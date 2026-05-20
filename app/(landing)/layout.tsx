export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-theme="light" className="min-h-screen" style={{ backgroundColor: 'var(--color-cream)' }}>
      {children}
    </div>
  )
}
