import { Metadata } from 'next'
import { AnalyticsOptOut } from '@/components/analytics-opt-out'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How this site handles personal data: contact form submissions and site analytics.',
  robots: { index: false, follow: true },
}

/*
 * NOTE FOR OWNER: retention periods and controller contact were set to
 * sensible defaults at deploy time — review and adjust as needed.
 * This page is legally informed but is not legal advice.
 */
export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8 md:py-28">
      <p className="section-label mb-4">Legal</p>
      <h1 className="font-display mb-4 text-4xl font-bold tracking-tight md:text-5xl">
        Privacy policy
      </h1>
      <p className="mb-12 text-sm text-tertiary-fg">Last updated: July 2026</p>

      <div className="space-y-10 leading-relaxed text-secondary-fg">
        <section>
          <h2 className="font-display mb-3 text-xl font-semibold text-foreground">
            Who is responsible for this site
          </h2>
          <p>
            This is the personal portfolio of Lukáš Hošala, based in Italy. For
            anything related to your personal data, contact:{' '}
            <a
              href="mailto:lukas.hosala@icloud.com"
              className="underline hover:text-foreground"
            >
              lukas.hosala@icloud.com
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-display mb-3 text-xl font-semibold text-foreground">
            What data is collected
          </h2>
          <p className="mb-3">
            <strong className="text-foreground">Contact form:</strong> when you
            send a message, the name, email address, company, inquiry type, and
            message text you provide are stored so I can reply. Technical
            details (IP address, browser user-agent) are recorded with the
            submission for abuse prevention.
          </p>
          <p className="mb-3">
            <strong className="text-foreground">Site analytics:</strong> for
            each page view the site records the page path, the country and city
            your network resolves to, the referring website, browser, operating
            system and device type, how long you stayed and how far you
            scrolled, plus a short-lived session identifier and a flag for
            whether you have visited before.{' '}
            <strong className="text-foreground">
              Your IP address is never stored
            </strong>{' '}
            for analytics — it is used at the edge to derive an approximate
            location and then discarded. No advertising trackers are used, and
            no data is sold or shared for marketing.
          </p>
          <p>
            <strong className="text-foreground">Campaign tags:</strong> links to
            this site are sometimes tagged with a{' '}
            <code className="rounded bg-accent-soft px-1 text-xs">?ref=</code>{' '}
            parameter or standard{' '}
            <code className="rounded bg-accent-soft px-1 text-xs">utm_*</code>{' '}
            parameters, so I can tell which page or channel a visit came from.
            These are page- and channel-level labels such as{' '}
            <code className="rounded bg-accent-soft px-1 text-xs">
              recruiter
            </code>{' '}
            or{' '}
            <code className="rounded bg-accent-soft px-1 text-xs">
              linkedin-post
            </code>
            . They do not contain names and are not used to identify individual
            people.
          </p>
        </section>

        <section>
          <h2 className="font-display mb-3 text-xl font-semibold text-foreground">
            Who processes it
          </h2>
          <p className="mb-3">
            The site is hosted by{' '}
            <strong className="text-foreground">Vercel</strong>, which also
            provides an aggregate, cookieless page-view count. Analytics records
            are stored on{' '}
            <strong className="text-foreground">Cloudflare</strong>{' '}
            infrastructure (Workers and D1). Contact form messages are delivered
            by <strong className="text-foreground">Resend</strong>. Each acts as
            a processor on my behalf; none of them receive data for their own
            marketing.
          </p>
          <p>
            Automated traffic — crawlers, link scanners and command-line tools —
            is detected from the browser identification string and excluded from
            the statistics.
          </p>
        </section>

        <section>
          <h2 className="font-display mb-3 text-xl font-semibold text-foreground">
            Legal basis
          </h2>
          <p>
            Contact form data is processed to respond to your request
            (legitimate interest / pre-contractual steps, GDPR Art. 6(1)(b) and
            (f)). Analytics data is processed under legitimate interest (GDPR
            Art. 6(1)(f)) to operate and improve a personal portfolio site.
          </p>
        </section>

        <section>
          <h2 className="font-display mb-3 text-xl font-semibold text-foreground">
            How long data is kept
          </h2>
          <p>
            Contact form submissions are kept for up to 24 months after the
            conversation ends, then deleted. Analytics data is kept for up to 13
            months. You can request earlier deletion at any time using the
            contact address above.
          </p>
        </section>

        <section>
          <h2 className="font-display mb-3 text-xl font-semibold text-foreground">
            Your rights
          </h2>
          <p>
            Under the GDPR you can request access to, correction of, or deletion
            of your personal data, object to processing, and lodge a complaint
            with a supervisory authority (in Italy, the Garante per la
            protezione dei dati personali). To exercise any of these rights,
            email the address above.
          </p>
        </section>

        <section>
          <h2 className="font-display mb-3 text-xl font-semibold text-foreground">
            Cookies and local storage
          </h2>
          <p className="mb-4">
            Everything below is{' '}
            <strong className="text-foreground">first-party</strong> — set by
            this site, readable only by this site, and never shared. There are
            no advertising or cross-site tracking cookies.
          </p>
          <div className="mb-4 overflow-x-auto">
            <table className="w-full min-w-[34rem] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs uppercase tracking-wide text-tertiary-fg">
                  <th className="py-2 pr-4 font-medium">Name</th>
                  <th className="py-2 pr-4 font-medium">Kept for</th>
                  <th className="py-2 font-medium">Purpose</th>
                </tr>
              </thead>
              <tbody className="align-top">
                {[
                  [
                    'pv_sid',
                    '30 minutes',
                    'Groups the pages of one visit together',
                  ],
                  [
                    'pv_seen',
                    '90 days',
                    'Whether you have visited before (new vs returning)',
                  ],
                  [
                    'visitor-country, visitor-city',
                    '1 hour',
                    'Approximate location, used to decide which banner to show',
                  ],
                  [
                    'pv_owner',
                    '1 year',
                    'Only set if I tag my own device, so my visits are excluded from my own statistics. Never set for ordinary visitors',
                  ],
                  [
                    'pv_optout',
                    '1 year',
                    'Records that you opted out. Set only if you choose to',
                  ],
                  [
                    'portfolio-theme (local storage)',
                    'Until cleared',
                    'Your light/dark preference',
                  ],
                  [
                    'Banner dismissals (local storage)',
                    'Until cleared',
                    'Remembers that you closed a banner, so it stays closed',
                  ],
                  [
                    'error_reports (local storage)',
                    'Until cleared',
                    'Recent client-side errors, kept in your browser only and never transmitted',
                  ],
                ].map(([name, life, purpose]) => (
                  <tr
                    key={name}
                    className="border-b border-line last:border-b-0"
                  >
                    <td className="py-2 pr-4">
                      <code className="text-xs text-foreground">{name}</code>
                    </td>
                    <td className="py-2 pr-4 whitespace-nowrap text-xs">
                      {life}
                    </td>
                    <td className="py-2 text-xs">{purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            Because these are first-party, aggregate and free of advertising or
            profiling, they fall under the audience-measurement exemption from
            prior consent — which is why there is no consent pop-up. That
            exemption depends on you being able to refuse, so the control below
            is a real one, and reversible.
          </p>
        </section>

        <section>
          <h2 className="font-display mb-3 text-xl font-semibold text-foreground">
            Opt out of analytics
          </h2>
          <p className="mb-4">
            Opting out stops page-view recording and the engagement measurement,
            and clears the session and returning-visitor cookies. Nothing about
            your visit is stored after that. To be precise about what it does{' '}
            <em>not</em> cover: the two short-lived location cookies still
            apply, because they decide which banner is shown rather than
            producing statistics. Your theme preference is also kept.
          </p>
          <AnalyticsOptOut />
        </section>
      </div>
    </div>
  )
}
