export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-theme="light"
      className="grain-overlay min-h-screen"
      style={{
        background: [
          /* Blob 1 — rojo cálido, arriba-derecha (hero) */
          'radial-gradient(ellipse 70% 55% at 85% -8%, rgba(197,48,48,0.10) 0%, transparent 58%)',
          /* Blob 2 — dorado, abajo-izquierda */
          'radial-gradient(ellipse 60% 45% at -5% 88%, rgba(212,168,71,0.09) 0%, transparent 58%)',
          /* Blob 3 — rojo muy suave, centro-derecha (features) */
          'radial-gradient(ellipse 45% 35% at 100% 45%, rgba(197,48,48,0.05) 0%, transparent 52%)',
          /* Blob 4 — dorado, centro-izquierda */
          'radial-gradient(ellipse 50% 30% at 0% 55%, rgba(212,168,71,0.05) 0%, transparent 50%)',
          /* Blob 5 — rojo muy suave, abajo-centro (CTA) */
          'radial-gradient(ellipse 55% 30% at 50% 100%, rgba(197,48,48,0.06) 0%, transparent 55%)',
          /* Vignette sutil en bordes */
          'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 60%, rgba(188,176,160,0.18) 100%)',
          /* Base cream */
          '#F5F0E8',
        ].join(', '),
      }}
    >
      {children}
    </div>
  )
}
