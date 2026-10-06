'use client'

/* PROTOTYPE — the deck, as the layer you dig into from a board tile. */

import { useCallback, useEffect, useRef } from 'react'
import { ArrowLeft, ArrowRight, Check, CornerDownRight, X } from 'lucide-react'
import { prefersReducedMotion } from '@/lib/gsap'
import type { CaseFile } from '../case-file-data'
import { firstWords, SEEN } from './journey-parts'

/**
 * The deck is no longer a section — it is the detail layer.
 *
 * Opening a tile could have expanded it in place, and that is what the board
 * prototype did. A takeover is better here for one reason: once you are
 * reading evidence you should be able to keep going with an arrow key and
 * never return to the grid until you choose to. In place, the next file is
 * wherever the grid happens to put it; in the overlay, next is always next.
 *
 * Esc and the backdrop both close it, and focus returns to the tile that
 * opened it — otherwise a keyboard user lands back at the top of the page.
 */
export function DeckOverlay({
  files,
  index,
  seen,
  lastOne,
  onIndex,
  onClose,
}: {
  files: CaseFile[]
  index: number
  seen: Set<string>
  /** True when this card was the last sealed one — closing moves on. */
  lastOne: boolean
  onIndex: (next: number) => void
  onClose: () => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const dirRef = useRef(1)
  const file = files[index]

  const go = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(files.length - 1, next))
      if (clamped === index) return
      dirRef.current = clamped > index ? 1 : -1
      onIndex(clamped)
    },
    [files.length, index, onIndex]
  )

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') go(index + 1)
      if (event.key === 'ArrowLeft') go(index - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, index, onClose])

  /**
   * Own the screen properly.
   *
   * `aria-modal="true"` is a claim, not a behaviour: it was measured letting
   * focus tab straight through to the tiles underneath. So the close button
   * takes focus on open, Tab is cycled inside the dialog, and the rest of the
   * page is marked inert for assistive technology as well as the pointer.
   */
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const root = document.getElementById('__next') ?? document.body
    const siblings = Array.from(root.children).filter(
      node => !node.contains(cardRef.current)
    )
    siblings.forEach(node => node.setAttribute('aria-hidden', 'true'))

    closeRef.current?.focus()

    const onTab = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      const scope = cardRef.current?.parentElement
      if (!scope) return
      const focusable = scope.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
      )
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onTab)

    return () => {
      document.body.style.overflow = previousOverflow
      siblings.forEach(node => node.removeAttribute('aria-hidden'))
      document.removeEventListener('keydown', onTab)
    }
  }, [])

  useEffect(() => {
    const card = cardRef.current
    if (!card || prefersReducedMotion()) return
    card.animate(
      [
        {
          opacity: 0,
          transform: `translate3d(${dirRef.current * 24}px, 0, 0) scale(.98)`,
        },
        { opacity: 1, transform: 'none' },
      ],
      { duration: 380, easing: 'cubic-bezier(.16,.84,.26,1)' }
    )
  }, [index])

  const touch = useRef<{ x: number; y: number } | null>(null)

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={file.title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 py-10 backdrop-blur-md sm:px-6"
      onClick={event => event.target === event.currentTarget && onClose()}
      onTouchStart={e =>
        (touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY })
      }
      onTouchEnd={e => {
        const start = touch.current
        if (!start) return
        const dx = e.changedTouches[0].clientX - start.x
        const dy = e.changedTouches[0].clientY - start.y
        if (Math.abs(dx) > 56 && Math.abs(dx) > Math.abs(dy)) {
          go(index + (dx < 0 ? 1 : -1))
        }
        touch.current = null
      }}
    >
      <div className="w-full max-w-3xl">
        <article
          ref={cardRef}
          className="relative rounded-[1.25rem] border border-white/15 bg-white/[0.07] p-7 backdrop-blur-xl sm:p-10 md:p-12"
        >
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-5 right-5 rounded-full border border-white/15 p-2 text-white/60 transition-colors hover:border-(--accent) hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="mb-7 flex flex-wrap items-center gap-3 pr-12">
            <span className="font-mono text-[11px] tracking-[0.18em] text-white/45 uppercase">
              {String(index + 1).padStart(2, '0')} / {files.length}
            </span>
            {file.tag && (
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold ${
                  file.isMatch
                    ? 'bg-(--accent) text-white'
                    : 'border border-white/20 text-white/70'
                }`}
              >
                {file.isMatch && (
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                )}
                {file.tag}
              </span>
            )}
          </div>

          <h3 className="font-display text-[1.6rem] leading-[1.14] font-bold tracking-tight text-white sm:text-3xl md:text-[2.4rem]">
            {file.title}
          </h3>

          {file.stat && (
            <div className="mt-7 flex items-baseline gap-4 border-l-2 border-(--accent) pl-4">
              <span className="font-display text-3xl font-bold text-white md:text-4xl">
                {file.stat.value}
              </span>
              <span className="text-sm text-white/55">{file.stat.label}</span>
            </div>
          )}

          <p className="mt-7 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
            {file.body}
          </p>

          {lastOne && (
            <p
              className="mt-8 flex items-center gap-2 text-sm font-semibold"
              style={{ color: SEEN.text }}
            >
              <Check className="h-4 w-4" />
              That is all {files.length}. Close this and I will take you to
              where I stop short.
            </p>
          )}

          {!lastOne && file.related.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {file.related.map(id => {
                const other = files.find(f => f.id === id)
                if (!other) return null
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => go(files.indexOf(other))}
                    className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/70 transition-colors hover:border-(--accent) hover:text-white"
                  >
                    <CornerDownRight className="h-3 w-3 shrink-0 text-(--accent)" />
                    <span className="truncate">
                      {firstWords(other.title, 7)}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </article>

        <div className="mt-5 flex items-center gap-3">
          <button
            type="button"
            onClick={() => go(index - 1)}
            disabled={index === 0}
            aria-label="Previous"
            className="rounded-full border border-white/20 p-2.5 text-white/70 transition-colors hover:border-(--accent) hover:text-white disabled:opacity-25"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            disabled={index === files.length - 1}
            aria-label="Next"
            className="rounded-full border border-white/20 p-2.5 text-white/70 transition-colors hover:border-(--accent) hover:text-white disabled:opacity-25"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
          <span className="hidden font-mono text-[11px] text-white/35 sm:block">
            ← → to move · esc to close
          </span>
          <span className="ml-auto font-mono text-[11px] text-white/35">
            {seen.size} / {files.length} opened
          </span>
        </div>
      </div>
    </div>
  )
}
