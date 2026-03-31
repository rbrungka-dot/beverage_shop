import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-secondary border-t border-border mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-foreground mb-3">
              The Modern <span className="text-primary italic">Alchemist</span>
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

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
              ติดต่อ
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>อีเมล: hello@modernalchemist.com</li>
              <li>โทร: 02-xxx-xxxx</li>
              <li>เวลาทำการ: จันทร์–ศุกร์ 9:00–18:00</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} The Modern Alchemist. สงวนลิขสิทธิ์ทุกประการ
        </div>
      </div>
    </footer>
  );
}
