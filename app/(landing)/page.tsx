import type { Metadata } from 'next'
import { LandingHeader } from '@/features/landing/components/LandingHeader'
import { HeroSection } from '@/features/landing/components/HeroSection'
import { HowItWorksSection } from '@/features/landing/components/HowItWorksSection'
import { FeaturesSection } from '@/features/landing/components/FeaturesSection'
import { UseCasesSection } from '@/features/landing/components/UseCasesSection'
import { PricingSection } from '@/features/landing/components/PricingSection'
import { FaqSection } from '@/features/landing/components/FaqSection'
import { CtaSection } from '@/features/landing/components/CtaSection'
import { LandingFooter } from '@/features/landing/components/LandingFooter'

export const metadata: Metadata = {
  title: 'Luania — Tu tienda vende sola con IA | Ventas por Instagram y Facebook',
  description: 'Luania es el agente de ventas con inteligencia artificial para tiendas que venden por Instagram y Facebook. Responde clientes, cierra ventas y gestiona pedidos 24/7 — sin web, sin código.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Luania — Tu tienda vende sola con IA',
    description: 'El primer agente de ventas IA para tiendas que venden por Instagram y Facebook. Cierra ventas 24/7 automáticamente.',
    url: '/',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Luania — Agente de ventas IA para Instagram y Facebook',
      },
    ],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://luania.app/#organization',
      name: 'Luania',
      url: 'https://luania.app',
      logo: {
        '@type': 'ImageObject',
        url: 'https://luania.app/images/logo.png',
      },
      sameAs: [
        'https://www.instagram.com/luania.app',
      ],
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'PE',
        addressLocality: 'Lima',
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://luania.app/#website',
      url: 'https://luania.app',
      name: 'Luania',
      publisher: { '@id': 'https://luania.app/#organization' },
      inLanguage: 'es-PE',
    },
    {
      '@type': 'SoftwareApplication',
      name: 'Luania',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      url: 'https://luania.app',
      description: 'Agente de ventas con inteligencia artificial para tiendas que venden por Instagram y Facebook. Responde clientes, cierra ventas y gestiona pedidos 24/7.',
      publisher: { '@id': 'https://luania.app/#organization' },
      offers: [
        {
          '@type': 'Offer',
          name: 'Plan Básico',
          price: '29',
          priceCurrency: 'PEN',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: '29',
            priceCurrency: 'PEN',
            unitCode: 'MON',
          },
        },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: '¿Necesito saber programar?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. Creas tu cuenta en Luania, agregas tus productos, pegas tu @usuario de Instagram y autorizas con Meta. Si sabes usar Instagram, sabes usar Luania.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Cómo conecto mi Instagram o Facebook?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Desde el panel de Luania vas a "Canales", pegas tu @usuario o ID de página, y haces clic en "Conectar con Meta". El proceso toma menos de 30 segundos y no necesitas ningún código ni herramienta externa.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Cómo funcionan los planes y la comisión?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'El plan Básico (S/ 29/mes) cobra una comisión del 5% por cada venta cerrada a través de Luania. Los planes Pro y Premium no tienen comisión — pagas una tarifa fija mensual y te quedas con el 100% de tus ventas.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Hay límite de productos, mensajes o tiendas?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'El plan Básico permite hasta 100 productos, 1 canal y 1,000 mensajes IA por mes. El plan Pro y Premium son ilimitados en productos y mensajes. El plan Premium además permite múltiples tiendas y catálogos.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Y si el agente comete un error?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Luania aprende de cada conversación. Ante situaciones delicadas (quejas, reembolsos, pagos en disputa) el agente transfiere automáticamente a ti con un resumen completo. Tú siempre tienes el control y puedes intervenir en cualquier momento.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Qué pasa con los datos de mis clientes?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Todos los datos son tuyos. Luania no vende ni comparte tu información ni la de tus clientes con terceros. Cumplimos con la Ley 29733 de Protección de Datos Personales del Perú y puedes exportar o eliminar tus datos cuando quieras.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Puedo cancelar cuando quiera?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sí, sin contratos largos ni penalidades. Puedes cancelar, pausar o cambiar de plan en cualquier momento desde tu panel. Si cancelas, tu cuenta queda activa hasta el final del período pagado.',
          },
        },
      ],
    },
  ],
}

export default function LandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingHeader />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <FeaturesSection />
        <UseCasesSection />
        <PricingSection />
        <FaqSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </>
  )
}
