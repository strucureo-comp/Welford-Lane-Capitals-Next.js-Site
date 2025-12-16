import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      }
    })
  }

  try {
    const { email, password, fullName, adminEmail } = await req.json()

    if (!email || !password || !fullName) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Send email using Resend API
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: [email],
        subject: 'Welcome to Welford Lane Capitals - Account Approved',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { 
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                }
                .header {
                  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
                  color: white;
                  padding: 30px;
                  text-align: center;
                  border-radius: 8px 8px 0 0;
                }
                .logo {
                  font-size: 28px;
                  font-weight: bold;
                  letter-spacing: -1px;
                }
                .accent {
                  color: #3b82f6;
                }
                .content {
                  background: #f9fafb;
                  padding: 30px;
                  border-radius: 0 0 8px 8px;
                }
                .credentials-box {
                  background: white;
                  border: 2px solid #e5e7eb;
                  border-radius: 8px;
                  padding: 20px;
                  margin: 20px 0;
                }
                .credential-row {
                  display: flex;
                  justify-content: space-between;
                  padding: 12px 0;
                  border-bottom: 1px solid #e5e7eb;
                }
                .credential-row:last-child {
                  border-bottom: none;
                }
                .credential-label {
                  font-weight: 600;
                  color: #6b7280;
                }
                .credential-value {
                  font-family: 'Courier New', monospace;
                  background: #f3f4f6;
                  padding: 4px 12px;
                  border-radius: 4px;
                  font-size: 14px;
                }
                .button {
                  display: inline-block;
                  background: #1a1a1a;
                  color: white;
                  padding: 14px 32px;
                  text-decoration: none;
                  border-radius: 6px;
                  margin: 20px 0;
                  font-weight: 600;
                }
                .button:hover {
                  background: #3b82f6;
                }
                .warning {
                  background: #fef3c7;
                  border-left: 4px solid #f59e0b;
                  padding: 16px;
                  margin: 20px 0;
                  border-radius: 4px;
                }
                .footer {
                  text-align: center;
                  color: #6b7280;
                  font-size: 12px;
                  margin-top: 30px;
                  padding-top: 20px;
                  border-top: 1px solid #e5e7eb;
                }
              </style>
            </head>
            <body>
              <div class="header">
                <div class="logo">WLC<span class="accent">.</span></div>
                <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Welford Lane Capitals</p>
              </div>
              
              <div class="content">
                <h2 style="color: #1a1a1a; margin-top: 0;">Welcome, ${fullName}! 🎉</h2>
                
                <p>Congratulations! Your access to the Welford Lane Capitals Investor Portal has been approved.</p>
                
                <p>You can now log in to view your portfolio performance, track investments, and access exclusive insights.</p>
                
                <div class="credentials-box">
                  <h3 style="margin-top: 0; color: #1a1a1a;">Your Login Credentials</h3>
                  
                  <div class="credential-row">
                    <span class="credential-label">Email:</span>
                    <span class="credential-value">${email}</span>
                  </div>
                  
                  <div class="credential-row">
                    <span class="credential-label">Password:</span>
                    <span class="credential-value">${password}</span>
                  </div>
                </div>
                
                <div class="warning">
                  <strong>⚠️ Security Notice:</strong><br>
                  Please change your password after your first login for security purposes.
                </div>
                
                <center>
                  <a href="${Deno.env.get('SITE_URL') || 'http://localhost:3000'}/login" class="button">
                    Log In to Your Account →
                  </a>
                </center>
                
                <h3 style="color: #1a1a1a;">What's Next?</h3>
                <ul style="color: #4b5563;">
                  <li>Access your personalized dashboard</li>
                  <li>View real-time portfolio performance</li>
                  <li>Track your investment history</li>
                  <li>Review monthly reports and insights</li>
                </ul>
                
                <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                  If you have any questions, please don't hesitate to reach out to our team.
                </p>
              </div>
              
              <div class="footer">
                <p>© ${new Date().getFullYear()} Welford Lane Capitals. All rights reserved.</p>
                <p>This email was sent from an automated system. Please do not reply.</p>
              </div>
            </body>
          </html>
        `
      })
    })

    if (!emailRes.ok) {
      const errorData = await emailRes.text()
      console.error('Resend API error:', errorData)
      return new Response(
        JSON.stringify({ error: 'Failed to send email', details: errorData }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    const data = await emailRes.json()

    return new Response(
      JSON.stringify({ success: true, messageId: data.id }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
})
