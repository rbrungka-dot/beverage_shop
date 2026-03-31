import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function Cart() {
  const [, navigate] = useLocation();
  const { isAuthenticated, user } = useAuth();
  const utils = trpc.useUtils();

  const [shippingName, setShippingName] = useState(user?.name || "");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingPhone, setShippingPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const { data: cartItems, isLoading } = trpc.cart.get.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const updateItem = trpc.cart.updateItem.useMutation({
    onMutate: async ({ id, quantity }) => {
      await utils.cart.get.cancel();
      const prev = utils.cart.get.getData();
      utils.cart.get.setData(undefined, (old) =>
        old?.map((item) => (item.id === id ? { ...item, quantity } : item)).filter((item) => item.quantity > 0)
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      utils.cart.get.setData(undefined, ctx?.prev);
    },
    onSettled: () => utils.cart.get.invalidate(),
  });

  const removeItem = trpc.cart.removeItem.useMutation({
    onMutate: async ({ id }) => {
      await utils.cart.get.cancel();
      const prev = utils.cart.get.getData();
      utils.cart.get.setData(undefined, (old) => old?.filter((item) => item.id !== id));
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      utils.cart.get.setData(undefined, ctx?.prev);
    },
    onSettled: () => utils.cart.get.invalidate(),
  });

  const createCheckout = trpc.stripe.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        toast.success("กำลังนำคุณไปยังหน้าชำระเงิน...");
        window.open(data.url, "_blank");
      }
    },
    onError: () => toast.error("เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ"),
    onSettled: () => setIsCheckingOut(false),
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mx-auto" />
          <h2 className="font-serif text-2xl font-semibold text-foreground">กรุณาเข้าสู่ระบบ</h2>
          <p className="text-muted-foreground">เข้าสู่ระบบเพื่อดูตะกร้าสินค้าของคุณ</p>
          <Button onClick={() => window.location.href = getLoginUrl()} className="bg-primary text-primary-foreground">
            เข้าสู่ระบบ
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen py-12">
        <div className="container max-w-4xl">
          <Skeleton className="h-8 w-48 mb-8" />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full mb-4 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const isEmpty = !cartItems || cartItems.length === 0;
  const total = cartItems?.reduce((sum, item) => sum + parseFloat(item.productPrice || "0") * item.quantity, 0) ?? 0;

  const handleCheckout = () => {
    if (!shippingName.trim()) { toast.error("กรุณากรอกชื่อผู้รับ"); return; }
    if (!shippingAddress.trim()) { toast.error("กรุณากรอกที่อยู่จัดส่ง"); return; }
    if (!cartItems || cartItems.length === 0) return;

    setIsCheckingOut(true);
    createCheckout.mutate({
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          name: item.productName || "",
          price: item.productPrice || "0",
          imageUrl: item.productImageUrl,
        })),
      shippingName,
      shippingAddress,
      shippingPhone,
      notes,
      origin: window.location.origin,
    });
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container max-w-4xl">
        <h1 className="font-serif text-3xl font-semibold text-foreground mb-8">ตะกร้าสินค้า</h1>

        {isEmpty ? (
          <div className="text-center py-20">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="font-serif text-xl font-semibold text-foreground mb-2">ตะกร้าว่างเปล่า</h2>
            <p className="text-muted-foreground mb-6">เพิ่มสินค้าที่คุณชื่นชอบลงในตะกร้า</p>
            <Link href="/products">
              <Button className="bg-primary text-primary-foreground gap-2">
                เลือกซื้อสินค้า <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-card rounded-xl border border-border p-4 flex gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                    {item.productImageUrl ? (
                      <img src={item.productImageUrl} alt={item.productName || ""} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="h-8 w-8 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">{item.productName}</h3>
                    <p className="text-sm text-muted-foreground">฿{parseFloat(item.productPrice || "0").toLocaleString("th-TH")}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border border-border rounded-lg overflow-hidden">
                        <Button
                          variant="ghost" size="icon" className="h-7 w-7 rounded-none"
                          onClick={() => updateItem.mutate({ id: item.id, quantity: item.quantity - 1 })}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="ghost" size="icon" className="h-7 w-7 rounded-none"
                          onClick={() => updateItem.mutate({ id: item.id, quantity: item.quantity + 1 })}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => removeItem.mutate({ id: item.id })}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">
                      ฿{(parseFloat(item.productPrice || "0") * item.quantity).toLocaleString("th-TH")}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary + Shipping */}
            <div className="space-y-4">
              {/* Shipping Form */}
              <div className="bg-card rounded-xl border border-border p-4 space-y-4">
                <h3 className="font-serif font-semibold text-foreground">ข้อมูลจัดส่ง</h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="name" className="text-sm">ชื่อผู้รับ *</Label>
                    <Input id="name" value={shippingName} onChange={(e) => setShippingName(e.target.value)} placeholder="ชื่อ-นามสกุล" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="address" className="text-sm">ที่อยู่จัดส่ง *</Label>
                    <Textarea id="address" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} placeholder="บ้านเลขที่ ถนน แขวง เขต จังหวัด รหัสไปรษณีย์" className="mt-1 resize-none" rows={3} />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm">เบอร์โทรศัพท์</Label>
                    <Input id="phone" value={shippingPhone} onChange={(e) => setShippingPhone(e.target.value)} placeholder="08x-xxx-xxxx" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="notes" className="text-sm">หมายเหตุ</Label>
                    <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="ข้อความเพิ่มเติม (ถ้ามี)" className="mt-1 resize-none" rows={2} />
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-card rounded-xl border border-border p-4 space-y-3">
                <h3 className="font-serif font-semibold text-foreground">สรุปคำสั่งซื้อ</h3>
                <div className="space-y-2 text-sm">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-muted-foreground">
                      <span className="truncate mr-2">{item.productName} x{item.quantity}</span>
                      <span>฿{(parseFloat(item.productPrice || "0") * item.quantity).toLocaleString("th-TH")}</span>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-foreground">
                  <span>ยอดรวม</span>
                  <span>฿{total.toLocaleString("th-TH", { minimumFractionDigits: 2 })}</span>
                </div>
                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handleCheckout}
                  disabled={isCheckingOut || createCheckout.isPending}
                >
                  {isCheckingOut ? "กำลังดำเนินการ..." : "ชำระเงิน"}
                </Button>
                <p className="text-xs text-muted-foreground text-center">ชำระเงินผ่าน Stripe (บัตรเครดิต/เดบิต)</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
