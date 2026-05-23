'use client'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'next-themes'
import { store } from '@/shared/store/store'
import { ToastProvider } from '@/shared/components/ui/Toast'
import { ErrorBoundary } from '@/shared/components/ErrorBoundary'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ToastProvider>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </ToastProvider>
      </ThemeProvider>
    </Provider>
  )
}
