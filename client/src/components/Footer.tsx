import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-primary/10 border-t border-primary/20 mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-foreground mb-3">
              Bien<span className="text-primary italic">vica</span>
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              เครื่องดื่มคุณภาพพรีเมียม คัดสรรจากวัตถุดิบธรรมชาติ
              เพื่อประสบการณ์การดื่มที่ดีที่สุด
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
              เมนู
            </h4>
            <ul className="space-y-2">
              {[
                { href: "/", label: "หน้าแรก" },
                { href: "/products", label: "สินค้าทั้งหมด" },
                { href: "/about", label: "เกี่ยวกับเรา" },
                { href: "/orders", label: "คำสั่งซื้อของฉัน" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors no-underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
              นโยบาย
            </h4>
            <ul className="space-y-2">
              {[
                { href: "/refund-policy", label: "นโยบายการคืนเงิน" },
                { href: "/terms-of-service", label: "ข้อตกลงการใช้บริการ" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors no-underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-1 text-sm text-muted-foreground">
              <p>อีเมล: thanakrittum@gmail.com</p>
              <p>โทร: 064 654 0592</p>
              <a
                href="https://www.facebook.com/profile.php?id=61578488837019"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                Facebook: Bienvica เบียงวิก้า
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Bienvica. สงวนลิขสิทธิ์ทุกประการ
        </div>
      </div>
    </footer>
  );
}
