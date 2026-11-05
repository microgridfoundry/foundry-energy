import type { HandlerByMethod } from "fresh";
import { Resend } from "resend";

// Simple in-memory rate limiting (for production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Rate limit configuration
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_REQUESTS = 3; // Max 3 submissions per hour per IP

function getRateLimitKey(ip: string): string {
  return `contact_${ip}`;
}

function checkRateLimit(
  ip: string,
): { allowed: boolean; remaining: number; resetTime: number } {
  const key = getRateLimitKey(ip);
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    // New window
    const resetTime = now + RATE_LIMIT_WINDOW;
    rateLimitMap.set(key, { count: 1, resetTime });
    return { allowed: true, remaining: MAX_REQUESTS - 1, resetTime };
  }

  if (record.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }

  record.count++;
  return {
    allowed: true,
    remaining: MAX_REQUESTS - record.count,
    resetTime: record.resetTime,
  };
}

// Clean up old rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000); // Clean up every 5 minutes

export const handler: HandlerByMethod<unknown, unknown> = {
  async POST(ctx) {
    try {
      // Fresh 2.x: handlers take a single context argument; the Request is ctx.req
      const req = ctx.req;

      if (!req) {
        console.error("No request object found in context");
        return new Response(
          JSON.stringify({
            success: false,
            error: "Invalid request received. Please try again.",
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      // Early check for environment access
      if (typeof Deno === "undefined" || !Deno.env) {
        console.error("Deno environment not available");
        return new Response(
          JSON.stringify({
            success: false,
            error:
              "Server configuration error. Please contact the administrator.",
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      // Check for Resend API key early
      const resendApiKey = Deno.env.get("RESEND_API_KEY");
      if (!resendApiKey || resendApiKey.trim() === "") {
        console.error(
          "RESEND_API_KEY environment variable is not set or is empty",
        );
        return new Response(
          JSON.stringify({
            success: false,
            error:
              "Email service is not configured. Please set the RESEND_API_KEY environment variable. Visit /debug to check configuration.",
          }),
          {
            status: 503,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      // Get client IP for rate limiting
      const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
        req.headers.get("x-real-ip") ||
        "unknown";

      // Check rate limit
      const rateLimit = checkRateLimit(ip);
      if (!rateLimit.allowed) {
        const resetDate = new Date(rateLimit.resetTime);
        return new Response(
          JSON.stringify({
            success: false,
            error:
              `Rate limit exceeded. Please try again after ${resetDate.toLocaleTimeString()}.`,
            resetTime: rateLimit.resetTime,
          }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "X-RateLimit-Limit": MAX_REQUESTS.toString(),
              "X-RateLimit-Remaining": "0",
              "X-RateLimit-Reset": rateLimit.resetTime.toString(),
            },
          },
        );
      }

      // Parse form data
      const formData = await req.formData();
      const name = formData.get("name")?.toString().trim();
      const email = formData.get("email")?.toString().trim();
      const enquiry = formData.get("enquiry")?.toString().trim();
      const honeypot = formData.get("website")?.toString(); // Honeypot field

      // Honeypot check - if filled, it's likely a bot
      if (honeypot) {
        console.log("Honeypot triggered - potential spam detected");
        // Return success to avoid revealing the honeypot
        return new Response(
          JSON.stringify({
            success: true,
            message: "Thank you for your enquiry. We'll be in touch soon!",
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      // Validate required fields
      if (!name || !email || !enquiry) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Please fill in all required fields.",
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Please enter a valid email address.",
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      // Get recipient email (defaults to a fallback)
      const toEmail = Deno.env.get("CONTACT_EMAIL") ||
        "hello@microgridfoundry.co.uk";
      const fromEmail = Deno.env.get("RESEND_FROM_EMAIL") ||
        "onboarding@resend.dev";

      // Initialize Resend with error handling
      let resend;
      try {
        resend = new Resend(resendApiKey);
      } catch (initError) {
        console.error("Failed to initialize Resend:", initError);
        return new Response(
          JSON.stringify({
            success: false,
            error:
              "Failed to initialize email service. Please check your RESEND_API_KEY is valid.",
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      // Send email with additional error handling
      let data, error;
      try {
        const result = await resend.emails.send({
          from: fromEmail,
          to: toEmail,
          replyTo: email,
          subject: `New Contact Form Enquiry from ${name}`,
          html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
              New Contact Form Enquiry
            </h2>

            <div style="margin: 20px 0;">
              <p style="margin: 10px 0;">
                <strong style="color: #374151;">Name:</strong> ${name}
              </p>
              <p style="margin: 10px 0;">
                <strong style="color: #374151;">Email:</strong>
                <a href="mailto:${email}" style="color: #3b82f6;">${email}</a>
              </p>
            </div>

            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <strong style="color: #374151;">Enquiry:</strong>
              <p style="margin: 10px 0 0 0; white-space: pre-wrap;">${enquiry}</p>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
              <p>Submitted from: ${ip}</p>
              <p>Time: ${new Date().toISOString()}</p>
            </div>
          </div>
        `,
        });
        data = result.data;
        error = result.error;
      } catch (sendError) {
        console.error("Failed to send email:", sendError);
        return new Response(
          JSON.stringify({
            success: false,
            error:
              "Failed to send email. The email service may be temporarily unavailable. Please try again later.",
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      if (error) {
        console.error("Resend API error:", error);
        return new Response(
          JSON.stringify({
            success: false,
            error:
              "Failed to send email. Please try again later or contact us directly.",
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      console.log("Email sent successfully:", data);

      return new Response(
        JSON.stringify({
          success: true,
          message:
            "Thank you for your enquiry! We'll get back to you as soon as possible.",
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "X-RateLimit-Limit": MAX_REQUESTS.toString(),
            "X-RateLimit-Remaining": rateLimit.remaining.toString(),
            "X-RateLimit-Reset": rateLimit.resetTime.toString(),
          },
        },
      );
    } catch (error) {
      console.error("Error processing contact form:", error);

      // Provide more specific error messages based on error type
      let errorMessage =
        "An unexpected error occurred. Please try again later.";

      if (error instanceof TypeError) {
        errorMessage =
          "Configuration error detected. Please ensure all environment variables are properly set. Visit /debug to check your configuration.";
      } else if (error instanceof Error) {
        // Log the actual error for debugging but don't expose internal details to users
        console.error("Error details:", error.message, error.stack);
      }

      return new Response(
        JSON.stringify({
          success: false,
          error: errorMessage,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  },
};
