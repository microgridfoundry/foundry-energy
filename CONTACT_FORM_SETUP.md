# Contact Form Setup

The contact form at `/contact` is now fully functional with email sending
capabilities using [Resend](https://resend.com).

## Features

✅ **Email Sending**: Uses Resend API to send contact form submissions via email
✅ **Spam Protection**: Includes rate limiting (3 submissions per hour per IP)
and honeypot field ✅ **User Feedback**: Clear success/error messages with
loading states ✅ **Secure**: Environment variables are masked in the debug page
✅ **Mobile Friendly**: Responsive design with accessible form controls

## Setup Instructions

### 1. Get a Resend API Key

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain (or use their test domain for development)
3. Generate an API key from your dashboard

### 2. Configure Environment Variables

Create a `.env` file in the project root (or set environment variables in your
deployment platform):

```bash
# Required
RESEND_API_KEY=re_xxxxxxxxxxxx

# Optional (with defaults)
RESEND_FROM_EMAIL=noreply@yourdomain.com
CONTACT_EMAIL=hello@microgridfoundry.co.uk
```

### 3. Verify Configuration

Visit `/debug` to check your email service configuration:

- Green checkmark ✓ means the API key is set
- Red X ✗ means you need to configure it

## Environment Variables

| Variable            | Required | Default                        | Description                                             |
| ------------------- | -------- | ------------------------------ | ------------------------------------------------------- |
| `RESEND_API_KEY`    | **Yes**  | -                              | Your Resend API key                                     |
| `RESEND_FROM_EMAIL` | No       | `onboarding@resend.dev`        | Email address to send from (must be verified in Resend) |
| `CONTACT_EMAIL`     | No       | `hello@microgridfoundry.co.uk` | Where to send contact form submissions                  |

## Spam Protection

The contact form includes two layers of spam protection:

1. **Rate Limiting**: Max 3 submissions per hour per IP address
2. **Honeypot Field**: Hidden field that bots typically fill in

## Development

For local development without email sending, the API will return a helpful error
message when `RESEND_API_KEY` is not set.

## Testing

To test the contact form:

1. Set your `RESEND_API_KEY` in `.env`
2. Start the dev server: `deno task dev`
3. Visit `http://localhost:8000/contact`
4. Fill out and submit the form
5. Check your `CONTACT_EMAIL` inbox for the message

## API Endpoint

The contact form posts to `/api/contact` which:

- Validates input fields
- Checks rate limits
- Filters spam via honeypot
- Sends email via Resend
- Returns JSON response with success/error status

## Troubleshooting

**Form not sending emails?**

1. Check `/debug` page to verify `RESEND_API_KEY` is set
2. Ensure your domain is verified in Resend (or use test domain)
3. Check server logs for error messages

**Rate limit errors?**

- Wait 1 hour for the rate limit to reset
- For testing, restart the server to clear the in-memory rate limit cache

**"From" address not working?**

- Make sure the email domain is verified in your Resend account
- Use `onboarding@resend.dev` for testing (Resend's test address)
