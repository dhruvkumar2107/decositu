type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail(payload: EmailPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ORDER_EMAIL_FROM || "Decoritu <orders@decoritu.in>";

  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[email:dev] ${payload.subject} to ${payload.to}`);
    }
    return { sent: false as const };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, ...payload }),
    });

    if (!response.ok) {
      console.error("Email delivery failed", response.status);
      return { sent: false as const };
    }

    return { sent: true as const };
  } catch {
    console.error("Email delivery request failed");
    return { sent: false as const };
  }
}

export function orderEmailHtml({
  name,
  orderNumber,
  total,
  items,
}: {
  name: string;
  orderNumber: string;
  total: string;
  items: { name: string; quantity: number }[];
}) {
  return `
    <div style="font-family:Arial,sans-serif;color:#2b2a25;line-height:1.6;max-width:600px;margin:auto">
      <h1 style="font-family:Georgia,serif;font-weight:400">Thank you, ${name.split(" ")[0]}.</h1>
      <p>Your Decoritu order <strong>${orderNumber}</strong> has been received.</p>
      <ul>${items.map((item) => `<li>${item.name} × ${item.quantity}</li>`).join("")}</ul>
      <p><strong>Total: ${total}</strong></p>
      <p>You can follow your order from your Decoritu account.</p>
      <p style="color:#777">Decoritu · Considered things for beautiful living.</p>
    </div>
  `;
}

export function passwordResetHtml(url: string) {
  return `
    <div style="font-family:Arial,sans-serif;color:#2b2a25;line-height:1.6;max-width:600px;margin:auto">
      <h1 style="font-family:Georgia,serif;font-weight:400">Reset your password</h1>
      <p>Use the secure link below to choose a new password. It expires in one hour.</p>
      <p><a href="${url}" style="background:#33362b;color:#fff;padding:12px 20px;text-decoration:none;display:inline-block">Reset password</a></p>
      <p>If you did not request this, you can ignore this email.</p>
    </div>
  `;
}
