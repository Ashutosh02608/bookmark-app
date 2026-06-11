import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendWelcomeEmail(email: string, handle: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Bookmarks App <onboarding@resend.dev>', // Change to your verified domain in production
      to: [email],
      subject: 'Welcome to Bookmarks App!',
      html: `<p>Hi @${handle},</p><p>Welcome to your new personal bookmarks app! You can now start adding your favorite links.</p><p>Your public profile is at: <a href="https://yourdomain.com/${handle}">yourdomain.com/${handle}</a></p>`,
    })

    if (error) {
      console.error('Error sending email:', error)
      return { error }
    }

    return { data }
  } catch (error) {
    console.error('Exception sending email:', error)
    return { error }
  }
}
