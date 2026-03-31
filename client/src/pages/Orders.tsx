import React from "react";
import { useParams, Link, useSearch } from "wouter";
import { ArrowLeft, Package, CheckCircle2, Clock, Truck, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: "รอชำระเงิน", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  paid: { label: "ชำระเงินแล้ว", color: "bg-blue-100 text-blue-800", icon: CheckCircle2 },
  processing: { label: "กำลังเตรียมสินค้า", color: "bg-purple-100 text-purple-800", icon: Package },
  shipped: { label: "จัดส่งแล้ว", color: "bg-indigo-100 text-indigo-800", icon: Truck },
  delivered: { label: "ได้รับสินค้าแล้ว", color: "bg-green-100 text-green-800", icon: CheckCircle2 },
  cancelled: { label: "ยกเลิก", color: "bg-red-100 text-red-800", icon: XCircle },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] || { label: status, color: "bg-gray-100 text-gray-800", icon: Package };
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
      <Icon className="h-3.5 w-3.5" />
      {cfg.label}
    </span>
  );
}

function OrderDetail({ orderId }: { orderId: number }) {
  const searchStr = useSearch();
  const isSuccess = new URLSearchParams(searchStr).get("success") === "true";
  const utils = trpc.useUtils();
  const verifyPayment = trpc.stripe.verifyPayment.useMutation({
    onSuccess: () => {
      utils.orders.getById.invalidate({ id: orderId });
    },
  });
  const { data: order, isLoading } = trpc.orders.getById.useQuery({ id: orderId });

  // When arriving at success page, verify payment with Stripe and update order status
  const [verified, setVerified] = React.useState(false);
  React.useEffect(() => {
    if (isSuccess && !verified && order?.status === "pending") {
      setVerified(true);
      verifyPayment.mutate({ orderId });
    }
  }, [isSuccess, order?.status, verified]);

  if (isLoading) return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-32 w-full rounded-xl" />
    </div>
  );
  if (!order) return <p className="text-muted-foreground">ไม่พบคำสั่งซื้อ</p>;

  return (
    <div className="space-y-6">
      {isSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
          <div>
            <p className="font-medium text-green-800">ชำระเงินสำเร็จ!</p>
            <p className="text-sm text-green-700">ขอบคุณสำหรับการสั่งซื้อ เราจะดำเนินการจัดส่งโดยเร็ว</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-foreground">คำสั่งซื้อ #{order.id}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {new Date(order.createdAt).toLocaleString("th-TH")}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Items */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="font-medium text-foreground">รายการสินค้า</h3>
        </div>
        <div className="divide-y divide-border">
          {order.items?.map((item: any) => (
            <div key={item.id} className="p-4 flex justify-between items-center">
              <div>
                <p className="font-medium text-foreground">{item.productName}</p>
                <p className="text-sm text-muted-foreground">฿{parseFloat(item.priceAtTime).toLocaleString("th-TH")} × {item.quantity}</p>
              </div>
              <p className="font-semibold text-foreground">
                ฿{(parseFloat(item.priceAtTime) * item.quantity).toLocaleString("th-TH")}
              </p>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-border flex justify-between font-semibold text-foreground">
          <span>ยอดรวม</span>
          <span>฿{parseFloat(order.totalAmount).toLocaleString("th-TH", { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      {/* Shipping */}
      {order.shippingAddress && (
        <div className="bg-card rounded-xl border border-border p-4">
          <h3 className="font-medium text-foreground mb-3">ข้อมูลจัดส่ง</h3>
          <div className="space-y-1 text-sm text-muted-foreground">
            {order.shippingName && <p><span className="font-medium text-foreground">ผู้รับ:</span> {order.shippingName}</p>}
            <p><span className="font-medium text-foreground">ที่อยู่:</span> {order.shippingAddress}</p>
            {order.shippingPhone && <p><span className="font-medium text-foreground">โทร:</span> {order.shippingPhone}</p>}
            {order.notes && <p><span className="font-medium text-foreground">หมายเหตุ:</span> {order.notes}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

function OrdersList() {
  const { data: orders, isLoading } = trpc.orders.myOrders.useQuery();

  if (isLoading) return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-24 w-full rounded-xl" />
      ))}
    </div>
  );

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-20">
        <Package className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
        <h2 className="font-serif text-xl font-semibold text-foreground mb-2">ยังไม่มีคำสั่งซื้อ</h2>
        <p className="text-muted-foreground mb-6">เริ่มต้นช้อปปิ้งเพื่อดูประวัติคำสั่งซื้อของคุณ</p>
        <Link href="/products">
          <Button className="bg-primary text-primary-foreground">เลือกซื้อสินค้า</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Link key={order.id} href={`/orders/${order.id}`} className="no-underline block">
          <div className="bg-card rounded-xl border border-border p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-foreground">คำสั่งซื้อ #{order.id}</span>
              <StatusBadge status={order.status} />
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{new Date(order.createdAt).toLocaleDateString("th-TH")}</span>
              <span className="font-semibold text-foreground">
                ฿{parseFloat(order.totalAmount).toLocaleString("th-TH", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function Orders() {
  const { id } = useParams<{ id?: string }>();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Package className="h-16 w-16 text-muted-foreground/30 mx-auto" />
          <h2 className="font-serif text-2xl font-semibold text-foreground">กรุณาเข้าสู่ระบบ</h2>
          <Button onClick={() => window.location.href = getLoginUrl()} className="bg-primary text-primary-foreground">
            เข้าสู่ระบบ
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container max-w-3xl">
        {id ? (
          <>
            <Link href="/orders" className="no-underline">
              <Button variant="ghost" size="sm" className="mb-6 gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" />
                คำสั่งซื้อทั้งหมด
              </Button>
            </Link>
            <OrderDetail orderId={parseInt(id)} />
          </>
        ) : (
          <>
            <h1 className="font-serif text-3xl font-semibold text-foreground mb-8">คำสั่งซื้อของฉัน</h1>
            <OrdersList />
          </>
        )}
      </div>
    </div>
  );
}
