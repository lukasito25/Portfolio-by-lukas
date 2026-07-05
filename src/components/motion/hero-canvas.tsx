'use client'

import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '@/lib/gsap'

interface Particle {
  x: number
  y: number
  baseX: number
  baseY: number
  vx: number
  vy: number
  size: number
  alpha: number
  drift: number
  phase: number
}

/**
 * Interactive particle signal-field rendered on canvas.
 * Particles drift slowly; the pointer bends the field around it.
 * Static single frame under prefers-reduced-motion; paused when offscreen.
 */
export function HeroCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let particles: Particle[] = []
    let raf = 0
    let width = 0
    let height = 0
    let dpr = 1
    let running = true
    let t = 0
    const pointer = { x: -9999, y: -9999, active: false }
    const reduced = prefersReducedMotion()

    const accent = () =>
      document.documentElement.classList.contains('dark')
        ? { r: 139, g: 133, b: 255 }
        : { r: 91, g: 80, b: 232 }

    const build = () => {
      const rect = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const isSmall = width < 768
      const gap = isSmall ? 44 : 36
      particles = []
      for (let x = gap / 2; x < width; x += gap) {
        for (let y = gap / 2; y < height; y += gap) {
          const jx = (Math.random() - 0.5) * gap * 0.6
          const jy = (Math.random() - 0.5) * gap * 0.6
          particles.push({
            x: x + jx,
            y: y + jy,
            baseX: x + jx,
            baseY: y + jy,
            vx: 0,
            vy: 0,
            size: 0.8 + Math.random() * 1.4,
            alpha: 0.12 + Math.random() * 0.38,
            drift: 0.3 + Math.random() * 0.7,
            phase: Math.random() * Math.PI * 2,
          })
        }
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      const { r, g, b } = accent()

      for (const p of particles) {
        // slow ambient drift
        const dx = Math.sin(t * 0.0006 * p.drift + p.phase) * 6
        const dy = Math.cos(t * 0.0005 * p.drift + p.phase) * 6

        // pointer repulsion
        if (pointer.active) {
          const px = p.x - pointer.x
          const py = p.y - pointer.y
          const dist = Math.hypot(px, py)
          const radius = 140
          if (dist < radius && dist > 0.01) {
            const force = ((radius - dist) / radius) * 2.2
            p.vx += (px / dist) * force
            p.vy += (py / dist) * force
          }
        }

        // spring back + friction
        p.vx += (p.baseX - p.x) * 0.02
        p.vy += (p.baseY - p.y) * 0.02
        p.vx *= 0.9
        p.vy *= 0.9
        p.x += p.vx
        p.y += p.vy

        const displaced = Math.hypot(p.x - p.baseX, p.y - p.baseY)
        const glow = Math.min(displaced / 40, 1)
        const alpha = p.alpha + glow * 0.5

        ctx.beginPath()
        ctx.arc(p.x + dx, p.y + dy, p.size + glow * 1.2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`
        ctx.fill()
      }
    }

    const loop = (time: number) => {
      if (!running) return
      t = time
      draw()
      raf = requestAnimationFrame(loop)
    }

    build()
    if (reduced) {
      draw()
    } else {
      raf = requestAnimationFrame(loop)
    }

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer.x = e.clientX - rect.left
      pointer.y = e.clientY - rect.top
      pointer.active = true
    }
    const onPointerLeave = () => {
      pointer.active = false
      pointer.x = -9999
      pointer.y = -9999
    }

    const onResize = () => {
      build()
      if (reduced) draw()
    }

    // Pause rendering when the hero is offscreen
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries[0]?.isIntersecting ?? true
        if (reduced) return
        if (visible && !running) {
          running = true
          raf = requestAnimationFrame(loop)
        } else if (!visible && running) {
          running = false
          cancelAnimationFrame(raf)
        }
      },
      { threshold: 0 }
    )
    observer.observe(canvas)

    window.addEventListener('resize', onResize)
    canvas.parentElement?.addEventListener('pointermove', onPointerMove)
    canvas.parentElement?.addEventListener('pointerleave', onPointerLeave)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      observer.disconnect()
      window.removeEventListener('resize', onResize)
      canvas.parentElement?.removeEventListener('pointermove', onPointerMove)
      canvas.parentElement?.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className ?? 'absolute inset-0 h-full w-full'}
    />
  )
}
