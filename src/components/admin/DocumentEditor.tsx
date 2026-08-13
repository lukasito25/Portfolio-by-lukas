'use client'

/**
 * Field-level editors for the CV and the cover letter.
 *
 * These documents were read-only until now — rendered as a JSON dump next to a
 * download button — which had a consequence beyond the inconvenience: every
 * improvement he made happened in Word, after downloading, where the engine
 * could not see it. The two documents he rewrites hardest taught the generator
 * nothing, so it kept making the same mistakes.
 *
 * Editing here closes that loop. Each field carries its dotted path, which is
 * what lets a change be recorded as "this field, before → after" rather than as
 * an opaque new version, and that pairing is what the learning prompt reads.
 *
 * Prose gets a textarea, everything else an input, and the two are chosen by
 * what the field *is* rather than how long it happens to be: `summary` stays a
 * textarea when empty, `period` stays an input when someone types an essay into
 * it. Anything structural the form does not cover — reordering roles, adding a
 * skill group — is reachable through the JSON tab, which is the same editor the
 * fit brief has always used.
 */

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp, Plus, X } from 'lucide-react'
import type { CvContent, CoverLetterContent } from '@/lib/documents/schema'

/* ------------------------------------------------------------------ *
 * Small field primitives
 * ------------------------------------------------------------------ */

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1 flex items-baseline gap-2">
        <span className="text-xs font-semibold tracking-wide text-gray-700 uppercase">
          {label}
        </span>
        {hint && <span className="text-xs text-gray-400">{hint}</span>}
      </span>
      {children}
    </label>
  )
}

const inputClass =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none'

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      className={inputClass}
    />
  )
}

function TextBox({
  value,
  onChange,
  rows = 3,
}: {
  value: string
  onChange: (v: string) => void
  rows?: number
}) {
  return (
    <textarea
      value={value}
      rows={rows}
      onChange={e => onChange(e.target.value)}
      className={`${inputClass} leading-relaxed`}
    />
  )
}

/**
 * A list of plain strings — links, skill items, languages.
 *
 * Kept as one control rather than a row of inputs because these are short and
 * order rarely matters; one line each is faster to scan and to retype than a
 * stack of boxes with add and remove buttons.
 */
function StringList({
  value,
  onChange,
  rows,
}: {
  value: string[]
  onChange: (v: string[]) => void
  rows?: number
}) {
  return (
    <textarea
      value={value.join('\n')}
      rows={rows ?? Math.max(2, value.length)}
      onChange={e =>
        onChange(
          e.target.value
            .split('\n')
            .map(s => s.trim())
            .filter(Boolean)
        )
      }
      className={`${inputClass} font-mono text-xs`}
    />
  )
}

/** Citations are shown, never edited — they are the honesty layer's anchor. */
function Citations({ ids }: { ids: string[] }) {
  if (!ids?.length) return null
  return (
    <p className="mt-1 font-mono text-[11px] text-gray-400">
      cites: {ids.join(', ')}
    </p>
  )
}

/* ------------------------------------------------------------------ *
 * CV
 * ------------------------------------------------------------------ */

export function CvEditor({
  value,
  onChange,
}: {
  value: CvContent
  onChange: (next: CvContent) => void
}) {
  const [openRole, setOpenRole] = useState<string | null>(
    value.roles[0]?.roleId ?? null
  )

  const set = <K extends keyof CvContent>(key: K, v: CvContent[K]) =>
    onChange({ ...value, [key]: v })

  const setRole = (index: number, next: CvContent['roles'][number]) => {
    const roles = [...value.roles]
    roles[index] = next
    set('roles', roles)
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name">
          <TextInput
            value={value.fullName}
            onChange={v => set('fullName', v)}
          />
        </Field>
        <Field label="Location">
          <TextInput
            value={value.location}
            onChange={v => set('location', v)}
          />
        </Field>
      </div>

      <Field label="Headline" hint="one line under the name, tuned to the role">
        <TextInput value={value.headline} onChange={v => set('headline', v)} />
      </Field>

      <Field label="Summary" hint="2–4 sentences">
        <TextBox
          value={value.summary}
          onChange={v => set('summary', v)}
          rows={4}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email">
          <TextInput value={value.email} onChange={v => set('email', v)} />
        </Field>
        <Field label="Links" hint="one per line">
          <StringList value={value.links} onChange={v => set('links', v)} />
        </Field>
      </div>

      {/* Roles */}
      <div>
        <p className="mb-2 text-xs font-semibold tracking-wide text-gray-700 uppercase">
          Experience
        </p>
        <div className="space-y-2">
          {value.roles.map((role, roleIndex) => {
            const open = openRole === role.roleId
            return (
              <div
                key={role.roleId}
                className="rounded-lg border border-gray-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenRole(open ? null : role.roleId)}
                  className="flex w-full items-center justify-between px-3 py-2 text-left"
                >
                  <span className="text-sm font-medium text-gray-900">
                    {role.company} — {role.title}
                  </span>
                  <span className="flex items-center gap-2 text-xs text-gray-500">
                    {role.period}
                    {open ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </span>
                </button>

                {open && (
                  <div className="space-y-4 border-t border-gray-100 p-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Title">
                        <TextInput
                          value={role.title}
                          onChange={v =>
                            setRole(roleIndex, { ...role, title: v })
                          }
                        />
                      </Field>
                      <Field label="Company">
                        <TextInput
                          value={role.company}
                          onChange={v =>
                            setRole(roleIndex, { ...role, company: v })
                          }
                        />
                      </Field>
                      <Field label="Location">
                        <TextInput
                          value={role.location}
                          onChange={v =>
                            setRole(roleIndex, { ...role, location: v })
                          }
                        />
                      </Field>
                      <Field label="Period">
                        <TextInput
                          value={role.period}
                          onChange={v =>
                            setRole(roleIndex, { ...role, period: v })
                          }
                        />
                      </Field>
                    </div>

                    <div className="space-y-3">
                      {role.bullets.map((bullet, bulletIndex) => {
                        const replace = (
                          next: CvContent['roles'][number]['bullets']
                        ) => setRole(roleIndex, { ...role, bullets: next })

                        const move = (delta: number) => {
                          const to = bulletIndex + delta
                          if (to < 0 || to >= role.bullets.length) return
                          const bullets = [...role.bullets]
                          const [item] = bullets.splice(bulletIndex, 1)
                          bullets.splice(to, 0, item)
                          replace(bullets)
                        }

                        return (
                          <div
                            key={bulletIndex}
                            className="rounded-md bg-gray-50 p-3"
                          >
                            <div className="mb-2 flex items-center gap-2">
                              <input
                                type="text"
                                value={bullet.label}
                                placeholder="Bold lead-in (optional)"
                                onChange={e => {
                                  const bullets = [...role.bullets]
                                  bullets[bulletIndex] = {
                                    ...bullet,
                                    label: e.target.value,
                                  }
                                  replace(bullets)
                                }}
                                className="flex-1 rounded border border-gray-300 px-2 py-1 text-xs font-semibold"
                              />
                              <button
                                type="button"
                                onClick={() => move(-1)}
                                disabled={bulletIndex === 0}
                                className="rounded p-1 text-gray-400 hover:text-gray-900 disabled:opacity-25"
                                aria-label="Move bullet up"
                              >
                                <ChevronUp className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => move(1)}
                                disabled={
                                  bulletIndex === role.bullets.length - 1
                                }
                                className="rounded p-1 text-gray-400 hover:text-gray-900 disabled:opacity-25"
                                aria-label="Move bullet down"
                              >
                                <ChevronDown className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  replace(
                                    role.bullets.filter(
                                      (_, i) => i !== bulletIndex
                                    )
                                  )
                                }
                                disabled={role.bullets.length <= 2}
                                title={
                                  role.bullets.length <= 2
                                    ? 'Two bullets is the minimum'
                                    : 'Remove bullet'
                                }
                                className="rounded p-1 text-gray-400 hover:text-red-600 disabled:opacity-25"
                                aria-label="Remove bullet"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <TextBox
                              value={bullet.text}
                              rows={2}
                              onChange={v => {
                                const bullets = [...role.bullets]
                                bullets[bulletIndex] = { ...bullet, text: v }
                                replace(bullets)
                              }}
                            />
                            <Citations ids={bullet.factIds} />
                          </div>
                        )
                      })}

                      {role.bullets.length < 5 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setRole(roleIndex, {
                              ...role,
                              bullets: [
                                ...role.bullets,
                                { label: '', text: '', factIds: [] },
                              ],
                            })
                          }
                        >
                          <Plus className="mr-1 h-3.5 w-3.5" />
                          Add bullet
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Skills */}
      <div>
        <p className="mb-2 text-xs font-semibold tracking-wide text-gray-700 uppercase">
          Skills
        </p>
        <div className="space-y-3">
          {value.skills.map((group, index) => (
            <div key={index} className="rounded-md bg-gray-50 p-3">
              <input
                type="text"
                value={group.group}
                onChange={e => {
                  const skills = [...value.skills]
                  skills[index] = { ...group, group: e.target.value }
                  set('skills', skills)
                }}
                className="mb-2 w-full rounded border border-gray-300 px-2 py-1 text-xs font-semibold"
              />
              <StringList
                value={group.items}
                onChange={v => {
                  const skills = [...value.skills]
                  skills[index] = { ...group, items: v }
                  set('skills', skills)
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Education & certifications */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-semibold tracking-wide text-gray-700 uppercase">
            Education
          </p>
          <div className="space-y-2">
            {value.education.map((entry, index) => (
              <div key={index} className="space-y-1 rounded-md bg-gray-50 p-2">
                <TextInput
                  value={entry.qualification}
                  onChange={v => {
                    const education = [...value.education]
                    education[index] = { ...entry, qualification: v }
                    set('education', education)
                  }}
                />
                <TextInput
                  value={entry.institution}
                  onChange={v => {
                    const education = [...value.education]
                    education[index] = { ...entry, institution: v }
                    set('education', education)
                  }}
                />
                <TextInput
                  value={entry.detail}
                  placeholder="Years, or a thesis title"
                  onChange={v => {
                    const education = [...value.education]
                    education[index] = { ...entry, detail: v }
                    set('education', education)
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold tracking-wide text-gray-700 uppercase">
            Certifications
          </p>
          <div className="space-y-2">
            {value.certifications.map((entry, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={entry.year}
                  onChange={e => {
                    const certifications = [...value.certifications]
                    certifications[index] = { ...entry, year: e.target.value }
                    set('certifications', certifications)
                  }}
                  className="w-20 rounded-md border border-gray-300 px-2 py-2 text-sm"
                />
                <input
                  type="text"
                  value={entry.entry}
                  onChange={e => {
                    const certifications = [...value.certifications]
                    certifications[index] = { ...entry, entry: e.target.value }
                    set('certifications', certifications)
                  }}
                  className={inputClass}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <Field label="Languages" hint="statements, never levels — one per line">
        <StringList
          value={value.languages}
          onChange={v => set('languages', v)}
        />
      </Field>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Cover letter
 * ------------------------------------------------------------------ */

export function LetterEditor({
  value,
  onChange,
}: {
  value: CoverLetterContent
  onChange: (next: CoverLetterContent) => void
}) {
  const set = <K extends keyof CoverLetterContent>(
    key: K,
    v: CoverLetterContent[K]
  ) => onChange({ ...value, [key]: v })

  const move = (index: number, delta: number) => {
    const to = index + delta
    if (to < 0 || to >= value.paragraphs.length) return
    const paragraphs = [...value.paragraphs]
    const [item] = paragraphs.splice(index, 1)
    paragraphs.splice(to, 0, item)
    set('paragraphs', paragraphs)
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Recipient" hint="never an individual's name">
          <TextInput
            value={value.recipient}
            onChange={v => set('recipient', v)}
          />
        </Field>
        <Field label="Subject">
          <TextInput value={value.subject} onChange={v => set('subject', v)} />
        </Field>
      </div>

      <Field label="Greeting">
        <TextInput value={value.greeting} onChange={v => set('greeting', v)} />
      </Field>

      <div>
        <p className="mb-2 text-xs font-semibold tracking-wide text-gray-700 uppercase">
          Body
        </p>
        <div className="space-y-3">
          {value.paragraphs.map((paragraph, index) => (
            <div key={index} className="rounded-md bg-gray-50 p-3">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">
                  Paragraph {index + 1}
                  {index === value.paragraphs.length - 2 && (
                    <span className="ml-2 text-gray-400">
                      — usually the honest limit
                    </span>
                  )}
                </span>
                <span className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    className="rounded p-1 text-gray-400 hover:text-gray-900 disabled:opacity-25"
                    aria-label="Move paragraph up"
                  >
                    <ChevronUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === value.paragraphs.length - 1}
                    className="rounded p-1 text-gray-400 hover:text-gray-900 disabled:opacity-25"
                    aria-label="Move paragraph down"
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      set(
                        'paragraphs',
                        value.paragraphs.filter((_, i) => i !== index)
                      )
                    }
                    disabled={value.paragraphs.length <= 3}
                    title={
                      value.paragraphs.length <= 3
                        ? 'Three paragraphs is the minimum'
                        : 'Remove paragraph'
                    }
                    className="rounded p-1 text-gray-400 hover:text-red-600 disabled:opacity-25"
                    aria-label="Remove paragraph"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              </div>
              <TextBox
                value={paragraph.text}
                rows={4}
                onChange={v => {
                  const paragraphs = [...value.paragraphs]
                  paragraphs[index] = { ...paragraph, text: v }
                  set('paragraphs', paragraphs)
                }}
              />
              <Citations ids={paragraph.factIds} />
            </div>
          ))}

          {value.paragraphs.length < 5 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                set('paragraphs', [
                  ...value.paragraphs,
                  { text: '', factIds: [] },
                ])
              }
            >
              <Plus className="mr-1 h-3.5 w-3.5" />
              Add paragraph
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Closing">
          <TextInput value={value.closing} onChange={v => set('closing', v)} />
        </Field>
        <Field label="Signature">
          <TextInput
            value={value.signature}
            onChange={v => set('signature', v)}
          />
        </Field>
      </div>
    </div>
  )
}
