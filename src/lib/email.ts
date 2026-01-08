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
