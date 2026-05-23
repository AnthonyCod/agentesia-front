'use client'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  page: number
  pageSize: number
  total: number
  onPage: (p: number) => void
}

export function Pagination({ page, pageSize, total, onPage }: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize)
  if (totalPages <= 1) return null

  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  return (
    <div className="flex items-center justify-between gap-2 px-1 pt-1">
      <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
        {from}–{to} de {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page <= 1}
          aria-label="Página anterior"
          className="icon-btn-hover flex h-8 w-8 items-center justify-center rounded-lg transition-colors disabled:opacity-40"
          style={{ color: 'var(--color-ink)' }}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          let p: number
          if (totalPages <= 5) {
            p = i + 1
          } else if (page <= 3) {
            p = i + 1
          } else if (page >= totalPages - 2) {
            p = totalPages - 4 + i
          } else {
            p = page - 2 + i
          }
          return (
            <button
              key={p}
              onClick={() => onPage(p)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-all"
              style={{
                backgroundColor: p === page ? 'var(--color-primary)' : 'transparent',
                color: p === page ? '#fff' : 'var(--color-ink)',
              }}
            >
              {p}
            </button>
          )
        })}

        <button
          onClick={() => onPage(page + 1)}
          disabled={page >= totalPages}
          aria-label="Página siguiente"
          className="icon-btn-hover flex h-8 w-8 items-center justify-center rounded-lg transition-colors disabled:opacity-40"
          style={{ color: 'var(--color-ink)' }}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
