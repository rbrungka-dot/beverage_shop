import { useState } from "react";
import { useParams, Link } from "wouter";
import { ArrowLeft, ShoppingCart, Package, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id || "0");
  const [quantity, setQuantity] = useState(1);
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();

  const { data: product, isLoading } = trpc.products.getById.useQuery({ id: productId });

  const addToCart = trpc.cart.addItem.useMutation({
    onSuccess: () => {
      utils.cart.get.invalidate();
      toast.success(`เพิ่ม "${product?.name}" ลงตะกร้าแล้ว`);
    },
    onError: () => toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่"),
  });

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    addToCart.mutate({ productId, quantity });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-12">
        <div className="container max-w-4xl">
          <Skeleton className="h-6 w-24 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Skeleton className="aspect-square rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground text-lg mb-4">ไม่พบสินค้า</p>
          <Link href="/products">
            <Button variant="outline">กลับไปดูสินค้าทั้งหมด</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;

  return (
    <div className="min-h-screen py-12">
      <div className="container max-w-4xl">
        {/* Back */}
        <Link href="/products" className="no-underline">
          <Button variant="ghost" size="sm" className="mb-8 gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            กลับ
          </Button>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image */}
          <div className="aspect-square rounded-2xl overflow-hidden bg-secondary">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="h-24 w-24 text-muted-foreground/30" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              {product.categoryName && (
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  {product.categoryName}
                </span>
              )}
              <h1 className="font-serif text-3xl font-semibold text-foreground mt-1 mb-2">
                {product.name}
              </h1>
              {product.isFeatured && (
                <Badge className="bg-accent text-accent-foreground">สินค้าแนะนำ</Badge>
              )}
            </div>

            <div className="text-3xl font-semibold text-foreground">
              ฿{parseFloat(product.price).toLocaleString("th-TH", { minimumFractionDigits: 0 })}
            </div>

            {product.description && (
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            )}

            <div className="text-sm text-muted-foreground">
              {isOutOfStock ? (
                <span className="text-destructive font-medium">สินค้าหมด</span>
              ) : (
                <span>มีสินค้า: {product.stock} ชิ้น</span>
              )}
            </div>

            {/* Quantity */}
            {!isOutOfStock && (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-foreground">จำนวน:</span>
                <div className="flex items-center border border-border rounded-lg overflow-hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-none"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-none"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <Button
              size="lg"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
              onClick={handleAddToCart}
              disabled={isOutOfStock || addToCart.isPending}
            >
              <ShoppingCart className="h-5 w-5" />
              {isOutOfStock ? "สินค้าหมด" : addToCart.isPending ? "กำลังเพิ่ม..." : "เพิ่มลงตะกร้า"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
