import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

interface ContactEmailData {
  name: string
  email: string
  subject: string
  message: string
  phone?: string
  company?: string
}

interface WelcomeEmailData {
  email: string
  name?: string
}

export async function sendContactEmail(data: ContactEmailData) {
  if (!resend) {
    console.warn('RESEND_API_KEY not configured, skipping email send')
    return
  }

  try {
    const { error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: [process.env.ADMIN_EMAIL || 'hosala.lukas@gmail.com'],
      subject: `New Contact Form Submission: ${data.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${data.name} (${data.email})</p>
        ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
        ${data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : ''}
        <p><strong>Subject:</strong> ${data.subject}</p>
        <div>
          <strong>Message:</strong>
          <div style="background: #f5f5f5; padding: 15px; margin-top: 10px; border-radius: 5px;">
            ${data.message.replace(/\n/g, '<br>')}
          </div>
        </div>

        <hr style="margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">
          This email was sent from your portfolio contact form.
        </p>
      `,
    })

    if (error) {
      console.error('Failed to send contact email:', error)
      throw new Error(`Email send failed: ${error.message}`)
    }

    // Send auto-reply to the contact
    await sendContactAutoReply(data)
  } catch (error) {
    console.error('Error sending contact email:', error)
    throw error
  }
}

async function sendContactAutoReply(data: ContactEmailData) {
  if (!resend) {
    console.warn('RESEND_API_KEY not configured, skipping auto-reply email')
    return
  }

  try {
    const { error } = await resend.emails.send({
      from: 'Lukáš Hošala <onboarding@resend.dev>',
      to: [data.email],
      subject: 'Thank you for your message',
      html: `
        <h2>Thank you for contacting me!</h2>
        <p>Hi ${data.name},</p>
        <p>Thank you for reaching out through my portfolio contact form. I've received your message and will get back to you as soon as possible.</p>

        <div style="background: #f8f9fa; padding: 15px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #007bff;">
          <p><strong>Your message:</strong></p>
          <p style="margin: 0;">${data.message.replace(/\n/g, '<br>')}</p>
        </div>

        <p>I typically respond within 24-48 hours. If your inquiry is urgent, please feel free to reach out via other channels listed on my portfolio.</p>

        <p>Best regards,<br>Lukáš Hošala</p>

        <hr style="margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">
          This is an automated response. Please do not reply to this email.
        </p>
      `,
    })

    if (error) {
      console.error('Failed to send auto-reply:', error)
    }
  } catch (error) {
    console.error('Error sending auto-reply:', error)
    // Don't throw here as it's not critical
  }
}

export async function sendWelcomeEmail(data: WelcomeEmailData) {
  if (!resend) {
    console.warn('RESEND_API_KEY not configured, skipping email send')
    return
  }

  try {
    const { error } = await resend.emails.send({
      from: 'Lukáš Hošala <onboarding@resend.dev>',
      to: [data.email],
      subject: 'Welcome to my newsletter!',
      html: `
        <h2>Welcome to my newsletter!</h2>
        <p>Hi ${data.name || 'there'},</p>
        <p>Thank you for subscribing to my newsletter! I'm excited to share my latest projects, thoughts on web development, and insights from my journey as a developer.</p>

        <p>Here's what you can expect:</p>
        <ul>
          <li>🚀 Updates on my latest projects and case studies</li>
          <li>💡 Web development tips and best practices</li>
          <li>📚 Resources and tools I find valuable</li>
          <li>🎯 Behind-the-scenes content and development insights</li>
        </ul>

        <p>I respect your inbox and will only send valuable content. No spam, ever.</p>

        <p>You can unsubscribe at any time by clicking the link at the bottom of any newsletter email.</p>

        <p>Thanks again for joining me on this journey!</p>

        <p>Best regards,<br>Lukáš Hošala</p>

        <hr style="margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">
          You received this email because you subscribed to my newsletter on my portfolio website.
          <br>
          <a href="http://localhost:3000/api/newsletter?email=${data.email}" style="color: #666;">Unsubscribe</a>
        </p>
      `,
    })

    if (error) {
      console.error('Failed to send welcome email:', error)
      throw new Error(`Welcome email send failed: ${error.message}`)
    }
  } catch (error) {
    console.error('Error sending welcome email:', error)
    throw error
  }
}

export async function sendNewsletterEmail(
  subscribers: { email: string; name?: string }[],
  subject: string,
  content: string
) {
  if (!resend) {
    console.warn('RESEND_API_KEY not configured, skipping email send')
    return
  }

  const results = []

  for (const subscriber of subscribers) {
    try {
      const { error } = await resend.emails.send({
        from: 'Lukáš Hošala <onboarding@resend.dev>',
        to: [subscriber.email],
        subject,
        html: `
          ${content}

          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">
            You received this email because you subscribed to my newsletter.
            <br>
            <a href="http://localhost:3000/api/newsletter?email=${subscriber.email}" style="color: #666;">Unsubscribe</a>
          </p>
        `,
      })

      if (error) {
        console.error(
          `Failed to send newsletter to ${subscriber.email}:`,
          error
        )
        results.push({
          email: subscriber.email,
          success: false,
          error: error.message,
        })
      } else {
        results.push({ email: subscriber.email, success: true })
      }
    } catch (error) {
      console.error(`Error sending newsletter to ${subscriber.email}:`, error)
      results.push({
        email: subscriber.email,
        success: false,
        error: (error as Error).message,
      })
    }
  }

  return results
}

/* ------------------------------------------------------------------ *
 * Overnight job-search digest
 * ------------------------------------------------------------------ */

/**
 * One lead as the digest renders it. A subset of JobLead, deliberately — the
 * email carries what decides whether to open the posting, not everything known.
 */
export interface DigestLead {
  url: string
  title: string
  companyName: string
  location: string
  salaryText: string
  leadScore: number
  band: string
  liveness: string
  verdict?: string
}

export interface JobDigestData {
  searchName: string
  leads: DigestLead[]
  /** Set when the scheduler switched the search off, so the mail can say why. */
  pausedReason?: string
}

/** HTML-escape. These strings come from job postings, not from us. */
function esc(value: string): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const BAND_COLOR: Record<string, string> = {
  strong: '#047857',
  credible: '#1d4ed8',
  stretch: '#b45309',
  'long-shot': '#6b7280',
}

/**
 * The morning digest.
 *
 * Sent only when a scheduled run found something worth opening — the caller
 * decides that, and calls this with an empty list never. A mail that arrives
 * every morning saying "nothing today" is one you stop opening, and then the
 * one that matters is unread too.
 *
 * Absolute URLs come from `origin`, not from a hardcoded host: the existing
 * welcome and newsletter templates in this file hardcode `http://localhost:3000`
 * in their unsubscribe links, which is a live bug worth not repeating.
 */
export async function sendJobDigestEmail(data: JobDigestData, origin: string) {
  if (!resend) {
    console.warn('RESEND_API_KEY not configured, skipping digest')
    return
  }

  const count = data.leads.length
  const rows = data.leads
    .map(
      lead => `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #e5e7eb;vertical-align:top;width:56px">
            <div style="font-size:20px;font-weight:700;color:${BAND_COLOR[lead.band] ?? '#6b7280'}">${lead.leadScore}</div>
            <div style="font-size:11px;color:#6b7280">${esc(lead.band)}</div>
          </td>
          <td style="padding:12px 0;border-bottom:1px solid #e5e7eb;vertical-align:top">
            <a href="${esc(lead.url)}" style="font-size:15px;font-weight:600;color:#111827;text-decoration:none">${esc(lead.title)}</a>
            <div style="font-size:13px;color:#374151;margin-top:2px">
              ${esc(lead.companyName)}${lead.location ? ` &middot; ${esc(lead.location)}` : ''}
            </div>
            <div style="font-size:12px;color:#6b7280;margin-top:2px">
              ${lead.salaryText ? esc(lead.salaryText) : 'Salary not stated'}
              &middot; ${lead.liveness === 'live' ? 'Verified live' : 'Could not verify'}
            </div>
            ${lead.verdict ? `<div style="font-size:12px;color:#4b5563;margin-top:6px">${esc(lead.verdict)}</div>` : ''}
          </td>
        </tr>`
    )
    .join('')

  try {
    const { error } = await resend.emails.send({
      from: 'Lukáš Hošala <onboarding@resend.dev>',
      to: [process.env.ADMIN_EMAIL || 'hosala.lukas@gmail.com'],
      subject: `${count} new lead${count === 1 ? '' : 's'} · ${data.searchName}`,
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:640px;margin:0 auto;padding:24px">
          <p style="font-size:13px;color:#6b7280;margin:0 0 4px">Overnight job search</p>
          <h2 style="font-size:20px;color:#111827;margin:0 0 4px">${esc(data.searchName)}</h2>
          <p style="font-size:14px;color:#374151;margin:0 0 20px">
            ${count} new posting${count === 1 ? '' : 's'} worth a look. Scores are the pre-generation triage, not the full fit score.
          </p>
          <table style="width:100%;border-collapse:collapse">${rows}</table>
          <p style="margin:24px 0 0">
            <a href="${origin}/admin/applications" style="display:inline-block;background:#111827;color:#fff;padding:10px 16px;border-radius:6px;font-size:14px;text-decoration:none">
              Review in the panel
            </a>
          </p>
          ${
            data.pausedReason
              ? `<p style="font-size:13px;color:#b45309;margin-top:20px">This search has been paused: ${esc(data.pausedReason)}</p>`
              : ''
          }
        </div>
      `,
    })

    if (error) console.error('Digest email error:', error)
  } catch (error) {
    console.error('Digest email failed:', error)
  }
}

/**
 * A scheduled run that did not work.
 *
 * Sent instead of silence, because a broken scheduler and a quiet job market
 * look identical from the outside — and the quiet one is the story you tell
 * yourself.
 */
export async function sendJobSearchFailureEmail(
  searchName: string,
  reason: string,
  origin: string
) {
  if (!resend) {
    console.warn('RESEND_API_KEY not configured, skipping failure notice')
    return
  }

  try {
    const { error } = await resend.emails.send({
      from: 'Lukáš Hošala <onboarding@resend.dev>',
      to: [process.env.ADMIN_EMAIL || 'hosala.lukas@gmail.com'],
      subject: `Job search did not run · ${searchName}`,
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:640px;margin:0 auto;padding:24px">
          <h2 style="font-size:18px;color:#111827;margin:0 0 8px">The overnight search failed</h2>
          <p style="font-size:14px;color:#374151;margin:0 0 4px"><strong>${esc(searchName)}</strong></p>
          <pre style="background:#f3f4f6;padding:12px;border-radius:6px;font-size:12px;color:#374151;white-space:pre-wrap;margin:12px 0">${esc(reason)}</pre>
          <p style="font-size:13px;color:#6b7280;margin:0">
            Nothing was stored for this run. It will be retried on the next tick it is due.
          </p>
          <p style="margin:20px 0 0">
            <a href="${origin}/admin/applications" style="font-size:14px;color:#1d4ed8">Open the panel</a>
          </p>
        </div>
      `,
    })

    if (error) console.error('Failure email error:', error)
  } catch (error) {
    console.error('Failure email failed:', error)
  }
}
