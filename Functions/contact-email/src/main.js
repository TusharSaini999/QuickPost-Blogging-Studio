import nodemailer from "nodemailer";

export default async ({ req, res, log, error }) => {
  try {
    const data =
      typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body;

    const { name, email } = data;

    if (!email) {
      throw new Error("Email field is missing");
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Quick Post 🚀" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Thanks for contacting Quick Post 🚀",
      html: `
        <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Thanks for Connecting – Quick Post</title>

    <!-- Dark Mode Support -->
    <meta name="color-scheme" content="light dark">
    <meta name="supported-color-schemes" content="light dark">

    <style>
      @media (prefers-color-scheme: dark) {
        body {
          background-color: #111827 !important;
        }
        .card {
          background-color: #1f2933 !important;
        }
        .text-main {
          color: #f9fafb !important;
        }
        .text-muted {
          color: #d1d5db !important;
        }
        .footer {
          background-color: #111827 !important;
          color: #9ca3af !important;
        }
        .highlight {
          background-color: #2b1c1c !important;
          color: #fecaca !important;
          border-left: 5px solid #ef4444 !important;
        }
      }
    </style>
  </head>

  <body style="margin:0; padding:0; background-color:#f3f4f6; font-family:Arial, Helvetica, sans-serif;">

    <!-- Outer Wrapper -->
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="padding:24px 12px;">
      <tr>
        <td align="center">

          <!-- Email Card -->
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
            class="card"
            style="
              max-width:640px;
              background-color:#ffffff;
              border-radius:12px;
              overflow:hidden;
              box-shadow:0 10px 25px rgba(0,0,0,0.12);
            ">

            <!-- Gradient Header -->
            <tr>
              <td align="center"
                style="
                  padding:26px 16px;
                  background:#dc2626;
                  background:linear-gradient(90deg,#f87171,#ef4444,#dc2626,#b91c1c);
                ">
                <h1 style="margin:0; color:#ffffff; font-size:24px;">
                  Quick Post
                </h1>
                <p style="margin:6px 0 0; color:#fee2e2; font-size:13px;">
                  Fast & Easy Blogging
                </p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td align="center" style="padding:32px 20px;" class="text-main">

                <h2 style="margin:0; font-size:20px;">
                  Thanks for Connecting! ❤️
                </h2>

                <p style="font-size:14px; line-height:1.7; margin:18px 0;">
                  Hi <strong>${name || "there"}</strong>,<br /><br />
                  Thank you for reaching out to
                  <strong style="color:#dc2626;">Quick Post</strong>.
                  We truly appreciate your interest.
                </p>

                <p style="font-size:14px; line-height:1.7; margin:18px 0;">
                  Your message has been <strong>successfully received</strong> and is under review.
                  Our team will respond as soon as possible.
                </p>

                <!-- Highlight Box -->
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin:24px 0;">
                  <tr>
                    <td class="highlight"
                      style="
                        padding:18px;
                        background-color:#fef2f2;
                        border-left:5px solid #dc2626;
                        border-radius:8px;
                        font-size:13px;
                        color:#7f1d1d;
                        text-align:left;
                        line-height:1.6;
                      ">
                      🔔 <strong>What happens next?</strong><br /><br />
                      • Our support team reviews your query<br />
                      • You’ll receive a reply via email<br />
                      • Response time may vary during peak hours
                    </td>
                  </tr>
                </table>

                <!-- CTA -->
                <a
                  href="https://quickpostai.vercel.app/"
                  style="
                    display:inline-block;
                    padding:14px 26px;
                    font-size:14px;
                    font-weight:bold;
                    color:#ffffff;
                    text-decoration:none;
                    border-radius:999px;
                    background:#dc2626;
                    background:linear-gradient(90deg,#ef4444,#dc2626,#b91c1c);
                  ">
                  Visit Quick Post
                </a>

                <p style="margin-top:26px; font-size:13px;">
                  Warm regards,<br />
                  <strong>Quick Post Team</strong>
                </p>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center"
                class="footer"
                style="
                  padding:18px 16px;
                  background-color:#f9fafb;
                  font-size:11px;
                  color:#6b7280;
                ">
                This is a system-generated email. Please do not reply.
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
</html>

      `,
      text:`Hi ${name || "there"},

Thanks for connecting with Quick Post!

We have successfully received your message, and our team is currently reviewing your query. We appreciate you taking the time to reach out to us.

What happens next?
- Our support team is reviewing your request
- You will receive a response via email
- Response time may vary during peak hours

If you’d like to explore more, visit Quick Post:
https://quickpostai.vercel.app/

Warm regards,
Quick Post Team

---
This is a system-generated email.
Please do not reply to this message.
`,
    });

    log(`Email sent to: ${email}`);

    return res.json({ success: true });
  } catch (err) {
    error(err.message);
    return res.json({ success: false, error: err.message });
  }
};
