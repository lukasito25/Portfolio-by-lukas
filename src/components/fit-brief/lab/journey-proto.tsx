'use client'

/* PROTOTYPE — the composed concept, end to end. */

import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, Check, ChevronDown } from 'lucide-react'
import type { FitBriefContent } from '@/lib/fit-brief/schema'
import { prefersReducedMotion } from '@/lib/gsap'
import { buildCaseFile, flattenFiles, type CaseFile } from '../case-file-data'
import {
  ChapterCard,
  ChapterBar,
  NUMERALS,
  firstWords,
  SEEN,
} from './journey-parts'
import { DeckOverlay } from './deck-overlay'

/**
 * One page, four movements, each in the form its content deserves.
 *
 * The funnel, rather than a format per content type: the reel opens with the
 * three strongest claims and asks nothing of the reader, the board then hands
 * over control with everything visible at once, and the deck is the layer
 * they dig into from any tile. The gap gets a screen to itself because an
 * honest limitation read in passing is not read at all.
 *
 * Scroll is the only way through. Every format reacts to arriving rather than
 * trapping the reader in it, so someone who scrolls past the whole thing still
 * reaches the close — which is the guarantee that makes exploration optional.
 */
export function JourneyProto({
  content,
  slug,
  ground,
}: {
  content: FitBriefContent
  slug: string
  /** The stage colour, so a chapter card can blot the footage out. */
  ground: string
}) {
  const groups = useMemo(() => buildCaseFile(content), [content])
  const all = useMemo(() => flattenFiles(groups), [groups])

  /**
   * The files the board actually deals in.
   *
   * The gap has its own movement and is deliberately not a tile, so counting
   * it here would make the set uncompletable — "17 / 18 opened" forever, and
   * the advance to the finale would never fire. It did exactly that until the
   * board was tested to the end rather than to the fourth tile.
   */
  const files = useMemo(() => all.filter(f => f.group !== 'gap'), [all])

  /**
   * The three the reel opens with.
   *
   * Direct matches that carry a figure, because a number is what lands in the
   * second a screen is given. Topped up with the remaining direct matches if
   * fewer than three have one, so the opening is never short.
   */
  const opening = useMemo(() => {
    const withStat = files.filter(f => f.isMatch && f.stat)
    const rest = files.filter(f => f.isMatch && !f.stat)
    return [...withStat, ...rest].slice(0, 3)
  }, [files])

  /**
   * What the board deals in: everything the reel has not already shown in
   * full. Tiles 01–03 used to replay the three screens the reader finished
   * thirty seconds earlier, which is the moment a sceptical reader decides
   * the interaction is decorative.
   */
  const board = useMemo(
    () => files.filter(f => !opening.some(o => o.id === f.id)),
    [files, opening]
  )

  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [seen, setSeen] = useState<Set<string>>(new Set())
  const [section, setSection] = useState<'reel' | 'board' | null>(null)
  const [reelAt, setReelAt] = useState(0)
  const lastTile = useRef<HTMLButtonElement | null>(null)
  const gapRef = useRef<HTMLElement>(null)
  /** So the page only ever carries them onward once. */
  const advanced = useRef(false)

  const reveal = (id: string) =>
    setSeen(prev => (prev.has(id) ? prev : new Set(prev).add(id)))

  const openFile = (id: string, trigger?: HTMLButtonElement | null) => {
    const at = board.findIndex(f => f.id === id)
    if (at < 0) return
    lastTile.current = trigger ?? null
    setOpenIndex(at)
    reveal(id)
  }

  const allSeen = board.length > 0 && seen.size === board.length

  /**
   * Closing the last card carries them to the finale.
   *
   * On close rather than on open: the last file is still a file, and pulling
   * the page out from under someone mid-sentence is the one thing that would
   * make this feel like it is driving them instead of the other way round.
   * Focus goes with the scroll, so a keyboard user is taken along too.
   */
  const close = () => {
    setOpenIndex(null)
    if (allSeen && !advanced.current) {
      advanced.current = true
      gapRef.current?.scrollIntoView({
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        block: 'start',
      })
      gapRef.current?.focus({ preventScroll: true })
      return
    }
    lastTile.current?.focus()
  }

  // Which movement owns the sticky bar.
  const reelRef = useRef<HTMLDivElement>(null)
  const boardRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          const name = (entry.target as HTMLElement).dataset.section as
            | 'reel'
            | 'board'
          if (entry.isIntersecting) setSection(name)
          else if (section === name) setSection(null)
        }
      },
      { threshold: 0.12 }
    )
    ;[reelRef.current, boardRef.current].forEach(n => n && observer.observe(n))
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="relative">
      {/* ============ HERO ============ */}
      <section className="flex min-h-[92svh] items-end px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-5xl">
          <p className="mb-6 font-mono text-[11px] tracking-[0.2em] text-white/55 uppercase">
            {content.hero.eyebrow}
          </p>
          <h1 className="font-display max-w-4xl text-[2.1rem] leading-[1.08] font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            {content.hero.headlineLead}{' '}
            <span className="text-(--accent)">
              {content.hero.headlineGradient}
            </span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-relaxed text-white/65">
            {content.hero.description}
          </p>
          <ChevronDown className="mt-12 h-5 w-5 text-white/35 motion-safe:animate-bounce" />
        </div>
      </section>

      {/* ============ I — THE REEL ============ */}
      <ChapterCard
        numeral={NUMERALS[0]}
        eyebrow={content.profileMatchSection.eyebrow}
        heading={content.profileMatchSection.heading}
        meta={
          opening.length
            ? `${opening.length} screens · just scroll`
            : 'Just scroll'
        }
        ground={ground}
      />

      <div ref={reelRef} data-section="reel">
        {section === 'reel' && (
          <ChapterBar
            numeral={NUMERALS[0]}
            label={content.profileMatchSection.eyebrow}
            detail={`${Math.min(reelAt + 1, opening.length)} / ${opening.length}`}
            progress={opening.length ? (reelAt + 1) / opening.length : 0}
          />
        )}
        {opening.map((file, i) => (
          <ReelScreen
            key={file.id}
            file={file}
            index={i}
            total={opening.length}
            onActive={() => setReelAt(i)}
          />
        ))}
      </div>

      {/* ============ II — THE BOARD ============ */}
      <ChapterCard
        numeral={NUMERALS[1]}
        eyebrow={content.roleMapSection.eyebrow}
        heading={content.roleMapSection.heading}
        meta={`${board.length} more · open any for the full evidence`}
        ground={ground}
      />

      <div ref={boardRef} data-section="board">
        {section === 'board' && (
          <ChapterBar
            numeral={NUMERALS[1]}
            label={content.roleMapSection.eyebrow}
            detail={`${seen.size} / ${board.length} read in full`}
            progress={board.length ? seen.size / board.length : 0}
            complete={allSeen}
          />
        )}

        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="space-y-10 rounded-3xl bg-black/25 p-4 backdrop-blur-[2px] sm:p-6">
            {groups
              .filter(group => group.id !== 'gap')
              .map(group => {
                const tiles = group.files.filter(f => board.includes(f))
                if (!tiles.length) return null
                return (
                  <section key={group.id}>
                    <p className="mb-3 font-mono text-[11px] tracking-[0.2em] text-white/45 uppercase">
                      {group.title}
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {tiles.map(file => (
                        <Tile
                          key={file.id}
                          file={file}
                          seen={seen.has(file.id)}
                          onOpen={trigger => openFile(file.id, trigger)}
                        />
                      ))}
                    </div>
                  </section>
                )
              })}
          </div>
        </div>
      </div>

      {/* ============ III — THE GAP, ALONE ============ */}
      <section
        ref={gapRef}
        tabIndex={-1}
        className="flex min-h-[80svh] items-center px-4 py-20 outline-none sm:px-6 lg:px-8"
      >
        <div className="mx-auto w-full max-w-3xl">
          <p className="font-display text-5xl leading-none font-bold text-(--accent) md:text-7xl">
            {NUMERALS[2]}
          </p>
          <div className="my-6 h-px w-16 bg-white/25" />
          <p className="mb-4 font-mono text-[11px] tracking-[0.22em] text-white/50 uppercase">
            {content.gap.chip}
          </p>
          <h2 className="font-display max-w-2xl text-[1.8rem] leading-[1.12] font-bold tracking-tight text-white sm:text-4xl">
            {content.gap.heading}
          </h2>
          <p className="mt-7 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
            {content.gap.body}
          </p>
        </div>
      </section>

      {/* ============ CLOSING ============ */}
      <section className="flex min-h-[70svh] items-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-3xl text-center">
          <p className="mb-4 font-mono text-[11px] tracking-[0.22em] text-white/45 uppercase">
            {content.closing.eyebrow}
          </p>
          <h2 className="font-display text-[1.8rem] leading-[1.12] font-bold text-white sm:text-4xl">
            {content.closing.heading}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/70">
            {content.closing.body}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {content.closing.credentials.map(credential => (
              <span
                key={credential}
                className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/60"
              >
                {credential}
              </span>
            ))}
          </div>
          <p className="font-display mt-10 text-lg text-(--accent)">
            {content.closing.signature}
          </p>
        </div>
      </section>

      {openIndex !== null && (
        <DeckOverlay
          files={board}
          index={openIndex}
          seen={seen}
          lastOne={allSeen && !advanced.current}
          onIndex={next => {
            setOpenIndex(next)
            reveal(board[next].id)
          }}
          onClose={close}
        />
      )}

      <span className="sr-only">{slug}</span>
    </div>
  )
}

/** One of the three opening screens: a figure, a claim, a line of proof. */
function ReelScreen({
  file,
  index,
  total,
  onActive,
}: {
  file: CaseFile
  index: number
  total: number
  onActive: () => void
}) {
  const ref = useRef<HTMLElement>(null)
  const [active, setActive] = useState(false)
  const [still, setStill] = useState(false)

  useEffect(() => {
    // Without this a reduced-motion reader still gets sliding, fading text
    // and sees two of the three screens held at 30% opacity.
    setStill(prefersReducedMotion())
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setActive(entry.isIntersecting)
        if (entry.isIntersecting) onActive()
      },
      { threshold: 0.5 }
    )
    observer.observe(node)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section
      ref={ref}
      className="flex min-h-[88svh] items-center px-4 py-16 sm:px-6 lg:px-8"
    >
      <div
        className={`mx-auto w-full max-w-4xl ${
          still
            ? ''
            : `transition-all duration-700 ${
                active
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-4 opacity-30'
              }`
        }`}
      >
        <p className="mb-6 font-mono text-[11px] tracking-[0.2em] text-white/45 uppercase">
          {String(index + 1).padStart(2, '0')} /{' '}
          {String(total).padStart(2, '0')}
          {file.tag ? ` · ${file.tag}` : ''}
        </p>
        {file.stat && (
          <p className="font-display mb-2 text-[3.5rem] leading-[0.95] font-bold tracking-tight text-(--accent) sm:text-8xl">
            {file.stat.value}
          </p>
        )}
        {file.stat && (
          <p className="mb-8 text-sm text-white/50">{file.stat.label}</p>
        )}
        <h3 className="font-display max-w-3xl text-[1.7rem] leading-[1.12] font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
          {file.title}
        </h3>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
          {file.body}
        </p>
      </div>
    </section>
  )
}

/**
 * A file on the board — open, not sealed.
 *
 * It was sealed, and both reviews took it apart for the same reason: the
 * proof sentences were not in the DOM at all until you clicked, so a reader
 * who clicked nothing got none of the argument, Cmd+F found nothing, printing
 * produced empty boxes and a screen reader announced seventeen buttons called
 * "not yet opened". The curiosity gap is a mechanic for content people do not
 * yet want; a recruiter checking this page against their own posting already
 * wants it, and sealing it converted demand into friction.
 *
 * So the tile now carries the claim and the opening of the evidence, and the
 * card became what it should always have been — a lens, not a toll. The green
 * check stays, quietly, because knowing what you have already read is useful
 * in a grid; it is no longer the only thing a tile has to say.
 */
function Tile({
  file,
  seen,
  onOpen,
}: {
  file: CaseFile
  seen: boolean
  onOpen: (trigger: HTMLButtonElement | null) => void
}) {
  const ref = useRef<HTMLButtonElement>(null)

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onOpen(ref.current)}
      className="group flex flex-col gap-3 rounded-2xl border p-5 text-left backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-(--accent)"
      style={{
        borderColor: seen ? SEEN.border : 'rgb(255 255 255 / 0.14)',
        background: seen
          ? `linear-gradient(to bottom, ${SEEN.glow}, rgb(0 0 0 / 0.5))`
          : 'rgb(0 0 0 / 0.45)',
      }}
    >
      <div className="flex items-start justify-between gap-3">
        {file.tag && (
          <span
            className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold tracking-[0.12em] uppercase"
            style={{
              color: file.isMatch ? 'var(--accent)' : 'rgb(255 255 255 / 0.65)',
            }}
          >
            {file.isMatch && (
              <span className="h-1.5 w-1.5 rounded-full bg-(--accent)" />
            )}
            {file.tag}
          </span>
        )}
        {seen && (
          <Check
            className="h-3.5 w-3.5 shrink-0"
            style={{ color: SEEN.text }}
            aria-label="Read"
          />
        )}
      </div>

      <span className="font-display text-base leading-snug font-semibold text-white">
        {file.title}
      </span>

      {/* The evidence itself, two lines of it. A reader who never clicks has
          now read the argument; the card adds the figure and the links. */}
      <span className="line-clamp-2 text-sm leading-relaxed text-white/65">
        {file.body}
      </span>

      <span className="mt-auto flex items-center gap-2 pt-1 font-mono text-[11px] text-white/45 transition-colors group-hover:text-(--accent)">
        {file.stat ? file.stat.value : 'Read it in full'}
        <ArrowRight className="h-3 w-3" />
      </span>
    </button>
  )
}
