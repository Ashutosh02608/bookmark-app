import { Resend } from 'resend'

export async function sendWelcomeEmail(email: string, handle: string) {
  const apiKey = process.env.RESEND_API_KEY
  
  if (!apiKey) {
    console.error('RESEND_API_KEY is missing from environment variables')
    return { error: 'Missing API Key' }
  }

  const resend = new Resend(apiKey)

  try {
    console.log(`Attempting to send welcome email to ${email} for @${handle}...`)
    
    const { data, error } = await resend.emails.send({
      from: 'Bookmarks App <onboarding@resend.dev>',
      to: [email],
      subject: 'Welcome to Bookmarks App!',
      html: `<p>Hi @${handle},</p><p>Welcome to your new personal bookmarks app! You can now start adding your favorite links.</p>`,
    })

    if (error) {
      console.error('Resend API Error:', JSON.stringify(error, null, 2))
      return { error }
    }

    console.log('Resend Success:', JSON.stringify(data, null, 2))
    return { data }
  } catch (error) {
    console.error('Resend Exception:', error)
    return { error }
  }
}
