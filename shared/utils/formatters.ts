export function formatPrice(amount: number, currency = 'PEN'): string {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(date))
}

export function formatOrderCode(code: string): string {
  return code.toUpperCase()
}
