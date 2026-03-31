import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, ShieldCheck, FlaskConical, Zap, CheckCircle2, AlertCircle, Loader2, ExternalLink } from "lucide-react";

// Test products for payment testing
const TEST_PRODUCTS = [
  {
    productId: 4,
    name: "Bienvica Gift Set — ของขวัญเพื่อสุขภาพ",
    price: "699.00",
    quantity: 1,
    imageUrl: null,
  },
];

const TEST_CARDS = [
  { label: "ชำระเงินสำเร็จ", number: "4242 4242 4242 4242", type: "success", color: "bg-emerald-50 border-emerald-200 text-emerald-800" },
  { label: "ถูกปฏิเสธ (Insufficient Funds)", number: "4000 0000 0000 9995", type: "decline", color: "bg-red-50 border-red-200 text-red-800" },
  { label: "ต้องยืนยัน 3D Secure", number: "4000 0025 0000 3155", type: "3ds", color: "bg-amber-50 border-amber-200 text-amber-800" },
  { label: "ถูกปฏิเสธ (Generic)", number: "4000 0000 0000 0002", type: "decline2", color: "bg-red-50 border-red-200 text-red-800" },
];

export default function TestPayment() {
  const { user, loading: authLoading } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [copiedCard, setCopiedCard] = useState<string | null>(null);

  const createCheckout = trpc.stripe.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        toast.success("กำลังเปิดหน้าชำระเงิน Stripe...");
        window.open(data.url, "_blank");
      }
      setIsRedirecting(false);
    },
    onError: (err) => {
      toast.error(`เกิดข้อผิดพลาด: ${err.message}`);
      setIsRedirecting(false);
    },
  });

  const handleStartCheckout = () => {
    if (!user) {
      window.location.href = getLoginUrl("/test-payment");
      return;
    }
    setIsRedirecting(true);
    createCheckout.mutate({
      items: TEST_PRODUCTS,
      shippingName: user.name || "ทดสอบระบบ",
      shippingAddress: "123 ถนนทดสอบ กรุงเทพฯ 10100",
      shippingPhone: "0812345678",
      notes: "คำสั่งซื้อทดสอบ — ไม่ใช่การชำระเงินจริง",
      origin: window.location.origin,
    });
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text.replace(/\s/g, ""));
    setCopiedCard(id);
    toast.success("คัดลอกหมายเลขบัตรแล้ว");
    setTimeout(() => setCopiedCard(null), 2000);
  };

  if (authLoading && !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <Badge variant="outline" className="mb-4 text-xs tracking-widest uppercase border-amber-400 text-amber-700 bg-amber-50">
          Stripe Test Mode — Sandbox
        </Badge>
        <h1 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-3">
          ทดสอบการชำระเงิน
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
          หน้านี้ใช้สำหรับทดสอบ Stripe Checkout ในโหมด Sandbox เท่านั้น
          ไม่มีการตัดเงินจริงเกิดขึ้น
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Checkout Card */}
        <div className="space-y-4">
          {/* Status Banner */}
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0" />
            <p className="text-sm text-amber-800">
              <strong>Test Mode:</strong> ใช้หมายเลขบัตรทดสอบด้านขวาเท่านั้น
            </p>
          </div>

          {/* Product Preview */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FlaskConical className="h-4 w-4 text-primary" />
                สินค้าทดสอบ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-sm">Bienvica Beyond Cider™</p>
                  <p className="text-xs text-muted-foreground">จำนวน 1 ขวด · ทดสอบระบบ</p>
                </div>
                <span className="font-semibold text-primary">฿690</span>
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between text-sm font-semibold">
                <span>ยอดรวม</span>
                <span className="text-primary">฿690.00</span>
              </div>
            </CardContent>
          </Card>

          {/* Checkout Button */}
          {!user ? (
            <Card className="border-dashed">
              <CardContent className="pt-6 text-center space-y-4">
                <ShieldCheck className="h-8 w-8 text-muted-foreground mx-auto" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">ต้องเข้าสู่ระบบก่อนทดสอบการชำระเงิน</p>
                  <p className="text-xs text-muted-foreground">กดปุ่ม "เข้าสู่ระบบ" ด้านขวาบน (มุมบนขวา) แล้วกลับมาที่หน้านี้อีกครั้ง</p>
                </div>
                <Button
                  onClick={() => {
                    window.location.href = getLoginUrl("/test-payment");
                  }}
                  className="w-full"
                >
                  เข้าสู่ระบบ
                </Button>
                <p className="text-xs text-muted-foreground">
                  → หลัง login จะกลับมาหน้านี้โดยอัตโนมัติ
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>เข้าสู่ระบบแล้วในชื่อ <strong className="text-foreground">{user.name || user.email}</strong></span>
                </div>
                <Button
                  onClick={handleStartCheckout}
                  disabled={isRedirecting || createCheckout.isPending}
                  className="w-full h-12 text-base font-semibold"
                  size="lg"
                >
                  {(isRedirecting || createCheckout.isPending) ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      กำลังสร้าง Checkout Session...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      เริ่มทดสอบการชำระเงิน
                      <ExternalLink className="h-3.5 w-3.5 ml-2 opacity-70" />
                    </>
                  )}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  จะเปิด Stripe Checkout ในแท็บใหม่
                </p>
              </CardContent>
            </Card>
          )}

          {/* Flow Diagram */}
          <Card className="bg-secondary/40 border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">ขั้นตอนการทดสอบ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { step: "1", text: "คลิก \"เริ่มทดสอบการชำระเงิน\"" },
                { step: "2", text: "กรอกหมายเลขบัตรทดสอบ (ด้านขวา)" },
                { step: "3", text: "กรอก Expiry: 12/26, CVC: 123, ZIP: 10100" },
                { step: "4", text: "ระบบ redirect กลับมาที่หน้า Orders" },
                { step: "5", text: "ตรวจสอบสถานะ Order เปลี่ยนเป็น \"Paid\"" },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {item.step}
                  </span>
                  <p className="text-sm text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right: Test Cards */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                บัตรทดสอบ Stripe
              </CardTitle>
              <CardDescription className="text-xs">
                คลิกที่หมายเลขบัตรเพื่อคัดลอก · ใช้ Expiry: 12/26 · CVC: 123
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {TEST_CARDS.map((card) => (
                <button
                  key={card.number}
                  onClick={() => copyToClipboard(card.number, card.number)}
                  className={`w-full text-left rounded-xl border px-4 py-3 transition-all hover:shadow-sm ${card.color} ${copiedCard === card.number ? "ring-2 ring-emerald-400" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold mb-1">{card.label}</p>
                      <p className="font-mono text-sm tracking-wider">{card.number}</p>
                    </div>
                    {copiedCard === card.number ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <span className="text-xs opacity-60">คัดลอก</span>
                    )}
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Stripe Docs Link */}
          <Card className="bg-secondary/40 border-0">
            <CardContent className="pt-4 space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">ข้อมูลเพิ่มเติม</p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <p>ธุรกรรมทดสอบไม่มีการตัดเงินจริง</p>
                </div>
                <div className="flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <p>Webhook จะอัปเดตสถานะ Order อัตโนมัติเมื่อชำระเงินสำเร็จ</p>
                </div>
                <div className="flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <p>ดูผลใน <strong>Stripe Dashboard → Payments</strong></p>
                </div>
              </div>
              <a
                href="https://docs.stripe.com/testing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium"
              >
                Stripe Testing Docs
                <ExternalLink className="h-3 w-3" />
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
