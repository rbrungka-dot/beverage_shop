import nodemailer from "nodemailer";

// Use Ethereal (test SMTP) when no real SMTP is configured
// In production, set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS env vars
// or use a service like Resend/SendGrid by replacing the transporter

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || "Bienvica <noreply@bienvica.com>";

  if (host && user && pass) {
    return { transporter: nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } }), from };
  }

  // Fallback: log email to console (no real sending)
  return { transporter: null, from };
}

export interface OrderEmailData {
  to: string;
  customerName: string;
  orderId: number;
  orderDate: Date;
  items: Array<{ productName: string; quantity: number; priceAtTime: string }>;
  totalAmount: string;
  shippingName: string;
  shippingAddress: string;
  shippingPhone?: string;
}

function buildOrderEmailHtml(data: OrderEmailData): string {
  const itemsHtml = data.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #f0ede8;color:#3d3530;">${item.productName}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f0ede8;text-align:center;color:#3d3530;">${item.quantity}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f0ede8;text-align:right;color:#3d3530;">฿${(parseFloat(item.priceAtTime) * item.quantity).toLocaleString("th-TH")}</td>
        </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="th">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#faf8f5;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf8f5;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#8b5e3c,#c4956a);padding:32px 40px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:300;letter-spacing:2px;">Bien<strong>vica</strong></h1>
            <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:13px;">Premium Artisan Beverages</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:40px;">
            <h2 style="margin:0 0 8px;color:#3d3530;font-size:22px;font-weight:600;">ยืนยันคำสั่งซื้อ</h2>
            <p style="margin:0 0 24px;color:#7a6e68;font-size:15px;">สวัสดีคุณ ${data.customerName} ขอบคุณสำหรับการสั่งซื้อ เราได้รับการชำระเงินของคุณเรียบร้อยแล้ว</p>

            <!-- Order Info -->
            <div style="background:#faf8f5;border-radius:10px;padding:16px 20px;margin-bottom:24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="color:#7a6e68;font-size:13px;">หมายเลขคำสั่งซื้อ</td>
                  <td style="text-align:right;color:#3d3530;font-weight:600;font-size:13px;">#${data.orderId}</td>
                </tr>
                <tr>
                  <td style="color:#7a6e68;font-size:13px;padding-top:6px;">วันที่สั่งซื้อ</td>
                  <td style="text-align:right;color:#3d3530;font-size:13px;padding-top:6px;">${data.orderDate.toLocaleString("th-TH")}</td>
                </tr>
              </table>
            </div>

            <!-- Items -->
            <h3 style="margin:0 0 12px;color:#3d3530;font-size:15px;font-weight:600;">รายการสินค้า</h3>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f0ede8;border-radius:10px;overflow:hidden;margin-bottom:24px;">
              <thead>
                <tr style="background:#faf8f5;">
                  <th style="padding:10px 12px;text-align:left;color:#7a6e68;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">สินค้า</th>
                  <th style="padding:10px 12px;text-align:center;color:#7a6e68;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">จำนวน</th>
                  <th style="padding:10px 12px;text-align:right;color:#7a6e68;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">ราคา</th>
                </tr>
              </thead>
              <tbody>${itemsHtml}</tbody>
              <tfoot>
                <tr style="background:#faf8f5;">
                  <td colspan="2" style="padding:12px;color:#3d3530;font-weight:700;font-size:14px;">ยอดรวมทั้งหมด</td>
                  <td style="padding:12px;text-align:right;color:#8b5e3c;font-weight:700;font-size:16px;">฿${parseFloat(data.totalAmount).toLocaleString("th-TH", { minimumFractionDigits: 2 })}</td>
                </tr>
              </tfoot>
            </table>

            <!-- Shipping -->
            <h3 style="margin:0 0 12px;color:#3d3530;font-size:15px;font-weight:600;">ข้อมูลจัดส่ง</h3>
            <div style="background:#faf8f5;border-radius:10px;padding:16px 20px;margin-bottom:32px;">
              <p style="margin:0;color:#3d3530;font-size:14px;font-weight:600;">${data.shippingName}</p>
              <p style="margin:6px 0 0;color:#7a6e68;font-size:13px;">${data.shippingAddress}</p>
              ${data.shippingPhone ? `<p style="margin:4px 0 0;color:#7a6e68;font-size:13px;">โทร: ${data.shippingPhone}</p>` : ""}
            </div>

            <p style="margin:0;color:#7a6e68;font-size:13px;line-height:1.6;">หากมีคำถามเกี่ยวกับคำสั่งซื้อของคุณ กรุณาติดต่อเราที่ <a href="mailto:support@bienvica.com" style="color:#8b5e3c;">support@bienvica.com</a></p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#3d3530;padding:20px 40px;text-align:center;">
            <p style="margin:0;color:rgba(255,255,255,0.6);font-size:12px;">© 2025 Bienvica · Premium Artisan Beverages</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendOrderConfirmationEmail(data: OrderEmailData): Promise<boolean> {
  const { transporter, from } = createTransporter();

  const subject = `ยืนยันคำสั่งซื้อ #${data.orderId} — Bienvica`;
  const html = buildOrderEmailHtml(data);

  if (!transporter) {
    // No SMTP configured: log to console for development
    console.log(`[Email] Would send order confirmation to ${data.to}`);
    console.log(`[Email] Subject: ${subject}`);
    console.log(`[Email] Order #${data.orderId}, Total: ฿${data.totalAmount}`);
    return true;
  }

  try {
    await transporter.sendMail({ from, to: data.to, subject, html });
    console.log(`[Email] Order confirmation sent to ${data.to}`);
    return true;
  } catch (err) {
    console.error("[Email] Failed to send order confirmation:", err);
    return false;
  }
}
