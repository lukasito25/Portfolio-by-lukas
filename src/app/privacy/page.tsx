import { Metadata } from 'next'

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
          <p>
            <strong className="text-foreground">Site analytics:</strong> the
            site records anonymous usage events (pages viewed, approximate
            location derived from IP, device type, interaction events) to
            understand how the site is used. No advertising trackers are used,
            and no data is sold or shared with third parties for marketing.
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
            Cookies
          </h2>
          <p>
            This site stores a single preference in your browser&apos;s local
            storage to remember your light/dark theme choice. It is not used for
            tracking. If additional analytics tools are enabled in the future,
            this policy will be updated first.
          </p>
        </section>
      </div>
    </div>
  )
}
